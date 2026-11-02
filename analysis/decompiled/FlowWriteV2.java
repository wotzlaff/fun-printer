package com.wtx.ytbbleplugin.utils;

import android.bluetooth.BluetoothGattCharacteristic;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import com.clj.fastble.BleManager;
import com.clj.fastble.callback.BleWriteCallback;
import com.clj.fastble.data.BleDevice;
import com.clj.fastble.exception.BleException;
import com.clj.fastble.utils.HexUtil;
import com.wtx.ytbbleplugin.callback.WTXWriteCallback;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedDeque;

/* JADX INFO: loaded from: classes2.dex */
public class FlowWriteV2 {
    private static FlowWriteV2 flowWriteV2;
    private String TAG = "YinTiBao_FlowWrite";
    private Queue<WriteingDataItem> mDataQueue;
    private BleDevice mDevice;
    private Object mFlagLock;
    private volatile Boolean mIsCanWriteFlag;
    private WTXWriteCallback mWriteCallback;
    private Handler mWriteHandler;
    private HandlerThread mWriteHandlerThread;

    private FlowWriteV2() {
    }

    public static FlowWriteV2 getInstance() {
        if (flowWriteV2 == null) {
            flowWriteV2 = new FlowWriteV2();
        }
        return flowWriteV2;
    }

    private void release() {
        HandlerThread handlerThread = this.mWriteHandlerThread;
        if (handlerThread != null) {
            handlerThread.quit();
            this.mWriteHandlerThread = null;
        }
        Handler handler = this.mWriteHandler;
        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
            this.mWriteHandler = null;
        }
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

    public void addWriteData(String str, BluetoothGattCharacteristic bluetoothGattCharacteristic, int i, long j) {
        if (TextUtils.isEmpty(str)) {
            return;
        }
        this.mDataQueue.add(new WriteingDataItem(splitByte(HexUtil.hexStringToBytes(str), i), j, bluetoothGattCharacteristic));
        this.mWriteHandler.sendMessage(this.mWriteHandler.obtainMessage(17));
    }

    public void clearDataQueue() {
        this.mDataQueue.clear();
        this.mWriteHandler.removeCallbacksAndMessages(null);
    }

    public void init(Object obj, WTXWriteCallback wTXWriteCallback) {
        this.mFlagLock = obj;
        this.mWriteCallback = wTXWriteCallback;
        this.mDataQueue = new ConcurrentLinkedDeque();
        this.mIsCanWriteFlag = true;
        startSendThread();
    }

    public void resetParam() {
        this.mIsCanWriteFlag = true;
        this.mDataQueue.clear();
        this.mWriteHandler.removeCallbacksAndMessages(null);
    }

    public void setCanWriteFlag(Boolean bool) {
        this.mIsCanWriteFlag = bool;
    }

    public void setmDevice(BleDevice bleDevice) {
        this.mDevice = bleDevice;
    }

    public void startSendThread() {
        HandlerThread handlerThread = new HandlerThread("WTXFlowWriteSendTHread");
        this.mWriteHandlerThread = handlerThread;
        handlerThread.start();
        this.mWriteHandler = new Handler(this.mWriteHandlerThread.getLooper()) { // from class: com.wtx.ytbbleplugin.utils.FlowWriteV2.1
            @Override // android.os.Handler
            public void handleMessage(Message message) {
                super.handleMessage(message);
                if (message.what == 17) {
                    FlowWriteV2.this.write();
                }
            }
        };
    }

    public void write() {
        WriteingDataItem writeingDataItem;
        synchronized (this.mFlagLock) {
            do {
                WriteingDataItem writeingDataItemPeek = this.mDataQueue.peek();
                if (writeingDataItemPeek != null) {
                    if (writeingDataItemPeek.mData.peek() == null) {
                        this.mDataQueue.poll();
                        writeingDataItemPeek = null;
                    }
                    writeingDataItem = writeingDataItemPeek;
                    if (this.mDataQueue.size() <= 0) {
                        break;
                    }
                } else {
                    return;
                }
            } while (writeingDataItem == null);
            if (!this.mIsCanWriteFlag.booleanValue()) {
                try {
                    this.mFlagLock.wait();
                } catch (InterruptedException e2) {
                    e2.printStackTrace();
                }
            }
            if (this.mDevice != null && this.mDataQueue.peek() != null && writeingDataItem != null && writeingDataItem.mData.peek() != null) {
                byte[] bArrPoll = writeingDataItem.mData.poll();
                final int i = writeingDataItem.mTotal;
                final int size = writeingDataItem.mTotal - writeingDataItem.mData.size();
                final long j = writeingDataItem.mIntervalBetweenPackage;
                BleManager.getInstance().write(this.mDevice, writeingDataItem.mCharacteristic.getService().getUuid().toString(), writeingDataItem.mCharacteristic.getUuid().toString(), bArrPoll, false, new BleWriteCallback() { // from class: com.wtx.ytbbleplugin.utils.FlowWriteV2.2
                    @Override // com.clj.fastble.callback.BleWriteCallback
                    public void onWriteFailure(BleException bleException) {
                        Log.i(FlowWriteV2.this.TAG, "onWriteFailure: " + bleException.toString());
                        FlowWriteV2.this.mWriteCallback.onWriteFailure(bleException);
                    }

                    @Override // com.clj.fastble.callback.BleWriteCallback
                    public void onWriteSuccess(int i2, int i3, byte[] bArr) {
                        Log.i(FlowWriteV2.this.TAG, "onWriteSuccess: write success, current: " + size + " total: " + i + " justWrite: " + HexUtil.formatHexString(bArr, true));
                        FlowWriteV2.this.mWriteCallback.onWriteSuccess(size, i, bArr);
                        FlowWriteV2.this.mWriteHandler.sendMessageDelayed(FlowWriteV2.this.mWriteHandler.obtainMessage(17), j);
                    }
                });
            }
        }
    }
}
