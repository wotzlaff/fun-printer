package com.xyz.yintibao.library;

import android.content.Context;
import android.graphics.Bitmap;
import com.google.common.base.Ascii;
import com.xyz.yintibao.library.PrinterModel;
import com.xyz.yintibao.tools.ConvertUtils;
import java.util.ArrayList;
import org.opencv.android.BaseLoaderCallback;

/* JADX INFO: loaded from: classes2.dex */
public class V5g {
    private static V5g instance;
    private static int[] p0 = {0, 128};
    private static int[] p1 = {0, 64};
    private static int[] p2 = {0, 32};
    private static int[] p3 = {0, 16};
    private static int[] p4 = {0, 8};
    private static int[] p5 = {0, 4};
    private static int[] p6 = {0, 2};
    private String bleName;
    private Context context;
    private BaseLoaderCallback mOpenCVCallback;
    private int packageLength;
    private String TAG = "V5g";
    protected byte[] quality1 = {81, 120, -92, 0, 1, 0, 49, -105, -1};
    protected byte[] quality2 = {81, 120, -92, 0, 1, 0, 50, -98, -1};
    protected byte[] quality3 = {81, 120, -92, 0, 1, 0, 51, -103, -1};
    protected byte[] quality4 = {81, 120, -92, 0, 1, 0, 52, -116, -1};
    protected byte[] quality5 = {81, 120, -92, 0, 1, 0, 53, -117, -1};
    protected byte[] paper = {81, 120, -95, 0, 2, 0, 48, 0, -7, -1};
    protected byte[] paper_300dpi = {81, 120, -95, 0, 2, 0, 72, 0, -13, -1};
    protected byte[] updateDev = {81, 120, -87, 0, 1, 0, 0, 0, -1};
    protected byte[] getDevState = {81, 120, -93, 0, 1, 0, 0, 0, -1};
    protected byte[] getDevInfo = {81, 120, -88, 0, 1, 0, 0, 0, -1};
    protected byte[] print_img = {81, 120, -66, 0, 1, 0, 0, 0, -1};
    protected byte[] print_text = {81, 120, -66, 0, 1, 0, 1, 7, -1};
    protected byte[] getDevId = {81, 120, -69, 0, 1, 0, 1, 7, -1};
    protected byte[] printLattice = {81, 120, -90, 0, Ascii.VT, 0, -86, 85, Ascii.ETB, 56, 68, 95, 95, 95, 68, 56, 44, -95, -1};
    protected byte[] finishLattice = {81, 120, -90, 0, Ascii.VT, 0, -86, 85, Ascii.ETB, 0, 0, 0, 0, 0, 0, 0, Ascii.ETB, 17, -1};
    private int TEXT_PRINT_TYPE = 0;
    private int IMG_PRINT_TYPE = 1;
    private boolean hasWriteId = false;
    private String deviceId = "";

    public V5g(String str) {
        this.bleName = str;
    }

