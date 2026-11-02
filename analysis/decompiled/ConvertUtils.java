package com.xyz.yintibao.tools;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import com.google.common.base.Ascii;
import com.google.common.primitives.SignedBytes;
import com.taobao.weex.performance.WXInstanceApm;
import java.io.File;
import java.io.FileOutputStream;
import kotlin.io.encoding.Base64;
import org.opencv.android.Utils;
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.imgproc.Imgproc;

/* JADX INFO: loaded from: classes2.dex */
public class ConvertUtils {
    private static final byte[] CHECKSUM_TABLE = {0, 7, Ascii.SO, 9, Ascii.FS, Ascii.ESC, Ascii.DC2, Ascii.NAK, 56, 63, 54, 49, 36, 35, 42, 45, 112, 119, 126, 121, 108, 107, 98, 101, 72, 79, 70, 65, 84, 83, 90, 93, -32, -25, -18, -23, -4, -5, -14, -11, -40, -33, -42, -47, -60, -61, -54, -51, -112, -105, -98, -103, -116, -117, -126, -123, -88, -81, -90, -95, -76, -77, -70, -67, -57, -64, -55, -50, -37, -36, -43, -46, -1, -8, -15, -10, -29, -28, -19, -22, -73, -80, -71, -66, -85, -84, -91, -94, -113, -120, -127, -122, -109, -108, -99, -102, 39, 32, 41, 46, 59, 60, 53, 50, Ascii.US, Ascii.CAN, 17, Ascii.SYN, 3, 4, Ascii.CR, 10, 87, 80, 89, 94, 75, 76, 69, 66, 111, 104, 97, 102, 115, 116, 125, 122, -119, -114, -121, -128, -107, -110, -101, -100, -79, -74, -65, -72, -83, -86, -93, -92, -7, -2, -9, -16, -27, -30, -21, -20, -63, -58, -49, -56, -35, -38, -45, -44, 105, 110, 103, 96, 117, 114, 123, 124, 81, 86, 95, 88, 77, 74, 67, 68, Ascii.EM, Ascii.RS, Ascii.ETB, Ascii.DLE, 5, 2, Ascii.VT, Ascii.FF, 33, 38, 47, 40, Base64.padSymbol, 58, 51, 52, 78, 73, SignedBytes.MAX_POWER_OF_TWO, 71, 82, 85, 92, 91, 118, 113, 120, 127, 106, 109, 100, 99, 62, 57, 48, 55, 34, 37, 44, 43, 6, 1, 8, Ascii.SI, Ascii.SUB, Ascii.GS, Ascii.DC4, 19, -82, -87, -96, -89, -78, -75, -68, -69, -106, -111, -104, -97, -118, -115, -124, -125, -34, -39, -48, -41, -62, -59, -52, -53, -26, -31, -24, -17, -6, -3, -12, -13};

    private ConvertUtils() {
        throw new UnsupportedOperationException("u can't instantiate me...");
    }

    public static String BinaryToHexString(byte[] bArr) {
        StringBuilder sb = new StringBuilder();
        for (byte b2 : bArr) {
            sb.append(String.valueOf("0123456789ABCDEF".charAt((b2 & 240) >> 4)));
            sb.append(String.valueOf("0123456789ABCDEF".charAt(b2 & Ascii.SI)));
        }
        return sb.toString();
    }

    public static int RGB2Gray(int i, int i2, int i3) {
        return (int) ((((double) i) * 0.299d) + (((double) i2) * 0.587d) + (((double) i3) * 0.114d));
    }

    public static Bitmap adjustBrightnessContrast(Bitmap bitmap, double d2, double d3, int i) {
        if (bitmap == null || bitmap.isRecycled()) {
            return null;
        }
        Mat mat = new Mat();
        Mat mat2 = new Mat();
        Utils.bitmapToMat(bitmap, mat);
        if (mat.channels() > 1) {
            Imgproc.cvtColor(mat, mat, 10);
        }
        mat.convertTo(mat2, -1, d2, d3);
        if (i == -1 || i == 0 || i == 1) {
            Core.flip(mat2, mat2, i);
        }
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(mat2.cols(), mat2.rows(), bitmap.getConfig());
        Utils.matToBitmap(mat2, bitmapCreateBitmap);
        mat.release();
        mat2.release();
        return bitmapCreateBitmap;
    }

