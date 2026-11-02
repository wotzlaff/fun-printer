package com.xyz.yintibao;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.util.Base64;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.asm.Opcodes;
import com.facebook.imagepipeline.memory.BitmapCounterConfig;
import com.google.common.base.Ascii;
import com.taobao.weex.WXSDKEngine;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.Constants;
import com.taobao.weex.el.parse.Operators;
import com.taobao.weex.performance.WXInstanceApm;
import com.taobao.weex.ui.module.WXModalUIModule;
import com.wtx.minilzohelper.MinilzoTool;
import com.xyz.yintibao.library.HexInfo;
import com.xyz.yintibao.library.ProcessPictures;
import com.xyz.yintibao.library.V5g;
import com.xyz.yintibao.library.V5gCMD;
import com.xyz.yintibao.tools.ConvertUtils;
import com.xyz.yintibao.tools.OperationEnum;
import com.ytb.zlibhelper.ZlibTool;
import io.dcloud.common.constant.AbsoluteConst;
import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintStream;
import java.lang.reflect.Array;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.zip.Deflater;
import org.mozilla.universalchardet.prober.HebrewProber;
import org.opencv.android.OpenCVLoader;
import org.opencv.android.Utils;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDouble;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import tv.danmaku.ijk.media.player.IjkMediaMeta;

/* JADX INFO: loaded from: classes2.dex */
public class OpencvUtilsWXModule extends WXSDKEngine.DestroyableModule implements OperationEnum {
    public static String TAG = "YINTIBAO";
    private JSCallback jsCallback;
    private String version = "2026092001";
    private boolean isInitDebug = true;
    private boolean opencvInit = false;
    private String hexSplitSymbol = "#@";

    private int RGB2Gray(int i, int i2, int i3) {
        return (int) ((((double) i) * 0.299d) + (((double) i2) * 0.587d) + (((double) i3) * 0.114d));
    }

