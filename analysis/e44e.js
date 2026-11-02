function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = i(a("a061")),
            n = i(a("e289")),
            r = uni.requireNativePlugin("YtbWeiTeRuiModule"),
            l = {
                "58P7_": {
                    support_lxzdy: !0,
                    support_label: !0,
                    support_wsdy: !1,
                    support_hbdy: !1,
                    show_dyfs: !0,
                    support_coustom_width_size: !1,
                    width_list_default_index: 0,
                    support_max_dpi: 384,
                    sub_model: "58P7_",
                    label_rotate_90: !1,
                    device_dpi: 200,
                    support_paper_switch: !1
                },
                "15P1_": {
                    support_lxzdy: !0,
                    support_label: !0,
                    support_wsdy: !1,
                    support_hbdy: !1,
                    show_dyfs: !0,
                    support_coustom_width_size: !1,
                    width_list_default_index: 0,
                    support_max_dpi: 92,
                    sub_model: "15P1_",
                    label_rotate_90: !0,
                    device_dpi: 200,
                    support_paper_switch: !0
                },
                A47: {
                    support_lxzdy: !0,
                    support_label: !1,
                    support_wsdy: !0,
                    support_hbdy: !0,
                    show_dyfs: !1,
                    support_coustom_width_size: !0,
                    width_list_default_index: 3,
                    support_max_dpi: 1600,
                    sub_model: "A47",
                    label_rotate_90: !1,
                    device_dpi: 200,
                    support_paper_switch: !1,
                    packetDelayMs: 60,
                    useMethod: "printBitmap",
                    size_type: "A4"
                },
                A55: {
                    support_lxzdy: !0,
                    support_label: !1,
                    support_wsdy: !0,
                    support_hbdy: !0,
                    show_dyfs: !1,
                    support_coustom_width_size: !0,
                    width_list_default_index: 3,
                    support_max_dpi: 1600,
                    sub_model: "A55",
                    label_rotate_90: !1,
                    device_dpi: 200,
                    support_paper_switch: !1,
                    packetDelayMs: 60,
                    useMethod: "printBitmap",
                    size_type: "A4"
                },
                A55Pro: {
                    support_lxzdy: !0,
                    support_label: !1,
                    support_wsdy: !0,
                    support_hbdy: !0,
                    show_dyfs: !1,
                    support_coustom_width_size: !0,
                    width_list_default_index: 3,
                    support_max_dpi: 1600,
                    sub_model: "A55",
                    label_rotate_90: !1,
                    device_dpi: 300,
                    support_paper_switch: !1,
                    packetDelayMs: 60,
                    useMethod: "printBitmap",
                    size_type: "A4"
                }
            },
            o = ["58P7_", "58D3_"],
            A = ["A47", "A42", "A41"],
            g = ["15P1_", "15P3_"],
            d = {},
            c = {
                ble_address: "",
                ble_name: "",
                ble_uuid: "",
                support_label: !1,
                model: "",
                sn: "",
                device_support: null
            },
            u = !1,
            f = !1,
            h = !1;

        function p() {
            var e, t;
            return !((null === (e = getApp().globalData) || void 0 === e ? void 0 : e.p7_print_nums) > 0 && null !== (t = getApp().globalData) && void 0 !== t && t.p7_print_image)
        }

        function m(e) {
            var a;
            t("log", "init", e, " at models/printer/weiturui.js:369");
            var i = parseInt(e.code);
            switch (i) {
                case 200:
                    "fail" == e.result && uni.$emit("send_connect_fail_msg");
                    break;
                case 300:
                    getApp().globalData.p7_print_nums = 0;
                    var r = e.deviceInfo.split("|");
                    c.ble_name = r[0], c.ble_address = r[1], c.model = s.default.get_printer_model(r[0], r[1]), c.sn = r[5], c.device_support = d.get_device_support(c.ble_name), c.support_label = null === (a = c.device_support) || void 0 === a ? void 0 : a.support_label, t("log", c, " at models/printer/weiturui.js:386"), u ? (n.default.ble_auth(c.ble_name, c.ble_address, c.sn, "P7"), getApp().globalData.p7_print_nums = 0, u = !1, uni.$emit("connect_complete", {
                        ble_address: c.ble_address,
                        ble_name: c.ble_name,
                        model: c.model,
                        broadcast: "",
                        isMXW01Board: !1,
                        ble_uuid: c.ble_uuid,
                        research_uuid: ""
                    })) : uni.$emit("p7_device_info", {
                        name: r[0],
                        mac: r[1],
                        powerDownTime: r[2],
                        battery: r[3],
                        version: r[4]
                    });
                    break;
                case 400:
                    getApp().globalData.p7_print_nums = 0, h = !1, n.default.disconnected(), uni.$emit("bq05_print_complete__notify");
                    break;
                case 501:
                    e.value;
                    break;
                case 502:
                    1 === (null === e || void 0 === e ? void 0 : e.value) && (t("log", "\u6253\u5370\u4e2d, \u70b9\u51fb\u4e86\u7535\u6e90\u6309\u94ae", " at models/printer/weiturui.js:422"), h = !1, uni.$emit("bq05_print_complete__notify"));
                    break;
                case 503:
                    (function(e) {
                        var a = e.split(";"),
                            i = a[0],
                            s = a[1],
                            n = a[2],
                            r = a[3],
                            l = "";
                        l = "\u65e0\u7eb8" == i || "\u5f00\u76d6" == r ? "quezhi" : "\u9ad8\u6e29" == s ? "guore" : "\u4f4e\u538b" == n ? "didian" : "zhengchang";
                        "zhengchang" != l && (getApp().globalData.p7_print_nums = 0, h && d.cancel_print(), t("log", "\u5f02\u5e38\u72b6\u6001, \u53d6\u6d88\u6253\u5370", " at models/printer/weiturui.js:487"));
                        var o = getCurrentPages(),
                            A = o[o.length - 1].$getAppWebview();
                        "pages/print_preview/print_webview_preview" == A.__uniapp_route && (p() || "zhengchang" != l ? uni.$emit("print_status_alter", l) : d.print(!1))
                    })(e.value);
                    break;
                case 505:
                case 603:
                case 602:
                    getApp().globalData.p7_print_nums = 0;
                    break;
                case 601:
                    var l;
                    if (p()) uni.$emit("bq05_print_complete__notify"), h = !1, null !== (l = getApp().globalData) && void 0 !== l && l.p7_uploaded_log && (getApp().globalData.p7_uploaded_log = !1, n.default.print_log());
                    else d.get_device_status();
                    break;
                case 604:
                    break;
                case 600:
                    break;
                case 507:
                    d.get_sn();
                    break;
                case 508:
                    n.default.to_auth(c.ble_name, c.ble_address, e.value, "P7");
                    break
            }
        }
        d.is_inited = function() {
            return f
        }, d.is_printing = function() {
            return h
        }, d.reset_inited_flag = function() {
            f = !1
        }, d.init = function() {
            f || (f = !0, t("log", "init>>>>>>>>>>>>>>", f, " at models/printer/weiturui.js:140"), "android" == uni.getSystemInfoSync().osName ? r.init({}, m) : r.uniInit({}, m))
        }, d.getDevices = function() {
            return r.getDevices()
        }, d.set_sn = function(e) {
            t("log", "\u5409\u745e\u666e\u8981\u8bbe\u7f6e\u7684SN:" + e, " at models/printer/weiturui.js:154"), r.setSn(e)
        }, d.get_sn = function() {
            r.getSn()
        }, d.connect = function(e) {
            u = !0, h = !1, c.ble_uuid = e;
            var t = r.connect(e);
            return t
        }, d.disconnect = function() {
            var e = r.disconnect();
            return e
        }, d.print = function() {
            var e, a, i, s, n, l, o, A, g, d, u, f = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
            if (0 !== getApp().globalData.p7_print_nums) {
                var p = null === (e = getApp().globalData) || void 0 === e ? void 0 : e.p7_print_image,
                    m = null !== (a = null === (i = getApp().globalData) || void 0 === i ? void 0 : i.p7_print_density) && void 0 !== a ? a : 1,
                    b = null !== (s = null === (n = getApp().globalData) || void 0 === n ? void 0 : n.p7_px_width) && void 0 !== s ? s : 384,
                    y = "printRawBitmap",
                    k = !1,
                    z = !1,
                    w = !1,
                    j = "\u8fde\u7eed\u7eb8",
                    x = 400,
                    C = !1;
                if (p) {
                    switch (null === (l = getApp().globalData) || void 0 === l ? void 0 : l.p7_print_paper_type) {
                        case "bqz":
                            j = "\u6807\u7b7e\u7eb8", y = "setRawBitmap";
                            break;
                        case "hbz":
                            j = "\u9ed1\u6807\u7eb8", y = "setBitmap";
                        case "wsz":
                            j = "\u7eb9\u8eab\u7eb8", y = "printRawBitmap";
                            break;
                        default:
                            j = "\u8fde\u7eed\u7eb8", y = "printRawBitmap";
                            break
                    }
                    if (null !== c && void 0 !== c && null !== (o = c.device_support) && void 0 !== o && o.useMethod && (y = c.device_support.useMethod), null !== c && void 0 !== c && null !== (A = c.device_support) && void 0 !== A && A.packetDelayMs && (x = c.device_support.packetDelayMs), "A4" == (null === c || void 0 === c || null === (g = c.device_support) || void 0 === g ? void 0 : g.size_type) && (C = !0), "15P1_" == (null === c || void 0 === c || null === (d = c.device_support) || void 0 === d ? void 0 : d.sub_model) || "58P7_" == (null === c || void 0 === c || null === (u = c.device_support) || void 0 === u ? void 0 : u.sub_model)) {
                        var v, q, B, I;
                        if (b = null === c || void 0 === c || null === (v = c.device_support) || void 0 === v ? void 0 : v.support_max_dpi, "15P1_" == (null === c || void 0 === c || null === (q = c.device_support) || void 0 === q ? void 0 : q.sub_model) && (y = "setBitmap"), f) k = !0, (null === (I = getApp().globalData) || void 0 === I ? void 0 : I.p7_print_nums) > 1 && (z = !0);
                        else z = !0;
                        1 == (null === (B = getApp().globalData) || void 0 === B ? void 0 : B.p7_print_nums) && (w = !0, z = !1)
                    }
                    var Q = {
                        paperType: j,
                        imgPath: p,
                        density: m,
                        printImgWidth: b,
                        packetDelayMs: x,
                        useMethod: y,
                        useGoToBack: k,
                        useGoToHeat: z,
                        useSetFeedGap: w,
                        isA4Series: C
                    };
                    "ios" == uni.getSystemInfoSync().osName && (Q.gammaValue = 1.2), getApp().globalData.hasOwnProperty("p7_print_nums") && getApp().globalData.p7_print_nums--, h = !0, r.print(Q)
                } else t("log", "\u6253\u5370\u5185\u5bb9, \u4e0d\u80fd\u4e3a\u7a7a", " at models/printer/weiturui.js:194")
            } else h = !1
        }, d.get_print_status = function() {
            r.getPrintStatus()
        }, d.get_device_status = function() {
            r.getDeviceStatus()
        }, d.get_device_info = function() {
            r.getDeviceInfo()
        }, d.set_power_time = function(e) {
            r.setPowrDownTime(e)
        }, d.cancel_print = function() {
            getApp().globalData.p7_print_nums = 0, r.cancalPrint()
        }, d.feed_paper = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 80;
            t("log", "\u53d6\u6d88\u540e\u7684\u8d70\u7eb8" + e, " at models/printer/weiturui.js:307"), r.feedLine(e)
        }, d.feed_gap = function() {
            r.setFeedGap()
        }, d.get_deivce = function() {
            return c
        }, d.go_to_back = function() {
            r.goToBack()
        }, d.go_to_heat = function() {
            r.goToHeat()
        }, d.get_device_support = function(e) {
            if (e) {
                var t = e.slice(0, 5),
                    a = e.slice(0, 3);
                return -1 !== o.indexOf(t) && (t = "58P7_"), -1 !== A.indexOf(a) && (a = "A47"), -1 !== g.indexOf(t) && (t = "15P1_"), l.hasOwnProperty(t) ? l[t] : l.hasOwnProperty(a) ? l[a] : null
            }
        }, e.exports = d
    }).call(this, a("f3b9")["default"])
}