package com.xyz.yintibao.library;

import android.util.Log;
import com.xyz.yintibao.tools.ConvertUtils;

/* JADX INFO: loaded from: classes2.dex */
public class V5gCMD {
    private static String TAG = "V5gCMD";
    private static byte[] paper = {81, 120, -95, 0, 2, 0, 48, 0, -7, -1};
    private static byte[] paper_300dpi = {81, 120, -95, 0, 2, 0, 72, 0, -13, -1};

    public static String flowControl() {
        byte[] bArr = {81, 120, -82, 0, 1, 0, 0, 0, 0};
        bArr[7] = ConvertUtils.calcCrc8(bArr, 6, 1);
        bArr[8] = -1;
        String strBinaryToHexString = ConvertUtils.BinaryToHexString(bArr);
        Log.i(TAG, "flowControl: " + strBinaryToHexString);
        return strBinaryToHexString;
    }

    public static String getCrc8CMD(byte[] bArr, int i, int i2) {
        int length = bArr.length;
        bArr[length - 2] = ConvertUtils.calcCrc8(bArr, i, i2);
        bArr[length - 1] = -1;
        String strBinaryToHexString = ConvertUtils.BinaryToHexString(bArr);
        Log.i(TAG, "getCrc8CMD: " + strBinaryToHexString);
        return strBinaryToHexString;
    }

    public static String getFeedPage(int i, byte[] bArr) {
        Boolean bool = true;
        if (bArr == null || bArr.length != 10) {
            bool = false;
            bArr = i == 300 ? paper_300dpi : paper;
        }
        if (bool.booleanValue()) {
            bArr[8] = ConvertUtils.calcCrc8(bArr, 6, 2);
            bArr[9] = -1;
        }
        String strBinaryToHexString = ConvertUtils.BinaryToHexString(bArr);
        Log.i(TAG, "getFeedPage: " + strBinaryToHexString);
        return strBinaryToHexString;
    }
}
