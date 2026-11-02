package com.wtx.ytbbleplugin;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.LocationManager;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import androidx.core.util.Consumer;
import androidx.work.WorkRequest;
import com.alibaba.fastjson.JSONObject;
import com.bykv.vk.openvk.preload.falconx.statistic.StatisticData;
import com.bytedance.sdk.component.pglcrypt.PglCryptUtils;
import com.clj.fastble.BleManager;
import com.clj.fastble.callback.BleGattCallback;
import com.clj.fastble.callback.BleMtuChangedCallback;
import com.clj.fastble.callback.BleNotifyCallback;
import com.clj.fastble.callback.BleScanCallback;
import com.clj.fastble.data.BleDevice;
import com.clj.fastble.exception.BleException;
import com.clj.fastble.scan.BleScanRuleConfig;
import com.clj.fastble.utils.HexUtil;
import com.google.ads.mediation.pangle.PangleConstants;
import com.hjq.permissions.Permission;
import com.taobao.weex.el.parse.Operators;
import com.taobao.weex.performance.WXInstanceApm;
import com.wtx.ytbbleplugin.callback.WTXWriteCallback;
import com.wtx.ytbbleplugin.callback.WTXWriteCallbackV10g;
import com.wtx.ytbbleplugin.utils.FlowWrite;
import com.wtx.ytbbleplugin.utils.FlowWriteForQ7;
import com.wtx.ytbbleplugin.utils.FlowWriteForV10G;
import io.dcloud.common.util.ExifInterface;
import io.dcloud.feature.uniapp.annotation.UniJSMethod;
import io.dcloud.feature.uniapp.bridge.UniJSCallback;
import io.dcloud.feature.uniapp.common.UniDestroyableModule;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
import kotlin.UByte$$ExternalSyntheticBackport0;

