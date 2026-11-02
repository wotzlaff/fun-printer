package com.xyz.yintibao.library;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Matrix;
import android.graphics.Paint;
import com.xyz.yintibao.library.PrinterModel;
import java.io.ByteArrayOutputStream;
import org.opencv.android.Utils;
import org.opencv.core.Mat;
import org.opencv.imgproc.Imgproc;

/* JADX INFO: loaded from: classes2.dex */
public class ImageUtils {
    private static ImageUtils instance;

    private ImageUtils() {
        throw new UnsupportedOperationException("u can't instantiate me...");
    }

    public static Bitmap convertGreyImgByFloyd(Bitmap bitmap) {
        if (bitmap == null) {
            throw new NullPointerException("Bitmap must not be null");
        }
        Bitmap gray = toGray(bitmap, false);
        int width = gray.getWidth();
        int height = gray.getHeight();
        int i = width * height;
        int[] iArr = new int[i];
        gray.getPixels(iArr, 0, width, 0, 0, width, height);
        int[] iArr2 = new int[i];
        for (int i2 = 0; i2 < height; i2++) {
            for (int i3 = 0; i3 < width; i3++) {
                int i4 = (width * i2) + i3;
                iArr2[i4] = Color.red(iArr[i4]);
            }
        }
        int i5 = 0;
        while (i5 < height) {
            boolean z = i5 < height + (-1);
            int i6 = 0;
            while (i6 < width) {
                boolean z2 = i6 > 0;
                boolean z3 = i6 < width + (-1);
                int i7 = width * i5;
                int i8 = i7 + i6;
                int i9 = iArr2[i8];
                if (i9 >= 128) {
                    iArr[i8] = -1;
                    i9 -= 255;
                } else {
                    iArr[i8] = -16777216;
                }
                if (z3) {
                    int i10 = i6 + 1 + i7;
                    iArr2[i10] = iArr2[i10] + ((i9 * 7) / 16);
                }
                if (z2 & z) {
                    int i11 = (i6 - 1) + ((i5 + 1) * width);
                    iArr2[i11] = iArr2[i11] + ((i9 * 3) / 16);
                }
                if (z) {
                    int i12 = ((i5 + 1) * width) + i6;
                    iArr2[i12] = iArr2[i12] + ((i9 * 5) / 16);
                }
                if (z3 && z) {
                    int i13 = i6 + 1 + ((i5 + 1) * width);
                    iArr2[i13] = iArr2[i13] + (i9 / 16);
                }
                i6++;
            }
            i5++;
        }
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
        bitmapCreateBitmap.setPixels(iArr, 0, width, 0, 0, width, height);
        return bitmapCreateBitmap;
    }

    protected static Bitmap fitBitmap(Bitmap bitmap, String str) {
        if (bitmap == null) {
            throw new NullPointerException("Bitmap must not be null");
        }
        PrinterModel.DataBean model = PrinterModel.getModel(str);
        int printSize = model.getPrintSize();
        if (model.getSize() == 8 || model.getSize() == 4) {
            printSize = (int) (((double) printSize) * 0.7d);
        }
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        Matrix matrix = new Matrix();
        float f = printSize / width;
        matrix.postScale(f, f);
        return Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
    }

    public static Bitmap getImageModelBitmap(Bitmap bitmap) {
        return convertGreyImgByFloyd(bitmap);
    }

    public static int getPrintHeight(double d2, String str) {
        if (0.0d != d2) {
            return (int) Math.ceil((d2 / ((double) PrinterModel.getModel(str).getOneLength())) / 10.0d);
        }
        throw new NullPointerException("height must not be 0");
    }

    public static int getPrintHeight(Bitmap bitmap, String str) {
        if (bitmap == null) {
            throw new NullPointerException("Bitmap must not be null");
        }
        PrinterModel.DataBean model = PrinterModel.getModel(str);
        if (bitmap.getWidth() != model.getPrintSize()) {
            bitmap = fitBitmap(bitmap, str);
        }
        if (bitmap == null) {
            return 0;
        }
        return (int) Math.ceil((((double) bitmap.getHeight()) / ((double) model.getOneLength())) / 10.0d);
    }

    protected static Bitmap printText(Bitmap bitmap, boolean z) {
        if (bitmap == null) {
            return null;
        }
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.RGB_565;
            Bitmap bitmapDecodeByteArray = BitmapFactory.decodeByteArray(byteArrayOutputStream.toByteArray(), 0, byteArrayOutputStream.size(), options);
            Mat mat = new Mat();
            Mat mat2 = new Mat();
            Utils.bitmapToMat(bitmapDecodeByteArray, mat);
            Imgproc.cvtColor(mat, mat2, 7);
            Imgproc.adaptiveThreshold(mat2, mat2, 255.0d, 1, 0, 51, 18.0d);
            Bitmap bitmapCreateBitmap = Bitmap.createBitmap(mat2.cols(), mat2.rows(), Bitmap.Config.RGB_565);
            Utils.matToBitmap(mat2, bitmapCreateBitmap);
            return bitmapCreateBitmap;
        } catch (NullPointerException | UnsatisfiedLinkError unused) {
            return bitmap;
        }
    }

    public static Bitmap printTextBitmap(Bitmap bitmap, boolean z) {
        return printText(bitmap, z);
    }

    protected static Bitmap toGray(Bitmap bitmap, boolean z) {
        if (bitmap == null) {
            throw new NullPointerException("Bitmap must not be null");
        }
        Bitmap bitmapCreateBitmap = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), bitmap.getConfig());
        Canvas canvas = new Canvas(bitmapCreateBitmap);
        Paint paint = new Paint();
        ColorMatrix colorMatrix = new ColorMatrix();
        colorMatrix.setSaturation(0.0f);
        paint.setColorFilter(new ColorMatrixColorFilter(colorMatrix));
        canvas.drawBitmap(bitmap, 0.0f, 0.0f, paint);
        if (z && !bitmap.isRecycled() && bitmapCreateBitmap != bitmap) {
            bitmap.recycle();
        }
        return bitmapCreateBitmap;
    }
}
