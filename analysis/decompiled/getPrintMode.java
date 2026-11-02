package com.xyz.yintibao.library;

import com.xyz.yintibao.library.PrinterModel;

/* JADX INFO: loaded from: classes2.dex */
public class getPrintMode {
    private static PrinterModel model;

    public static PrinterModel.DataBean getPrintMode(String str) {
        return PrinterModel.getModel(str);
    }
}