    private byte[] bitmapToBWPix(Bitmap bitmap) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int i = width * height;
        int[] iArr = new int[i];
        byte[] bArr = new byte[i];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        for (int i2 = 0; i2 < bitmap.getHeight(); i2++) {
            for (int i3 = 0; i3 < bitmap.getWidth(); i3++) {
                int width2 = (bitmap.getWidth() * i2) + i3;
                if (iArr[width2] == -1) {
                    bArr[width2] = 0;
                } else {
                    bArr[width2] = 1;
                }
            }
        }
        return bArr;
    }

    private byte[] conver2HexToByte(String str) {
        String[] strArrSplit = str.split(",");
        int length = strArrSplit.length;
        byte[] bArr = new byte[length];
        for (int i = 0; i < length; i++) {
            bArr[i] = Long.valueOf(strArrSplit[i], 2).byteValue();
        }
        return bArr;
    }

    private void dataTrim(int i, byte b2, ArrayList<Byte> arrayList) {
        while (i > 127) {
            arrayList.add(Byte.valueOf(conver2HexToByte(((int) b2) + toBinary(127))[0]));
            i -= 127;
        }
        if (i > 0) {
            String binary = toBinary(i);
            String str = ((int) b2) + "";
            if (binary.length() < 8) {
                for (int i2 = 0; i2 < 7 - binary.length(); i2++) {
                    str = str + 0;
                }
            }
            arrayList.add(Byte.valueOf(conver2HexToByte(str + binary)[0]));
        }
    }

    private byte[] eachLinePixToCmdB(byte[] bArr, int i, int i2, int i3, int i4) {
        byte[] bArr2;
        int i5;
        byte b2;
        int length = bArr.length / i3;
        int i6 = i3 / 8;
        ArrayList arrayList = new ArrayList();
        ArrayList arrayList2 = new ArrayList();
        byte b3 = 0;
        if (i != 0) {
            bArr2 = new byte[(i3 * length) + 28];
            byte[] enerageByte = getEnerageByte(i);
            System.arraycopy(enerageByte, 0, bArr2, 0, enerageByte.length);
            i5 = 10;
            this.packageLength += 10;
        } else {
            bArr2 = new byte[(i3 * length) + 18];
            i5 = 0;
        }
        System.arraycopy(getPrintModel(i4), 0, bArr2, i5, getPrintModel(i4).length);
        int length2 = i5 + getPrintModel(i4).length;
        this.packageLength += getPrintModel(i4).length;
        byte[] printSpeed = getPrintSpeed(i2);
        System.arraycopy(printSpeed, 0, bArr2, length2, printSpeed.length);
        int i7 = length2 + 9;
        this.packageLength += 9;
        int i8 = 0;
        int i9 = 0;
        int i10 = 0;
        while (i8 < length) {
            i9 += 8;
            arrayList.clear();
            arrayList2.clear();
            arrayList.clear();
            i10 = (i10 + i3) - i3;
            arrayList.add((byte) -1);
            for (int i11 = b3; i11 < i6; i11++) {
                byte b4 = (byte) (p0[bArr[i10 + 7]] + p1[bArr[i10 + 6]] + p2[bArr[i10 + 5]] + p3[bArr[i10 + 4]] + p4[bArr[i10 + 3]] + p5[bArr[i10 + 2]] + p6[bArr[i10 + 1]] + bArr[i10]);
                i10 += 8;
                arrayList.add(Byte.valueOf(b4));
            }
            if (arrayList.size() > 0) {
                int size = arrayList.size();
                byte[] bArr3 = new byte[size];
                b2 = b3;
                for (int i12 = b2; i12 < arrayList.size(); i12++) {
                    bArr3[i12] = ((Byte) arrayList.get(i12)).byteValue();
                }
                int size2 = i9 + arrayList.size();
                Integer.toHexString(size);
                bArr2[i7] = 81;
                bArr2[i7 + 1] = 120;
                bArr2[i7 + 2] = -94;
                i9 = size2 - 1;
                String hexString = Integer.toHexString(i6);
                bArr2[i7 + 3] = b2;
                bArr2[i7 + 4] = ConvertUtils.hexString2Bytes(hexString)[b2];
                bArr2[i7 + 5] = b2;
                byte b5 = bArr3[b2];
                int i13 = i7 + 6;
                System.arraycopy(bArr3, 1, bArr2, i13, size - 1);
                bArr2[i13 + i6] = ConvertUtils.calcCrc8(bArr2, i13, i6);
                bArr2[i7 + 7 + i6] = -1;
                i7 = i7 + 8 + i6;
                this.packageLength = this.packageLength + 8 + i6;
            } else {
                b2 = b3;
            }
            i8++;
            b3 = b2;
        }
        byte b6 = b3;
        byte[] bArr4 = i != 0 ? new byte[i9 + 28] : new byte[i9 + 19];
        System.arraycopy(bArr2, b6, bArr4, b6, bArr4.length);
        return bArr4;
    }

    private void format_K_threshold(int[] iArr, int i, int i2, byte[] bArr) {
        int i3 = 0;
        int i4 = 0;
        for (int i5 = 0; i5 < i2; i5++) {
            for (int i6 = 0; i6 < i; i6++) {
                i3 += iArr[i4] & 255;
                i4++;
            }
        }
        int i7 = ((i3 / i2) / i) - 13;
        int i8 = 0;
        for (int i9 = 0; i9 < i2; i9++) {
            for (int i10 = 0; i10 < i; i10++) {
                int i11 = iArr[i8] & 255;
                if (i11 == 0) {
                    bArr[i8] = 1;
                } else if (i11 > i7) {
                    bArr[i8] = 0;
                } else {
                    bArr[i8] = 1;
                }
                i8++;
            }
        }
    }

    private byte[] getEnerageByte(int i) {
        byte[] bArr = {81, 120, -81, 0, 2, 0, ConvertUtils.hexString2Bytes(Integer.toHexString(i))[1], ConvertUtils.hexString2Bytes(Integer.toHexString(i))[0], 0, 0};
        bArr[8] = ConvertUtils.calcCrc8(bArr, 6, 2);
        bArr[9] = -1;
        return bArr;
    }

    private byte[] getPrintModel(int i) {
        if (i == 0) {
            return this.print_text;
        }
        if (1 == i) {
            return this.print_img;
        }
        return null;
    }

    private byte[] getPrintSpeed(int i) {
        byte[] bArr = {81, 120, -67, 0, 1, 0, ConvertUtils.hexString2Bytes(Integer.toHexString(i))[0], 0, 0};
        bArr[7] = ConvertUtils.calcCrc8(bArr, 6, 1);
        bArr[8] = -1;
        return bArr;
    }

    private byte[] getQuality(int i) {
        return 1 == i ? this.quality1 : 2 == i ? this.quality2 : 3 == i ? this.quality3 : 4 == i ? this.quality4 : this.quality5;
    }

    private String toBinary(int i) {
        String str = "";
        while (i != 0) {
            str = (i % 2) + str;
            i /= 2;
        }
        return str;
    }

    public String getGrayPrintData(Bitmap bitmap, int i, int i2, int i3) {
        StringBuilder sb = new StringBuilder();
        PrinterModel.DataBean printMode = getPrintMode.getPrintMode(this.bleName);
        sb.append(ConvertUtils.BinaryToHexString(getQuality(i2)));
        sb.append(ConvertUtils.BinaryToHexString(this.printLattice));
        sb.append(ConvertUtils.BinaryToHexString(getEnerageByte(i3)));
        sb.append(ConvertUtils.BinaryToHexString(getPrintModel(1)));
        sb.append(ConvertUtils.BinaryToHexString(getPrintSpeed(i)));
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int[] iArr = new int[width * height];
        bitmap.getPixels(iArr, 0, width, 0, 0, width, height);
        for (int i4 = 0; i4 < height; i4++) {
            int i5 = i4 * width;
            StringBuilder sb2 = new StringBuilder();
            for (int i6 = 0; i6 < width; i6++) {
                int i7 = iArr[i5 + i6];
                sb2.append(ConvertUtils.byteToHex((byte) ConvertUtils.RGB2Gray((16711680 & i7) >> 16, (65280 & i7) >> 8, i7 & 255)));
            }
            byte[] bArrHexString2Bytes = ConvertUtils.hexString2Bytes(sb2.toString());
            sb2.append(ConvertUtils.BinaryToHexString(new byte[]{ConvertUtils.calcCrc8(bArrHexString2Bytes, 0, bArrHexString2Bytes.length)}));
            sb2.append("FF");
            sb.append("5178A2003000");
            sb.append(sb2.toString());
        }
        for (int i8 = 0; i8 < printMode.getPaperNum(); i8++) {
            if (printMode.getDevdpi() == 300) {
                sb.append(ConvertUtils.BinaryToHexString(this.paper_300dpi));
            } else {
                sb.append(ConvertUtils.BinaryToHexString(this.paper));
            }
        }
        sb.append(ConvertUtils.BinaryToHexString(this.finishLattice));
        sb.append(ConvertUtils.BinaryToHexString(this.getDevState));
        return sb.toString();
    }

    public String getPrintData(Bitmap bitmap, int i, int i2, int i3) {
        PrinterModel.DataBean printMode = getPrintMode.getPrintMode(this.bleName);
        Bitmap bitmapFitBitmap = ImageUtils.fitBitmap(bitmap, this.bleName);
        this.packageLength = this.printLattice.length + 9;
        byte[] bArrEachLinePixToCmdB = eachLinePixToCmdB(bitmapToBWPix(bitmapFitBitmap), i3, i, bitmap.getWidth(), 1);
        byte[] bArr = new byte[bArrEachLinePixToCmdB.length + (this.paper.length * printMode.getPaperNum()) + getQuality(i2).length + this.printLattice.length + this.finishLattice.length + getPrintSpeed(25).length + this.getDevState.length];
        byte[] quality = getQuality(i2);
        System.arraycopy(quality, 0, bArr, 0, quality.length);
        int length = quality.length;
        byte[] bArr2 = this.printLattice;
        System.arraycopy(bArr2, 0, bArr, length, bArr2.length);
        int length2 = length + this.printLattice.length;
        System.arraycopy(bArrEachLinePixToCmdB, 0, bArr, length2, bArrEachLinePixToCmdB.length);
        int length3 = length2 + bArrEachLinePixToCmdB.length;
        byte[] printSpeed = getPrintSpeed(i);
        System.arraycopy(printSpeed, 0, bArr, length3, printSpeed.length);
        int length4 = length3 + printSpeed.length;
        for (int i4 = 0; i4 < printMode.getPaperNum(); i4++) {
            if (printMode.getDevdpi() == 200) {
                byte[] bArr3 = this.paper;
                System.arraycopy(bArr3, 0, bArr, length4, bArr3.length);
            } else if (printMode.getDevdpi() == 300) {
                byte[] bArr4 = this.paper_300dpi;
                System.arraycopy(bArr4, 0, bArr, length4, bArr4.length);
            } else {
                byte[] bArr5 = this.paper;
                System.arraycopy(bArr5, 0, bArr, length4, bArr5.length);
            }
            length4 += this.paper.length;
        }
        byte[] bArr6 = this.finishLattice;
        System.arraycopy(bArr6, 0, bArr, length4, bArr6.length);
        int length5 = length4 + this.finishLattice.length;
        byte[] bArr7 = this.getDevState;
        System.arraycopy(bArr7, 0, bArr, length5, bArr7.length);
        return ConvertUtils.BinaryToHexString(bArr);
    }
}