    private Bitmap addTopRightBorder(Bitmap bitmap, int i, int i2) {
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight() + i, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmapCreateBitmap);
        canvas.drawColor(-1);
        canvas.drawBitmap(bitmap, i2 * (-1), i, (Paint) null);
        return bitmapCreateBitmap;
    }

    public static Bitmap base64ToBitmap(String str) {
        byte[] bArrDecode = Base64.decode(str, 0);
        return BitmapFactory.decodeByteArray(bArrDecode, 0, bArrDecode.length);
    }

    /* JADX WARN: Not initialized variable reg: 1, insn: 0x0038: MOVE (r0 I:??[OBJECT, ARRAY]) = (r1 I:??[OBJECT, ARRAY]), block:B:20:0x0038 */
    public static String bitmapToBase64(Bitmap bitmap) throws Throwable {
        ByteArrayOutputStream byteArrayOutputStream;
        ByteArrayOutputStream byteArrayOutputStream2;
        String strEncodeToString;
        ByteArrayOutputStream byteArrayOutputStream3 = null;
        try {
            if (bitmap != null) {
                try {
                    byteArrayOutputStream2 = new ByteArrayOutputStream();
                    try {
                        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream2);
                        byteArrayOutputStream2.flush();
                        byteArrayOutputStream2.close();
                        strEncodeToString = Base64.encodeToString(byteArrayOutputStream2.toByteArray(), 0);
                        byteArrayOutputStream3 = byteArrayOutputStream2;
                    } catch (IOException e2) {
                        e = e2;
                        e.printStackTrace();
                        if (byteArrayOutputStream2 == null) {
                            return null;
                        }
                        try {
                            byteArrayOutputStream2.flush();
                            byteArrayOutputStream2.close();
                            return null;
                        } catch (IOException e3) {
                            e3.printStackTrace();
                            return null;
                        }
                    }
                } catch (IOException e4) {
                    e = e4;
                    byteArrayOutputStream2 = null;
                } catch (Throwable th) {
                    th = th;
                    if (byteArrayOutputStream3 != null) {
                        try {
                            byteArrayOutputStream3.flush();
                            byteArrayOutputStream3.close();
                        } catch (IOException e5) {
                            e5.printStackTrace();
                        }
                    }
                    throw th;
                }
            } else {
                strEncodeToString = null;
            }
            if (byteArrayOutputStream3 != null) {
                try {
                    byteArrayOutputStream3.flush();
                    byteArrayOutputStream3.close();
                } catch (IOException e6) {
                    e6.printStackTrace();
                }
            }
            return strEncodeToString;
        } catch (Throwable th2) {
            th = th2;
            byteArrayOutputStream3 = byteArrayOutputStream;
        }
    }

    private String byteToHex(byte b2) {
        String hexString = Integer.toHexString(b2 & 255);
        return hexString.length() < 2 ? WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString : hexString;
    }

    private String bytesToHexString(byte[] bArr) {
        StringBuilder sb = new StringBuilder();
        if (bArr == null || bArr.length <= 0) {
            return "";
        }
        for (byte b2 : bArr) {
            String upperCase = Integer.toHexString(b2 & 255).toUpperCase();
            if (upperCase.length() < 2) {
                sb.append(0);
            }
            sb.append(upperCase);
        }
        return sb.toString();
    }

    private byte[] compressDataZlib(byte[] bArr, int i) {
        Deflater deflater = new Deflater();
        deflater.setLevel(i);
        deflater.setDictionary(new byte[]{(byte) 524288});
        deflater.setInput(bArr);
        deflater.finish();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(bArr.length);
        byte[] bArr2 = new byte[1024];
        while (!deflater.finished()) {
            byteArrayOutputStream.write(bArr2, 0, deflater.deflate(bArr2));
        }
        deflater.end();
        return byteArrayOutputStream.toByteArray();
    }

    private void convertToJpg(String str, String str2) {
        Bitmap bitmapDecodeFile = BitmapFactory.decodeFile(str);
        Bitmap bitmapCopy = bitmapDecodeFile.copy(Bitmap.Config.ARGB_8888, true);
        new Canvas(bitmapCopy).drawBitmap(bitmapDecodeFile, 0.0f, 0.0f, (Paint) null);
        try {
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(str2));
            if (bitmapCopy.compress(Bitmap.CompressFormat.JPEG, 100, bufferedOutputStream)) {
                bufferedOutputStream.flush();
            }
            bufferedOutputStream.close();
        } catch (IOException e2) {
            e2.printStackTrace();
        } finally {
            bitmapDecodeFile.recycle();
        }
    }

    private Bitmap cropImageOutMaxHeight(Bitmap bitmap, int i) {
        if (bitmap == null) {
            return null;
        }
        int width = bitmap.getWidth();
        if (bitmap.getHeight() <= i) {
            return bitmap;
        }
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(bitmap, 0, 0, width, i);
        if (!bitmap.equals(bitmapCreateBitmap) && !bitmap.isRecycled()) {
            bitmap.recycle();
        }
        return bitmapCreateBitmap;
    }

    private void debug(String str, String str2) {
        if (this.jsCallback != null) {
            Log.i(TAG, str + ":" + str2);
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("debug", (Object) (str + ":" + str2));
            this.jsCallback.invokeAndKeepAlive(jSONObject);
        }
    }

    private Bitmap fixedThreshBinary(Bitmap bitmap, int i, float f) {
        Mat mat = new Mat(bitmap.getHeight(), bitmap.getWidth(), CvType.CV_8UC3);
        Utils.bitmapToMat(bitmap, mat);
        Mat mat2 = new Mat();
        Imgproc.cvtColor(mat, mat2, 10);
        Mat matBlurWithGuas = ProcessPictures.blurWithGuas(mat2);
        if (f == -1.0f) {
            f = ProcessPictures.getChecksumsForGamma(matBlurWithGuas);
        }
        Log.i(TAG, "fixedThreshBinary: f:" + f);
        Mat matEqualizeHistogram = ProcessPictures.equalizeHistogram(ProcessPictures.enhancedImage(ProcessPictures.gammaTransformation(matBlurWithGuas, f), ProcessPictures.getEnhancedParam(r14)), 2.0d);
        Mat mat3 = new Mat();
        Imgproc.threshold(matEqualizeHistogram, mat3, i, 255.0d, 0);
        Bitmap bitmapCreateBitmap = mat.channels() == 3 ? Bitmap.createBitmap(mat.cols(), mat.rows(), Bitmap.Config.RGB_565) : Bitmap.createBitmap(mat.cols(), mat.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(matEqualizeHistogram, bitmapCreateBitmap);
        Log.i(TAG, "fixedThreshBinary: 111");
        mat.release();
        matBlurWithGuas.release();
        matEqualizeHistogram.release();
        mat3.release();
        bitmap.recycle();
        return bitmapCreateBitmap;
    }

    private Bitmap fixedThreshBinary1(Bitmap bitmap, int i) {
        if (!this.isInitDebug) {
            return null;
        }
        Mat mat = new Mat();
        Imgproc.cvtColor(bitmapToMat(bitmap), mat, 6);
        Mat mat2 = new Mat();
        Imgproc.threshold(mat, mat2, i, 255.0d, 0);
        Bitmap bitmapCreateBitmap = mat2.channels() == 3 ? Bitmap.createBitmap(mat2.cols(), mat2.rows(), Bitmap.Config.RGB_565) : Bitmap.createBitmap(mat2.cols(), mat2.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(mat2, bitmapCreateBitmap);
        Log.i(TAG, "fixedThreshBinary: 111");
        mat.release();
        mat2.release();
        bitmap.recycle();
        return bitmapCreateBitmap;
    }

    private String getFileHeader(String str) {
        String strBytesToHexString = null;
        try {
            FileInputStream fileInputStream = new FileInputStream(str);
            byte[] bArr = new byte[4];
            fileInputStream.read(bArr, 0, 4);
            strBytesToHexString = bytesToHexString(bArr);
            fileInputStream.close();
            return strBytesToHexString;
        } catch (IOException e2) {
            e2.printStackTrace();
            return strBytesToHexString;
        }
    }

    private Bitmap handlerForBQ02LabelPrint(Bitmap bitmap, int i, int i2, int i3) {
        if (bitmap == null) {
            return null;
        }
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int i4 = ((height * i) / width) + i2;
        Rect rect = new Rect(0, 0, width, height);
        int i5 = 384 - i3;
        Rect rect2 = new Rect(i5 - i, i2, i5, i4);
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, i4, Bitmap.Config.ARGB_8888);
        bitmapCreateBitmap.eraseColor(-1);
        new Canvas(bitmapCreateBitmap).drawBitmap(bitmap, rect, rect2, (Paint) null);
        return bitmapCreateBitmap;
    }

    private String imageToHex(String str) {
        StringBuilder sb = new StringBuilder();
        try {
            File file = new File(str);
            FileInputStream fileInputStream = new FileInputStream(file);
            int length = (int) file.length();
            byte[] bArr = new byte[length];
            fileInputStream.read(bArr);
            fileInputStream.close();
            for (int i = 0; i < length; i++) {
                String hexString = Integer.toHexString(bArr[i] & 255);
                if (hexString.length() == 1) {
                    sb.append(WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                }
                sb.append(hexString);
            }
        } catch (FileNotFoundException e2) {
            e2.printStackTrace();
        } catch (IOException e3) {
            e3.printStackTrace();
        }
        return sb.toString();
    }

    private byte px2Byte(int i, int i2, int i3, int[] iArr) {
        if (i < i2) {
            int i4 = iArr[i3];
            if (RGB2Gray((16711680 & i4) >> 16, (65280 & i4) >> 8, i4 & 255) < 128) {
                return (byte) 1;
            }
        }
        return (byte) 0;
    }

    private byte px2Byte(int i, int i2, Bitmap bitmap) {
        if (i < bitmap.getWidth() && i2 < bitmap.getHeight()) {
            int pixel = bitmap.getPixel(i, i2);
            if (RGB2Gray((16711680 & pixel) >> 16, (65280 & pixel) >> 8, pixel & 255) < 128) {
                return (byte) 1;
            }
        }
        return (byte) 0;
    }

    private byte px2Byte(int i, int i2, int[] iArr) {
        if (i < i2) {
            int i3 = iArr[i];
            if (RGB2Gray((16711680 & i3) >> 16, (65280 & i3) >> 8, i3 & 255) < 128) {
                return (byte) 1;
            }
        }
        return (byte) 0;
    }

    private String save_hex(String str) {
        String str2 = this.mWXSDKInstance.getContext().getExternalCacheDir().toString() + "/bin";
        String str3 = System.currentTimeMillis() + ".bin";
        try {
            File file = new File(str2);
            if (!file.exists()) {
                file.mkdirs();
            }
            File file2 = new File(str2, str3);
            if (!file2.exists()) {
                file2.createNewFile();
            }
            FileWriter fileWriter = new FileWriter(file2);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write(str);
            bufferedWriter.close();
            fileWriter.close();
        } catch (IOException e2) {
            e2.printStackTrace();
        }
        return str2 + Operators.DIV + str3;
    }

    private Bitmap scaleAndaddSpaceForBQ95(Bitmap bitmap, int i, int i2, int i3) {
        int i4;
        if (i <= i2) {
            if (i >= i3) {
            }
            i4 = i2;
            int i5 = (i3 - i) / 2;
            int i6 = (i4 - i2) / 2;
            Rect rect = new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
            Rect rect2 = new Rect(i5, i6, i + i5, i2 + i6);
            Bitmap bitmapCreateBitmap = Bitmap.createBitmap(i3, i4, Bitmap.Config.RGB_565);
            bitmapCreateBitmap.eraseColor(-1);
            new Canvas(bitmapCreateBitmap).drawBitmap(bitmap, rect, rect2, (Paint) null);
            return bitmapCreateBitmap;
        }
        if (i2 < i3) {
            i4 = i3;
            i3 = i;
            int i52 = (i3 - i) / 2;
            int i62 = (i4 - i2) / 2;
            Rect rect3 = new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
            Rect rect22 = new Rect(i52, i62, i + i52, i2 + i62);
            Bitmap bitmapCreateBitmap2 = Bitmap.createBitmap(i3, i4, Bitmap.Config.RGB_565);
            bitmapCreateBitmap2.eraseColor(-1);
            new Canvas(bitmapCreateBitmap2).drawBitmap(bitmap, rect3, rect22, (Paint) null);
            return bitmapCreateBitmap2;
        }
        i3 = i;
        i4 = i2;
        int i522 = (i3 - i) / 2;
        int i622 = (i4 - i2) / 2;
        Rect rect32 = new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
        Rect rect222 = new Rect(i522, i622, i + i522, i2 + i622);
        Bitmap bitmapCreateBitmap22 = Bitmap.createBitmap(i3, i4, Bitmap.Config.RGB_565);
        bitmapCreateBitmap22.eraseColor(-1);
        new Canvas(bitmapCreateBitmap22).drawBitmap(bitmap, rect32, rect222, (Paint) null);
        return bitmapCreateBitmap22;
    }

    private String scaleImageForGrayPrint(Bitmap bitmap, String str, int i, int i2, int i3) {
        int i4;
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int i5 = 1280;
        if (width > height) {
            i4 = (height * 1280) / width;
        } else {
            int i6 = (width * 1280) / height;
            i4 = 1280;
            i5 = i6;
        }
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Bitmap bitmapScaleAndaddSpaceForBQ95 = scaleAndaddSpaceForBQ95(bitmap, i5, i4, i2);
        do {
            byteArrayOutputStream.reset();
            bitmapScaleAndaddSpaceForBQ95.compress(Bitmap.CompressFormat.JPEG, i, byteArrayOutputStream);
            i -= 5;
            if (byteArrayOutputStream.toByteArray().length <= i3) {
                break;
            }
        } while (i >= 10);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        Bitmap bitmapDecodeByteArray = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.length);
        bitmapScaleAndaddSpaceForBQ95.recycle();
        return save_image(bitmapDecodeByteArray);
    }

    public Bitmap SierraDithering(Mat mat) {
        int iCols = mat.cols();
        int iRows = mat.rows();
        if (!this.isInitDebug) {
            Bitmap bitmapCreateBitmap = Bitmap.createBitmap(iCols, iRows, Bitmap.Config.RGB_565);
            Utils.matToBitmap(mat, bitmapCreateBitmap);
            return bitmapCreateBitmap;
        }
        mat.convertTo(mat, 4);
        Log.i(TAG, "SierraDithering paramMat channels " + mat.channels() + "type:" + mat.type());
        Log.i(TAG, "j=" + iRows + ", i=" + iCols);
        int[] iArr = new int[iRows * iCols];
        mat.get(0, 0, iArr);
        mat.release();
        for (int i = 0; i < iRows; i++) {
            for (int i2 = 0; i2 < iCols; i2++) {
                int i3 = (iCols * i) + i2;
                int i4 = iArr[i3];
                if (i4 > 127) {
                    i4 -= 255;
                    iArr[i3] = -1;
                } else {
                    iArr[i3] = -16777216;
                }
                if (i2 > 1) {
                    if (i2 < iCols - 2) {
                        if (i < iRows - 2) {
                            int i5 = i3 + 1;
                            int i6 = (i4 * 5) / 32;
                            iArr[i5] = iArr[i5] + i6;
                            int i7 = i3 + 2;
                            int i8 = (i4 * 3) / 32;
                            iArr[i7] = iArr[i7] + i8;
                            int i9 = ((i + 1) * iCols) + i2;
                            iArr[i9] = iArr[i9] + i6;
                            int i10 = i9 + 1;
                            int i11 = (i4 * 4) / 32;
                            iArr[i10] = iArr[i10] + i11;
                            int i12 = i9 + 2;
                            int i13 = (i4 * 2) / 32;
                            iArr[i12] = iArr[i12] + i13;
                            int i14 = i9 - 1;
                            iArr[i14] = iArr[i14] + i11;
                            int i15 = i9 - 2;
                            iArr[i15] = iArr[i15] + i13;
                            int i16 = ((i + 2) * iCols) + i2;
                            iArr[i16] = iArr[i16] + i8;
                            int i17 = i16 + 1;
                            iArr[i17] = iArr[i17] + i13;
                            int i18 = i16 - 1;
                            iArr[i18] = iArr[i18] + i13;
                        } else if (i < iRows - 1) {
                            int i19 = i3 + 1;
                            int i20 = (i4 * 5) / 32;
                            iArr[i19] = iArr[i19] + i20;
                            int i21 = i3 + 2;
                            iArr[i21] = iArr[i21] + ((i4 * 3) / 32);
                            int i22 = ((i + 1) * iCols) + i2;
                            iArr[i22] = iArr[i22] + i20;
                            int i23 = i22 + 1;
                            int i24 = (i4 * 4) / 32;
                            iArr[i23] = iArr[i23] + i24;
                            int i25 = i22 + 2;
                            int i26 = (i4 * 2) / 32;
                            iArr[i25] = iArr[i25] + i26;
                            int i27 = i22 - 1;
                            iArr[i27] = iArr[i27] + i24;
                            int i28 = i22 - 2;
                            iArr[i28] = iArr[i28] + i26;
                        } else {
                            int i29 = i3 + 1;
                            iArr[i29] = iArr[i29] + ((i4 * 5) / 32);
                            int i30 = i3 + 2;
                            iArr[i30] = iArr[i30] + ((i4 * 3) / 32);
                        }
                    } else if (i2 < iCols - 1) {
                        if (i < iRows - 2) {
                            int i31 = i3 + 1;
                            int i32 = (i4 * 5) / 32;
                            iArr[i31] = iArr[i31] + i32;
                            int i33 = ((i + 1) * iCols) + i2;
                            iArr[i33] = iArr[i33] + i32;
                            int i34 = i33 + 1;
                            int i35 = (i4 * 4) / 32;
                            iArr[i34] = iArr[i34] + i35;
                            int i36 = i33 - 1;
                            iArr[i36] = iArr[i36] + i35;
                            int i37 = i33 - 2;
                            int i38 = (i4 * 2) / 32;
                            iArr[i37] = iArr[i37] + i38;
                            int i39 = ((i + 2) * iCols) + i2;
                            iArr[i39] = iArr[i39] + ((i4 * 3) / 32);
                            int i40 = i39 + 1;
                            iArr[i40] = iArr[i40] + i38;
                            int i41 = i39 - 1;
                            iArr[i41] = iArr[i41] + i38;
                        } else if (i < iRows - 1) {
                            int i42 = i3 + 1;
                            int i43 = (i4 * 5) / 32;
                            iArr[i42] = iArr[i42] + i43;
                            int i44 = ((i + 1) * iCols) + i2;
                            iArr[i44] = iArr[i44] + i43;
                            int i45 = i44 + 1;
                            int i46 = (i4 * 4) / 32;
                            iArr[i45] = iArr[i45] + i46;
                            int i47 = i44 - 1;
                            iArr[i47] = iArr[i47] + i46;
                            int i48 = i44 - 2;
                            iArr[i48] = iArr[i48] + ((i4 * 2) / 32);
                        } else {
                            int i49 = i3 + 1;
                            iArr[i49] = iArr[i49] + ((i4 * 5) / 32);
                        }
                    } else if (i < iRows - 2) {
                        int i50 = ((i + 1) * iCols) + i2;
                        iArr[i50] = iArr[i50] + ((i4 * 5) / 32);
                        int i51 = i50 - 1;
                        iArr[i51] = iArr[i51] + ((i4 * 4) / 32);
                        int i52 = i50 - 2;
                        int i53 = (i4 * 2) / 32;
                        iArr[i52] = iArr[i52] + i53;
                        int i54 = ((i + 2) * iCols) + i2;
                        iArr[i54] = iArr[i54] + ((i4 * 3) / 32);
                        int i55 = i54 - 1;
                        iArr[i55] = iArr[i55] + i53;
                    } else if (i < iRows - 1) {
                        int i56 = ((i + 1) * iCols) + i2;
                        iArr[i56] = iArr[i56] + ((i4 * 5) / 32);
                        int i57 = i56 - 1;
                        iArr[i57] = iArr[i57] + ((i4 * 4) / 32);
                        int i58 = i56 - 2;
                        iArr[i58] = iArr[i58] + ((i4 * 2) / 32);
                    }
                } else if (i2 > 0) {
                    if (i < iRows - 2) {
                        int i59 = i3 + 1;
                        int i60 = (i4 * 5) / 32;
                        iArr[i59] = iArr[i59] + i60;
                        int i61 = i3 + 2;
                        int i62 = (i4 * 3) / 32;
                        iArr[i61] = iArr[i61] + i62;
                        int i63 = ((i + 1) * iCols) + i2;
                        iArr[i63] = iArr[i63] + i60;
                        int i64 = i63 + 1;
                        int i65 = (i4 * 4) / 32;
                        iArr[i64] = iArr[i64] + i65;
                        int i66 = i63 + 2;
                        int i67 = (i4 * 2) / 32;
                        iArr[i66] = iArr[i66] + i67;
                        int i68 = i63 - 1;
                        iArr[i68] = iArr[i68] + i65;
                        int i69 = ((i + 2) * iCols) + i2;
                        iArr[i69] = iArr[i69] + i62;
                        int i70 = i69 + 1;
                        iArr[i70] = iArr[i70] + i67;
                        int i71 = i69 - 1;
                        iArr[i71] = iArr[i71] + i67;
                    } else if (i < iRows - 1) {
                        int i72 = i3 + 1;
                        int i73 = (i4 * 5) / 32;
                        iArr[i72] = iArr[i72] + i73;
                        int i74 = i3 + 2;
                        iArr[i74] = iArr[i74] + ((i4 * 3) / 32);
                        int i75 = ((i + 1) * iCols) + i2;
                        iArr[i75] = iArr[i75] + i73;
                        int i76 = i75 + 1;
                        int i77 = (i4 * 4) / 32;
                        iArr[i76] = iArr[i76] + i77;
                        int i78 = i75 + 2;
                        iArr[i78] = iArr[i78] + ((i4 * 2) / 32);
                        int i79 = i75 - 1;
                        iArr[i79] = iArr[i79] + i77;
                    } else {
                        int i80 = i3 + 1;
                        iArr[i80] = iArr[i80] + ((i4 * 5) / 32);
                        int i81 = i3 + 2;
                        iArr[i81] = iArr[i81] + ((i4 * 3) / 32);
                    }
                } else if (i < iRows - 2) {
                    int i82 = i3 + 1;
                    int i83 = (i4 * 5) / 32;
                    iArr[i82] = iArr[i82] + i83;
                    int i84 = i3 + 2;
                    int i85 = (i4 * 3) / 32;
                    iArr[i84] = iArr[i84] + i85;
                    int i86 = ((i + 1) * iCols) + i2;
                    iArr[i86] = iArr[i86] + i83;
                    int i87 = i86 + 1;
                    iArr[i87] = iArr[i87] + ((i4 * 4) / 32);
                    int i88 = i86 + 2;
                    int i89 = (i4 * 2) / 32;
                    iArr[i88] = iArr[i88] + i89;
                    int i90 = ((i + 2) * iCols) + i2;
                    iArr[i90] = iArr[i90] + i85;
                    int i91 = i90 + 1;
                    iArr[i91] = iArr[i91] + i89;
                } else if (i < iRows - 1) {
                    int i92 = i3 + 1;
                    int i93 = (i4 * 5) / 32;
                    iArr[i92] = iArr[i92] + i93;
                    int i94 = i3 + 2;
                    iArr[i94] = iArr[i94] + ((i4 * 3) / 32);
                    int i95 = ((i + 1) * iCols) + i2;
                    iArr[i95] = iArr[i95] + i93;
                    int i96 = i95 + 1;
                    iArr[i96] = iArr[i96] + ((i4 * 4) / 32);
                    int i97 = i95 + 2;
                    iArr[i97] = iArr[i97] + ((i4 * 2) / 32);
                } else {
                    int i98 = i3 + 1;
                    iArr[i98] = iArr[i98] + ((i4 * 5) / 32);
                    int i99 = i3 + 2;
                    iArr[i99] = iArr[i99] + ((i4 * 3) / 32);
                }
            }
        }
        Bitmap bitmapCreateBitmap2 = Bitmap.createBitmap(iCols, iRows, Bitmap.Config.ARGB_8888);
        bitmapCreateBitmap2.setPixels(iArr, 0, iCols, 0, 0, iCols, iRows);
        return bitmapCreateBitmap2;
    }

    public Bitmap adaptiveThreshold(Bitmap bitmap) {
        if (!this.isInitDebug || bitmap == null || bitmap.isRecycled()) {
            System.out.println("fail to deal with bitmap.");
            return bitmap;
        }
        try {
            int width = bitmap.getWidth();
            int height = bitmap.getHeight();
            Mat mat = new Mat(width, height, CvType.CV_8UC3);
            Utils.bitmapToMat(bitmap, mat);
            Imgproc.cvtColor(mat, mat, 1);
            Mat matReduceBackGroundAlgorithm = reduceBackGroundAlgorithm(mat);
            Mat mat2 = new Mat();
            Imgproc.cvtColor(matReduceBackGroundAlgorithm, mat2, 6);
            Mat mat3 = new Mat();
            int i = (int) (((double) width) / 20.0d);
            if (i % 2 == 0) {
                i++;
            }
            Imgproc.adaptiveThreshold(mat2, mat3, 255.0d, 1, 0, Math.max(15, i), width > 1200 ? 12.0d : 7.0d);
            Imgproc.erode(mat3, mat3, Imgproc.getStructuringElement(0, new Size(1.0d, 1.0d)));
            Bitmap bitmapCreateBitmap = mat3.channels() == 3 ? Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565) : Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(mat3, bitmapCreateBitmap);
            mat.release();
            matReduceBackGroundAlgorithm.release();
            mat2.release();
            mat3.release();
            return bitmapCreateBitmap;
        } catch (Exception e2) {
            e2.printStackTrace();
            return bitmap;
        }
    }

    public Bitmap adaptiveThresholdNew(Bitmap bitmap, float f) {
        if (!this.isInitDebug || bitmap == null || bitmap.isRecycled()) {
            System.out.println("fail to deal with bitmap.");
            return bitmap;
        }
        try {
            int width = bitmap.getWidth();
            int height = bitmap.getHeight();
            Mat mat = new Mat(width, height, CvType.CV_8UC3);
            Utils.bitmapToMat(bitmap, mat);
            Imgproc.cvtColor(mat, mat, 10);
            Mat matBlurWithGuas = ProcessPictures.blurWithGuas(mat);
            float checksumsForGamma = f == -1.0f ? ProcessPictures.getChecksumsForGamma(matBlurWithGuas) : f;
            Log.i(TAG, "adaptiveThresholdNew: f=" + checksumsForGamma);
            Mat matSharpImage = ProcessPictures.sharpImage(ProcessPictures.equalizeHistogram(ProcessPictures.enhancedImage(ProcessPictures.gammaTransformation(matBlurWithGuas, checksumsForGamma), ProcessPictures.getEnhancedParam(r0)), 2.0d));
            Log.i(TAG, "adaptiveThresholdNew: 进行了预处理");
            Imgproc.cvtColor(matSharpImage, matSharpImage, 9);
            Mat matReduceBackGroundAlgorithm = reduceBackGroundAlgorithm(matSharpImage);
            Imgproc.cvtColor(matReduceBackGroundAlgorithm, matReduceBackGroundAlgorithm, 10);
            Mat mat2 = new Mat();
            Imgproc.adaptiveThreshold(matReduceBackGroundAlgorithm, mat2, 255.0d, 1, 0, 45, 9.0d);
            Imgproc.erode(mat2, mat2, Imgproc.getStructuringElement(0, new Size(1.0d, 1.0d)));
            Bitmap bitmapCreateBitmap = mat2.channels() == 3 ? Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565) : Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(mat2, bitmapCreateBitmap);
            matBlurWithGuas.release();
            matReduceBackGroundAlgorithm.release();
            matSharpImage.release();
            mat2.release();
            return bitmapCreateBitmap;
        } catch (Exception e2) {
            e2.printStackTrace();
            return bitmap;
        }
    }

    public Bitmap adaptiveThresholdText(Bitmap bitmap) {
        if (!this.isInitDebug || bitmap == null || bitmap.isRecycled()) {
            System.out.println("fail to deal with bitmap.");
            return bitmap;
        }
        try {
            int width = bitmap.getWidth();
            int height = bitmap.getHeight();
            Mat mat = new Mat(width, height, CvType.CV_8UC3);
            Utils.bitmapToMat(bitmap, mat);
            Imgproc.cvtColor(mat, mat, 1);
            Mat matReduceBackGroundAlgorithm = reduceBackGroundAlgorithm(mat);
            Mat mat2 = new Mat();
            Imgproc.cvtColor(matReduceBackGroundAlgorithm, mat2, 6);
            Mat mat3 = new Mat();
            Imgproc.adaptiveThreshold(mat2, mat3, 255.0d, 1, 0, 45, 9.0d);
            Imgproc.erode(mat3, mat3, Imgproc.getStructuringElement(0, new Size(1.0d, 1.0d)));
            Bitmap bitmapCreateBitmap = mat3.channels() == 3 ? Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565) : Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(mat3, bitmapCreateBitmap);
            mat.release();
            matReduceBackGroundAlgorithm.release();
            mat2.release();
            mat3.release();
            return bitmapCreateBitmap;
        } catch (Exception e2) {
            e2.printStackTrace();
            return bitmap;
        }
    }

    @JSMethod(uiThread = false)
    public void adjustBrightnessContrast(JSONObject jSONObject, JSCallback jSCallback) throws Throwable {
        Throwable th;
        Bitmap bitmapPathToBitmap;
        String string = jSONObject.getString("image_path");
        double dDoubleValue = jSONObject.containsKey("alpha") ? jSONObject.getDouble("alpha").doubleValue() : 1.0d;
        double dDoubleValue2 = jSONObject.containsKey("beta") ? jSONObject.getDouble("beta").doubleValue() : 0.0d;
        int iIntValue = jSONObject.containsKey("flip") ? jSONObject.getInteger("flip").intValue() : -2;
        JSONObject jSONObject2 = new JSONObject();
        Bitmap bitmapAdjustBrightnessContrast = null;
        try {
            try {
                bitmapPathToBitmap = ConvertUtils.pathToBitmap(string);
            } catch (Throwable th2) {
                th = th2;
            }
        } catch (Exception e2) {
            e = e2;
        }
        try {
            bitmapAdjustBrightnessContrast = ConvertUtils.adjustBrightnessContrast(bitmapPathToBitmap, dDoubleValue, dDoubleValue2, iIntValue);
            String str = this.mWXSDKInstance.getContext().getExternalCacheDir().toString() + "/images/";
            File file = new File(str);
            if (!file.exists()) {
                file.mkdirs();
            }
            String str2 = str + System.currentTimeMillis() + Operators.DOT_STR + ConvertUtils.getFileSuffix(string);
            if (ConvertUtils.saveBitmap(bitmapAdjustBrightnessContrast, str2)) {
                jSONObject2.put("code", (Object) WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
                jSONObject2.put("image", (Object) str2);
                jSCallback.invoke(jSONObject2);
            } else {
                jSONObject2.put("code", (Object) "-1");
                jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) "保存失败");
                jSCallback.invoke(jSONObject2);
            }
            bitmapAdjustBrightnessContrast.recycle();
            if (bitmapPathToBitmap != null) {
                bitmapPathToBitmap.recycle();
            }
        } catch (Exception e3) {
            e = e3;
            bitmapAdjustBrightnessContrast = bitmapPathToBitmap;
            jSONObject2.put("code", (Object) "-1");
            jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) e.getMessage());
            jSCallback.invoke(jSONObject2);
            if (bitmapAdjustBrightnessContrast != null) {
                bitmapAdjustBrightnessContrast.recycle();
            }
        } catch (Throwable th3) {
            th = th3;
            bitmapAdjustBrightnessContrast = bitmapPathToBitmap;
            if (bitmapAdjustBrightnessContrast == null) {
                throw th;
            }
            bitmapAdjustBrightnessContrast.recycle();
            throw th;
        }
    }

    public Mat bitmapToMat(Bitmap bitmap) {
        if (!this.isInitDebug) {
            return new Mat();
        }
        Mat mat = new Mat();
        Utils.bitmapToMat(bitmap, mat, false);
        Log.i(TAG, "bitmapToMat: channels:" + mat.channels() + " , type:" + mat.type() + ", bitmap:" + bitmap.getConfig());
        Imgproc.cvtColor(mat, mat, 1);
        mat.channels();
        Log.i(TAG, "bitmapToMat: channels:" + mat.channels() + " , type:" + mat.type());
        return mat;
    }

    public String bq95V2DotHex(Bitmap bitmap, String str) {
        StringBuilder sb = new StringBuilder();
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int[] iArr = new int[width * height];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        for (int i = 0; i < height; i++) {
            int i2 = i * width;
            StringBuilder sb2 = new StringBuilder();
            int iCeil = (int) Math.ceil(width / 8.0f);
            for (int i3 = 0; i3 < iCeil; i3++) {
                byte bPx2Byte = 0;
                for (int i4 = 7; i4 >= 0; i4--) {
                    bPx2Byte = (byte) (bPx2Byte + px2Byte((i3 * 8) + i2 + i4, i2 + width, iArr) + bPx2Byte);
                }
                sb2.append(byteToHex(bPx2Byte));
            }
            sb.append("V5C".equals(str) ? "5688A4003000" : "5178A2003000");
            sb.append((CharSequence) sb2);
            sb.append(getCheckValue(str, sb2.toString()));
            sb.append("FF");
        }
        return sb.toString().toUpperCase();
    }

    public String bq95V2GrayHex(Bitmap bitmap, String str) {
        Mat mat = new Mat(bitmap.getHeight(), bitmap.getWidth(), CvType.CV_8UC3);
        Utils.bitmapToMat(bitmap, mat);
        Mat mat2 = new Mat();
        Imgproc.cvtColor(mat, mat2, 10);
        Bitmap bitmapMatToBitmap = matToBitmap(mat2);
        int width = bitmapMatToBitmap.getWidth();
        int height = bitmapMatToBitmap.getHeight();
        int[] iArr = new int[width * height];
        bitmapMatToBitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < height; i++) {
            StringBuilder sb2 = new StringBuilder();
            int i2 = i * width;
            for (int i3 = 0; i3 < width; i3++) {
                sb2.append(byteToHex((byte) (Color.blue(iArr[i2 + i3]) & 255)));
            }
            sb.append("5178CF008001");
            sb.append((CharSequence) sb2);
            sb.append(getCheckValue(str, sb2.toString()));
            sb.append("FF");
        }
        mat.release();
        mat2.release();
        return sb.toString().toUpperCase();
    }

    public String bq95V2GrayHexWithCompress(Bitmap bitmap, String str, boolean z, float f, boolean z2, boolean z3) {
        Bitmap bitmapMatToBitmap;
        Mat mat;
        Mat mat2;
        Mat mat3 = new Mat(bitmap.getHeight(), bitmap.getWidth(), CvType.CV_8UC3);
        Utils.bitmapToMat(bitmap, mat3);
        Mat mat4 = new Mat();
        Imgproc.cvtColor(mat3, mat4, 10);
        if (z) {
            mat4 = ProcessPictures.blurWithGuas(mat4);
            Mat matSharpImage = ProcessPictures.sharpImage(ProcessPictures.equalizeHistogram(ProcessPictures.enhancedImage(ProcessPictures.gammaTransformation(mat4, f == -1.0f ? ProcessPictures.getChecksumsForGamma(mat4) : f), ProcessPictures.getEnhancedParam(r4)), 2.0d));
            bitmapMatToBitmap = matToBitmap(matSharpImage);
            matSharpImage.release();
        } else {
            bitmapMatToBitmap = matToBitmap(mat4);
        }
        Bitmap bitmap2 = bitmapMatToBitmap;
        int width = bitmap2.getWidth();
        int height = bitmap2.getHeight();
        int[] iArr = new int[width * height];
        bitmap2.getPixels(iArr, 0, width, 0, 0, width, height);
        StringBuilder sb = new StringBuilder();
        MinilzoTool minilzoTool = new MinilzoTool();
        "chengong".equals(str);
        ArrayList arrayList = new ArrayList();
        int i = 0;
        while (i < height) {
            int i2 = i + 20;
            int iMin = Math.min(i2, height);
            StringBuilder sb2 = new StringBuilder();
            while (i < iMin) {
                int i3 = 0;
                while (i3 < width) {
                    int i4 = (i * width) + i3;
                    if (z2) {
                        mat = mat3;
                        mat2 = mat4;
                        double dBlue = Color.blue(iArr[i4]) / 16;
                        sb2.append(Integer.toHexString(15 - ((int) (Math.ceil(dBlue) <= 15.0d ? Math.ceil(dBlue) : 15.0d))));
                    } else {
                        mat = mat3;
                        mat2 = mat4;
                        String hexString = Integer.toHexString(Color.blue(iArr[i4]));
                        if (hexString.length() == 1) {
                            sb2.append(0);
                        }
                        sb2.append(hexString);
                    }
                    i3++;
                    mat4 = mat2;
                    mat3 = mat;
                }
                i++;
            }
            arrayList.add(sb2.toString());
            i = i2;
            mat3 = mat3;
        }
        Mat mat5 = mat3;
        Mat mat6 = mat4;
        String[] strArr = (String[]) arrayList.toArray(new String[0]);
        String[] strArrCompressStrings = minilzoTool.compressStrings(strArr);
        if (strArrCompressStrings.length != strArr.length) {
            Log.i(TAG, "bq95V2GrayHexWithCompress: 处理错误, 压缩数组与被压缩数组长度不一致");
            return "";
        }
        for (int i5 = 0; i5 < strArrCompressStrings.length; i5++) {
            String str2 = strArrCompressStrings[i5];
            String str3 = getFrameLenthOfHex(strArr[i5].length()) + getFrameLenthOfHex(str2.length()) + str2;
            String frameLenthOfHex = getFrameLenthOfHex(str3.length());
            sb.append("V5C".equals(str) ? "5688A500" : "5178CF00");
            sb.append(frameLenthOfHex);
            sb.append(str3);
            sb.append(getCheckValue(str, str3));
            sb.append("FF");
            if (z3) {
                sb.append(this.hexSplitSymbol);
            }
        }
        mat5.release();
        mat6.release();
        return sb.toString().toUpperCase();
    }

    public String bytesToHex(byte[] bArr) {
        char[] charArray = "0123456789ABCDEF".toCharArray();
        char[] cArr = new char[bArr.length * 2];
        for (int i = 0; i < bArr.length; i++) {
            byte b2 = bArr[i];
            int i2 = i * 2;
            cArr[i2] = charArray[(b2 & 255) >>> 4];
            cArr[i2 + 1] = charArray[b2 & Ascii.SI];
        }
        return new String(cArr);
    }

    public Mat cutBlue(Mat mat) {
        Mat mat2 = new Mat();
        Mat mat3 = new Mat();
        Imgproc.cvtColor(mat, mat, 1);
        Imgproc.cvtColor(mat, mat3, 41);
        Mat mat4 = new Mat();
        Core.inRange(mat3, new Scalar(100.0d, 50.0d, 50.0d), new Scalar(140.0d, 255.0d, 255.0d), mat4);
        Mat mat5 = new Mat(mat3.size(), mat3.type(), new Scalar(0.0d, 0.0d, 255.0d));
        mat5.copyTo(mat2, mat4);
        Imgproc.cvtColor(mat2, mat2, 55);
        Core.add(mat, mat2, mat2);
        mat3.release();
        mat4.release();
        mat5.release();
        return mat2;
    }

    public Mat cutRed(Mat mat) {
        Mat mat2 = new Mat();
        Mat mat3 = new Mat();
        Imgproc.cvtColor(mat, mat, 1);
        Imgproc.cvtColor(mat, mat3, 41);
        Mat mat4 = new Mat();
        Mat mat5 = new Mat();
        Mat mat6 = new Mat();
        Core.inRange(mat3, new Scalar(0.0d, 50.0d, 50.0d), new Scalar(10.0d, 255.0d, 255.0d), mat4);
        Core.inRange(mat3, new Scalar(170.0d, 50.0d, 50.0d), new Scalar(180.0d, 255.0d, 255.0d), mat5);
        Core.bitwise_xor(mat4, mat5, mat6);
        Mat mat7 = new Mat(mat3.size(), mat3.type(), new Scalar(0.0d, 0.0d, 255.0d));
        mat7.copyTo(mat2, mat6);
        Imgproc.cvtColor(mat2, mat2, 55);
        Core.add(mat, mat2, mat2);
        mat3.release();
        mat6.release();
        mat7.release();
        mat5.release();
        mat4.release();
        return mat2;
    }

    public Mat cutRedAndBlue(Mat mat) {
        Mat mat2 = new Mat();
        Mat mat3 = new Mat();
        Imgproc.cvtColor(mat, mat, 1);
        Imgproc.cvtColor(mat, mat3, 41);
        Mat mat4 = new Mat();
        Mat mat5 = new Mat();
        Mat mat6 = new Mat();
        Mat mat7 = new Mat();
        Core.inRange(mat3, new Scalar(0.0d, 50.0d, 50.0d), new Scalar(10.0d, 255.0d, 255.0d), mat4);
        Core.inRange(mat3, new Scalar(170.0d, 50.0d, 50.0d), new Scalar(180.0d, 255.0d, 255.0d), mat5);
        Core.inRange(mat3, new Scalar(100.0d, 50.0d, 50.0d), new Scalar(140.0d, 255.0d, 255.0d), mat7);
        Core.bitwise_xor(mat4, mat5, mat6);
        Core.bitwise_xor(mat6, mat7, mat6);
        Mat mat8 = new Mat(mat3.size(), mat3.type(), new Scalar(0.0d, 0.0d, 255.0d));
        mat8.copyTo(mat2, mat6);
        Imgproc.cvtColor(mat2, mat2, 55);
        Core.add(mat, mat2, mat2);
        mat3.release();
        mat6.release();
        mat8.release();
        mat5.release();
        mat4.release();
        mat7.release();
        return mat2;
    }

    @Override // com.taobao.weex.common.Destroyable
    public void destroy() {
    }

    @JSMethod(uiThread = false)
    public void dither(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        String string = jSONObject.getString("image_path");
        String strSave_image = save_image(getFlyodBitmapNew(resize(imagePathToBitmap(string, true), jSONObject.getInteger("width").intValue(), jSONObject.getInteger("height").intValue()), -1.0f));
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        this.jsCallback.invoke(jSONObject2);
    }

    @JSMethod(uiThread = false)
    public void enhancePicture(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        debug("enhancePicture", "start");
        debug("jsondata", jSONObject.toString());
        String string = jSONObject.getString("image_path");
        boolean zBooleanValue = jSONObject.getBoolean("is_adapter").booleanValue();
        Bitmap bitmapImagePathToBitmap = imagePathToBitmap(string, true);
        int i = this.mWXSDKInstance.getContext().getResources().getDisplayMetrics().widthPixels;
        Bitmap bitmapResize = resize(bitmapImagePathToBitmap, i, (int) (bitmapImagePathToBitmap.getHeight() * ((i * 1.0f) / bitmapImagePathToBitmap.getWidth())));
        String strSave_image = save_image(zBooleanValue ? adaptiveThreshold(bitmapResize) : threshold(bitmapResize));
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        jSCallback.invoke(jSONObject2);
    }

    @JSMethod(uiThread = false)
    public void enhanceText(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        debug("enhanceText", "start");
        debug("jsondata", jSONObject.toString());
        String string = jSONObject.getString("image_path");
        boolean booleanValue = jSONObject.getBooleanValue("cut_red");
        boolean booleanValue2 = jSONObject.getBooleanValue("cut_blue");
        int iIntValue = jSONObject.containsKey("slide_value") ? jSONObject.getInteger("slide_value").intValue() : 39;
        Bitmap bitmapImagePathToBitmap = imagePathToBitmap(string, false);
        int i = this.mWXSDKInstance.getContext().getResources().getDisplayMetrics().widthPixels;
        String strSave_image = save_image(getBinaryBitmap(resize(bitmapImagePathToBitmap, i, (int) (bitmapImagePathToBitmap.getHeight() * ((i * 1.0f) / bitmapImagePathToBitmap.getWidth()))), booleanValue, booleanValue2, iIntValue));
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        jSCallback.invoke(jSONObject2);
    }

    @JSMethod(uiThread = false)
    public void enhanceTextV2(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        debug("enhanceText", "start");
        debug("jsondata", jSONObject.toString());
        String string = jSONObject.getString("image_path");
        boolean booleanValue = jSONObject.getBooleanValue("cut_red");
        boolean booleanValue2 = jSONObject.getBooleanValue("cut_blue");
        float floatValue = jSONObject.containsValue("gammaValue") ? jSONObject.getFloatValue("gammaValue") : -1.0f;
        int iIntValue = jSONObject.containsKey("slide_value") ? jSONObject.getInteger("slide_value").intValue() : 39;
        Bitmap bitmapImagePathToBitmap = imagePathToBitmap(string, false);
        int i = this.mWXSDKInstance.getContext().getResources().getDisplayMetrics().widthPixels;
        Mat matBitmapToMat = bitmapToMat(resize(bitmapImagePathToBitmap, i, (int) (bitmapImagePathToBitmap.getHeight() * ((i * 1.0f) / bitmapImagePathToBitmap.getWidth()))));
        if (booleanValue && !booleanValue2) {
            matBitmapToMat = cutRed(matBitmapToMat);
        } else if (!booleanValue && booleanValue2) {
            matBitmapToMat = cutBlue(matBitmapToMat);
        } else if (booleanValue && booleanValue2) {
            matBitmapToMat = cutRedAndBlue(matBitmapToMat);
        }
        Mat mat = new Mat();
        Imgproc.cvtColor(matBitmapToMat, mat, 10);
        Mat matBlurWithGuas = ProcessPictures.blurWithGuas(mat);
        if (floatValue == -1.0f) {
            floatValue = ProcessPictures.getChecksumsForGamma(matBlurWithGuas);
        }
        Mat matSharpImage = ProcessPictures.sharpImage(ProcessPictures.equalizeHistogram(ProcessPictures.enhancedImage(ProcessPictures.gammaTransformation(matBlurWithGuas, floatValue), ProcessPictures.getEnhancedParam(r0)), 2.0d));
        String strSave_image = save_image(getBinaryBitmap(matToBitmap(matSharpImage), false, false, iIntValue));
        matSharpImage.release();
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        jSCallback.invoke(jSONObject2);
    }

    public int[] errorDiffusion(Bitmap bitmap) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int i = width * height;
        int[] iArr = new int[i];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        for (int i2 = 0; i2 < i; i2++) {
            int i3 = iArr[i2];
            iArr[i2] = RGB2Gray((16711680 & i3) >> 16, (65280 & i3) >> 8, 255 & i3);
        }
        for (int i4 = 0; i4 < height; i4++) {
            for (int i5 = 0; i5 < width; i5++) {
                int i6 = (width * i4) + i5;
                int i7 = iArr[i6];
                int iRound = Math.round(i7 / 16) * 16;
                if (iRound > 255) {
                    iRound = 255;
                }
                iArr[i6] = iRound;
                int i8 = i7 - iRound;
                if (i5 > 1) {
                    if (i5 < width - 2) {
                        if (i4 < height - 2) {
                            int i9 = i6 + 1;
                            int i10 = (i8 * 5) / 32;
                            iArr[i9] = iArr[i9] + i10;
                            int i11 = i6 + 2;
                            int i12 = (i8 * 3) / 32;
                            iArr[i11] = iArr[i11] + i12;
                            int i13 = ((i4 + 1) * width) + i5;
                            iArr[i13] = iArr[i13] + i10;
                            int i14 = i13 + 1;
                            int i15 = (i8 * 4) / 32;
                            iArr[i14] = iArr[i14] + i15;
                            int i16 = i13 + 2;
                            int i17 = (i8 * 2) / 32;
                            iArr[i16] = iArr[i16] + i17;
                            int i18 = i13 - 1;
                            iArr[i18] = iArr[i18] + i15;
                            int i19 = i13 - 2;
                            iArr[i19] = iArr[i19] + i17;
                            int i20 = ((i4 + 2) * width) + i5;
                            iArr[i20] = iArr[i20] + i12;
                            int i21 = i20 + 1;
                            iArr[i21] = iArr[i21] + i17;
                            int i22 = i20 - 1;
                            iArr[i22] = iArr[i22] + i17;
                        } else if (i4 < height - 1) {
                            int i23 = i6 + 1;
                            int i24 = (i8 * 5) / 32;
                            iArr[i23] = iArr[i23] + i24;
                            int i25 = i6 + 2;
                            iArr[i25] = iArr[i25] + ((i8 * 3) / 32);
                            int i26 = ((i4 + 1) * width) + i5;
                            iArr[i26] = iArr[i26] + i24;
                            int i27 = i26 + 1;
                            int i28 = (i8 * 4) / 32;
                            iArr[i27] = iArr[i27] + i28;
                            int i29 = i26 + 2;
                            int i30 = (i8 * 2) / 32;
                            iArr[i29] = iArr[i29] + i30;
                            int i31 = i26 - 1;
                            iArr[i31] = iArr[i31] + i28;
                            int i32 = i26 - 2;
                            iArr[i32] = iArr[i32] + i30;
                        } else {
                            int i33 = i6 + 1;
                            iArr[i33] = iArr[i33] + ((i8 * 5) / 32);
                            int i34 = i6 + 2;
                            iArr[i34] = iArr[i34] + ((i8 * 3) / 32);
                        }
                    } else if (i5 < width - 1) {
                        if (i4 < height - 2) {
                            int i35 = i6 + 1;
                            int i36 = (i8 * 5) / 32;
                            iArr[i35] = iArr[i35] + i36;
                            int i37 = ((i4 + 1) * width) + i5;
                            iArr[i37] = iArr[i37] + i36;
                            int i38 = i37 + 1;
                            int i39 = (i8 * 4) / 32;
                            iArr[i38] = iArr[i38] + i39;
                            int i40 = i37 - 1;
                            iArr[i40] = iArr[i40] + i39;
                            int i41 = i37 - 2;
                            int i42 = (i8 * 2) / 32;
                            iArr[i41] = iArr[i41] + i42;
                            int i43 = ((i4 + 2) * width) + i5;
                            iArr[i43] = iArr[i43] + ((i8 * 3) / 32);
                            int i44 = i43 + 1;
                            iArr[i44] = iArr[i44] + i42;
                            int i45 = i43 - 1;
                            iArr[i45] = iArr[i45] + i42;
                        } else if (i4 < height - 1) {
                            int i46 = i6 + 1;
                            int i47 = (i8 * 5) / 32;
                            iArr[i46] = iArr[i46] + i47;
                            int i48 = ((i4 + 1) * width) + i5;
                            iArr[i48] = iArr[i48] + i47;
                            int i49 = i48 + 1;
                            int i50 = (i8 * 4) / 32;
                            iArr[i49] = iArr[i49] + i50;
                            int i51 = i48 - 1;
                            iArr[i51] = iArr[i51] + i50;
                            int i52 = i48 - 2;
                            iArr[i52] = iArr[i52] + ((i8 * 2) / 32);
                        } else {
                            int i53 = i6 + 1;
                            iArr[i53] = iArr[i53] + ((i8 * 5) / 32);
                        }
                    } else if (i4 < height - 2) {
                        int i54 = ((i4 + 1) * width) + i5;
                        iArr[i54] = iArr[i54] + ((i8 * 5) / 32);
                        int i55 = i54 - 1;
                        iArr[i55] = iArr[i55] + ((i8 * 4) / 32);
                        int i56 = i54 - 2;
                        int i57 = (i8 * 2) / 32;
                        iArr[i56] = iArr[i56] + i57;
                        int i58 = ((i4 + 2) * width) + i5;
                        iArr[i58] = iArr[i58] + ((i8 * 3) / 32);
                        int i59 = i58 - 1;
                        iArr[i59] = iArr[i59] + i57;
                    } else if (i4 < height - 1) {
                        int i60 = ((i4 + 1) * width) + i5;
                        iArr[i60] = iArr[i60] + ((i8 * 5) / 32);
                        int i61 = i60 - 1;
                        iArr[i61] = iArr[i61] + ((i8 * 4) / 32);
                        int i62 = i60 - 2;
                        iArr[i62] = iArr[i62] + ((i8 * 2) / 32);
                    }
                } else if (i5 > 0) {
                    if (i4 < height - 2) {
                        int i63 = i6 + 1;
                        int i64 = (i8 * 5) / 32;
                        iArr[i63] = iArr[i63] + i64;
                        int i65 = i6 + 2;
                        int i66 = (i8 * 3) / 32;
                        iArr[i65] = iArr[i65] + i66;
                        int i67 = ((i4 + 1) * width) + i5;
                        iArr[i67] = iArr[i67] + i64;
                        int i68 = i67 + 1;
                        int i69 = (i8 * 4) / 32;
                        iArr[i68] = iArr[i68] + i69;
                        int i70 = i67 + 2;
                        int i71 = (i8 * 2) / 32;
                        iArr[i70] = iArr[i70] + i71;
                        int i72 = i67 - 1;
                        iArr[i72] = iArr[i72] + i69;
                        int i73 = ((i4 + 2) * width) + i5;
                        iArr[i73] = iArr[i73] + i66;
                        int i74 = i73 + 1;
                        iArr[i74] = iArr[i74] + i71;
                        int i75 = i73 - 1;
                        iArr[i75] = iArr[i75] + i71;
                    } else if (i4 < height - 1) {
                        int i76 = i6 + 1;
                        int i77 = (i8 * 5) / 32;
                        iArr[i76] = iArr[i76] + i77;
                        int i78 = i6 + 2;
                        iArr[i78] = iArr[i78] + ((i8 * 3) / 32);
                        int i79 = ((i4 + 1) * width) + i5;
                        iArr[i79] = iArr[i79] + i77;
                        int i80 = i79 + 1;
                        int i81 = (i8 * 4) / 32;
                        iArr[i80] = iArr[i80] + i81;
                        int i82 = i79 + 2;
                        iArr[i82] = iArr[i82] + ((i8 * 2) / 32);
                        int i83 = i79 - 1;
                        iArr[i83] = iArr[i83] + i81;
                    } else {
                        int i84 = i6 + 1;
                        iArr[i84] = iArr[i84] + ((i8 * 5) / 32);
                        int i85 = i6 + 2;
                        iArr[i85] = iArr[i85] + ((i8 * 3) / 32);
                    }
                } else if (i4 < height - 2) {
                    int i86 = i6 + 1;
                    int i87 = (i8 * 5) / 32;
                    iArr[i86] = iArr[i86] + i87;
                    int i88 = i6 + 2;
                    int i89 = (i8 * 3) / 32;
                    iArr[i88] = iArr[i88] + i89;
                    int i90 = ((i4 + 1) * width) + i5;
                    iArr[i90] = iArr[i90] + i87;
                    int i91 = i90 + 1;
                    iArr[i91] = iArr[i91] + ((i8 * 4) / 32);
                    int i92 = i90 + 2;
                    int i93 = (i8 * 2) / 32;
                    iArr[i92] = iArr[i92] + i93;
                    int i94 = ((i4 + 2) * width) + i5;
                    iArr[i94] = iArr[i94] + i89;
                    int i95 = i94 + 1;
                    iArr[i95] = iArr[i95] + i93;
                } else if (i4 < height - 1) {
                    int i96 = i6 + 1;
                    int i97 = (i8 * 5) / 32;
                    iArr[i96] = iArr[i96] + i97;
                    int i98 = i6 + 2;
                    iArr[i98] = iArr[i98] + ((i8 * 3) / 32);
                    int i99 = ((i4 + 1) * width) + i5;
                    iArr[i99] = iArr[i99] + i97;
                    int i100 = i99 + 1;
                    iArr[i100] = iArr[i100] + ((i8 * 4) / 32);
                    int i101 = i99 + 2;
                    iArr[i101] = iArr[i101] + ((i8 * 2) / 32);
                } else {
                    int i102 = i6 + 1;
                    iArr[i102] = iArr[i102] + ((i8 * 5) / 32);
                    int i103 = i6 + 2;
                    iArr[i103] = iArr[i103] + ((i8 * 3) / 32);
                }
            }
        }
        return iArr;
    }

    public Mat gamma(Mat mat, float f) {
        if (!this.isInitDebug || f == 1.0f) {
            return mat;
        }
        int iType = mat.type();
        Mat mat2 = new Mat();
        mat.convertTo(mat2, 6, 0.00392156862745098d, 0.0d);
        Core.pow(mat2, 1.0f / f, mat2);
        Mat mat3 = new Mat();
        mat2.convertTo(mat3, iType, 255.0d, 0.0d);
        mat2.release();
        return mat3;
    }

    public Bitmap getBinaryBitmap(Bitmap bitmap, float f, boolean z, boolean z2, int i) {
        Log.i(TAG, "paramFloat:" + f + "_paramBoolean1:" + z + "_paramBoolean2:" + z2 + "_paramInt:" + i);
        Mat matBitmapToMat = bitmapToMat(bitmap);
        Mat matReduceBackGroundAlgorithm = reduceBackGroundAlgorithm(matBitmapToMat);
        Mat mat = new Mat();
        Mat matGamma = gamma(matReduceBackGroundAlgorithm, f);
        if (z && !z2) {
            matGamma = cutRed(matGamma);
        } else if (!z && z2) {
            matGamma = cutBlue(matGamma);
        } else if (z && z2) {
            matGamma = cutRedAndBlue(matGamma);
        }
        Imgproc.cvtColor(matGamma, mat, 7);
        Mat mat2 = new Mat();
        Imgproc.adaptiveThreshold(mat, mat2, 255.0d, 1, 0, 45, i + 9);
        Imgproc.erode(mat2, mat2, Imgproc.getStructuringElement(0, new Size(1.0d, 1.0d)));
        Bitmap bitmapMatToBitmap = matToBitmap(mat2);
        matBitmapToMat.release();
        matReduceBackGroundAlgorithm.release();
        mat.release();
        matGamma.release();
        mat2.release();
        return bitmapMatToBitmap;
    }

    /* JADX WARN: Removed duplicated region for block: B:43:0x00be  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public android.graphics.Bitmap getBinaryBitmap(android.graphics.Bitmap r12, boolean r13, boolean r14, int r15) {
        /*
            Method dump skipped, instruction units count: 281
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.xyz.yintibao.OpencvUtilsWXModule.getBinaryBitmap(android.graphics.Bitmap, boolean, boolean, int):android.graphics.Bitmap");
    }

    public String getBitMapHex(Bitmap bitmap, int i, String str) {
        StringBuilder sb = new StringBuilder();
        System.out.println("width:" + bitmap.getWidth() + ", height:" + bitmap.getHeight());
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int[] iArr = new int[width * height];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        for (int i2 = 0; i2 < bitmap.getHeight() / 24.0f; i2++) {
            sb.append("1B2A21");
            sb.append(Integer.toHexString(bitmap.getWidth() % 256));
            String hexString = Integer.toHexString(bitmap.getWidth() / 256);
            if (hexString.length() == 1) {
                hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
            }
            sb.append(hexString);
            int i3 = i2 * 24;
            for (int i4 = 0; i4 < bitmap.getWidth(); i4++) {
                for (int i5 = 0; i5 < 3; i5++) {
                    int i6 = (i5 * 8) + i3;
                    byte bPx2Byte = 0;
                    for (int i7 = 0; i7 < 8; i7++) {
                        int i8 = i6 + i7;
                        bPx2Byte = (byte) (bPx2Byte + px2Byte(i8, height, (i8 * width) + i4, iArr) + bPx2Byte);
                    }
                    sb.append(byteToHex(bPx2Byte));
                }
            }
            if (str.equals("v5") || str.equals("v5pro") || str.equals("v7") || str.equals("v7pro") || str.equals("v5n") || str.equals("v5npro") || str.equals("v10g")) {
                sb.append("1B33000A");
                if (i2 + 1 >= bitmap.getHeight() / 24.0f) {
                    if (str.equals("v5") || str.equals("v5n") || str.equals("v7") || str.equals("v10g")) {
                        sb.append("1B6404");
                    } else {
                        sb.append("1B6406");
                    }
                }
            }
        }
        return sb.toString();
    }

    public HexInfo getBitMapHexForV5xDotPrint(Bitmap bitmap) {
        StringBuilder sb = new StringBuilder("2221A9000200");
        String hexString = Integer.toHexString(bitmap.getHeight());
        for (int length = hexString.length(); length < 4; length++) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        byte b2 = 0;
        String str = hexString.substring(hexString.length() - 2) + hexString.substring(0, 2);
        sb.append(str);
        byte[] bArrHexString2Bytes = ConvertUtils.hexString2Bytes(str.toString());
        sb.append(ConvertUtils.BinaryToHexString(new byte[]{ConvertUtils.calcCrc8(bArrHexString2Bytes, 0, bArrHexString2Bytes.length)}));
        sb.append("FF");
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int[] iArr = new int[width * height];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        int i = 0;
        int i2 = 0;
        int i3 = 0;
        while (i < height) {
            int i4 = i * width;
            StringBuilder sb2 = new StringBuilder();
            int iCeil = (int) Math.ceil(width / 8.0f);
            int i5 = b2;
            while (i5 < iCeil) {
                byte b3 = b2;
                for (int i6 = 7; i6 >= 0; i6--) {
                    byte bPx2Byte = px2Byte((i5 * 8) + i4 + i6, i4 + width, iArr);
                    b3 = (byte) (b3 + b3 + bPx2Byte);
                    if (bPx2Byte == 0) {
                        i2++;
                    } else {
                        i3++;
                    }
                }
                sb2.append(byteToHex(b3));
                i5++;
                b2 = 0;
            }
            sb.append(sb2.toString());
            i++;
            b2 = 0;
        }
        return new HexInfo(i2, i3, sb.toString().toUpperCase());
    }

    public HexInfo getBitMapHexForV5xDotPrintOfSeriaPort(Bitmap bitmap) {
        StringBuilder sb = new StringBuilder("2221A9000200");
        String hexString = Integer.toHexString(bitmap.getHeight());
        for (int length = hexString.length(); length < 4; length++) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        byte b2 = 0;
        String str = hexString.substring(hexString.length() - 2) + hexString.substring(0, 2);
        sb.append(str);
        byte[] bArrHexString2Bytes = ConvertUtils.hexString2Bytes(str.toString());
        sb.append(ConvertUtils.BinaryToHexString(new byte[]{ConvertUtils.calcCrc8(bArrHexString2Bytes, 0, bArrHexString2Bytes.length)}));
        sb.append("FF");
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int[] iArr = new int[width * height];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        int i = 0;
        int i2 = 0;
        int i3 = 0;
        while (i < height) {
            int i4 = i * width;
            StringBuilder sb2 = new StringBuilder("2221A8003000");
            int iCeil = (int) Math.ceil(width / 8.0f);
            int i5 = b2;
            while (i5 < iCeil) {
                byte b3 = b2;
                for (int i6 = 7; i6 >= 0; i6--) {
                    byte bPx2Byte = px2Byte((i5 * 8) + i4 + i6, i4 + width, iArr);
                    b3 = (byte) (b3 + b3 + bPx2Byte);
                    if (bPx2Byte == 0) {
                        i2++;
                    } else {
                        i3++;
                    }
                }
                sb2.append(byteToHex(b3));
                i5++;
                b2 = 0;
            }
            sb2.append("0000");
            sb.append(sb2.toString());
            i++;
            b2 = 0;
        }
        return new HexInfo(i2, i3, sb.toString().toUpperCase());
    }

    public String getBitMapHexForV5xDotPrintTest() {
        int[][] iArr = (int[][]) Array.newInstance((Class<?>) Integer.TYPE, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT);
        for (int i = 0; i < 384; i++) {
            for (int i2 = 0; i2 < 384; i2++) {
                if (i2 <= i) {
                    iArr[i][i2] = 1;
                } else {
                    iArr[i][i2] = 0;
                }
            }
        }
        int[][] iArr2 = (int[][]) Array.newInstance((Class<?>) Integer.TYPE, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT);
        for (int i3 = 0; i3 < iArr2.length; i3++) {
            iArr2[i3] = iArr[i3];
        }
        save_image(iArr2);
        int length = iArr2[0].length;
        int length2 = iArr2.length;
        int[] iArr3 = new int[length * length2];
        StringBuilder sb = new StringBuilder("2221A9000200");
        String hexString = Integer.toHexString(length2);
        for (int length3 = hexString.length(); length3 < 4; length3++) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        String str = hexString.substring(hexString.length() - 2) + hexString.substring(0, 2);
        sb.append(str);
        byte[] bArrHexString2Bytes = ConvertUtils.hexString2Bytes(str.toString());
        sb.append(ConvertUtils.BinaryToHexString(new byte[]{ConvertUtils.calcCrc8(bArrHexString2Bytes, 0, bArrHexString2Bytes.length)}));
        sb.append("FF");
        for (int i4 = 0; i4 < length2; i4++) {
            for (int i5 = 0; i5 < length; i5++) {
                iArr3[(i4 * length) + i5] = iArr2[i4][i5];
            }
        }
        for (int i6 = 0; i6 < length2; i6++) {
            int i7 = i6 * length;
            StringBuilder sb2 = new StringBuilder();
            int iCeil = (int) Math.ceil(length / 8.0f);
            for (int i8 = 0; i8 < iCeil; i8++) {
                byte b2 = 0;
                for (int i9 = 7; i9 >= 0; i9--) {
                    b2 = (byte) (b2 + (iArr3[((i8 * 8) + i7) + i9] == 1 ? (byte) 1 : (byte) 0) + b2);
                }
                sb2.append(byteToHex(b2));
            }
            sb.append(sb2.toString());
        }
        return sb.toString().toUpperCase();
    }

    public HexInfo getBitMapHexForV5xGrayPrint(Bitmap bitmap, boolean z, boolean z2, float f, boolean z3) {
        Bitmap bitmapMatToBitmap;
        Mat mat = new Mat(bitmap.getHeight(), bitmap.getWidth(), CvType.CV_8UC3);
        Utils.bitmapToMat(bitmap, mat);
        Mat mat2 = new Mat();
        Imgproc.cvtColor(mat, mat2, 10);
        if (!z) {
            bitmapMatToBitmap = matToBitmap(mat2);
        } else if (z3) {
            mat2 = ProcessPictures.sharpMask(mat2);
            Mat matGammaTransformation = ProcessPictures.gammaTransformation(mat2, ProcessPictures.getGammaValueV2(mat2));
            Mat matSharpImage = ProcessPictures.sharpImage(ProcessPictures.enhancedImageV2(matGammaTransformation, ProcessPictures.getEnhancedParam(matGammaTransformation)));
            bitmapMatToBitmap = matToBitmap(matSharpImage);
            matSharpImage.release();
            Log.i(TAG, "getBitMapHexForV5xGrayPrint: " + z3);
        } else {
            mat2 = ProcessPictures.blurWithGuas(mat2);
            Mat matSharpImage2 = ProcessPictures.sharpImage(ProcessPictures.equalizeHistogram(ProcessPictures.enhancedImage(ProcessPictures.gammaTransformation(mat2, f == -1.0f ? ProcessPictures.getChecksumsForGamma(mat2) : f), ProcessPictures.getEnhancedParam(r1)), 2.0d));
            bitmapMatToBitmap = matToBitmap(matSharpImage2);
            matSharpImage2.release();
        }
        Bitmap bitmap2 = bitmapMatToBitmap;
        StringBuilder sb = new StringBuilder("2221A9000200");
        String hexString = Integer.toHexString(bitmap2.getHeight());
        for (int length = hexString.length(); length < 4; length++) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        String str = hexString.substring(hexString.length() - 2) + hexString.substring(0, 2);
        sb.append(str);
        byte[] bArrHexString2Bytes = ConvertUtils.hexString2Bytes(str.toString());
        sb.append(ConvertUtils.BinaryToHexString(new byte[]{ConvertUtils.calcCrc8(bArrHexString2Bytes, 0, bArrHexString2Bytes.length)}));
        sb.append("FF");
        int width = bitmap2.getWidth();
        int height = bitmap2.getHeight();
        int[] iArr = new int[width * height];
        bitmap2.getPixels(iArr, 0, width, 0, 0, width, height);
        for (int i = 0; i < height; i++) {
            for (int i2 = 0; i2 < width; i2++) {
                int i3 = (i * width) + i2;
                if (z2) {
                    double dBlue = Color.blue(iArr[i3]) / 16;
                    sb.append(Integer.toHexString(15 - ((int) (Math.ceil(dBlue) <= 15.0d ? Math.ceil(dBlue) : 15.0d))));
                } else {
                    sb.append(byteToHex((byte) (Color.blue(iArr[i3]) & 255)));
                }
            }
        }
        mat.release();
        mat2.release();
        return new HexInfo(0, 0, sb.toString().toUpperCase());
    }

    public HexInfo getBitMapHexForV5xGrayPrintOfSeriaPort(Bitmap bitmap, boolean z, boolean z2) {
        Bitmap bitmapMatToBitmap;
        Mat mat = new Mat(bitmap.getHeight(), bitmap.getWidth(), CvType.CV_8UC3);
        Utils.bitmapToMat(bitmap, mat);
        Mat mat2 = new Mat();
        Imgproc.cvtColor(mat, mat2, 10);
        if (z) {
            mat2 = ProcessPictures.blurWithGuas(mat2);
            Mat matSharpImage = ProcessPictures.sharpImage(ProcessPictures.equalizeHistogram(ProcessPictures.enhancedImage(ProcessPictures.gammaTransformation(mat2, ProcessPictures.getChecksumsForGamma(mat2)), ProcessPictures.getEnhancedParam(r4)), 2.0d));
            bitmapMatToBitmap = matToBitmap(matSharpImage);
            matSharpImage.release();
        } else {
            bitmapMatToBitmap = matToBitmap(mat2);
        }
        Bitmap bitmap2 = bitmapMatToBitmap;
        StringBuilder sb = new StringBuilder("2221A9000200");
        String hexString = Integer.toHexString(bitmap2.getHeight());
        for (int length = hexString.length(); length < 4; length++) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        String str = hexString.substring(hexString.length() - 2) + hexString.substring(0, 2);
        sb.append(str);
        byte[] bArrHexString2Bytes = ConvertUtils.hexString2Bytes(str.toString());
        sb.append(ConvertUtils.BinaryToHexString(new byte[]{ConvertUtils.calcCrc8(bArrHexString2Bytes, 0, bArrHexString2Bytes.length)}));
        sb.append("FF");
        int width = bitmap2.getWidth();
        int height = bitmap2.getHeight();
        int[] iArr = new int[width * height];
        bitmap2.getPixels(iArr, 0, width, 0, 0, width, height);
        for (int i = 0; i < height; i++) {
            StringBuilder sb2 = new StringBuilder("2221A800C000");
            int i2 = i * width;
            for (int i3 = 0; i3 < width; i3++) {
                double dBlue = Color.blue(iArr[i2 + i3]) / 16;
                double dCeil = 15.0d;
                if (Math.ceil(dBlue) <= 15.0d) {
                    dCeil = Math.ceil(dBlue);
                }
                sb2.append(Integer.toHexString(15 - ((int) dCeil)));
            }
            sb2.append("0000");
            sb.append(sb2.toString());
        }
        mat.release();
        mat2.release();
        return new HexInfo(0, 0, sb.toString().toUpperCase());
    }

    public String getBitMapHexV10g(Bitmap bitmap, int i, String str) {
        StringBuilder sb = new StringBuilder();
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int[] iArr = new int[width * height];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        int iCeil = (int) Math.ceil(width / 8.0f);
        StringBuilder sb2 = new StringBuilder();
        for (int i2 = 0; i2 < height; i2++) {
            int i3 = i2 * width;
            for (int i4 = 0; i4 < iCeil; i4++) {
                byte bPx2Byte = 0;
                for (int i5 = 0; i5 <= 7; i5++) {
                    bPx2Byte = (byte) (bPx2Byte + px2Byte((i4 * 8) + i3 + i5, i3 + width, iArr) + bPx2Byte);
                }
                sb2.append(byteToHex(bPx2Byte));
            }
        }
        byte[] bArrHexString2Bytes = ConvertUtils.hexString2Bytes(sb2.toString());
        byte[] bArrCompressData = ZlibTool.compressData(bArrHexString2Bytes, 10);
        if (bArrCompressData == null) {
            bArrCompressData = ZlibTool.compressData(bArrHexString2Bytes, 10);
        }
        String strBytesToHex = bytesToHex(bArrCompressData);
        sb.append("1B2321");
        String hexString = Integer.toHexString(iCeil);
        StringBuilder sb3 = new StringBuilder();
        while (sb3.length() + hexString.length() < 4) {
            sb3.append(WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        }
        sb.append((CharSequence) sb3);
        sb.append(hexString);
        String hexString2 = Integer.toHexString(height);
        StringBuilder sb4 = new StringBuilder();
        while (sb4.length() + hexString2.length() < 4) {
            sb4.append(WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        }
        sb.append((CharSequence) sb4);
        sb.append(hexString2);
        String hexString3 = Integer.toHexString(strBytesToHex.length() / 2);
        StringBuilder sb5 = new StringBuilder();
        while (sb5.length() + hexString3.length() < 8) {
            sb5.append(WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
        }
        sb.append((CharSequence) sb5);
        sb.append(hexString3);
        sb.append(strBytesToHex);
        return sb.toString();
    }

    public String getBitMapHex_v10(Bitmap bitmap) {
        System.out.println("w:" + bitmap.getWidth() + ", h:" + bitmap.getHeight());
        StringBuilder sb = new StringBuilder("1D823000D800");
        String hexString = Integer.toHexString(bitmap.getHeight());
        for (int length = hexString.length(); length < 4; length++) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        sb.append(hexString.substring(hexString.length() - 2, hexString.length()) + hexString.substring(0, 2));
        System.out.println("return_hex:" + ((Object) sb));
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int i = width * height;
        Log.i(TAG, "width:" + width + ", height:" + height + "; size=" + i + "," + bitmap.getConfig());
        int[] iArr = new int[i];
        Log.i(TAG, "bitmap_pixel success");
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        Log.i(TAG, "bitmap_pixel success 2");
        for (int i2 = 0; i2 < bitmap.getHeight(); i2++) {
            int i3 = i2 * width;
            for (int i4 = 0; i4 < Math.ceil(bitmap.getWidth() / 8.0f); i4++) {
                byte bPx2Byte = 0;
                for (int i5 = 0; i5 < 8; i5++) {
                    bPx2Byte = (byte) (bPx2Byte + px2Byte((i4 * 8) + i3 + i5, i3 + width, iArr) + bPx2Byte);
                }
                sb.append(byteToHex(bPx2Byte));
            }
            for (int i6 = 0; i6 < 216.0d - Math.ceil(bitmap.getWidth() / 8.0f); i6++) {
                sb.append(byteToHex((byte) 0));
            }
        }
        Boolean bool = true;
        if (bool.booleanValue()) {
            int iCeil = (int) Math.ceil(sb.toString().length() / 4000.0f);
            for (int i7 = 0; i7 < iCeil; i7++) {
                if (i7 < iCeil - 1) {
                    System.out.println("n:" + i7 + ", hex:" + sb.toString().substring(i7 * 4000, (i7 + 1) * 4000));
                } else {
                    System.out.println("n:" + i7 + ", hex:" + sb.toString().substring(i7 * 4000, sb.toString().length()));
                }
            }
        }
        return sb.toString();
    }

    public String getBitMapHex_v5g(Bitmap bitmap, String str, int i, int i2, int i3, boolean z, String str2, String str3, int i4, int i5, int i6) {
        V5g v5g = new V5g(str);
        if (!z) {
            return v5g.getPrintData(bitmap, i, i2, i3);
        }
        if ("MXW010".equals(str3)) {
            return getMXW010GrayHex(bitmap);
        }
        String strScaleImageForGrayPrint = scaleImageForGrayPrint(bitmap, str3, i4, i5, i6);
        String str4 = "5178A2" + imageToHex(strScaleImageForGrayPrint) + "5178A1";
        new File(strScaleImageForGrayPrint).delete();
        return str4;
    }

    public String getBitMapHex_v5g(Bitmap bitmap, String str, boolean z, boolean z2, float f, boolean z3, boolean z4) {
        return z ? bq95V2GrayHexWithCompress(bitmap, str, z2, f, z3, z4) : bq95V2DotHex(bitmap, str);
    }

    public String getBitMapHex_v5m(Bitmap bitmap) {
        int i;
        StringBuilder sb = new StringBuilder();
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int[] iArr = new int[width * height];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        Log.i(TAG, "getBitMapHex_v5m bitmap_height: " + height);
        int i2 = 0;
        int i3 = 0;
        while (i2 < height) {
            StringBuilder sb2 = new StringBuilder();
            int i4 = 0;
            while (i4 < 2 && (i = i2 + i4) < height) {
                int i5 = i * width;
                int iCeil = (int) Math.ceil(width / 8.0f);
                int i6 = 0;
                while (i6 < iCeil) {
                    StringBuilder sb3 = new StringBuilder();
                    int i7 = 7;
                    while (i7 >= 0) {
                        sb3.append(String.valueOf((int) px2Byte(i5 + (i6 * 8) + i7, i5 + width, iArr)));
                        i7--;
                        i2 = i2;
                    }
                    int i8 = i2;
                    String hexString = Integer.toHexString(Integer.parseInt(sb3.reverse().toString(), 2));
                    int length = hexString.length();
                    for (int i9 = 2; length < i9; i9 = 2) {
                        hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
                        length++;
                    }
                    sb2.append(hexString);
                    i6++;
                    i2 = i8;
                }
                i4++;
                i2 = i2;
            }
            int i10 = i2;
            for (int length2 = sb2.length(); length2 < 192; length2++) {
                sb2.append(WXInstanceApm.VALUE_ERROR_CODE_DEFAULT);
            }
            String hexString2 = Integer.toHexString(i3);
            for (int length3 = hexString2.length(); length3 < 4; length3++) {
                hexString2 = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString2;
            }
            i3++;
            sb.append("55");
            sb.append(hexString2);
            sb.append((CharSequence) sb2);
            sb.append("00");
            i2 = i10 + 2;
        }
        sb.append("5A04");
        String hexString3 = Integer.toHexString(i3);
        for (int length4 = hexString3.length(); length4 < 4; length4++) {
            hexString3 = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString3;
        }
        sb.append(hexString3);
        sb.append("01");
        Log.i(TAG, "getBitMapHex_v5m: height" + height);
        Log.i(TAG, "getBitMapHex_v5m: total_package" + hexString3);
        sb.insert(0, "5A04" + hexString3 + "00");
        return sb.toString().toUpperCase();
    }

    public HexInfo getBitMapHex_v5x(Bitmap bitmap, boolean z, boolean z2, boolean z3, boolean z4, float f, boolean z5) {
        return z4 ? z ? getBitMapHexForV5xGrayPrintOfSeriaPort(bitmap, z2, z3) : getBitMapHexForV5xDotPrintOfSeriaPort(bitmap) : z ? getBitMapHexForV5xGrayPrint(bitmap, z2, z3, f, z5) : getBitMapHexForV5xDotPrint(bitmap);
    }

    public String getBitMapHex_v7s(Bitmap bitmap, String str) {
        System.out.println("w:" + bitmap.getWidth() + ", h:" + bitmap.getHeight());
        StringBuilder sb = new StringBuilder("1D763000");
        sb.append(Integer.toHexString(bitmap.getWidth() / 8) + "00");
        String hexString = Integer.toHexString(bitmap.getHeight());
        for (int length = hexString.length(); length < 4; length++) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        sb.append(hexString.substring(hexString.length() - 2, hexString.length()) + hexString.substring(0, 2));
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int i = width * height;
        Log.i(TAG, "width:" + width + ", height:" + height + "; size=" + i + "," + bitmap.getConfig());
        int[] iArr = new int[i];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        for (int i2 = 0; i2 < bitmap.getHeight(); i2++) {
            int i3 = i2 * width;
            for (int i4 = 0; i4 < Math.ceil(bitmap.getWidth() / 8.0f); i4++) {
                byte bPx2Byte = 0;
                for (int i5 = 0; i5 < 8; i5++) {
                    bPx2Byte = (byte) (bPx2Byte + px2Byte((i4 * 8) + i3 + i5, i3 + width, iArr) + bPx2Byte);
                }
                sb.append(byteToHex(bPx2Byte));
            }
        }
        return sb.toString();
    }

    public String getBitMapHex_v8(Bitmap bitmap, String str) {
        float f;
        System.out.println("w:" + bitmap.getWidth() + ", h:" + bitmap.getHeight());
        StringBuilder sb = str.equals(Constants.CodeCache.SAVE_PATH) ? new StringBuilder("1D8230006800") : new StringBuilder("1D823000A000");
        String hexString = Integer.toHexString(bitmap.getHeight());
        for (int length = hexString.length(); length < 4; length++) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        sb.append(hexString.substring(hexString.length() - 2, hexString.length()) + hexString.substring(0, 2));
        System.out.println("return_hex:" + ((Object) sb));
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int i = width * height;
        Log.i(TAG, "width:" + width + ", height:" + height + "; size=" + i + "," + bitmap.getConfig());
        int[] iArr = new int[i];
        Log.i(TAG, "bitmap_pixel success");
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        Log.i(TAG, "bitmap_pixel success 2");
        for (int i2 = 0; i2 < bitmap.getHeight(); i2++) {
            int i3 = i2 * width;
            int i4 = 0;
            while (true) {
                if (i4 >= Math.ceil(bitmap.getWidth() / 8.0f)) {
                    break;
                }
                byte bPx2Byte = 0;
                for (int i5 = 0; i5 < 8; i5++) {
                    bPx2Byte = (byte) (bPx2Byte + px2Byte((i4 * 8) + i3 + i5, i3 + width, iArr) + bPx2Byte);
                }
                sb.append(byteToHex(bPx2Byte));
                i4++;
            }
            int i6 = str.equals(Constants.CodeCache.SAVE_PATH) ? 104 : Opcodes.IF_ICMPNE;
            int i7 = 0;
            for (f = 8.0f; i7 < ((double) i6) - Math.ceil(bitmap.getWidth() / f); f = 8.0f) {
                sb.append(byteToHex((byte) 0));
                i7++;
            }
        }
        Boolean bool = true;
        if (bool.booleanValue()) {
            int iCeil = (int) Math.ceil(sb.toString().length() / 4000.0f);
            for (int i8 = 0; i8 < iCeil; i8++) {
                if (i8 < iCeil - 1) {
                    System.out.println("n:" + i8 + ", hex:" + sb.toString().substring(i8 * 4000, (i8 + 1) * 4000));
                } else {
                    System.out.println("n:" + i8 + ", hex:" + sb.toString().substring(i8 * 4000, sb.toString().length()));
                }
            }
        }
        return sb.toString();
    }

    public String getBitmapHex_v5c(Bitmap bitmap, boolean z, boolean z2, float f, boolean z3) {
        return z ? bq95V2GrayHexWithCompress(bitmap, "V5C", z2, f, z3, false) : bq95V2DotHex(bitmap, "V5C");
    }

    public String getCheckValue(String str, String str2) {
        int i = 0;
        if ("chongcheng".equals(str) || "V5C".equals(str)) {
            byte[] bArrHexString2Bytes = ConvertUtils.hexString2Bytes(str2);
            return ConvertUtils.BinaryToHexString(new byte[]{ConvertUtils.calcCrc8(bArrHexString2Bytes, 0, bArrHexString2Bytes.length)});
        }
        if (!"chengong".equals(str)) {
            return "";
        }
        int length = str2.length() % 2 == 0 ? str2.length() / 2 : (str2.length() / 2) + 1;
        int i2 = 0;
        while (i < length) {
            int i3 = i + 2;
            i2 += Integer.parseInt(str2.substring(i, Math.min(i3, str2.length())), 16);
            i = i3;
        }
        String hexString = Integer.toHexString(i2);
        if (hexString.length() % 2 != 0) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        return hexString.substring(hexString.length() - 2);
    }

    public String getException(Exception exc) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PrintStream printStream = new PrintStream(byteArrayOutputStream);
        exc.printStackTrace(printStream);
        String str = new String(byteArrayOutputStream.toByteArray());
        printStream.close();
        try {
            byteArrayOutputStream.close();
        } catch (Exception unused) {
        }
        return str;
    }

    /* JADX WARN: Removed duplicated region for block: B:46:0x00d2  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public android.graphics.Bitmap getFlyodBitmap(android.graphics.Bitmap r8) {
        /*
            Method dump skipped, instruction units count: 235
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.xyz.yintibao.OpencvUtilsWXModule.getFlyodBitmap(android.graphics.Bitmap):android.graphics.Bitmap");
    }

    public Bitmap getFlyodBitmapNew(Bitmap bitmap, float f) {
        if (this.isInitDebug) {
            try {
                Mat mat = new Mat(bitmap.getHeight(), bitmap.getWidth(), CvType.CV_8UC3);
                Utils.bitmapToMat(bitmap, mat);
                Mat mat2 = new Mat();
                Imgproc.cvtColor(mat, mat2, 10);
                Mat matBlurWithGuas = ProcessPictures.blurWithGuas(mat2);
                if (f == -1.0f) {
                    f = ProcessPictures.getChecksumsForGamma(matBlurWithGuas);
                }
                Mat matSharpImage = ProcessPictures.sharpImage(ProcessPictures.equalizeHistogram(ProcessPictures.enhancedImage(ProcessPictures.gammaTransformation(matBlurWithGuas, f), ProcessPictures.getEnhancedParam(r6)), 2.0d));
                Bitmap bitmapSierraDithering = SierraDithering(matSharpImage);
                mat.release();
                matBlurWithGuas.release();
                matSharpImage.release();
                return bitmapSierraDithering;
            } catch (Exception unused) {
            }
        }
        return bitmap;
    }

    public String getFrameLenthOfHex(int i) {
        String hexString = Integer.toHexString(i / 2);
        for (int length = hexString.length(); length < 4; length++) {
            hexString = WXInstanceApm.VALUE_ERROR_CODE_DEFAULT + hexString;
        }
        return hexString.substring(hexString.length() - 2) + hexString.substring(0, 2);
    }

    public String getMXW010GrayHex(Bitmap bitmap) {
        Mat mat = new Mat(bitmap.getHeight(), bitmap.getWidth(), CvType.CV_8UC3);
        Utils.bitmapToMat(bitmap, mat);
        Mat mat2 = new Mat();
        Imgproc.cvtColor(mat, mat2, 10);
        Bitmap bitmapMatToBitmap = matToBitmap(mat2);
        int width = bitmapMatToBitmap.getWidth();
        int height = bitmapMatToBitmap.getHeight();
        int[] iArr = new int[width * height];
        bitmapMatToBitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < height; i++) {
            StringBuilder sb2 = new StringBuilder();
            int i2 = i * width;
            for (int i3 = 0; i3 < width; i3++) {
                sb2.append(byteToHex((byte) (Color.blue(iArr[i2 + i3]) & 255)));
            }
            sb.append("5178C0008001");
            sb.append(sb2.toString());
            byte[] bArrHexString2Bytes = ConvertUtils.hexString2Bytes(sb2.toString());
            sb.append(ConvertUtils.BinaryToHexString(new byte[]{ConvertUtils.calcCrc8(bArrHexString2Bytes, 0, bArrHexString2Bytes.length)}));
            sb.append("FF");
        }
        mat.release();
        mat2.release();
        return sb.toString().toUpperCase();
    }

    public Bitmap getP7Bimap(String str, String str2) {
        return getP7Bimap(str, str2, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, true, false);
    }

    public Bitmap getP7Bimap(String str, String str2, int i, boolean z, boolean z2) {
        Bitmap bitmapImagePathToBitmap = imagePathToBitmap(str, false);
        float height = bitmapImagePathToBitmap.getHeight() / bitmapImagePathToBitmap.getWidth();
        int i2 = (int) (i * height);
        if (z2 && i2 > 4000) {
            i = Math.round(4000 / height);
            i2 = 4000;
        }
        Bitmap bitmapResize = resize(bitmapImagePathToBitmap, i, i2);
        if (str2.equals("image")) {
            bitmapResize = z ? getFlyodBitmapNew(bitmapResize, -1.0f) : getFlyodBitmap(bitmapResize);
        } else if (str2.equals("text")) {
            bitmapResize = adaptiveThreshold(bitmapResize);
        }
        if (bitmapResize.getConfig() == Bitmap.Config.ARGB_8888) {
            return bitmapResize;
        }
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(bitmapResize.getWidth(), bitmapResize.getHeight(), Bitmap.Config.ARGB_8888);
        new Canvas(bitmapCreateBitmap).drawBitmap(bitmapResize, 0.0f, 0.0f, new Paint(1));
        bitmapResize.recycle();
        return bitmapCreateBitmap;
    }

    public Bitmap getScaleBitmap(Bitmap bitmap, double d2, int i, int i2, int i3) {
        int width = bitmap.getWidth();
        int i4 = (int) (((double) width) * d2);
        int height = (bitmap.getHeight() * i4) / width;
        int i5 = (width - i4) / 2;
        Bitmap bitmapResize = resize(bitmap, i4, height);
        Mat mat = new Mat(height + i2 + i3, i, CvType.CV_8UC4, new Scalar(255.0d, 255.0d, 255.0d, 255.0d));
        Bitmap bitmapMatToBitmap = matToBitmap(mat);
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(bitmapMatToBitmap.getWidth(), bitmapMatToBitmap.getHeight(), bitmapMatToBitmap.getConfig());
        Canvas canvas = new Canvas(bitmapCreateBitmap);
        canvas.drawBitmap(bitmapMatToBitmap, new Matrix(), null);
        canvas.drawBitmap(bitmapResize, i5, i2, (Paint) null);
        mat.release();
        return bitmapCreateBitmap;
    }

    public Bitmap getScaleBitmap(Bitmap bitmap, int i, int i2, int i3) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        Mat mat = new Mat(height + i3, i, CvType.CV_8UC4, new Scalar(255.0d, 255.0d, 255.0d, 255.0d));
        Bitmap bitmapMatToBitmap = matToBitmap(mat);
        Log.i(TAG, "getConfig" + bitmapMatToBitmap.getConfig());
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(bitmapMatToBitmap.getWidth(), bitmapMatToBitmap.getHeight(), bitmapMatToBitmap.getConfig());
        Bitmap bitmapResize = resize(bitmap, width, height);
        Canvas canvas = new Canvas(bitmapCreateBitmap);
        canvas.drawBitmap(bitmapMatToBitmap, new Matrix(), null);
        canvas.drawBitmap(bitmapResize, i2, i3, (Paint) null);
        mat.release();
        return bitmapCreateBitmap;
    }

    @JSMethod(uiThread = false)
    public void getV5GSpeedPageCmd(JSONObject jSONObject, JSCallback jSCallback) {
        String[] strArrSplit = (jSONObject.containsKey("cmd_text") ? jSONObject.getString("cmd_text") : "81, 120, -95, 0, 2, 0, 48, 0, 0, 0").split(",");
        byte[] bArr = new byte[strArrSplit.length];
        for (int i = 0; i < strArrSplit.length; i++) {
            bArr[i] = Integer.valueOf(strArrSplit[i].trim()).byteValue();
        }
        String feedPage = V5gCMD.getFeedPage(200, bArr);
        JSONObject jSONObject2 = new JSONObject();
        jSONObject2.put("code", (Object) 0);
        jSONObject2.put("version", (Object) this.version);
        jSONObject2.put("hex_cmd", (Object) feedPage);
        this.jsCallback.invoke(jSONObject2);
    }

    @JSMethod(uiThread = false)
    public void getV5gCRC8CMD(JSONObject jSONObject, JSCallback jSCallback) {
        JSONObject jSONObject2 = new JSONObject();
        String string = jSONObject.containsKey("cmd_text") ? jSONObject.getString("cmd_text") : "81, 120, -95, 0, 2, 0, 48, 0, 0, 0";
        int iIntValue = jSONObject.containsKey("offset") ? jSONObject.getInteger("offset").intValue() : 6;
        int iIntValue2 = jSONObject.containsKey("len") ? jSONObject.getInteger("len").intValue() : 2;
        String strTrim = string.trim();
        if (strTrim.length() == 0) {
            jSONObject2.put("code", (Object) (-1));
        }
        String[] strArrSplit = strTrim.split(",");
        byte[] bArr = new byte[strArrSplit.length];
        for (int i = 0; i < strArrSplit.length; i++) {
            bArr[i] = Integer.valueOf(strArrSplit[i].trim()).byteValue();
        }
        String crc8CMD = V5gCMD.getCrc8CMD(bArr, iIntValue, iIntValue2);
        jSONObject2.put("version", (Object) this.version);
        jSONObject2.put("hex_cmd", (Object) crc8CMD);
        this.jsCallback.invoke(jSONObject2);
    }

    @JSMethod(uiThread = false)
    public void grayFilter(JSONObject jSONObject, JSCallback jSCallback) {
        Mat mat;
        Bitmap bitmapImagePathToBitmap;
        this.jsCallback = jSCallback;
        JSONObject jSONObject2 = new JSONObject();
        String string = jSONObject.getString("image_path");
        Mat mat2 = new Mat();
        Mat mat3 = new Mat();
        try {
            bitmapImagePathToBitmap = imagePathToBitmap(string, true);
            mat = new Mat(bitmapImagePathToBitmap.getHeight(), bitmapImagePathToBitmap.getWidth(), CvType.CV_8UC3);
        } catch (Exception e2) {
            e = e2;
        }
        try {
            Utils.bitmapToMat(bitmapImagePathToBitmap, mat);
            Imgproc.cvtColor(mat, mat3, 10);
            int width = bitmapImagePathToBitmap.getWidth();
            int height = bitmapImagePathToBitmap.getHeight();
            Bitmap bitmapCreateBitmap = mat3.channels() == 3 ? Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565) : Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(mat3, bitmapCreateBitmap);
            String strSave_image = save_image(bitmapCreateBitmap);
            bitmapCreateBitmap.recycle();
            bitmapImagePathToBitmap.recycle();
            if (strSave_image == null || strSave_image.isEmpty()) {
                jSONObject2.put("code", (Object) (-1));
            } else {
                jSONObject2.put("code", (Object) 0);
                jSONObject2.put("image", (Object) strSave_image);
            }
        } catch (Exception e3) {
            e = e3;
            mat2 = mat;
            jSONObject2.put("code", (Object) (-1));
            jSONObject2.put(NotificationCompat.CATEGORY_MESSAGE, (Object) e.toString());
            mat = mat2;
        }
        mat.release();
        mat3.release();
        jSONObject2.put("version", (Object) this.version);
        jSCallback.invoke(jSONObject2);
    }

    public int grayValueFor16(int i) {
        if (i <= 16) {
            return 16;
        }
        if (i > 16 && i <= 32) {
            return 32;
        }
        if (i > 32 && i <= 48) {
            return 48;
        }
        if (i > 48 && i <= 64) {
            return 64;
        }
        if (i > 64 && i <= 80) {
            return 80;
        }
        if (i > 80 && i <= 96) {
            return 96;
        }
        if (i > 96 && i <= 112) {
            return 112;
        }
        if (i > 112 && i <= 128) {
            return 128;
        }
        if (i > 128 && i <= 144) {
            return IjkMediaMeta.FF_PROFILE_H264_HIGH_444;
        }
        if (i > 144 && i <= 160) {
            return Opcodes.IF_ICMPNE;
        }
        if (i > 160 && i <= 176) {
            return 176;
        }
        if (i > 176 && i <= 182) {
            return Opcodes.INVOKEVIRTUAL;
        }
        if (i > 182 && i <= 198) {
            return Opcodes.IFNULL;
        }
        if (i > 198 && i <= 214) {
            return 214;
        }
        if (i <= 214 || i > 230) {
            return (i <= 230 || i > 246) ? i > 246 ? 255 : 0 : HebrewProber.NORMAL_TSADI;
        }
        return 230;
    }

    @JSMethod(uiThread = false)
    public void handleImage(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        String string = jSONObject.getString("image_path");
        String lowerCase = jSONObject.containsKey("model") ? jSONObject.getString("model").toLowerCase() : "v5";
        String string2 = jSONObject.containsKey("print_mode") ? jSONObject.getString("print_mode") : "text";
        double dDoubleValue = jSONObject.containsKey("scale") ? jSONObject.getDouble("scale").doubleValue() : 1.0d;
        int iIntValue = jSONObject.containsValue("bottom") ? jSONObject.getInteger("bottom").intValue() : 0;
        int iIntValue2 = jSONObject.containsKey("top") ? jSONObject.getInteger("top").intValue() : 0;
        Boolean boolValueOf = Boolean.valueOf(jSONObject.containsKey("needDither") ? jSONObject.getBoolean("needDither").booleanValue() : false);
        int iIntValue3 = jSONObject.containsKey("modified_px") ? jSONObject.getInteger("modified_px").intValue() : 0;
        int i = ("v5x".equals(lowerCase) || "v5g".equals(lowerCase) || lowerCase.equals("v6") || lowerCase.equals("v5") || lowerCase.equals("v5n")) ? BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT : ("v5gpro".equals(lowerCase) || lowerCase.equals("v6pro") || lowerCase.equals("v5pro") || lowerCase.equals("v5npro")) ? 576 : (lowerCase.equals("v8s") || lowerCase.equals("v8spro") || lowerCase.equals("v7") || lowerCase.equals("v7pro") || lowerCase.equals(Constants.CodeCache.SAVE_PATH) || lowerCase.equals("v8pro") || lowerCase.equals("v10") || lowerCase.equals("v10g") || lowerCase.equals("v7s") || lowerCase.equals("v7spro")) ? iIntValue3 : 0;
        if (!"v5g".equals(lowerCase) || iIntValue3 == 0) {
            iIntValue3 = i;
        }
        Bitmap bitmapImagePathToBitmap = imagePathToBitmap(string, true);
        if (bitmapImagePathToBitmap.getWidth() != iIntValue3) {
            bitmapImagePathToBitmap = resize(bitmapImagePathToBitmap, iIntValue3, (bitmapImagePathToBitmap.getHeight() * iIntValue3) / bitmapImagePathToBitmap.getWidth());
        }
        Bitmap scaleBitmap = getScaleBitmap(bitmapImagePathToBitmap, dDoubleValue, iIntValue3, iIntValue2, iIntValue);
        if (boolValueOf.booleanValue()) {
            if (string2.equals("image")) {
                scaleBitmap = getFlyodBitmap(scaleBitmap);
            } else if (string2.equals("text")) {
                scaleBitmap = adaptiveThreshold(scaleBitmap);
            }
        }
        String strSave_image = save_image(scaleBitmap);
        scaleBitmap.recycle();
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        jSCallback.invoke(jSONObject2);
    }

    @JSMethod(uiThread = false)
    public void handleImageWithoutModel(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        String string = jSONObject.getString("image_path");
        boolean zContainsKey = jSONObject.containsKey("bg_width");
        int iIntValue = BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT;
        int iIntValue2 = zContainsKey ? jSONObject.getInteger("bg_width").intValue() : 384;
        if (jSONObject.containsKey("dst_width")) {
            iIntValue = jSONObject.getInteger("dst_width").intValue();
        }
        int iIntValue3 = jSONObject.containsKey("dst_height") ? jSONObject.getInteger("dst_height").intValue() : 50;
        int iIntValue4 = jSONObject.containsKey("top") ? jSONObject.getInteger("top").intValue() : 0;
        int iIntValue5 = jSONObject.containsKey("left") ? jSONObject.getInteger("left").intValue() : 0;
        int iIntValue6 = jSONObject.containsKey("bottom") ? jSONObject.getInteger("bottom").intValue() : 0;
        Bitmap bitmapImagePathToBitmap = imagePathToBitmap(string, true);
        int width = bitmapImagePathToBitmap.getWidth();
        int height = bitmapImagePathToBitmap.getHeight();
        if (width != iIntValue || height != iIntValue3) {
            bitmapImagePathToBitmap = resize(bitmapImagePathToBitmap, iIntValue, iIntValue3);
        }
        Mat mat = new Mat(iIntValue3 + iIntValue4 + iIntValue6, iIntValue2, CvType.CV_8UC4, new Scalar(255.0d, 255.0d, 255.0d, 255.0d));
        Bitmap bitmapMatToBitmap = matToBitmap(mat);
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(bitmapMatToBitmap.getWidth(), bitmapMatToBitmap.getHeight(), bitmapMatToBitmap.getConfig());
        Canvas canvas = new Canvas(bitmapCreateBitmap);
        canvas.drawBitmap(bitmapMatToBitmap, new Matrix(), null);
        canvas.drawBitmap(bitmapImagePathToBitmap, iIntValue5, iIntValue4, (Paint) null);
        mat.release();
        String strSave_image = save_image(bitmapCreateBitmap);
        bitmapMatToBitmap.recycle();
        bitmapCreateBitmap.recycle();
        bitmapImagePathToBitmap.recycle();
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        jSCallback.invoke(jSONObject2);
    }

    public Bitmap handlerForV10GManHeight(Bitmap bitmap, int i) {
        if (bitmap.getHeight() <= i) {
            return bitmap;
        }
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int i2 = (width * i) / height;
        new Rect(0, 0, width, height);
        Rect rect = new Rect(0, 0, i2, i);
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(i2, i, Bitmap.Config.ARGB_8888);
        bitmapCreateBitmap.eraseColor(-1);
        new Canvas(bitmapCreateBitmap).drawBitmap(bitmap, (Rect) null, rect, (Paint) null);
        return bitmapCreateBitmap;
    }

    /* JADX WARN: Removed duplicated region for block: B:173:0x03a5  */
    /* JADX WARN: Removed duplicated region for block: B:234:0x0499  */
    /* JADX WARN: Removed duplicated region for block: B:277:0x058a  */
    /* JADX WARN: Removed duplicated region for block: B:279:0x0592  */
    /* JADX WARN: Removed duplicated region for block: B:315:0x066e  */
    /* JADX WARN: Removed duplicated region for block: B:318:0x06b9  */
    @com.taobao.weex.annotation.JSMethod(uiThread = false)
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public void hex(com.alibaba.fastjson.JSONObject r52, com.taobao.weex.bridge.JSCallback r53) {
        /*
            Method dump skipped, instruction units count: 1765
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.xyz.yintibao.OpencvUtilsWXModule.hex(com.alibaba.fastjson.JSONObject, com.taobao.weex.bridge.JSCallback):void");
    }

    @JSMethod(uiThread = false)
    public void hexForV10GHBPrints(JSONObject jSONObject, JSCallback jSCallback) {
        double d2;
        int i;
        int height;
        this.jsCallback = jSCallback;
        JSONArray array = JSON.parseArray(jSONObject.getString("images_path"));
        String lowerCase = jSONObject.getString("model").toLowerCase();
        String string = jSONObject.getString("print_mode");
        double dDoubleValue = jSONObject.getDouble("scale").doubleValue();
        int iIntValue = jSONObject.getInteger("left").intValue();
        int iIntValue2 = jSONObject.getInteger("top").intValue();
        int iIntValue3 = jSONObject.getInteger("rotate").intValue();
        boolean z = false;
        int iIntValue4 = jSONObject.containsKey("modified_px") ? jSONObject.getInteger("modified_px").intValue() : 0;
        int iIntValue5 = jSONObject.containsKey("mixHeight") ? jSONObject.getInteger("mixHeight").intValue() : 0;
        if (iIntValue4 <= 0) {
            iIntValue4 = BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT;
        }
        StringBuilder sb = new StringBuilder();
        int i2 = 0;
        while (i2 < array.size()) {
            Bitmap bitmapImagePathToBitmap = imagePathToBitmap(array.getString(i2), z);
            if (iIntValue3 != 0) {
                bitmapImagePathToBitmap = rotateBitmap2(bitmapImagePathToBitmap, iIntValue3);
            }
            if (bitmapImagePathToBitmap.getWidth() != iIntValue4 || dDoubleValue < 1.0d) {
                d2 = dDoubleValue;
                i = i2;
                bitmapImagePathToBitmap = resize(bitmapImagePathToBitmap, (int) (((double) iIntValue4) * d2), (int) (((double) ((bitmapImagePathToBitmap.getHeight() * iIntValue4) / bitmapImagePathToBitmap.getWidth())) * d2));
            } else {
                d2 = dDoubleValue;
                i = i2;
            }
            if (d2 < 1.0d) {
                bitmapImagePathToBitmap = getScaleBitmap(bitmapImagePathToBitmap, iIntValue4, iIntValue, iIntValue2);
            }
            if (iIntValue5 > 0) {
                bitmapImagePathToBitmap = handlerForV10GManHeight(bitmapImagePathToBitmap, iIntValue5);
                if (bitmapImagePathToBitmap.getHeight() < iIntValue5 && (height = (iIntValue5 - bitmapImagePathToBitmap.getHeight()) / 2) > 0) {
                    bitmapImagePathToBitmap = addTopRightBorder(bitmapImagePathToBitmap, height, 0);
                }
            }
            if (string.equals("image")) {
                bitmapImagePathToBitmap = getFlyodBitmapNew(bitmapImagePathToBitmap, -1.0f);
            } else if (string.equals("text")) {
                bitmapImagePathToBitmap = adaptiveThreshold(bitmapImagePathToBitmap);
            }
            sb.append(getBitMapHexV10g(bitmapImagePathToBitmap, iIntValue4, lowerCase));
            sb.append("1D0C");
            bitmapImagePathToBitmap.recycle();
            i2 = i + 1;
            dDoubleValue = d2;
            z = false;
        }
        JSONObject jSONObject2 = new JSONObject();
        if (sb.length() == 0) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("hex", (Object) sb);
        }
        jSCallback.invoke(jSONObject2);
    }

    public Bitmap imagePathToBitmap(String str) {
        Mat matImread = Imgcodecs.imread(str, -1);
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(matImread.cols(), matImread.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(matImread, bitmapCreateBitmap);
        matImread.release();
        return bitmapCreateBitmap;
    }

    public Bitmap imagePathToBitmap(String str, boolean z) {
        if (str.substring(0, 4).equals("http")) {
            str = save_url(str);
        }
        debug("image_path:", str);
        Mat matImread = null;
        try {
            matImread = Imgcodecs.imread(str, 1);
            debug("opencv init success", "");
        } catch (ArithmeticException e2) {
            debug("exception:", getException(e2));
        } catch (Exception e3) {
            String exception = getException(e3);
            debug("exception:", exception);
            Log.i(TAG, "exception: " + exception);
        }
        if (z) {
            Imgproc.cvtColor(matImread, matImread, 7);
        } else {
            Imgproc.cvtColor(matImread, matImread, 4);
        }
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(matImread.cols(), matImread.rows(), Bitmap.Config.RGB_565);
        Utils.matToBitmap(matImread, bitmapCreateBitmap);
        matImread.release();
        return bitmapCreateBitmap;
    }

    @JSMethod(uiThread = false)
    public void index(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        String string = jSONObject.getString("image_path");
        String string2 = jSONObject.getString("print_mode");
        int iIntValue = jSONObject.containsKey("deg") ? jSONObject.getInteger("deg").intValue() : 0;
        int iIntValue2 = jSONObject.containsKey("width") ? jSONObject.getInteger("width").intValue() : 0;
        int iIntValue3 = jSONObject.containsKey("height") ? jSONObject.getInteger("height").intValue() : 0;
        boolean zBooleanValue = jSONObject.containsKey("textModelPrehandle") ? jSONObject.getBoolean("textModelPrehandle").booleanValue() : false;
        float floatValue = jSONObject.containsKey("gammaValue") ? jSONObject.getFloatValue("gammaValue") : -1.0f;
        int iIntValue4 = jSONObject.containsKey("binaryValue") ? jSONObject.getInteger("binaryValue").intValue() : 127;
        boolean zBooleanValue2 = jSONObject.containsKey("use_new_dither_flag") ? jSONObject.getBoolean("use_new_dither_flag").booleanValue() : false;
        boolean zBooleanValue3 = jSONObject.containsKey("textPrint") ? jSONObject.getBoolean("textPrint").booleanValue() : false;
        debug("jsondata", jSONObject.toString());
        Bitmap bitmapImagePathToBitmap = imagePathToBitmap(string, true);
        if (iIntValue != 0) {
            bitmapImagePathToBitmap = rotateBitmap2(bitmapImagePathToBitmap, iIntValue);
        }
        if (iIntValue2 > 0 && iIntValue3 > 0) {
            bitmapImagePathToBitmap = resize(bitmapImagePathToBitmap, iIntValue2, iIntValue3);
        }
        if (string2.equals("image")) {
            bitmapImagePathToBitmap = zBooleanValue2 ? getFlyodBitmapNew(bitmapImagePathToBitmap, -1.0f) : getFlyodBitmap(bitmapImagePathToBitmap);
        } else if (string2.equals("text")) {
            bitmapImagePathToBitmap = zBooleanValue ? adaptiveThresholdNew(bitmapImagePathToBitmap, floatValue) : zBooleanValue3 ? adaptiveThresholdText(bitmapImagePathToBitmap) : adaptiveThreshold(bitmapImagePathToBitmap);
        } else if (string2.equals(Constants.Value.ORIGINAL)) {
            bitmapImagePathToBitmap = threshold(bitmapImagePathToBitmap);
        } else if ("label_text".equals(string2)) {
            bitmapImagePathToBitmap = fixedThreshBinary(bitmapImagePathToBitmap, iIntValue4, -1.0f);
        }
        String strSave_image = save_image(bitmapImagePathToBitmap);
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        this.jsCallback.invoke(jSONObject2);
    }

    @JSMethod(uiThread = false)
    public void initOpenCV(JSCallback jSCallback) {
        if (!this.opencvInit) {
            this.opencvInit = OpenCVLoader.initDebug();
        }
        if (jSCallback != null) {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("code", (Object) Integer.valueOf(this.opencvInit ? 0 : -1));
            jSCallback.invoke(jSONObject);
        }
    }

    public Bitmap matToBitmap(Mat mat) {
        Log.i(TAG, "matToBitmap channels" + mat.channels() + ";type:" + mat.type());
        Bitmap bitmapCreateBitmap = mat.channels() == 3 ? Bitmap.createBitmap(mat.cols(), mat.rows(), Bitmap.Config.RGB_565) : Bitmap.createBitmap(mat.cols(), mat.rows(), Bitmap.Config.ARGB_8888);
        Utils.matToBitmap(mat, bitmapCreateBitmap);
        return bitmapCreateBitmap;
    }

    @JSMethod(uiThread = false)
    public void merge(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        String string = jSONObject.getString("image_path");
        debug("img_path_arr_str", string);
        String[] strArrSplit = string.split(",");
        Bitmap bitmapMergeBitmap = null;
        int i = 0;
        while (i < strArrSplit.length) {
            debug(AbsoluteConst.XML_PATH, strArrSplit[i]);
            if (new File(strArrSplit[i]).exists()) {
                debug("file exists", strArrSplit[i]);
                Log.i(TAG, "merge: 文件存在:" + strArrSplit[i]);
            } else {
                debug("file not exists", strArrSplit[i]);
                Log.i(TAG, "merge: 文件不存在:" + strArrSplit[i]);
            }
            Bitmap bitmapImagePathToBitmap = imagePathToBitmap(strArrSplit[i], true);
            debug("imagePathToBitmap", WXModalUIModule.OK);
            bitmapMergeBitmap = i == 0 ? bitmapImagePathToBitmap : mergeBitmap(bitmapMergeBitmap, bitmapImagePathToBitmap);
            i++;
        }
        String strSave_image = save_image(bitmapMergeBitmap);
        debug("save_path", strSave_image);
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("save_path", (Object) strSave_image);
        }
        jSCallback.invoke(jSONObject2);
    }

    public Bitmap mergeBitmap(Bitmap bitmap, Bitmap bitmap2) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight() + bitmap2.getHeight();
        debug("height:", "height_1:" + bitmap.getHeight() + ",height_2:" + bitmap2.getHeight() + "");
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
        Canvas canvas = new Canvas(bitmapCreateBitmap);
        canvas.drawBitmap(bitmap, 0.0f, 0.0f, (Paint) null);
        canvas.drawBitmap(bitmap2, 0.0f, bitmap.getHeight(), (Paint) null);
        debug("合并完成", WXModalUIModule.OK);
        return bitmapCreateBitmap;
    }

    public Mat reduceBackGroundAlgorithm(Mat mat) {
        Mat mat2 = new Mat();
        Imgproc.GaussianBlur(mat, mat2, new Size(3.0d, 3.0d), 0.0d);
        Mat mat3 = new Mat();
        Imgproc.cvtColor(mat2, mat3, 11);
        mat2.release();
        Mat mat4 = new Mat();
        Mat mat5 = new Mat(3, 3, 5, new Scalar(0.0d));
        mat5.put(0, 1, -1.0d);
        mat5.put(1, 0, -1.0d);
        mat5.put(1, 2, -1.0d);
        mat5.put(2, 1, -1.0d);
        mat5.put(1, 1, 5.0d);
        Imgproc.filter2D(mat3, mat4, -1, mat5);
        mat3.release();
        mat5.release();
        Mat mat6 = new Mat();
        Imgproc.Canny(mat4, mat6, 85.0d, 255.0d);
        mat4.release();
        Mat structuringElement = Imgproc.getStructuringElement(0, new Size(3.0d, 3.0d));
        Mat mat7 = new Mat();
        Imgproc.dilate(mat6, mat7, structuringElement, new Point(-1.0d, -1.0d), 1);
        Imgproc.erode(mat7, mat7, structuringElement, new Point(-1.0d, -1.0d), 1);
        Imgproc.dilate(mat7, mat7, structuringElement, new Point(-1.0d, -1.0d), 1);
        mat6.release();
        structuringElement.release();
        Mat mat8 = new Mat();
        Mat mat9 = new Mat();
        Mat mat10 = new Mat();
        Mat mat11 = new Mat();
        Mat mat12 = new Mat();
        Mat mat13 = new Mat();
        Imgproc.blur(mat, mat8, new Size(101.0d, 101.0d));
        Core.addWeighted(mat8, 0.5d, mat, 0.5d, 0.0d, mat9);
        mat8.copyTo(mat9, mat7);
        mat7.release();
        mat8.release();
        Imgproc.GaussianBlur(mat9, mat9, new Size(3.0d, 3.0d), 0.0d);
        mat9.convertTo(mat11, CvType.CV_32FC3, 0.003921568859368563d);
        mat9.release();
        mat.convertTo(mat10, CvType.CV_32FC3, 0.003921568859368563d);
        Core.divide(mat10, mat11, mat12);
        mat10.release();
        mat11.release();
        mat12.convertTo(mat13, CvType.CV_8UC3, 255.0d);
        mat12.release();
        return mat13;
    }

    public Bitmap resize(Bitmap bitmap, int i, int i2) {
        if (bitmap == null || bitmap.isRecycled()) {
            return bitmap;
        }
        Mat matBitmapToMat = bitmapToMat(bitmap);
        Mat mat = new Mat();
        Imgproc.resize(matBitmapToMat, mat, new Size(i, i2));
        Bitmap bitmapMatToBitmap = matToBitmap(mat);
        matBitmapToMat.release();
        mat.release();
        return bitmapMatToBitmap;
    }

    @JSMethod(uiThread = false)
    public void rotate(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        debug("rotate", "start");
        debug("jsondata", jSONObject.toString());
        String strSave_image = save_image(rotateBitmap2(imagePathToBitmap(jSONObject.getString("image_path"), jSONObject.containsKey("need_convert_color") ? jSONObject.getBoolean("need_convert_color").booleanValue() : true), jSONObject.getInteger("rotate_deg").intValue()));
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        jSCallback.invoke(jSONObject2);
    }

    public Bitmap rotateBitmap2(Bitmap bitmap, int i) {
        if (i < 0) {
            i += 360;
        }
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        Matrix matrix = new Matrix();
        float f = width;
        float f2 = height;
        matrix.setRotate(i, f / 2.0f, f2 / 2.0f);
        float f3 = 0.0f;
        if (i == 90) {
            height = width;
            width = height;
            f = f2;
        } else if (i == 270) {
            height = width;
            width = height;
            f3 = f;
            f = 0.0f;
        } else {
            if (i != 180) {
                return bitmap;
            }
            f3 = f2;
        }
        float[] fArr = new float[9];
        matrix.getValues(fArr);
        matrix.postTranslate(f - fArr[2], f3 - fArr[5]);
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
        new Canvas(bitmapCreateBitmap).drawBitmap(bitmap, matrix, new Paint());
        return bitmapCreateBitmap;
    }

    public String save_image(Bitmap bitmap) {
        String str = this.mWXSDKInstance.getContext().getExternalCacheDir().toString() + "/images";
        try {
            File file = new File(str);
            if (!file.exists()) {
                file.mkdirs();
            }
            File file2 = new File(str, System.currentTimeMillis() + ".jpg");
            Mat matBitmapToMat = bitmapToMat(bitmap);
            Imgproc.cvtColor(matBitmapToMat, matBitmapToMat, 4);
            Imgcodecs.imwrite(file2.getAbsolutePath(), matBitmapToMat);
            matBitmapToMat.release();
            return file2.getAbsolutePath();
        } catch (Exception e2) {
            e2.printStackTrace();
            return null;
        }
    }

    public String save_image(Bitmap bitmap, String str) {
        String str2 = this.mWXSDKInstance.getContext().getExternalCacheDir().toString() + "/images";
        try {
            File file = new File(str2);
            if (!file.exists()) {
                file.mkdirs();
            }
            File file2 = new File(str2, System.currentTimeMillis() + Operators.DOT_STR + str);
            Mat matBitmapToMat = bitmapToMat(bitmap);
            Imgproc.cvtColor(matBitmapToMat, matBitmapToMat, 7);
            Imgcodecs.imwrite(file2.getAbsolutePath(), matBitmapToMat);
            matBitmapToMat.release();
            return file2.getAbsolutePath();
        } catch (Exception e2) {
            e2.printStackTrace();
            return null;
        }
    }

    public String save_image(int[][] iArr) {
        String str = this.mWXSDKInstance.getContext().getExternalCacheDir().toString() + "/images";
        try {
            File file = new File(str);
            if (!file.exists()) {
                file.mkdirs();
            }
            int length = iArr[0].length;
            int length2 = iArr.length;
            Bitmap bitmapCreateBitmap = Bitmap.createBitmap(length, length2, Bitmap.Config.ARGB_8888);
            Canvas canvas = new Canvas(bitmapCreateBitmap);
            Paint paint = new Paint();
            for (int i = 0; i < length2; i++) {
                for (int i2 = 0; i2 < length; i2++) {
                    paint.setColor(iArr[i][i2] == 0 ? -1 : -16777216);
                    paint.setAntiAlias(false);
                    paint.setFilterBitmap(false);
                    paint.setDither(false);
                    canvas.drawPoint(i2, i, paint);
                }
            }
            File file2 = new File(str, System.currentTimeMillis() + ".jpg");
            try {
                FileOutputStream fileOutputStream = new FileOutputStream(file2);
                try {
                    bitmapCreateBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fileOutputStream);
                    Log.i(TAG, "save_image: " + file2.getAbsolutePath());
                    fileOutputStream.close();
                    return null;
                } catch (Throwable th) {
                    try {
                        fileOutputStream.close();
                    } catch (Throwable th2) {
                        th.addSuppressed(th2);
                    }
                    throw th;
                }
            } catch (IOException e2) {
                e2.printStackTrace();
                return null;
            }
        } catch (Exception e3) {
            e3.printStackTrace();
            return null;
        }
    }

    public String save_url(String str) {
        Bitmap bitmapDecodeStream;
        try {
            HttpURLConnection httpURLConnection = (HttpURLConnection) new URL(str).openConnection();
            httpURLConnection.setDoInput(true);
            httpURLConnection.connect();
            bitmapDecodeStream = BitmapFactory.decodeStream(httpURLConnection.getInputStream());
        } catch (MalformedURLException e2) {
            e2.printStackTrace();
            bitmapDecodeStream = null;
        } catch (IOException e3) {
            e3.printStackTrace();
            bitmapDecodeStream = null;
        }
        return save_image(bitmapDecodeStream);
    }

    public Bitmap threshold(Bitmap bitmap) {
        return !this.isInitDebug ? bitmap : threshold(bitmapToMat(bitmap));
    }

    public Bitmap threshold(Mat mat) {
        Bitmap bitmapCreateBitmap;
        Log.i(TAG, "threshold Mat");
        if (!this.isInitDebug) {
            return null;
        }
        Mat mat2 = new Mat();
        Imgproc.cvtColor(mat, mat2, 6);
        MatOfDouble matOfDouble = new MatOfDouble();
        MatOfDouble matOfDouble2 = new MatOfDouble();
        Core.meanStdDev(mat2, matOfDouble, matOfDouble2);
        double d2 = matOfDouble.get(0, 0)[0];
        double d3 = d2 - matOfDouble2.get(0, 0)[0];
        Log.i(TAG, "d1:" + d2 + ";d2:" + d3);
        if (d3 > 0.0d) {
            d2 = 15.0d + d3;
        }
        Log.i(TAG, "d1:" + d2 + ";d2:" + d3);
        double dMin = Math.min(d2, 240.0d);
        if (dMin == 0.0d) {
            bitmapCreateBitmap = mat.channels() == 3 ? Bitmap.createBitmap(mat.cols(), mat.rows(), Bitmap.Config.RGB_565) : Bitmap.createBitmap(mat.cols(), mat.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(mat, bitmapCreateBitmap);
        } else {
            Mat mat3 = new Mat();
            Imgproc.threshold(mat2, mat3, dMin, 255.0d, 0);
            Bitmap bitmapCreateBitmap2 = mat3.channels() == 3 ? Bitmap.createBitmap(mat3.cols(), mat3.rows(), Bitmap.Config.RGB_565) : Bitmap.createBitmap(mat3.cols(), mat3.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(mat3, bitmapCreateBitmap2);
            mat3.release();
            bitmapCreateBitmap = bitmapCreateBitmap2;
        }
        matOfDouble.release();
        matOfDouble2.release();
        mat2.release();
        mat.release();
        return bitmapCreateBitmap;
    }

    @JSMethod(uiThread = false)
    public void v8sIndex(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        String string = jSONObject.getString("image_path");
        int iIntValue = jSONObject.getInteger("deg").intValue();
        int iIntValue2 = jSONObject.getInteger("width").intValue();
        int iIntValue3 = jSONObject.getInteger("height").intValue();
        debug("jsondata", jSONObject.toString());
        Bitmap bitmapImagePathToBitmap = imagePathToBitmap(string, true);
        if (iIntValue != 0) {
            bitmapImagePathToBitmap = rotateBitmap2(bitmapImagePathToBitmap, iIntValue);
        }
        String strSave_image = save_image(getFlyodBitmap(resize(bitmapImagePathToBitmap, iIntValue2, iIntValue3)), "png");
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        jSONObject2.put("version", (Object) this.version);
        this.jsCallback.invoke(jSONObject2);
    }

    @JSMethod(uiThread = false)
    public void v8sPrintImage(JSONObject jSONObject, JSCallback jSCallback) {
        this.jsCallback = jSCallback;
        debug("hex", "start");
        String string = jSONObject.getString("image_path");
        double dDoubleValue = jSONObject.getDouble("scale").doubleValue();
        int iIntValue = jSONObject.getInteger("left").intValue();
        int iIntValue2 = jSONObject.getInteger("top").intValue();
        int iIntValue3 = jSONObject.getInteger("rotate").intValue();
        int iIntValue4 = jSONObject.getInteger("modified_px").intValue();
        Bitmap bitmapImagePathToBitmap = imagePathToBitmap(string, true);
        if (iIntValue3 != 0) {
            bitmapImagePathToBitmap = rotateBitmap2(bitmapImagePathToBitmap, iIntValue3);
        }
        if (bitmapImagePathToBitmap.getWidth() != iIntValue4 || dDoubleValue < 1.0d) {
            bitmapImagePathToBitmap = resize(bitmapImagePathToBitmap, (int) (((double) iIntValue4) * dDoubleValue), (int) (((double) ((bitmapImagePathToBitmap.getHeight() * iIntValue4) / bitmapImagePathToBitmap.getWidth())) * dDoubleValue));
        }
        if (dDoubleValue < 1.0d) {
            bitmapImagePathToBitmap = getScaleBitmap(bitmapImagePathToBitmap, iIntValue4, iIntValue, iIntValue2);
        }
        Bitmap flyodBitmap = getFlyodBitmap(bitmapImagePathToBitmap);
        String strSave_image = save_image(flyodBitmap, "png");
        flyodBitmap.recycle();
        JSONObject jSONObject2 = new JSONObject();
        if (strSave_image == null || strSave_image.isEmpty()) {
            jSONObject2.put("code", (Object) (-1));
        } else {
            jSONObject2.put("code", (Object) 0);
            jSONObject2.put("image", (Object) strSave_image);
        }
        jSONObject2.put("version", (Object) this.version);
        this.jsCallback.invoke(jSONObject2);
    }
}
