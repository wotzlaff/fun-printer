package com.wtx.ytbbleplugin.utils;

import android.bluetooth.BluetoothGattCharacteristic;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Message;
import android.util.Log;
import com.clj.fastble.BleManager;
import com.clj.fastble.callback.BleWriteCallback;
import com.clj.fastble.data.BleDevice;
import com.clj.fastble.exception.BleException;
import com.clj.fastble.utils.HexUtil;
import com.wtx.ytbbleplugin.callback.WTXWriteCallback;
import java.util.LinkedList;
import java.util.Queue;

/* JADX INFO: loaded from: classes2.dex */
public class FlowWrite {
    private static Boolean mIsCanWriteFlag;
    private static Boolean mIsNeedCancalPrintFlag;
    private String TAG = "YinTiBao_FlowWrite";
    private WTXWriteCallback mCallback;
    private BluetoothGattCharacteristic mCharactristic;
    private int mCount;
    private byte[] mData;
    private Queue<byte[]> mDataQueue;
    private BleDevice mDevice;
    private Object mFlagLock;
    private Handler mHandler;
    private HandlerThread mHandlerThread;
    private long mIntervalBetweenTwoPackage;
    private int mTotalNum;

    public FlowWrite(BleDevice bleDevice, BluetoothGattCharacteristic bluetoothGattCharacteristic, Object obj) {
        this.mDevice = bleDevice;
        this.mCharactristic = bluetoothGattCharacteristic;
        this.mFlagLock = obj;
        HandlerThread handlerThread = new HandlerThread("WTXFlowWrite");
        this.mHandlerThread = handlerThread;
        handlerThread.start();
        this.mHandler = new Handler(this.mHandlerThread.getLooper()) { // from class: com.wtx.ytbbleplugin.utils.FlowWrite.1
            @Override // android.os.Handler
            public void handleMessage(Message message) {
                super.handleMessage(message);
                if (message.what == 17) {
                    FlowWrite.this.write();
                }
            }
        };
    }

    private void release() {
        HandlerThread handlerThread = this.mHandlerThread;
        if (handlerThread != null) {
            handlerThread.quit();
            this.mHandlerThread = null;
        }
        Handler handler = this.mHandler;
        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
            this.mHandler = null;
        }
    }

    public static void setCanWriteFlag(Boolean bool) {
        mIsCanWriteFlag = bool;
    }

    public static void setCancalPrintFlag(Boolean bool) {
        mIsNeedCancalPrintFlag = bool;
    }

    private static Queue<byte[]> splitByte(byte[] bArr, int i) {
        byte[] bArr2;
        LinkedList linkedList = new LinkedList();
        int length = bArr.length / i;
        if (bArr.length % i != 0) {
            length++;
        }
        if (length > 0) {
            for (int i2 = 0; i2 < length; i2++) {
                if (length == 1 || i2 == length - 1) {
                    int length2 = bArr.length % i == 0 ? i : bArr.length % i;
                    byte[] bArr3 = new byte[length2];
                    System.arraycopy(bArr, i2 * i, bArr3, 0, length2);
                    bArr2 = bArr3;
                } else {
                    bArr2 = new byte[i];
                    System.arraycopy(bArr, i2 * i, bArr2, 0, i);
                }
                linkedList.offer(bArr2);
            }
        }
        return linkedList;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void write() {
        synchronized (this.mFlagLock) {
            if (mIsNeedCancalPrintFlag.booleanValue()) {
                this.mCallback.onCancalPrintSuccess();
                release();
                return;
            }
            if (this.mDataQueue.peek() == null) {
                release();
                return;
            }
            byte[] bArrPoll = this.mDataQueue.poll();
            if (!mIsCanWriteFlag.booleanValue()) {
                try {
                    this.mFlagLock.wait();
                    if (mIsNeedCancalPrintFlag.booleanValue()) {
                        this.mCallback.onCancalPrintSuccess();
                        release();
                        return;
                    }
                } catch (InterruptedException e2) {
                    e2.printStackTrace();
                }
            }
            BleManager.getInstance().write(this.mDevice, this.mCharactristic.getService().getUuid().toString(), this.mCharactristic.getUuid().toString(), bArrPoll, false, new BleWriteCallback() { // from class: com.wtx.ytbbleplugin.utils.FlowWrite.2
                @Override // com.clj.fastble.callback.BleWriteCallback
                public void onWriteFailure(BleException bleException) {
                    Log.i(FlowWrite.this.TAG, "onWriteFailure: " + bleException.toString());
                    FlowWrite.this.mCallback.onWriteFailure(bleException);
                }

                @Override // com.clj.fastble.callback.BleWriteCallback
                public void onWriteSuccess(int i, int i2, byte[] bArr) {
                    FlowWrite.this.mCallback.onWriteSuccess(FlowWrite.this.mTotalNum - FlowWrite.this.mDataQueue.size(), FlowWrite.this.mTotalNum, bArr);
                    FlowWrite.this.mHandler.sendMessageDelayed(FlowWrite.this.mHandler.obtainMessage(17), FlowWrite.this.mIntervalBetweenTwoPackage);
                }
            });
        }
    }

    public void flowWrite(String str, int i, int i2, WTXWriteCallback wTXWriteCallback) {
        this.mCount = i;
        this.mIntervalBetweenTwoPackage = i2;
        this.mData = HexUtil.hexStringToBytes(str);
        this.mCallback = wTXWriteCallback;
        mIsCanWriteFlag = true;
        mIsNeedCancalPrintFlag = false;
        byte[] bArr = this.mData;
        if (bArr == null) {
            wTXWriteCallback.onParamsError("data is Null!");
            return;
        }
        int i3 = this.mCount;
        if (i3 < 1) {
            wTXWriteCallback.onParamsError("split count should higher than 0!");
            return;
        }
        Queue<byte[]> queueSplitByte = splitByte(bArr, i3);
        this.mDataQueue = queueSplitByte;
        this.mTotalNum = queueSplitByte.size();
        write();
    }
}