/* JADX INFO: loaded from: classes2.dex */
public class ytbBleFastV3Module extends UniDestroyableModule {
    private Activity activity;
    private BluetoothGattCharacteristic charactristicNotiy;
    private BluetoothGattCharacteristic charactristicNotiyForR5Data;
    private BluetoothGattCharacteristic charactristicNotiyFordata;
    private BluetoothGattCharacteristic charactristicRead;
    private BluetoothGattCharacteristic charactristicWrite;
    private BluetoothGattCharacteristic charactristicWriteWithNotResponse;
    private BluetoothGattCharacteristic charactristicWriteWithNotResponseForCmd;
    private BleDevice connectingDevice;
    private Object flowLock;
    private String mConnectingBleAddress;
    private String mConnectingBleName;
    private Context mContext;
    private String searchMac;
    private String searchName;
    private BleDevice stateQueryDevce;
    private UniJSCallback status_changed_callback;
    private String version = "2025091701";
    private String TAG = "YinTiBaoV3";
    private Boolean isNeedSetMtu = true;
    private Boolean isNeedOpenNotify = true;
    private int mReConnectCount = 5;
    private long mPerConnectTime = 3000;
    private long mOverTime = 3000;
    private boolean isMXW01Board = false;
    private String deviceModel = "";
    private boolean needSplitHex = false;
    private BleGattCallback bleGattCallback = new BleGattCallback() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.1
        @Override // com.clj.fastble.callback.BleGattCallback
        public void onConnectFail(BleDevice bleDevice, BleException bleException) {
            ytbBleFastV3Module.this.stateQueryDevce = bleDevice;
            Log.i(ytbBleFastV3Module.this.TAG, "onConnectFail: 连接失败:" + bleException.getDescription());
            JSONObject jSONObject = new JSONObject();
            boolean z = "Timeout Exception Occurred!".equals(bleException.getDescription());
            try {
                if (BleManager.getInstance().isConnected(bleDevice)) {
                    BleManager.getInstance().disconnect(bleDevice);
                    BleManager.getInstance().getBluetoothGatt(bleDevice).close();
                }
            } catch (Exception e2) {
                Log.i(ytbBleFastV3Module.this.TAG, "catch onConnectFail: " + e2.toString());
            }
            ytbBleFastV3Module.this.scanGattConnects(bleDevice != null ? bleDevice.getMac() : "");
            jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", (Object) "113");
            jSONObject.put("is_time_out", (Object) z);
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("连接失败:" + bleException.getDescription()));
            jSONObject.put("name", (Object) (bleDevice != null ? bleDevice.getName() : ""));
            jSONObject.put("mac", (Object) (bleDevice != null ? bleDevice.getMac() : ""));
            ytbBleFastV3Module.this.uni_status_callback(jSONObject);
        }

        @Override // com.clj.fastble.callback.BleGattCallback
        public void onConnected(BleDevice bleDevice, BluetoothGatt bluetoothGatt) {
            ytbBleFastV3Module.this.stateQueryDevce = bleDevice;
            Log.i(ytbBleFastV3Module.this.TAG, "onConnected: ");
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", (Object) PangleConstants.ADX_ID);
            jSONObject.put("step", (Object) "4");
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "等待开启服务发现");
            jSONObject.put("name", (Object) (bleDevice != null ? bleDevice.getName() : ""));
            jSONObject.put("mac", (Object) (bleDevice != null ? bleDevice.getMac() : ""));
            jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
            ytbBleFastV3Module.this.uni_status_callback(jSONObject);
        }

        @Override // com.clj.fastble.callback.BleGattCallback
        public void onConnecting(BleDevice bleDevice, BluetoothGatt bluetoothGatt) {
            ytbBleFastV3Module.this.stateQueryDevce = bleDevice;
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", (Object) "206");
            jSONObject.put("step", (Object) ExifInterface.GPS_MEASUREMENT_3D);
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "链接中...");
            jSONObject.put("name", (Object) (bleDevice != null ? bleDevice.getName() : ""));
            jSONObject.put("mac", (Object) (bleDevice != null ? bleDevice.getMac() : ""));
            jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
            ytbBleFastV3Module.this.uni_status_callback(jSONObject);
        }

        /* JADX WARN: Type inference failed for: r2v4, types: [com.wtx.ytbbleplugin.ytbBleFastV3Module$1$1] */
        @Override // com.clj.fastble.callback.BleGattCallback
        public void onDisConnected(boolean z, BleDevice bleDevice, BluetoothGatt bluetoothGatt, int i) {
            ytbBleFastV3Module.this.stateQueryDevce = bleDevice;
            Log.i(ytbBleFastV3Module.this.TAG, "onDisConnected: 连接断开");
            new Thread() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.1.1
                @Override // java.lang.Thread, java.lang.Runnable
                public void run() {
                    synchronized (ytbBleFastV3Module.this.flowLock) {
                        if (ytbBleFastV3Module.this.needSplitHex) {
                            FlowWriteForQ7.setCancalPrintFlag(true);
                            ytbBleFastV3Module.this.flowLock.notify();
                        } else {
                            FlowWrite.setCancalPrintFlag(true);
                            ytbBleFastV3Module.this.flowLock.notify();
                        }
                    }
                }
            }.start();
            try {
                if (BleManager.getInstance().isConnected(bleDevice)) {
                    BleManager.getInstance().getBleBluetooth(bleDevice).destroy();
                }
                bluetoothGatt.close();
            } catch (Exception e2) {
                Log.i(ytbBleFastV3Module.this.TAG, "onDisConnected: " + e2.toString());
            }
            ytbBleFastV3Module.this.scanGattConnects(bleDevice != null ? bleDevice.getMac() : "");
            ytbBleFastV3Module.this.initBleParam();
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", (Object) ExifInterface.GPS_MEASUREMENT_2D);
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "连接断开了");
            jSONObject.put("function", (Object) "onDisConnected");
            jSONObject.put("name", (Object) (bleDevice != null ? bleDevice.getName() : ""));
            jSONObject.put("mac", (Object) (bleDevice != null ? bleDevice.getMac() : ""));
            jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
            ytbBleFastV3Module.this.uni_status_callback(jSONObject);
        }

        @Override // com.clj.fastble.callback.BleGattCallback
        public void onDisConnecting(BleDevice bleDevice, BluetoothGatt bluetoothGatt) {
        }

        @Override // com.clj.fastble.callback.BleGattCallback
        public void onServicesDiscoveredFail(BleDevice bleDevice, BleException bleException) {
            String mac;
            String name;
            Log.i(ytbBleFastV3Module.this.TAG, "onServicesDiscoveredFail: ");
            if (bleDevice != null) {
                mac = bleDevice.getMac();
                name = bleDevice.getName();
            } else {
                mac = "";
                name = "";
            }
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", (Object) "202");
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "发现服务失败");
            jSONObject.put("function", (Object) "onServicesDiscoveredFail");
            jSONObject.put("ble_address", (Object) mac);
            jSONObject.put("ble_name", (Object) name);
            jSONObject.put("ble_mac", (Object) mac);
            jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
            ytbBleFastV3Module.this.uni_status_callback(jSONObject);
        }

        @Override // com.clj.fastble.callback.BleGattCallback
        public void onServicesDiscoveredSuccess(BleDevice bleDevice, BluetoothGatt bluetoothGatt, int i, List<BluetoothGattService> list) {
            int size;
            Log.i(ytbBleFastV3Module.this.TAG, "onServicesDiscoveredSuccess: ");
            ytbBleFastV3Module.this.connectingDevice = bleDevice;
            StringBuilder sb = new StringBuilder();
            if (list != null) {
                size = list.size();
                for (BluetoothGattService bluetoothGattService : list) {
                    if (bluetoothGattService != null) {
                        sb.append("服务" + bluetoothGattService.getUuid().toString() + "的特征值列表start:");
                        for (BluetoothGattCharacteristic bluetoothGattCharacteristic : bluetoothGattService.getCharacteristics()) {
                            if (bluetoothGattCharacteristic != null) {
                                sb.append(bluetoothGattCharacteristic.getUuid().toString() + "|");
                            }
                        }
                        sb.append("end;");
                    }
                }
            } else {
                size = 0;
            }
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", (Object) "204");
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "服务发现成功,开始扫描特征值之前的通知");
            jSONObject.put("step", (Object) "6");
            jSONObject.put("function", (Object) "onServicesDiscoveredSuccess");
            jSONObject.put("gattserviceSize", (Object) Integer.valueOf(size));
            jSONObject.put("serviceList", (Object) sb.toString());
            jSONObject.put("name", (Object) (bleDevice != null ? bleDevice.getName() : ""));
            jSONObject.put("mac", (Object) (bleDevice != null ? bleDevice.getMac() : ""));
            jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
            ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            ytbBleFastV3Module.this.getGattService(bleDevice, list);
            JSONObject jSONObject2 = new JSONObject();
            if (ytbBleFastV3Module.this.charactristicNotiy == null || ytbBleFastV3Module.this.charactristicWriteWithNotResponse == null) {
                jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject2.put("type", (Object) "109");
                jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "连接成功,特征扫描失败");
                jSONObject2.put("step", (Object) "8");
                jSONObject2.put("charactristicNotiy", (Object) (ytbBleFastV3Module.this.charactristicNotiy != null ? ytbBleFastV3Module.this.charactristicNotiy.getUuid().toString() : "null"));
                jSONObject2.put("charactristicWriteWithNotResponse", (Object) (ytbBleFastV3Module.this.charactristicWriteWithNotResponse != null ? ytbBleFastV3Module.this.charactristicWriteWithNotResponse.getUuid().toString() : "null"));
                jSONObject2.put("function", (Object) "onServicesDiscoveredSuccess");
                jSONObject2.put("name", (Object) (bleDevice != null ? bleDevice.getName() : ""));
                jSONObject2.put("mac", (Object) (bleDevice != null ? bleDevice.getMac() : ""));
                jSONObject2.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject2);
                return;
            }
            jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject2.put("type", (Object) "102");
            jSONObject2.put("step", (Object) "7");
            jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "特征值扫描成功,打印准备就绪");
            jSONObject2.put("function", (Object) "onServicesDiscoveredSuccess");
            jSONObject2.put("ble_address", (Object) ytbBleFastV3Module.this.connectingDevice.getMac());
            jSONObject2.put("ble_name", (Object) ytbBleFastV3Module.this.connectingDevice.getName());
            jSONObject2.put("ble_mac", (Object) ytbBleFastV3Module.this.connectingDevice.getMac());
            jSONObject2.put("version", (Object) ytbBleFastV3Module.this.version);
            ytbBleFastV3Module.this.uni_status_callback(jSONObject2);
            if (ytbBleFastV3Module.this.isNeedSetMtu.booleanValue()) {
                ytbBleFastV3Module.this.setMtu(PglCryptUtils.COMPRESS_FAILED);
            }
            if (!ytbBleFastV3Module.this.isNeedOpenNotify.booleanValue() || ytbBleFastV3Module.this.charactristicNotiy == null) {
                return;
            }
            JSONObject jSONObject3 = new JSONObject();
            jSONObject3.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject3.put("type", (Object) "209");
            jSONObject3.put("step", (Object) "11");
            jSONObject3.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "开始订阅通知回调");
            jSONObject3.put("version", (Object) ytbBleFastV3Module.this.version);
            jSONObject3.put("name", (Object) (bleDevice != null ? bleDevice.getName() : ""));
            jSONObject3.put("mac", (Object) (bleDevice != null ? bleDevice.getMac() : ""));
            ytbBleFastV3Module.this.uni_status_callback(jSONObject3);
            ytbBleFastV3Module.this.delayOpenNotification();
        }

        @Override // com.clj.fastble.callback.BleGattCallback
        public void onServicesDiscovering(BleDevice bleDevice, BluetoothGatt bluetoothGatt, boolean z) {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", (Object) "208");
            jSONObject.put("step", (Object) "5");
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "开始发现服务");
            jSONObject.put("name", (Object) (bleDevice != null ? bleDevice.getName() : ""));
            jSONObject.put("mac", (Object) (bleDevice != null ? bleDevice.getMac() : ""));
            jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
            ytbBleFastV3Module.this.uni_status_callback(jSONObject);
        }

        @Override // com.clj.fastble.callback.BleGattCallback
        public void onStartConnect() {
            Log.i(ytbBleFastV3Module.this.TAG, "onStartConnect: 开始连接; 主线程" + ytbBleFastV3Module.this.isMainThread());
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", (Object) "103");
            jSONObject.put("step", (Object) ExifInterface.GPS_MEASUREMENT_2D);
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "开始连接");
            jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
            ytbBleFastV3Module.this.uni_status_callback(jSONObject);
        }
    };
    private BroadcastReceiver BluetoothReciever = new BroadcastReceiver() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.2
        @Override // android.content.BroadcastReceiver
        public void onReceive(Context context, Intent intent) {
            if ("android.bluetooth.adapter.action.STATE_CHANGED".equals(intent.getAction())) {
                int intExtra = intent.getIntExtra("android.bluetooth.adapter.extra.STATE", 10);
                Log.i(ytbBleFastV3Module.this.TAG, "==========此时蓝牙的状态是====22====" + intExtra);
                ytbBleFastV3Module.this.printBTState(intExtra);
            }
        }
    };
    private int perPackageLength = 20;

    /* JADX INFO: Access modifiers changed from: private */
    public String byteToHex(byte b2) {
        String hexString = Integer.toHexString(b2 & 255);
        return hexString.length() < 2 ? WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString : hexString;
    }

    private boolean checkGPSIsOpen() {
        LocationManager locationManager = (LocationManager) this.mContext.getSystemService("location");
        if (locationManager == null) {
            return false;
        }
        return locationManager.isProviderEnabled("gps");
    }

    private void connect(final int i, final long j, final long j2, final BleDevice bleDevice) {
        this.activity.runOnUiThread(new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.12
            @Override // java.lang.Runnable
            public void run() {
                BleManager.getInstance().setReConnectCount(i, j).setConnectOverTime(j2).connect(bleDevice, ytbBleFastV3Module.this.bleGattCallback);
            }
        });
    }

    private void connect(final int i, final long j, final long j2, final String str) {
        if (str == null || "".equals(str)) {
            return;
        }
        this.activity.runOnUiThread(new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.11
            @Override // java.lang.Runnable
            public void run() {
                BleManager.getInstance().setReConnectCount(i, j).setConnectOverTime(j2).connect(str, ytbBleFastV3Module.this.bleGattCallback);
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    public Boolean connectPrinterNext(String str) {
        for (BluetoothDevice bluetoothDevice : getConnectedDevice()) {
            if (bluetoothDevice.getAddress() != null && !"".equals(bluetoothDevice.getAddress()) && str.equals(bluetoothDevice.getAddress())) {
                BleManager.getInstance().disableBluetooth();
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("type", "210");
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, "开始重启蓝牙");
                jSONObject.put("version", (Object) this.version);
                uni_status_callback(jSONObject);
                return false;
            }
        }
        scanGattConnects(str);
        connect(this.mReConnectCount, this.mPerConnectTime, this.mOverTime, str);
        return true;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void delayOpenNotification() {
        new Timer().schedule(new TimerTask() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.17
            @Override // java.util.TimerTask, java.lang.Runnable
            public void run() {
                ytbBleFastV3Module.this.openNotification();
            }
        }, 200L);
    }

    private Set<BluetoothDevice> getConnectedDevice() {
        HashSet hashSet = new HashSet();
        HashSet<BluetoothDevice> hashSet2 = new HashSet();
        BluetoothManager bluetoothManager = (BluetoothManager) this.mContext.getSystemService("bluetooth");
        List<BluetoothDevice> connectedDevices = bluetoothManager.getConnectedDevices(7);
        if (connectedDevices != null && connectedDevices.size() > 0) {
            hashSet2.addAll(connectedDevices);
        }
        Set<BluetoothDevice> bondedDevices = bluetoothManager.getAdapter().getBondedDevices();
        if (bondedDevices != null && bondedDevices.size() > 0) {
            hashSet2.addAll(bondedDevices);
        }
        for (BluetoothDevice bluetoothDevice : hashSet2) {
            bluetoothDevice.getType();
            if (isConnected(bluetoothDevice.getAddress())) {
                hashSet.add(bluetoothDevice);
            }
        }
        return hashSet;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public String getFFValueFromBroadcast(byte[] bArr) {
        if (bArr != null && bArr.length != 0) {
            int length = bArr.length;
            String[] strArr = new String[length];
            for (int i = 0; i < bArr.length; i++) {
                strArr[i] = byteToHex(bArr[i]).toUpperCase();
            }
            int i2 = 0;
            do {
                try {
                    int i3 = Integer.parseInt(strArr[i2], 16);
                    if ("FF".equals(strArr[i2 + 1]) && i3 > 1) {
                        int i4 = i3 - 1;
                        String[] strArr2 = new String[i4];
                        System.arraycopy(strArr, i2 + 2, strArr2, 0, i4);
                        return UByte$$ExternalSyntheticBackport0.m(Operators.SPACE_STR, strArr2);
                    }
                    i2 = i2 + i3 + 1;
                } catch (Exception unused) {
                }
            } while (i2 < length - 2);
        }
        return "";
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void getGattService(BleDevice bleDevice, List<BluetoothGattService> list) {
        String upperCase;
        if (bleDevice == null || bleDevice.getName() == null) {
            String str = this.mConnectingBleName;
            upperCase = str != null ? str.toUpperCase() : null;
        } else {
            upperCase = bleDevice.getName().toUpperCase();
        }
        if (upperCase != null && (upperCase.startsWith("MP850") || "MXW-A4".equals(upperCase))) {
            BluetoothGattService service = BleManager.getInstance().getBluetoothGatt(bleDevice).getService(UUID.fromString("0000ff00-0000-1000-8000-00805f9b34fb"));
            this.charactristicWriteWithNotResponse = service.getCharacteristic(UUID.fromString("0000ff02-0000-1000-8000-00805f9b34fb"));
            this.charactristicNotiyFordata = service.getCharacteristic(UUID.fromString("0000ff03-0000-1000-8000-00805f9b34fb"));
            this.charactristicNotiy = service.getCharacteristic(UUID.fromString("0000ff01-0000-1000-8000-00805f9b34fb"));
            return;
        }
        if (upperCase != null && "R5".equals(this.deviceModel)) {
            BluetoothGattService service2 = BleManager.getInstance().getBluetoothGatt(bleDevice).getService(UUID.fromString("0000200a-0000-1000-8000-00805f9b34fb"));
            this.charactristicNotiyForR5Data = service2.getCharacteristic(UUID.fromString("0000204a-0000-1000-8000-00805f9b34fb"));
            this.charactristicWriteWithNotResponse = service2.getCharacteristic(UUID.fromString("0000202a-0000-1000-8000-00805f9b34fb"));
            this.charactristicNotiy = service2.getCharacteristic(UUID.fromString("0000203a-0000-1000-8000-00805f9b34fb"));
            return;
        }
        if (upperCase != null && (upperCase.startsWith("MXW") || "C17".equals(upperCase) || this.isMXW01Board)) {
            BluetoothGattService service3 = BleManager.getInstance().getBluetoothGatt(bleDevice).getService(UUID.fromString("0000ae30-0000-1000-8000-00805f9b34fb"));
            this.charactristicNotiy = service3.getCharacteristic(UUID.fromString("0000ae02-0000-1000-8000-00805f9b34fb"));
            this.charactristicWriteWithNotResponseForCmd = service3.getCharacteristic(UUID.fromString("0000ae01-0000-1000-8000-00805f9b34fb"));
            this.charactristicWriteWithNotResponse = service3.getCharacteristic(UUID.fromString("0000ae03-0000-1000-8000-00805f9b34fb"));
            return;
        }
        if (list == null || list.size() <= 0) {
            list = BleManager.getInstance().getBluetoothGatt(bleDevice).getServices();
        }
        Iterator<BluetoothGattService> it = list.iterator();
        while (it.hasNext()) {
            for (BluetoothGattCharacteristic bluetoothGattCharacteristic : it.next().getCharacteristics()) {
                if (this.charactristicWrite == null && (bluetoothGattCharacteristic.getProperties() & 8) != 0) {
                    this.charactristicWrite = bluetoothGattCharacteristic;
                }
                if (this.charactristicRead == null && (bluetoothGattCharacteristic.getProperties() & 2) != 0) {
                    this.charactristicRead = bluetoothGattCharacteristic;
                }
                if (this.charactristicNotiy == null && ((bluetoothGattCharacteristic.getProperties() & 16) != 0 || (bluetoothGattCharacteristic.getProperties() & 32) != 0)) {
                    this.charactristicNotiy = bluetoothGattCharacteristic;
                }
                if (this.charactristicWriteWithNotResponse == null && (bluetoothGattCharacteristic.getProperties() & 4) != 0) {
                    this.charactristicWriteWithNotResponse = bluetoothGattCharacteristic;
                }
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void handle204aNotification(byte[] bArr) {
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject.put("type", "311");
        jSONObject.put("notice", (Object) HexUtil.formatHexString(bArr, false));
        jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, "SBC音频文件流");
        jSONObject.put("version", (Object) this.version);
        uni_status_callback(jSONObject);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void handleFf03Notification(final byte[] bArr) {
        Log.i(this.TAG, "ff03收到通知:" + HexUtil.formatHexString(bArr, false));
        if (bArr.length == 0) {
            return;
        }
        String strByteToHex = byteToHex(bArr[0]);
        JSONObject jSONObject = new JSONObject();
        if ("01".equals(strByteToHex)) {
            if (bArr.length < 2) {
                return;
            }
            Thread thread = new Thread() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.16
                @Override // java.lang.Thread, java.lang.Runnable
                public void run() {
                    synchronized (ytbBleFastV3Module.this.flowLock) {
                        FlowWriteForV10G.setGredit(Integer.parseInt(ytbBleFastV3Module.this.byteToHex(bArr[1]), 16));
                        ytbBleFastV3Module.this.flowLock.notify();
                    }
                }
            };
            thread.setPriority(10);
            thread.start();
            jSONObject.put("data", (Object) Integer.valueOf(Integer.parseInt(byteToHex(bArr[1]), 16)));
        } else if ("02".equals(strByteToHex)) {
            int i = Integer.parseInt(byteToHex(bArr[2]) + byteToHex(bArr[1]), 16);
            Log.i(this.TAG, "mtu: " + i);
            jSONObject.put("data", (Object) Integer.valueOf(i));
        }
        jSONObject.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject.put("type", "211");
        jSONObject.put("notice", (Object) HexUtil.formatHexString(bArr, false));
        jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("ff03收到回复内容:" + HexUtil.formatHexString(bArr, false)));
        jSONObject.put("version", (Object) this.version);
        uni_status_callback(jSONObject);
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Type inference failed for: r0v10, types: [com.wtx.ytbbleplugin.ytbBleFastV3Module$15] */
    /* JADX WARN: Type inference failed for: r1v22, types: [com.wtx.ytbbleplugin.ytbBleFastV3Module$14] */
    public void handleMainNotification(byte[] bArr) {
        Object obj;
        if (bArr == null || bArr.length == 0) {
            return;
        }
        boolean z = false;
        String hexString = HexUtil.formatHexString(bArr, false);
        if (TextUtils.equals("aa01", hexString) || TextUtils.equals("5178ae0101001070ff", hexString) || TextUtils.equals("2221a800010020e0ff", hexString) || TextUtils.equals("2221ae0101001070ff", hexString) || TextUtils.equals("2221ae0001000000", hexString) || "5178AE01001070FF".equalsIgnoreCase(hexString) || "5688A70101000107FF".equalsIgnoreCase(hexString)) {
            Log.i(this.TAG, "onCharacteristicChanged: 天远 触发流控，停止打印");
            if (this.needSplitHex) {
                FlowWriteForQ7.setCanWriteFlag(false);
            } else {
                FlowWrite.setCanWriteFlag(false);
            }
        } else if (TextUtils.equals("aa00", hexString) || TextUtils.equals("5178ae0101000000ff", hexString) || TextUtils.equals("2221a80001003090ff", hexString) || TextUtils.equals("2221ae0101000000ff", hexString) || TextUtils.equals("2221ae0001001000", hexString) || "5178AE01000000FF".equalsIgnoreCase(hexString) || "5688A70101000000FF".equalsIgnoreCase(hexString)) {
            Log.i(this.TAG, "onCharacteristicChanged: 天远 解除流控， 继续打印");
            new Thread() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.14
                @Override // java.lang.Thread, java.lang.Runnable
                public void run() {
                    synchronized (ytbBleFastV3Module.this.flowLock) {
                        if (ytbBleFastV3Module.this.needSplitHex) {
                            FlowWriteForQ7.setCanWriteFlag(true);
                            ytbBleFastV3Module.this.flowLock.notify();
                        } else {
                            FlowWrite.setCanWriteFlag(true);
                            ytbBleFastV3Module.this.flowLock.notify();
                        }
                    }
                }
            }.start();
        }
        JSONObject jSONObject = new JSONObject();
        if (this.charactristicNotiyFordata != null && hexString.startsWith("6572723a") && hexString.length() == 16) {
            hexString.substring(hexString.length() - 8);
            String strHexTobinaryStr = hexTobinaryStr(hexString.substring(10, 12));
            String strHexTobinaryStr2 = hexTobinaryStr(hexString.substring(12, 14));
            boolean z2 = true;
            if ("1".equals(strHexTobinaryStr.substring(1, 2))) {
                Log.i(this.TAG, "onCharacteristicChanged: 打印头过热");
                obj = "guore";
                z = true;
            } else {
                obj = "";
            }
            if ("11".equals(strHexTobinaryStr2.substring(4, 6))) {
                Log.i(this.TAG, "onCharacteristicChanged: 缺纸");
                obj = "quezhi";
            } else {
                z2 = z;
            }
            if (z2) {
                jSONObject.put("V10GStatus", obj);
                new Thread() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.15
                    @Override // java.lang.Thread, java.lang.Runnable
                    public void run() {
                        synchronized (ytbBleFastV3Module.this.flowLock) {
                            Log.i(ytbBleFastV3Module.this.TAG, "run: 取消打印");
                            FlowWriteForV10G.setCancalPrintFlag(true);
                            ytbBleFastV3Module.this.flowLock.notify();
                        }
                    }
                }.start();
            }
        }
        jSONObject.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject.put("type", StatisticData.ERROR_CODE_NOT_FOUND);
        jSONObject.put("notice", (Object) hexString);
        jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, "收到回复内容:" + hexString);
        jSONObject.put("version", this.version);
        uni_status_callback(jSONObject);
    }

    private String hexTobinaryStr(String str) {
        String binaryString = Integer.toBinaryString(Integer.parseInt(str, 16));
        for (int length = binaryString.length(); length < 8; length++) {
            binaryString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + binaryString;
        }
        return binaryString;
    }

    private void initBle() {
        BleManager.getInstance().enableLog(false).setReConnectCount(0, 6000L).setConnectOverTime(20000L).setOperateTimeout(7000);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void initBleParam() {
        this.connectingDevice = null;
        this.stateQueryDevce = null;
        this.charactristicNotiy = null;
        this.charactristicWrite = null;
        this.charactristicRead = null;
        this.charactristicWriteWithNotResponse = null;
        this.charactristicNotiyFordata = null;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean isMainThread() {
        return Thread.currentThread() == Looper.getMainLooper().getThread();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void onMainNotifyFailure(BleException bleException) {
        String mac;
        String str;
        BleDevice bleDevice;
        Log.i(this.TAG, "onNotifyFailure: ");
        String name = "";
        try {
            bleDevice = this.connectingDevice;
        } catch (Exception unused) {
            mac = "";
        }
        if (bleDevice == null) {
            str = "";
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", "105");
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("订阅失败:" + bleException.toString()));
            jSONObject.put("step", "13");
            jSONObject.put("ble_address", (Object) name);
            jSONObject.put("ble_name", (Object) str);
            jSONObject.put("ble_mac", (Object) name);
            jSONObject.put("version", (Object) this.version);
            uni_status_callback(jSONObject);
        }
        mac = bleDevice.getMac();
        try {
            name = this.connectingDevice.getName();
        } catch (Exception unused2) {
        }
        String str2 = mac;
        str = name;
        name = str2;
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put("type", "105");
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("订阅失败:" + bleException.toString()));
        jSONObject2.put("step", "13");
        jSONObject2.put("ble_address", (Object) name);
        jSONObject2.put("ble_name", (Object) str);
        jSONObject2.put("ble_mac", (Object) name);
        jSONObject2.put("version", (Object) this.version);
        uni_status_callback(jSONObject2);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void onMainNotifySuccess() {
        String string;
        JSONObject jSONObject = new JSONObject();
        String string2 = "";
        try {
            BluetoothGattCharacteristic bluetoothGattCharacteristic = this.charactristicWriteWithNotResponse;
            string = bluetoothGattCharacteristic != null ? bluetoothGattCharacteristic.getUuid().toString() : "";
            try {
                BluetoothGattCharacteristic bluetoothGattCharacteristic2 = this.charactristicNotiy;
                if (bluetoothGattCharacteristic2 != null) {
                    string2 = bluetoothGattCharacteristic2.getUuid().toString();
                }
            } catch (Exception unused) {
            }
        } catch (Exception unused2) {
            string = "";
        }
        jSONObject.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject.put("type", "108");
        jSONObject.put("step", "12");
        jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, "特征订阅成功");
        jSONObject.put("w_uuid", (Object) string);
        jSONObject.put("n_uuid", (Object) string2);
        jSONObject.put("version", (Object) this.version);
        uni_status_callback(jSONObject);
    }

    private void onPermissionGranted(String str) {
        str.hashCode();
        if (str.equals(Permission.ACCESS_FINE_LOCATION)) {
            if (!checkGPSIsOpen()) {
                Log.i(this.TAG, "onPermissionGranted: 当前手机扫描蓝牙需要打开定位功能");
            } else {
                setScanRule();
                startScan();
            }
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void openNotification() {
        BluetoothGattCharacteristic bluetoothGattCharacteristic = this.charactristicNotiy;
        if (bluetoothGattCharacteristic == null) {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject.put("type", (Object) "205");
            jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "调用失败openNotification charactristicNotiy 为null");
            jSONObject.put("version", (Object) this.version);
            return;
        }
        subscribeToCharacteristic(bluetoothGattCharacteristic, new Consumer() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda2
            @Override // androidx.core.util.Consumer
            public final void accept(Object obj) {
                this.f$0.handleMainNotification((byte[]) obj);
            }
        }, new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda3
            @Override // java.lang.Runnable
            public final void run() {
                this.f$0.onMainNotifySuccess();
            }
        }, new Consumer() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda4
            @Override // androidx.core.util.Consumer
            public final void accept(Object obj) {
                this.f$0.onMainNotifyFailure((BleException) obj);
            }
        });
        if (this.charactristicNotiyFordata != null) {
            new Handler().postDelayed(new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda5
                @Override // java.lang.Runnable
                public final void run() {
                    this.f$0.m342x55bd893d();
                }
            }, 300L);
        } else if (this.charactristicNotiyForR5Data != null) {
            new Handler().postDelayed(new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda6
                @Override // java.lang.Runnable
                public final void run() {
                    this.f$0.m345xfb9e0a40();
                }
            }, 300L);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void printBTState(int i) {
        String strValueOf;
        switch (i) {
            case 10:
                initBleParam();
                BleManager.getInstance().enableBluetooth();
                Log.i(this.TAG, "============蓝牙状态:已关闭===========" + i);
                strValueOf = "已关闭";
                break;
            case 11:
                Log.i(this.TAG, "=====蓝牙状态:正在打开======" + i);
                strValueOf = "正在打开";
                break;
            case 12:
                Log.i(this.TAG, "=========蓝牙状态:已打开=========" + i);
                strValueOf = "已打开";
                break;
            case 13:
                Log.i(this.TAG, "========蓝牙状态:正在关闭==============" + i);
                strValueOf = "正在关闭";
                break;
            default:
                strValueOf = String.valueOf(i);
                Log.i(this.TAG, "=========蓝牙状态=========" + i);
                break;
        }
        if ("".equals(strValueOf)) {
            return;
        }
        Log.i(this.TAG, "printBTState: " + strValueOf);
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject.put("type", "203");
        jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, "蓝牙状态");
        jSONObject.put("status_code", Integer.valueOf(i));
        jSONObject.put("status", (Object) strValueOf);
        jSONObject.put("version", this.version);
        uni_status_callback(jSONObject);
    }

    private void register_bluethooth_Broadcast() {
        IntentFilter intentFilter = new IntentFilter("android.bluetooth.device.action.FOUND");
        intentFilter.addAction("android.bluetooth.adapter.action.STATE_CHANGED");
        this.mContext.registerReceiver(this.BluetoothReciever, intentFilter);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void scanGattConnects(final String str) {
        if (str == null || "".equals(str)) {
            return;
        }
        this.activity.runOnUiThread(new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.4
            @Override // java.lang.Runnable
            public void run() {
                try {
                    BluetoothGatt bluetoothGatt = BleManager.getInstance().getBluetoothGatt(new BleDevice(BleManager.getInstance().getBluetoothAdapter().getRemoteDevice(str), 0, null, 0L));
                    if (bluetoothGatt == null) {
                        return;
                    }
                    List<BluetoothDevice> connectedDevices = bluetoothGatt.getConnectedDevices();
                    if (connectedDevices != null || connectedDevices.size() > 0) {
                        Iterator<BluetoothDevice> it = connectedDevices.iterator();
                        while (it.hasNext()) {
                            if (it.next().getAddress().equals(str)) {
                                bluetoothGatt.disconnect();
                            }
                        }
                    }
                    bluetoothGatt.close();
                } catch (Exception unused) {
                }
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void setMtu(int i) {
        BleManager.getInstance().setMtu(this.connectingDevice, i, new BleMtuChangedCallback() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.18
            @Override // com.clj.fastble.callback.BleMtuChangedCallback
            public void onMtuChanged(int i2) {
                Log.i(ytbBleFastV3Module.this.TAG, "onMtuChanged: " + i2);
                ytbBleFastV3Module.this.perPackageLength = i2 - 8;
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("type", (Object) "110");
                jSONObject.put("mtu", (Object) Integer.valueOf(i2));
                jSONObject.put("step", (Object) "10");
                jSONObject.put("perPackageLength", (Object) Integer.valueOf(ytbBleFastV3Module.this.perPackageLength));
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "设置MTU成功");
                jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            }

            @Override // com.clj.fastble.callback.BleMtuChangedCallback
            public void onSetMTUFailure(BleException bleException) {
                Log.i(ytbBleFastV3Module.this.TAG, "onSetMTUFailure: ");
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("type", (Object) "111");
                jSONObject.put("step", (Object) "9");
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("设置MTU失败:" + bleException.toString()));
                jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            }
        });
    }

    private void setScanRule() {
        BleScanRuleConfig.Builder builder = new BleScanRuleConfig.Builder();
        String str = this.searchName;
        if (str != null && str.length() != 0) {
            builder.setDeviceName(true, this.searchName);
        }
        String str2 = this.searchMac;
        if (str2 != null && str2.length() != 0) {
            builder.setDeviceMac(this.searchMac);
        }
        BleManager.getInstance().initScanRule(builder.setAutoConnect(false).setScanTimeOut(WorkRequest.MIN_BACKOFF_MILLIS).build());
    }

    private void startScan() {
        BleManager.getInstance().scan(new BleScanCallback() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.19
            @Override // com.clj.fastble.callback.BleScanCallback
            public void onLeScan(BleDevice bleDevice) {
                super.onLeScan(bleDevice);
                if (TextUtils.isEmpty(bleDevice.getName())) {
                    return;
                }
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("flag", (Object) "1");
                jSONObject.put("type", (Object) "4");
                jSONObject.put("ble_name", (Object) bleDevice.getName());
                jSONObject.put("ble_address", (Object) bleDevice.getMac());
                jSONObject.put("uuid", (Object) bleDevice.getMac());
                jSONObject.put("research_uuid", (Object) bleDevice.getMac());
                jSONObject.put("FFValue", (Object) ytbBleFastV3Module.this.getFFValueFromBroadcast(bleDevice.getScanRecord()));
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "BLE扫描结果返回");
                jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            }

            @Override // com.clj.fastble.callback.BleScanCallback
            public void onScanFinished(List<BleDevice> list) {
                Log.i(ytbBleFastV3Module.this.TAG, "onScanFinished: 扫描结束");
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("type", (Object) "106");
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "BLE扫描结束了");
                jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            }

            @Override // com.clj.fastble.callback.BleScanPresenterImp
            public void onScanStarted(boolean z) {
                Log.i(ytbBleFastV3Module.this.TAG, "onScanStarted: " + z + ";主线程：" + ytbBleFastV3Module.this.isMainThread());
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("type", (Object) "99");
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("开始扫描结果:" + z));
                jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            }

            @Override // com.clj.fastble.callback.BleScanPresenterImp
            public void onScanning(BleDevice bleDevice) {
                TextUtils.isEmpty(bleDevice.getName());
            }
        });
    }

    private void subscribeToCharacteristic(BluetoothGattCharacteristic bluetoothGattCharacteristic, final Consumer<byte[]> consumer, final Runnable runnable, final Consumer<BleException> consumer2) {
        if (this.connectingDevice == null || bluetoothGattCharacteristic == null) {
            Log.i(this.TAG, "subscribeToCharacteristic: Skip subscription: device or characteristic is null");
            return;
        }
        BluetoothGattService service = bluetoothGattCharacteristic.getService();
        if (service == null) {
            Log.i(this.TAG, "subscribeToCharacteristic: Characteristic has no service");
            return;
        }
        String string = service.getUuid().toString();
        final String string2 = bluetoothGattCharacteristic.getUuid().toString();
        BleManager.getInstance().notify(this.connectingDevice, string, string2, new BleNotifyCallback() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.13
            @Override // com.clj.fastble.callback.BleNotifyCallback
            public void onCharacteristicChanged(byte[] bArr) {
                if (bArr == null || bArr.length == 0) {
                    return;
                }
                consumer.accept(bArr);
            }

            @Override // com.clj.fastble.callback.BleNotifyCallback
            public void onNotifyFailure(BleException bleException) {
                Log.i(ytbBleFastV3Module.this.TAG, "onNotifyFailure Uuid: " + bleException.getDescription());
                consumer2.accept(bleException);
            }

            @Override // com.clj.fastble.callback.BleNotifyCallback
            public void onNotifySuccess() {
                Log.i(ytbBleFastV3Module.this.TAG, "onNotifySuccess: " + string2 + " ; 主线程:" + ytbBleFastV3Module.this.isMainThread());
                runnable.run();
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void uni_status_callback(JSONObject jSONObject) {
        UniJSCallback uniJSCallback = this.status_changed_callback;
        if (uniJSCallback != null) {
            try {
                uniJSCallback.invokeAndKeepAlive(jSONObject);
            } catch (Exception e2) {
                Log.i(this.TAG, "uni_status_callback: " + e2.toString());
            }
        }
    }

    @UniJSMethod(uiThread = false)
    public void CloseBleAdapter(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        BleManager.getInstance().disableBluetooth();
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "关闭蓝牙适配器");
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void OpenBleAdapter(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        String str;
        if (BleManager.getInstance().isBlueEnable()) {
            str = "已开启";
        } else {
            BleManager.getInstance().enableBluetooth();
            str = "开启请求已发送";
        }
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "开启蓝牙适配器");
        jSONObject2.put("result", (Object) str);
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    /* JADX WARN: Type inference failed for: r3v1, types: [com.wtx.ytbbleplugin.ytbBleFastV3Module$9] */
    @UniJSMethod(uiThread = false)
    public void cancelPrint(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        new Thread() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.9
            @Override // java.lang.Thread, java.lang.Runnable
            public void run() {
                synchronized (ytbBleFastV3Module.this.flowLock) {
                    if (ytbBleFastV3Module.this.needSplitHex) {
                        FlowWriteForQ7.setCancalPrintFlag(true);
                        ytbBleFastV3Module.this.flowLock.notify();
                    } else {
                        FlowWrite.setCancalPrintFlag(true);
                        ytbBleFastV3Module.this.flowLock.notify();
                    }
                }
            }
        }.start();
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "取消请求已发送");
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    /* JADX WARN: Type inference failed for: r3v1, types: [com.wtx.ytbbleplugin.ytbBleFastV3Module$8] */
    @UniJSMethod(uiThread = false)
    public void cancelPrintForV10g(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        new Thread() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.8
            @Override // java.lang.Thread, java.lang.Runnable
            public void run() {
                synchronized (ytbBleFastV3Module.this.flowLock) {
                    FlowWriteForV10G.setCancalPrintFlag(true);
                    ytbBleFastV3Module.this.flowLock.notify();
                }
            }
        }.start();
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "取消请求已发送");
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void checkPermissions() {
        if (!BluetoothAdapter.getDefaultAdapter().isEnabled()) {
            Log.i(this.TAG, "checkPermissions: please_open_blue");
            return;
        }
        String[] strArr = {Permission.ACCESS_FINE_LOCATION};
        ArrayList arrayList = new ArrayList();
        String str = strArr[0];
        if (ContextCompat.checkSelfPermission(this.mContext, str) == 0) {
            onPermissionGranted(str);
        } else {
            arrayList.add(str);
        }
        if (arrayList.isEmpty()) {
            return;
        }
        Log.i(this.TAG, "checkPermissions: 被拒绝的权限:" + arrayList.toString());
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject.put("type", "107");
        jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("权限检查失败:" + arrayList.toString()));
        jSONObject.put("version", (Object) this.version);
        uni_status_callback(jSONObject);
    }

    @UniJSMethod(uiThread = false)
    public void connectPrinter(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        this.mReConnectCount = jSONObject.containsKey("reConnectCount") ? jSONObject.getIntValue("reConnectCount") : 5;
        this.mPerConnectTime = jSONObject.containsKey("perConnectTime") ? jSONObject.getLongValue("perConnectTime") : 3000L;
        this.mOverTime = jSONObject.containsKey("overTime") ? jSONObject.getLongValue("overTime") : 3000L;
        final String string = jSONObject.getString("address");
        this.mConnectingBleAddress = string;
        this.mConnectingBleName = jSONObject.containsKey("bleName") ? jSONObject.getString("bleName") : null;
        this.isNeedSetMtu = Boolean.valueOf(jSONObject.containsKey("isNeedSetMtu") ? jSONObject.getBoolean("isNeedSetMtu").booleanValue() : false);
        this.isNeedOpenNotify = Boolean.valueOf(jSONObject.containsKey("isNeedOpenNotify") ? jSONObject.getBoolean("isNeedOpenNotify").booleanValue() : false);
        Boolean bool = false;
        try {
            BleManager.getInstance().cancelScan();
            if (this.connectingDevice != null) {
                bool = true;
                BleManager.getInstance().disconnect(this.connectingDevice);
            }
        } catch (Exception e2) {
            Log.i(this.TAG, "connectPrinter: try catch" + e2.toString());
        }
        Log.i(this.TAG, "connectPrinter: ".concat(this.connectingDevice == null ? "connectingDevice为空" : "connectingDevice存在"));
        initBleParam();
        this.isMXW01Board = jSONObject.containsKey("isMXW01Board") ? jSONObject.getBoolean("isMXW01Board").booleanValue() : false;
        this.deviceModel = jSONObject.containsKey("deviceModel") ? jSONObject.getString("deviceModel") : "";
        if (bool.booleanValue()) {
            new Timer().schedule(new TimerTask() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.3
                @Override // java.util.TimerTask, java.lang.Runnable
                public void run() {
                    Log.i(ytbBleFastV3Module.this.TAG, "run: 延时执行了");
                    ytbBleFastV3Module.this.connectPrinterNext(string).booleanValue();
                }
            }, 800L);
        } else if (!connectPrinterNext(string).booleanValue()) {
            return;
        }
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put("step", "1");
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, "链接请求已发送");
        jSONObject2.put("version", (Object) this.version);
        uni_status_callback(jSONObject2);
    }

    @Override // com.taobao.weex.common.Destroyable
    public void destroy() {
        try {
            this.mContext.unregisterReceiver(this.BluetoothReciever);
            if (this.connectingDevice != null) {
                this.activity.runOnUiThread(new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.20
                    @Override // java.lang.Runnable
                    public void run() {
                        BleManager.getInstance().disconnect(ytbBleFastV3Module.this.connectingDevice);
                        BleManager.getInstance().getBluetoothGatt(ytbBleFastV3Module.this.connectingDevice).close();
                    }
                });
            }
            BleManager.getInstance().disconnectAllDevice();
            BleManager.getInstance().destroy();
        } catch (Exception e2) {
            BleManager.getInstance().destroy();
            this.mContext.unregisterReceiver(this.BluetoothReciever);
            Log.i(this.TAG, "destroy: " + e2.toString());
        }
        Log.i(this.TAG, "destroy: ");
    }

    @UniJSMethod(uiThread = true)
    public void disconnectPrinter(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        try {
            if (this.connectingDevice != null) {
                BleManager.getInstance().disconnect(this.connectingDevice);
            } else {
                BleManager.getInstance().disconnectAllDevice();
            }
        } catch (Exception unused) {
        }
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, "断开请求已发送");
        jSONObject2.put("version", (Object) this.version);
        uni_status_callback(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void getBleAdapterStatus(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "查询蓝牙适配器状态");
        jSONObject2.put("result", (Object) (BleManager.getInstance().isBlueEnable() ? "开启" : "关闭"));
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void init(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        Log.i(this.TAG, "init: ");
        this.status_changed_callback = uniJSCallback;
        Context context = this.mUniSDKInstance.getContext();
        this.mContext = context;
        this.activity = (Activity) context;
        this.flowLock = new Object();
        register_bluethooth_Broadcast();
        Log.i(this.TAG, "init: " + BleManager.getInstance().getAllConnectedDevice().size());
        Log.i(this.TAG, "初始化 完毕!!");
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put("type", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, "BLE初始化成功");
        jSONObject2.put("version", (Object) this.version);
        uni_status_callback(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void initBle(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        initBle();
    }

    public boolean isConnected(String str) {
        if (!BluetoothAdapter.checkBluetoothAddress(str)) {
            return false;
        }
        BluetoothDevice remoteDevice = BluetoothAdapter.getDefaultAdapter().getRemoteDevice(str);
        try {
            Method declaredMethod = BluetoothDevice.class.getDeclaredMethod("isConnected", null);
            declaredMethod.setAccessible(true);
            return ((Boolean) declaredMethod.invoke(remoteDevice, null)).booleanValue();
        } catch (IllegalAccessException | NoSuchMethodException | InvocationTargetException unused) {
            return false;
        }
    }

    /* JADX INFO: renamed from: lambda$openNotification$0$com-wtx-ytbbleplugin-ytbBleFastV3Module, reason: not valid java name */
    /* synthetic */ void m340x3c7d333b() {
        Log.i(this.TAG, "onNotifySuccess: ff03 订阅成功");
    }

    /* JADX INFO: renamed from: lambda$openNotification$1$com-wtx-ytbbleplugin-ytbBleFastV3Module, reason: not valid java name */
    /* synthetic */ void m341xc91d5e3c(BleException bleException) {
        Log.i(this.TAG, "onNotifyFailure: ff03 订阅失败");
    }

    /* JADX INFO: renamed from: lambda$openNotification$2$com-wtx-ytbbleplugin-ytbBleFastV3Module, reason: not valid java name */
    /* synthetic */ void m342x55bd893d() {
        subscribeToCharacteristic(this.charactristicNotiyFordata, new Consumer() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda7
            @Override // androidx.core.util.Consumer
            public final void accept(Object obj) {
                this.f$0.handleFf03Notification((byte[]) obj);
            }
        }, new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda8
            @Override // java.lang.Runnable
            public final void run() {
                this.f$0.m340x3c7d333b();
            }
        }, new Consumer() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda9
            @Override // androidx.core.util.Consumer
            public final void accept(Object obj) {
                this.f$0.m341xc91d5e3c((BleException) obj);
            }
        });
    }

    /* JADX INFO: renamed from: lambda$openNotification$3$com-wtx-ytbbleplugin-ytbBleFastV3Module, reason: not valid java name */
    /* synthetic */ void m343xe25db43e() {
        Log.i(this.TAG, "onNotifySuccess: 204a 订阅成功");
    }

    /* JADX INFO: renamed from: lambda$openNotification$4$com-wtx-ytbbleplugin-ytbBleFastV3Module, reason: not valid java name */
    /* synthetic */ void m344x6efddf3f(BleException bleException) {
        Log.i(this.TAG, "onNotifyFailure: 204a 订阅失败");
    }

    /* JADX INFO: renamed from: lambda$openNotification$5$com-wtx-ytbbleplugin-ytbBleFastV3Module, reason: not valid java name */
    /* synthetic */ void m345xfb9e0a40() {
        subscribeToCharacteristic(this.charactristicNotiyForR5Data, new Consumer() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda10
            @Override // androidx.core.util.Consumer
            public final void accept(Object obj) {
                this.f$0.handle204aNotification((byte[]) obj);
            }
        }, new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda0
            @Override // java.lang.Runnable
            public final void run() {
                this.f$0.m343xe25db43e();
            }
        }, new Consumer() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module$$ExternalSyntheticLambda1
            @Override // androidx.core.util.Consumer
            public final void accept(Object obj) {
                this.f$0.m344x6efddf3f((BleException) obj);
            }
        });
    }

    @UniJSMethod(uiThread = false)
    public void openNotification(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        String str;
        int i;
        JSONObject jSONObject2 = new JSONObject();
        if (this.charactristicNotiy != null) {
            this.activity.runOnUiThread(new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.10
                @Override // java.lang.Runnable
                public void run() {
                    ytbBleFastV3Module.this.openNotification();
                }
            });
            i = 0;
            str = "订阅请求已发送";
        } else {
            str = "订阅特征为空";
            i = -1;
        }
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) str);
        jSONObject2.put("status", (Object) Integer.valueOf(i));
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void printCmdFromHexstring(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        final BluetoothGattCharacteristic bluetoothGattCharacteristic;
        int intValue = jSONObject.getIntValue("speed");
        String string = jSONObject.getString("hex_cmd");
        jSONObject.getString("model");
        Boolean boolValueOf = Boolean.valueOf(jSONObject.containsKey("is_command") ? jSONObject.getBoolean("is_command").booleanValue() : false);
        int intValue2 = jSONObject.containsKey("package_length") ? jSONObject.getIntValue("package_length") : this.perPackageLength;
        this.needSplitHex = jSONObject.containsKey("needSplitHex") ? jSONObject.getBoolean("needSplitHex").booleanValue() : false;
        JSONObject jSONObject2 = new JSONObject();
        if (this.connectingDevice == null) {
            jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "打印机已断开");
            jSONObject2.put("version", (Object) this.version);
            uniJSCallback.invoke(jSONObject2);
            return;
        }
        Log.i(this.TAG, "printCmdFromHexstring: 开始写入 速到:" + intValue + ";hex length:" + string.length() + "perpkgleng:" + intValue2);
        if (!boolValueOf.booleanValue() || (bluetoothGattCharacteristic = this.charactristicWriteWithNotResponseForCmd) == null) {
            bluetoothGattCharacteristic = this.charactristicWriteWithNotResponse;
        }
        if (this.charactristicNotiyFordata != null) {
            sendDataForV10g(bluetoothGattCharacteristic, string, intValue2, intValue, uniJSCallback);
            return;
        }
        int i = intValue2;
        WTXWriteCallback wTXWriteCallback = new WTXWriteCallback() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.6
            @Override // com.wtx.ytbbleplugin.callback.WTXWriteCallback
            public void onCancalPrintSuccess() {
                Log.i(ytbBleFastV3Module.this.TAG, "onCancalPrintSuccess: ");
                JSONObject jSONObject3 = new JSONObject();
                jSONObject3.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject3.put("type", (Object) "52");
                jSONObject3.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "已取消打印");
                jSONObject3.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject3);
            }

            @Override // com.wtx.ytbbleplugin.callback.WTXWriteCallback
            public void onParamsError(String str) {
                Log.i(ytbBleFastV3Module.this.TAG, "onParamsError: " + str);
                JSONObject jSONObject3 = new JSONObject();
                jSONObject3.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject3.put("type", (Object) "53");
                jSONObject3.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("请求参数错误:" + str));
                jSONObject3.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject3);
            }

            @Override // com.wtx.ytbbleplugin.callback.WTXWriteCallback
            public void onWriteFailure(BleException bleException) {
                Log.i(ytbBleFastV3Module.this.TAG, "onWriteFailure: " + bleException.toString());
                JSONObject jSONObject3 = new JSONObject();
                jSONObject3.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject3.put("type", (Object) "51");
                jSONObject3.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("打印失败:" + bleException.getDescription()));
                jSONObject3.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject3);
            }

            @Override // com.wtx.ytbbleplugin.callback.WTXWriteCallback
            public void onWriteSuccess(int i2, int i3, byte[] bArr) {
                JSONObject jSONObject3 = new JSONObject();
                jSONObject3.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject3.put("type", (Object) StatisticData.ERROR_CODE_IO_ERROR);
                jSONObject3.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "打印包相关的数据");
                BluetoothGattCharacteristic bluetoothGattCharacteristic2 = bluetoothGattCharacteristic;
                jSONObject3.put("特征值", (Object) (bluetoothGattCharacteristic2 != null ? bluetoothGattCharacteristic2.getUuid().toString() : ""));
                jSONObject3.put("totalPackages", (Object) Integer.valueOf(i3));
                jSONObject3.put("currentIndex", (Object) Integer.valueOf(i2));
                jSONObject3.put("writeLenght", (Object) Integer.valueOf(HexUtil.formatHexString(bArr, false).length()));
                ytbBleFastV3Module.this.uni_status_callback(jSONObject3);
            }
        };
        if (this.needSplitHex) {
            new FlowWriteForQ7(this.connectingDevice, bluetoothGattCharacteristic, this.flowLock).flowWrite(string, i, intValue, wTXWriteCallback);
        } else {
            new FlowWrite(this.connectingDevice, bluetoothGattCharacteristic, this.flowLock).flowWrite(string, i, intValue, wTXWriteCallback);
        }
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "开始打印了");
        jSONObject2.put("packageLength", (Object) Integer.valueOf(i));
        jSONObject2.put("characteristic", (Object) (bluetoothGattCharacteristic != null ? bluetoothGattCharacteristic.getUuid().toString() : ""));
        jSONObject2.put("speed", (Object) Integer.valueOf(intValue));
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void queryConnectStatus(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "0: 未连接;1:正在连接中;2:已连接;3: 断开连接中;success_connected链接并订阅成功");
        jSONObject2.put("status", (Object) Integer.valueOf(BleManager.getInstance().getConnectState(this.stateQueryDevce)));
        BleDevice bleDevice = this.stateQueryDevce;
        jSONObject2.put("name", (Object) (bleDevice != null ? bleDevice.getName() : ""));
        BleDevice bleDevice2 = this.stateQueryDevce;
        jSONObject2.put("mac", (Object) (bleDevice2 != null ? bleDevice2.getMac() : ""));
        jSONObject2.put("success_connected", (Object) Boolean.valueOf(BleManager.getInstance().isConnected(this.connectingDevice)));
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void reInitBLe(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        String str;
        String str2;
        try {
            initBle();
            initBleParam();
            str2 = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT;
            str = "重新初始化成功";
        } catch (Exception e2) {
            str = "重新初始化失败:" + e2.toString();
            str2 = "-1";
        }
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) str2);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) str);
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void retConfig(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        BleManager.getInstance().setOperateTimeout(jSONObject.containsKey("operateTimeout") ? jSONObject.getIntValue("operateTimeout") : 7000);
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "setOperateTimeout sucess");
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void searchBlePrinter(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        this.searchMac = jSONObject.containsKey("searchMac") ? jSONObject.getString("searchMac") : "";
        this.searchName = jSONObject.containsKey("searchName") ? jSONObject.getString("searchName") : "";
        setScanRule();
        startScan();
    }

    public void sendDataForV10g(final BluetoothGattCharacteristic bluetoothGattCharacteristic, String str, int i, int i2, UniJSCallback uniJSCallback) {
        new FlowWriteForV10G(this.connectingDevice, bluetoothGattCharacteristic, this.flowLock).flowWrite(str, i, i2, new WTXWriteCallbackV10g() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.7
            @Override // com.wtx.ytbbleplugin.callback.WTXWriteCallbackV10g
            public void onCancalPrintSuccess() {
                Log.i(ytbBleFastV3Module.this.TAG, "onCancalPrintSuccess: ");
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("type", (Object) "52");
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "已取消打印");
                jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            }

            @Override // com.wtx.ytbbleplugin.callback.WTXWriteCallbackV10g
            public void onParamsError(String str2) {
                Log.i(ytbBleFastV3Module.this.TAG, "onParamsError: " + str2);
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("type", (Object) "53");
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("请求参数错误:" + str2));
                jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            }

            @Override // com.wtx.ytbbleplugin.callback.WTXWriteCallbackV10g
            public void onWriteFailure(BleException bleException) {
                Log.i(ytbBleFastV3Module.this.TAG, "onWriteFailure: " + bleException.toString());
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("type", (Object) "51");
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) ("打印失败:" + bleException.getDescription()));
                jSONObject.put("version", (Object) ytbBleFastV3Module.this.version);
                ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            }

            @Override // com.wtx.ytbbleplugin.callback.WTXWriteCallbackV10g
            public void onWriteSuccess(int i3, int i4, byte[] bArr, int i5) {
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject.put("type", (Object) StatisticData.ERROR_CODE_IO_ERROR);
                jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "打印包相关的数据");
                BluetoothGattCharacteristic bluetoothGattCharacteristic2 = bluetoothGattCharacteristic;
                jSONObject.put("特征值", (Object) (bluetoothGattCharacteristic2 != null ? bluetoothGattCharacteristic2.getUuid().toString() : ""));
                jSONObject.put("totalPackages", (Object) Integer.valueOf(i4));
                jSONObject.put("currentIndex", (Object) Integer.valueOf(i3));
                jSONObject.put("writeLenght", (Object) Integer.valueOf(bArr.length));
                jSONObject.put("currentCredit", (Object) Integer.valueOf(i5));
                ytbBleFastV3Module.this.uni_status_callback(jSONObject);
            }
        });
        JSONObject jSONObject = new JSONObject();
        jSONObject.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "开始打印了");
        jSONObject.put("packageLength", (Object) Integer.valueOf(i));
        jSONObject.put("characteristic", (Object) (bluetoothGattCharacteristic != null ? bluetoothGattCharacteristic.getUuid().toString() : ""));
        jSONObject.put("speed", (Object) Integer.valueOf(i2));
        jSONObject.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject);
    }

    @UniJSMethod(uiThread = false)
    public void setMtu(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        final int intValue = jSONObject.containsKey("mtu") ? jSONObject.getIntValue("mtu") : PglCryptUtils.COMPRESS_FAILED;
        this.activity.runOnUiThread(new Runnable() { // from class: com.wtx.ytbbleplugin.ytbBleFastV3Module.5
            @Override // java.lang.Runnable
            public void run() {
                ytbBleFastV3Module.this.setMtu(intValue);
            }
        });
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, "修改MTU请求已发送");
        jSONObject2.put("version", (Object) this.version);
        uni_status_callback(jSONObject2);
    }

    @UniJSMethod(uiThread = false)
    public void stopSearchPrinter(JSONObject jSONObject, UniJSCallback uniJSCallback) {
        try {
            BleManager.getInstance().cancelScan();
        } catch (Exception e2) {
            Log.i(this.TAG, "stopSearchPrinter: " + e2);
        }
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "停止扫描请求已发送");
        jSONObject2.put("version", (Object) this.version);
        uniJSCallback.invoke(jSONObject2);
    }
}