    public static String byteToHex(byte b2) {
        String hexString = Integer.toHexString(b2 & 255);
        return hexString.length() < 2 ? WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString : hexString;
    }

    public static byte calcCrc8(byte[] bArr) {
        return calcCrc8(bArr, 0, bArr.length, (byte) 0);
    }

    public static byte calcCrc8(byte[] bArr, int i, int i2) {
        return calcCrc8(bArr, i, i2, (byte) 0);
    }

    public static byte calcCrc8(byte[] bArr, int i, int i2, byte b2) {
        for (int i3 = i; i3 < i + i2; i3++) {
            b2 = CHECKSUM_TABLE[(b2 ^ bArr[i3]) & 255];
        }
        return b2;
    }

    public static String getDevType(int i) {
        return i + "";
    }

    public static String getFileSuffix(String str) {
        String name;
        int iLastIndexOf;
        return (str == null || str.trim().isEmpty() || (iLastIndexOf = (name = new File(str).getName()).lastIndexOf(46)) <= 0 || iLastIndexOf >= name.length() + (-1)) ? "" : name.substring(iLastIndexOf + 1).toLowerCase();
    }

    private static int hex2Int(char c2) {
        if (c2 >= '0' && c2 <= '9') {
            return c2 - '0';
        }
        if (c2 < 'A' || c2 > 'F') {
            throw new IllegalArgumentException();
        }
        return c2 - '7';
    }

    public static byte[] hexString2Bytes(String str) {
        if (isSpace(str)) {
            return null;
        }
        int length = str.length();
        if (length % 2 != 0) {
            str = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + str;
            length++;
        }
        char[] charArray = str.toUpperCase().toCharArray();
        byte[] bArr = new byte[length >> 1];
        for (int i = 0; i < length; i += 2) {
            bArr[i >> 1] = (byte) ((hex2Int(charArray[i]) << 4) | hex2Int(charArray[i + 1]));
        }
        return bArr;
    }

    public static byte hexToByte(String str) {
        return (byte) Integer.parseInt(str, 16);
    }

    public static byte[] hexToByteArray(String str) {
        byte[] bArr;
        int length = str.length();
        if (length % 2 == 1) {
            length++;
            bArr = new byte[length / 2];
            str = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + str;
        } else {
            bArr = new byte[length / 2];
        }
        int i = 0;
        int i2 = 0;
        while (i < length) {
            int i3 = i + 2;
            bArr[i2] = hexToByte(str.substring(i, i3));
            i2++;
            i = i3;
        }
        return bArr;
    }

    public static byte[] int2byte(int i) {
        return new byte[]{(byte) (i & 255), (byte) ((i >> 8) & 255), (byte) ((i >> 16) & 255), (byte) (i >>> 24)};
    }

    private static boolean isSpace(String str) {
        if (str == null) {
            return true;
        }
        int length = str.length();
        for (int i = 0; i < length; i++) {
            if (!Character.isWhitespace(str.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    public static Bitmap pathToBitmap(String str) {
        File file = new File(str);
        if (!file.exists()) {
            return null;
        }
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;
            return BitmapFactory.decodeFile(file.getAbsolutePath(), options);
        } catch (Exception unused) {
            return null;
        }
    }

    public static boolean saveBitmap(Bitmap bitmap, String str) {
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(new File(str));
            try {
                if (str.toLowerCase().endsWith(".png")) {
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, fileOutputStream);
                } else {
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 95, fileOutputStream);
                }
                fileOutputStream.close();
                return true;
            } finally {
            }
        } catch (Exception e2) {
            Log.i("YINTIBAO", "saveBitmap: " + e2.getMessage());
            return false;
        }
    }
}
