package com.xyz.yintibao.library;

import com.facebook.imagepipeline.memory.BitmapCounterConfig;
import com.taobao.weex.el.parse.Operators;
import java.util.ArrayList;
import java.util.List;
import org.opencv.videoio.Videoio;

/* JADX INFO: loaded from: classes2.dex */
public class PrinterModel {
    private List<DataBean> data;

    public static class DataBean {
        private boolean canChangeMTU;
        private int deepenEneragy;
        private int devdpi;
        private boolean hasId;
        private String headName;
        private int imgMTU;
        private int imgPrintSpeed;
        private int interval;
        private int model;
        private String modelName;
        private String modelNo;
        private int moderationEneragy;
        private boolean newCompress;
        private int oneLength;
        private int paperNum;
        private int paperSize;
        private int printSize;
        private int size;
        private int textMTU;
        private int textPrintSpeed;
        private int thinEneragy;
        private boolean useSPP;

        public DataBean(String str, String str2, int i, int i2, int i3, int i4, int i5, String str3, boolean z, int i6, int i7, int i8, int i9, int i10, boolean z2, int i11, int i12, boolean z3, int i13, int i14, int i15, boolean z4) {
            this.modelNo = str;
            this.modelName = str2;
            this.model = i;
            this.size = i2;
            this.paperSize = i3;
            this.printSize = i4;
            this.oneLength = i5;
            this.headName = str3;
            this.canChangeMTU = z;
            this.devdpi = i6;
            this.imgPrintSpeed = i7;
            this.textPrintSpeed = i8;
            this.imgMTU = i9;
            this.textMTU = i10;
            this.newCompress = z2;
            this.paperNum = i11;
            this.interval = i12;
            this.useSPP = z3;
            this.thinEneragy = i13;
            this.moderationEneragy = i14;
            this.deepenEneragy = i15;
            this.hasId = z4;
        }

        public int getDeepenEneragy() {
            return this.deepenEneragy;
        }

        public int getDevdpi() {
            return this.devdpi;
        }

        public int getEneragy(int i) {
            if (i == 0) {
                return getThinEneragy();
            }
            if (i != 1 && i == 2) {
                return getDeepenEneragy();
            }
            return getModerationEneragy();
        }

        public String getHeadName() {
            return this.headName;
        }

        public int getImgMTU() {
            return this.imgMTU;
        }

        public int getImgPrintSpeed() {
            return this.imgPrintSpeed;
        }

        public int getInterval() {
            return this.interval;
        }

        public int getModel() {
            return this.model;
        }

        public String getModelName() {
            return this.modelName;
        }

        public String getModelNo() {
            return this.modelNo;
        }

        public int getModerationEneragy() {
            return this.moderationEneragy;
        }

        public int getOneLength() {
            return this.oneLength;
        }

        public int getPaperNum() {
            return this.paperNum;
        }

        public int getPaperSize() {
            return this.paperSize;
        }

        public int getPrintSize() {
            return this.printSize;
        }

        public int getSize() {
            return this.size;
        }

        public int getTextMTU() {
            return this.textMTU;
        }

        public int getTextPrintSpeed() {
            return this.textPrintSpeed;
        }

        public int getThinEneragy() {
            return this.thinEneragy;
        }

        public boolean isCanChangeMTU() {
            return this.canChangeMTU;
        }

        public boolean isHasId() {
            return this.hasId;
        }

        public boolean isNewCompress() {
            return this.newCompress;
        }

        public boolean isUseSPP() {
            return this.useSPP;
        }

        public void setCanChangeMTU(boolean z) {
            this.canChangeMTU = z;
        }

        public void setDevdpi(int i) {
            this.devdpi = i;
        }

        public void setHasId(boolean z) {
            this.hasId = z;
        }

        public void setHeadName(String str) {
            this.headName = str;
        }

        public void setImgMTU(int i) {
            this.imgMTU = i;
        }

        public void setImgPrintSpeed(int i) {
            this.imgPrintSpeed = i;
        }

        public void setModel(int i) {
            this.model = i;
        }

        public void setModelName(String str) {
            this.modelName = str;
        }

        public void setModelNo(String str) {
            this.modelNo = str;
        }

        public void setOneLength(int i) {
            this.oneLength = i;
        }

        public void setPaperNum(int i) {
            this.paperNum = i;
        }

        public void setPaperSize(int i) {
            this.paperSize = i;
        }

        public void setPrintSize(int i) {
            this.printSize = i;
        }

        public void setSize(int i) {
            this.size = i;
        }

        public void setTextMTU(int i) {
            this.textMTU = i;
        }

        public void setTextPrintSpeed(int i) {
            this.textPrintSpeed = i;
        }
    }

    public static ArrayList<Integer> getLYEneragyList() {
        ArrayList<Integer> arrayList = new ArrayList<>();
        arrayList.add(5000);
        arrayList.add(5000);
        arrayList.add(7000);
        arrayList.add(7000);
        arrayList.add(9500);
        arrayList.add(9500);
        arrayList.add(12000);
        arrayList.add(12000);
        arrayList.add(15000);
        arrayList.add(15000);
        Integer numValueOf = Integer.valueOf(Videoio.CAP_PROP_IMAGES_BASE);
        arrayList.add(numValueOf);
        arrayList.add(numValueOf);
        arrayList.add(20000);
        arrayList.add(20000);
        return arrayList;
    }

    public static DataBean getModel(String str) {
        if ("GT01".equals(str)) {
            return new DataBean("GT01", "", 0, 2, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, 8, "GT01-", true, 200, 55, 45, 123, 83, true, 2, 4, false, 12000, 12000, 12000, true);
        }
        if ("GT02".equals(str)) {
            return new DataBean("GT02", Operators.SPACE_STR, 0, 2, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, 8, "GT02-", true, 200, 55, 45, 123, 83, true, 2, 4, false, 8000, 8000, 8000, true);
        }
        if ("MX02".equals(str)) {
            return new DataBean("MX02", Operators.SPACE_STR, 0, 2, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, BitmapCounterConfig.DEFAULT_MAX_BITMAP_COUNT, 8, "MX02-", true, 200, 55, 45, 123, 83, true, 2, 4, false, 20000, 20000, 20000, true);
        }
        if ("MX03".equals(str)) {
            return new DataBean("MX03", Operators.SPACE_STR, 0, 2, 576, 576, 8, "MX03-", true, 200, 55, 45, 123, 83, true, 2, 4, false, 20000, 20000, 20000, true);
        }
        return null;
    }

    public List<DataBean> getData() {
        return this.data;
    }

    public DataBean getModel1(String str) {
        List<DataBean> list = this.data;
        if (list == null || list.size() == 0) {
            return null;
        }
        for (DataBean dataBean : this.data) {
            if (dataBean.getModelNo().equals(str)) {
                return dataBean;
            }
        }
        return null;
    }

    public void setData(List<DataBean> list) {
        this.data = list;
    }
}
