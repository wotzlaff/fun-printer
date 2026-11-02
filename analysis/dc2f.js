function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = i(a("e289")),
            n = i(a("a061")),
            r = i(a("291c")),
            l = i(a("dd92")),
            o = i(a("6660")),
            A = i(a("1ddb")),
            g = i(a("9673")),
            d = i(a("e54e")),
            c = a("d5ca"),
            u = a("4ab3"),
            f = i(a("4bd5")),
            h = uni.requireNativePlugin("Ytbbluetooth"),
            p = {},
            m = {
                ble_address: "",
                ble_name: "",
                model: "",
                support_label: 0,
                isMXW01Board: !1,
                broadcast: ""
            },
            b = {
                address: "",
                reConnectCount: 1,
                perConnectTime: 2e3,
                overTime: 1e4,
                isNeedSetMtu: !1,
                isNeedOpenNotify: !1,
                isMXW01Board: !1,
                broadcast: ""
            },
            y = l.default.get_time_id(),
            k = !1,
            z = !1,
            w = 0,
            j = 0;

        function x() {
            k = !1, z = !1
        }

        function C(e, t) {
            e.mac && e.mac != b.address || (z = !0, p.disconnect(t))
        }

        function v() {
            uni.$emit("send_connect_fail_msg")
        }
        p.init = function() {
            x(), h.init({}, (function(e) {
                0 == e.code ? p.ytb_ble_callback(e) : t("log", "ble_init \u5931\u8d25\u4e86", " at models/printer/android_ble.js:40")
            }))
        }, p.set_mtu = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 503;
            h.setMtu({
                mtu: e
            }, null)
        }, p.open_notify = function() {
            h.openNotification({}, (function(e) {
                e.type = 112, B(e, "ytb_ble_callback")
            }))
        }, p.ytb_ble_callback = function(e) {
            var a, i = e.type;
            i = parseInt(i), B(e, "ytb_ble_callback");
            var l = !1;
            switch ((101 != i || e.totalPackages == e.currentIndex) && (l = !0), l && uni.$emit("on_auto_test_callback", e), i) {
                case 0:
                    break;
                case 107:
                    t("log", "\u6743\u9650\u68c0\u67e5\u5931\u8d25:" + e.msg, " at models/printer/android_ble.js:82");
                    break;
                case 4:
                    if (!e.ble_name || !e.ble_address) return;
                    uni.$emit("android_ble_device_found", {
                        name: e.ble_name,
                        ble_address: e.ble_address,
                        broadcast: e.FFValue ? e.FFValue : ""
                    });
                    break;
                case 2:
                    s.default.disconnected(), p.re_init_fastBle(), k = !1, z && v();
                    break;
                case 51:
                case 52:
                    (function(e) {
                        var a = e.msg ? e.msg : e.result;
                        if (uni.hideLoading(), "\u5df2\u53d6\u6d88\u6253\u5370" == a) {
                            if (t("log", "\u5df2\u53d6\u6d88\u6253\u5370", " at models/printer/android_ble.js:722"), uni.showToast({
                                    icon: "none",
                                    title: getApp().globalData.$t("message").yqx,
                                    position: "bottom",
                                    duration: 3e3
                                }), m && m.hasOwnProperty("model") && "V5X" == m["model"]) p.print_hex("2221AC0001000000ff", "V5X");
                            else {
                                var i = "";
                                m && m.hasOwnProperty("ble_name") && m.ble_name && (i = m.ble_name), s.default.is_bq05_device(i) ? s.default.bq05_cancel_print() : m && m.hasOwnProperty("model") && "V10G" == m["model"] || p.print_hex("5178A30001000000FF5178A4000100348CFF5178A6000B00AA551738445F5F5F44382CA1FF5178AF0002001027A2FF5178BE0001000000FF5178BD0001000A36FF5178A10002003000F9FF", "V5G")
                            }
                            uni.$emit("success_cancel_print", {})
                        }
                    })(e);
                    break;
                case 102:
                    setTimeout((function() {
                        p.set_mtu()
                    }), 100), setTimeout((function() {
                        p.open_notify()
                    }), 300);
                    break;
                case 103:
                    break;
                case 108:
                    t("log", "\u7279\u5f81\u503c\u8ba2\u9605\u6210\u529f\uff0c\u771f\u6b63\u8fde\u63a5\u6210\u529f", e, " at models/printer/android_ble.js:123"), j = 0, z = !1, k = !1;
                    var o = b.hasOwnProperty("broadcast") ? b.broadcast : "",
                        A = !!b.hasOwnProperty("isMXW01Board") && b.isMXW01Board,
                        g = n.default.get_printer_model(m["ble_name"], "", o);
                    "V5X_S" == g && (g = "V5X"), "V5X" == g ? (m["support_label"] = !0, ["printer_with_screen", "ai_camera", "FriendAI"].includes(n.default.get_working_app()) || setTimeout((function(e) {
                        s.default.print_cmd("2221b10001000000ff", "V5X")
                    }), 200)) : "V5C" == g && setTimeout((function(e) {
                        s.default.print_cmd("5688AA0001000000FF", "V5C")
                    }), 600), s.default.set_d2_status(!1), s.default.update_d2_info("clear"), s.default.set_didian_status(!1), s.default.set_printer_wendu(-1, null === (a = m) || void 0 === a ? void 0 : a.ble_name), uni.$emit("connect_complete", {
                        ble_address: m["ble_address"],
                        ble_name: m["ble_name"],
                        model: g,
                        broadcast: o,
                        isMXW01Board: A
                    });
                    break;
                case 113:
                    k = !1, p.re_init_fastBle(), e.is_time_out && e.mac && b.address.trim().toUpperCase() == e.mac.trim().toUpperCase() && v();
                    break;
                case 109:
                    t("log", e.msg, " at models/printer/android_ble.js:172"), C({
                        mac: e.mac
                    });
                    break;
                case 105:
                case 202:
                    t("log", "\u8ba2\u9605\u5931\u8d25", e, " at models/printer/android_ble.js:179");
                    var f = null;
                    j++, "HarmonyOS" != uni.getSystemInfoSync().romName ? j <= 1 && (f = function() {
                        setTimeout((function() {
                            t("log", "\u8ba2\u9605\u5931\u8d25, \u91cd\u65b0\u94fe\u63a5", " at models/printer/android_ble.js:186"), p.connect(b.address, null, !1, "", !1)
                        }), 50)
                    }) : p.close_adapter(), C({
                        mac: e.ble_address
                    }, f);
                    break;
                case 205:
                    C({
                        mac: b.address
                    });
                    break;
                case 100:
                    if (getApp().globalData.is_wifi_connect) return void uni.$emit("CharacteristicValue", e.notice);
                    d.default.notify_callback(e.notice ? e.notice : "", m, e);
                    break;
                case 101:
                    (function(e) {
                        var t = e.totalPackages,
                            a = e.currentIndex;
                        if (m && m.hasOwnProperty("model") && "V5X" == m.model) return void(0, c.v5x_packages_callback)(e);
                        if (["BQ03", "BQ02", "BQ17"].includes(getApp().globalData.v5g_label_print_ble_name) && getApp().globalData.v5g_is_label_print) return void(0, u.bq02_packages_callback)(e);
                        if (t == a) {
                            var i = r.default.get_printer_info();
                            i["model"] && i["model"];
                            t > 1 && (uni.hideLoading(), uni.hideToast(), getApp().globalData.printing = 0, s.default.set_print_complete_time(), s.default.is_bq05_device() && uni.$emit("bq05_data_send_complete__notify"))
                        }
                        var n = Math.ceil(a / t * 100);
                        getApp().globalData.print_percent = n
                    })(e);
                    break;
                case 106:
                    t("log", "\u5df2\u505c\u6b62\u626b\u63cf", e, " at models/printer/android_ble.js:215"), uni.$emit("ble_scan_stop", null);
                    break;
                case 110:
                    t("log", "MTU\u8bbe\u7f6e\u6210\u529f", e, " at models/printer/android_ble.js:219");
                    break;
                case 111:
                    t("log", "MTU\u8bbe\u7f6e\u5931\u8d25", e, " at models/printer/android_ble.js:222");
                    break;
                case 103:
                    t("log", "\u5f00\u59cb\u8fde\u63a5", e, " at models/printer/android_ble.js:225"), z = !1;
                    break;
                case 203:
                    "\u5df2\u5173\u95ed" == e.status ? (x(), uni.hideToast(), uni.hideLoading()) : "\u5df2\u6253\u5f00" == e.status && (x(), uni.hideToast()), uni.$emit("bluetooth_status_notity", {
                        status: e.status
                    });
                    break;
                case 207:
                    break;
                case 106:
                    break
            }
        }, p.re_init_fastBle = function() {
            h.reInitBLe({}, (function(e) {
                t("log", "re_init_fastBle", e, " at models/printer/android_ble.js:266")
            }))
        }, p.stop_search_printer = function() {
            h.stopSearchPrinter({}, (function(e) {}))
        }, p.search = function() {
            h.searchBlePrinter({}, (function(e) {
                t("log", "search", "\u626b\u63cf\u84dd\u7259\u8bf7\u6c42\u5df2\u53d1\u9001", " at models/printer/android_ble.js:282")
            }))
        }, p.cancel_print = function(e) {
            var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            "V10G" == a ? h.cancelPrintForV10g({}, (function(a) {
                t("log", "\u53d6\u6d88\u6253\u5370v10g", a, " at models/printer/android_ble.js:292"), uni.$emit("start_cancel_print"), e && e()
            })) : h.cancelPrint({}, (function(a) {
                t("log", "\u53d6\u6d88\u6253\u5370", a, " at models/printer/android_ble.js:298"), uni.$emit("start_cancel_print"), e && e()
            }))
        }, p.print_hex = function(e, a, i) {
            var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
                l = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : [],
                o = arguments.length > 5 && void 0 !== arguments[5] && arguments[5],
                d = arguments.length > 6 && void 0 !== arguments[6] && arguments[6];
            if (e) {
                var c = !1,
                    u = "",
                    p = "",
                    b = null;
                m && m.ble_name && (p = m.ble_name, p = p.toUpperCase(), p = p.replace(/\s+/g, ""), a = a || m.model), e.length > 50 && "2221B5" != e.substr(0, 6).toUpperCase() && "5178F6" != e.substr(0, 6).toUpperCase() ? (getApp().globalData.printing = 1, "V5X" == a && (b = d ? 384 : 480)) : (getApp().globalData.printing = 0, "V5X" == a && (c = !0));
                var y = f.default.mx06_list,
                    k = f.default.mx10_list,
                    z = 4,
                    w = !1;
                if ((y.indexOf(p) >= 0 || k.indexOf(p) >= 0 || l[3] >= l[1]) && (w = !0), e.length > 50 && r > z && 4 == l.length && w && (A.default.is_handle_d2_status(p) || k.indexOf(p) >= 0) && !o) {
                    var j = Math.min(l[1], l[3]),
                        x = !1;
                    j != l[3] && (x = !0);
                    var C = !1,
                        v = 95;
                    if (y.indexOf(p) >= 0) {
                        var q = s.default.get_last_print_record();
                        if (q) {
                            var B = Date.parse(new Date) / 1e3,
                                I = s.default.get_last_complete_time();
                            B - I < 50 ? (j = Math.min(q.nongdu, j) - 10, x = !0, C = !0) : (j = Math.min(110, j), x = !0)
                        } else j = Math.min(110, j), x = !0
                    }
                    if (k.indexOf(p) >= 0) {
                        var Q, E, D, F, P = {};
                        t("log", {
                            flag_update_hex_cmd: x,
                            not_need_change_nongdu_nums: z,
                            mx10_min_nongdu: v,
                            mx_nongdu_value: l
                        }, " at models/printer/android_ble.js:395"), P = ["PD01", "IM.17", "MINISO-M1", "MINISO-M12"].includes(p) ? f.default.pd01_serial_continuous_nongdu(x, z, v, l) : f.default.mx10_serial_continuous_nongdu(x, z, v, l), j = null === (Q = P) || void 0 === Q ? void 0 : Q.begin_nongdu_value, z = null === (E = P) || void 0 === E ? void 0 : E.not_need_change_nongdu_nums, v = null === (D = P) || void 0 === D ? void 0 : D.mx10_min_nongdu, x = null === (F = P) || void 0 === F ? void 0 : F.flag_update_hex_cmd
                    }
                    if (x) {
                        var S = n.default.int2hex(j);
                        1 == S.length && (S = "0" + S);
                        var M = s.default.hexStr2Bytes("01" + S),
                            U = "5178F2000200" + g.default.crc8(M) + "FF";
                        e = U + e.substr(20)
                    }
                    for (var Y = 1; Y <= z; Y++) u += e;
                    var N, G = r - z;
                    if (["PD01", "IM.17", "MINISO-M1", "MINISO-M12"].includes(p)) {
                        var T = f.default.get_pd01_continuous_hex(u, e, j, G);
                        u = T.hex_cmd, N = T.last_nongdu_value
                    } else {
                        var O = f.default.get_continuous_hex(p, u, e, j, G, C, v);
                        u = O.hex_cmd, N = O.last_nongdu_value
                    }
                    s.default.last_print_record(r, N)
                } else {
                    var X = l[3];
                    if (e.length > 50 && A.default.is_handle_d2_status(p) && s.default.get_d2_status() && y.indexOf(p) >= 0) {
                        var K = s.default.get_last_complete_time(),
                            R = Date.parse(new Date) / 1e3;
                        if (R - K < 50) {
                            X = Math.min(s.default.get_last_nongdu(), X) > 0 ? Math.min(s.default.get_last_nongdu(), X) : X, y.indexOf(p) >= 0 && (X > 150 && (X = 150), X -= 20, X < 70 && (X = 70));
                            var L = n.default.int2hex(X);
                            1 == L.length && (L = "0" + L);
                            var H = s.default.hexStr2Bytes("01" + L),
                                W = "5178F2000200" + g.default.crc8(H) + "FF";
                            e = W + e.substr(20)
                        }
                    }
                    if (e.length > 50 && k.indexOf(p) >= 0 && s.default.get_printer_wendu() >= 50) {
                        var V = s.default.get_printer_wendu();
                        X = ["PD01", "IM.17", "MINISO-M1", "MINISO-M12"].includes(p) ? f.default.pd01_nongdu(V, l) : f.default.mx10_serial_nongdu(V, l);
                        var J = n.default.int2hex(X);
                        1 == J.length && (J = "0" + J);
                        var Z = s.default.hexStr2Bytes("01" + J),
                            _ = "5178F2000200" + g.default.crc8(Z) + "FF";
                        e = _ + e.substr(20)
                    }
                    l.length >= 4 && s.default.set_last_nongdu(X);
                    for (var $ = 0; $ < r; $++) u += e
                }
                var ee = 30;
                ("V5G" == a.toUpperCase() || "V5X" == a.toUpperCase()) && (ee = 30), "V5X" != a.toUpperCase() && (getApp().globalData.print_percent = 0), "MX05" == p && (ee = 36), A.default.is_handle_d2_status(p) && !o && (ee = 60), "55AAF6" != u.substr(0, 6) && "55AAF7" != u.substr(0, 6) && "55AAF5" != u.substr(0, 6) || (ee = 10), u.substr(0, 6) && "5178A1" == u.substr(-6) && (ee = 10), "V5X" == a && "2221B3002200" == u.substr(0, 12).toUpperCase() && (c = !0), "V10G" == a.toUpperCase() && (ee = 10), c && (ee = 0);
                var te = {
                    hex_cmd: u,
                    speed: ee,
                    model: a,
                    is_command: c
                };
                b && (te.package_length = b), s.default.is_q7_series_device(p) && (te.speed = 10, te.needSplitHex = !0), h.printCmdFromHexstring(te, (function(e) {
                    0 == e.code ? i && i(1) : t("log", "print_image_from_hexstring \u5931\u8d25\u4e86", " at models/printer/android_ble.js:579")
                }))
            }
        }, p.connect = function(e, a) {
            var i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                s = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "",
                n = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4];
            if (e) {
                y = l.default.get_time_id();
                var r = Date.now();
                return n & r - w < 7e3 && k ? (w = r, t("log", "\u4e24\u6b21\u94fe\u63a5\u65f6\u95f4\u592a\u77ed\u4e86, \u53d6\u6d88\u8bf7\u6c42\u53d1\u9001", " at models/printer/android_ble.js:597"), !1) : (w = r, b.address = e, b.isMXW01Board = i, b.broadcast = s, m.ble_address == e && m.ble_name && (b.bleName = m.ble_name), k = !0, h.connectPrinter(b, null), !0)
            }
        }, p.disconnect = function(e) {
            h.disconnectPrinter({}, (function(a) {
                t("log", a, " at models/printer/android_ble.js:618"), e && e()
            }))
        }, p.set_printer_info = function(e) {
            m = e
        }, p.get_deivce = function() {
            return m
        }, p.is_connected = function() {
            return new Promise((function(e, t) {
                h.queryConnectStatus({}, (function(t) {
                    e(t.success_connected)
                }))
            }))
        }, p.get_connected_device = function() {
            h.getConnectedDevice({}, (function(e) {
                t("log", JSON.parse(e.result), " at models/printer/android_ble.js:645")
            }))
        }, p.close_adapter = function() {
            h.CloseBleAdapter({}, (function(e) {
                e.stye = 114, B(e, "ytb_ble_callback")
            }))
        }, p.open_adapter = function() {
            h.OpenBleAdapter({}, (function(e) {
                "\u5f00\u542f\u8bf7\u6c42\u5df2\u53d1\u9001" == e.result && uni.showToast({
                    icon: "loading",
                    title: "\u84dd\u7259\u91cd\u542f\u4e2d...",
                    duration: 3e3
                }), B("\u5f00\u542f\u84dd\u7259\u9002\u914d\u5668\u8bf7\u6c42\u5df2\u53d1\u9001", "open_adapter")
            }))
        }, p.get_adapter_status = function() {
            h.getBleAdapterStatus({}, (function(e) {
                t("log", e, " at models/printer/android_ble.js:674")
            }))
        }, p.get_connect_operate_status = function(e) {
            return k
        };
        var q = [4, 101, 100, 99, 106];

        function B(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            if (getApp().globalData.user_config.get_config().upload_ble_log) {
                var a = 0;
                if ("ytb_ble_callback" == t) {
                    var i = e.type;
                    if (i = parseInt(i), q.indexOf(i) > -1) return;
                    if ("\u94fe\u63a5\u8bf7\u6c42\u5df2\u53d1\u9001" == e.msg) a = 1;
                    else if ("\u4fee\u6539MTU\u8bf7\u6c42\u5df2\u53d1\u9001" == e.msg) a = 8;
                    else if ("\u65ad\u5f00\u8bf7\u6c42\u5df2\u53d1\u9001" == e.msg) a = 12;
                    else switch (i) {
                        case 103:
                            e.msg = "\u5f00\u59cb\u8fde\u63a5", a = 2;
                            break;
                        case 206:
                            e.msg = "\u8fde\u63a5\u4e2d", a = 3;
                            break;
                        case 207:
                            a = 4, e.msg = "\u94fe\u63a5\u6210\u529f, \u7b49\u5f85\u5f00\u542f\u670d\u52a1\u53d1\u73b0";
                            break;
                        case 208:
                            a = 5, e.msg = "\u5f00\u59cb\u53d1\u73b0\u670d\u52a1";
                            break;
                        case 204:
                            a = 6, e.msg = "\u670d\u52a1\u53d1\u73b0\u6210\u529f, \u7b49\u5f85\u626b\u63cf\u7279\u5f81\u503c";
                            break;
                        case 102:
                            a = 7, e.msg = "\u7279\u5f81\u503c\u626b\u63cf\u6210\u529f, \u7b49\u5f85\u8bbe\u7f6eMTU\u53ca\u8ba2\u9605\u901a\u77e5";
                            break;
                        case 110:
                            a = 9, e.msg = "\u8bbe\u7f6eMTU\u6210\u529f";
                            break;
                        case 112:
                            a = 10, e.msg = e.msg;
                            break;
                        case 108:
                            a = 11, e.msg = "\u7279\u5f81\u8ba2\u9605\u6210\u529f";
                            break;
                        case 2:
                            a = 13, e.msg = "\u8fde\u63a5\u65ad\u5f00\u4e86";
                            break;
                        case 114:
                            a = 14, e.msg = "\u5173\u95ed\u84dd\u7259\u9002\u914d\u5668\u8bf7\u6c42\u5df2\u53d1\u9001";
                            break;
                        case 205:
                            a = 15;
                            break;
                        case 113:
                            a = 4.1;
                            break;
                        case 109:
                            a = 7.1, e.msg = "\u8fde\u63a5\u6210\u529f, \u7279\u5f81\u503c\u626b\u63cf\u5931\u8d25";
                            break;
                        case 202:
                            a = 6.1, e.msg = "\u8fde\u63a5\u6210\u529f, \u53d1\u73b0\u670d\u52a1\u5931\u8d25";
                            break;
                        case 105:
                            a = 11.1;
                            break;
                        case 111:
                            a = 8.1;
                            break;
                        case 203:
                            a = 16, e.msg = "\u5f53\u524d\u84dd\u7259\u72b6\u6001:" + e.status;
                            break;
                        case 115:
                            a = 17;
                            break;
                        case 116:
                            a = 18;
                            break;
                        case 117:
                            a = 11.2;
                            break;
                        case 118:
                            a = 19;
                        default:
                            break
                    }
                }
                "[object Object]" !== Object.prototype.toString.call(e) && "[object Array]" !== Object.prototype.toString.call(e) || (e = JSON.stringify(e)), o.default.post("setting/ble_log", {
                    connect_id: y,
                    otime: l.default.get_mill_time(),
                    from: t,
                    js_step: a,
                    json: e
                }, (function(e) {}))
            }
        }
        e.exports = p
    }).call(this, a("f3b9")["default"])
}