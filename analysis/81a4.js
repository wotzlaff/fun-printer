function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = i(a("127e")),
            n = i(a("ee10")),
            r = i(a("a061")),
            l = i(a("291c")),
            o = i(a("e289")),
            A = i(a("57d8")),
            g = i(a("9673")),
            d = i(a("a061")),
            c = i(a("1ddb")),
            u = i(a("e54e")),
            f = a("d5ca"),
            h = a("4ab3"),
            p = i(a("4bd5")),
            m = uni.requireNativePlugin("Ytbbluetooth"),
            b = [81, 120, -92, 0, 1, 0, 49, -105, -1],
            y = [81, 120, -92, 0, 1, 0, 50, -98, -1],
            k = [81, 120, -92, 0, 1, 0, 51, -103, -1],
            z = [81, 120, -92, 0, 1, 0, 52, -116, -1],
            w = [81, 120, -92, 0, 1, 0, 53, -117, -1],
            j = {},
            x = !1,
            C = {
                ble_address: "",
                ble_name: "",
                ble_uuid: "",
                model: "",
                ble_type: "",
                deviceId: "",
                research_uuid: "",
                support_label: !1,
                isMXW01Board: !1,
                broadcast: ""
            },
            v = {
                ble_uuid: "",
                ble_mac: "",
                broadcast: "",
                isMXW01Board: !1
            };

        function q(e) {
            var t = [];
            return t = 1 == e ? b : 2 == e ? y : 3 == e ? k : 4 == e ? z : w, B(t)
        }

        function B(e) {
            for (var t = "", a = 0; a < e.length; a++) {
                var i, s = e[a];
                i = s < 0 ? (255 + s + 1).toString(16) : s.toString(16), 1 == i.length && (i = "0" + i), t += i
            }
            return t
        }

        function I(e) {
            var t = e.toString(16),
                a = function(e) {
                    var t = 0,
                        a = e.length;
                    a % 2 != 0 && (e = "0" + e), a /= 2;
                    for (var i = new Array, s = 0; s < a; s++) {
                        var n = e.substr(t, 2),
                            r = parseInt(n, 16);
                        i.push(r), t += 2
                    }
                    return i
                }(t),
                i = B([81, 120, -81, 0, 2, 0]);
            return i += g.default.crc8([a[1], a[0]]), i += "FF", i
        }
        j.is_inited = function() {
            return x
        }, j.init = function() {
            x = !0, m.uniInit({}, (function(e) {
                var t, a;
                0 == e.code ? j.ytb_ble_callback(e) : -1 == e.code && "\u84dd\u7259\u53ef\u7528\uff0c\u672a\u6253\u5f00 \u6743\u9650\u68c0\u67e5" == e.msg && (getApp().globalData.p7_print_nums = 0, o.default.disconnected(), uni.$emit("bq05_print_complete__notify"), uni.$emit("bluetooth_status_notity", {
                    status: "\u5df2\u5173\u95ed"
                }), null === (t = getApp().globalData) || void 0 === t || null === (a = t.wtr_printer) || void 0 === a || a.reset_inited_flag())
            }))
        }, j.ytb_ble_callback = function(e) {
            var a = e.type;
            switch (a = parseInt(a), a) {
                case 4:
                    if ("YHK" == e.ble_name.substr(0, 3).toUpperCase() && !e.ble_address) break;
                    if (A.default.is_ble_connect(e.ble_name) && !e.uuid) break;
                    var i = function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                        if (!e) return "";
                        e = 14 == e.length ? e.substr(-14) : e.substr(-12);
                        var a = "";
                        e = e.toUpperCase(), "YTB01" == t ? (a += e.substr(10, 2), a += ":" + e.substr(8, 2), a += ":" + e.substr(6, 2), a += ":" + e.substr(4, 2), a += ":" + e.substr(2, 2), a += ":" + e.substr(0, 2)) : (a += e.substr(0, 2), a += ":" + e.substr(2, 2), a += ":" + e.substr(4, 2), a += ":" + e.substr(6, 2), a += ":" + e.substr(8, 2), a += ":" + e.substr(10, 2));
                        return a
                    }(e.ble_address, e.ble_name);
                    !i && ["Portable Printer", "Instant Print Plus"].includes(e.ble_name) && (e.ble_address = e.uuid, i = e.uuid);
                    var s = r.default.get_printer_model(e.ble_name, e.ble_address, e.ble_address),
                        n = e.ble_name,
                        l = e.ble_name;
                    if (!i && A.default.is_vson_plugin_connect(s) ? (n = "YINTIBAO-" + s, i = l.split("#")[1], l = "YINTIBAO-" + s) : i || "V6" != s && "V6PRO" != s && "V5C" != s && "P7" != s || (i = e.uuid), 1 == e.is_for_autoconnect) {
                        var g = {
                            ble_name: l,
                            ble_address: i,
                            ble_uuid: e.uuid,
                            research_uuid: e.research_uuid ? e.research_uuid : "",
                            model: s,
                            connected: !1,
                            broadcast: e.ble_address
                        };
                        return void o.default.connect(g)
                    }
                    var c = {};
                    c["model"] = s, c["device_no"] = n, c["ble_name"] = l, c["ble_address"] = i, c["ble_uuid"] = e.uuid, c["ble_type"] = "YTB_BLE", c["deviceId"] = c["ble_address"], c["research_uuid"] = e.research_uuid ? e.research_uuid : "", c["broadcast"] = e.ble_address, uni.$emit("ios_device_found", c);
                    break;
                case 10:
                    e.code;
                    break;
                case 102:
                    if (0 == e.code) {
                        var p;
                        o.default.set_d2_status(!1), o.default.set_didian_status(!1), o.default.update_d2_info("clear"), o.default.set_printer_wendu(-1, null === (p = C) || void 0 === p ? void 0 : p.ble_name);
                        var m = v.hasOwnProperty("broadcast") ? v.broadcast : "",
                            b = !!v.hasOwnProperty("isMXW01Board") && v.isMXW01Board,
                            y = r.default.get_printer_model(C["ble_name"], C["ble_address"], C["broadcast"]);
                        "V5X_S" == y && (y = "V5X"), uni.$emit("connect_complete", {
                            ble_address: C["ble_address"],
                            ble_name: C["ble_name"],
                            ble_uuid: C["ble_uuid"],
                            research_uuid: C["research_uuid"],
                            model: y,
                            broadcast: m,
                            isMXW01Board: b,
                            tag: C["tag"]
                        }), "V5X" == y ? (C["support_label"] = !0, ["printer_with_screen", "ai_camera", "FriendAI"].includes(d.default.get_working_app()) || setTimeout((function(e) {
                            o.default.print_cmd("2221b1000000000000", "V5X")
                        }), 200)) : "V5C" == y && setTimeout((function(e) {
                            o.default.print_cmd("5688AA0001000000FF", "V5C")
                        }), 600)
                    }
                    break;
                case 51:
                    (function(e) {
                        var a = e.result;
                        if (uni.hideLoading(), "\u5df2\u53d6\u6d88\u6253\u5370" == a) {
                            if (t("log", "\u5df2\u53d6\u6d88\u6253\u5370", " at models/printer/ios_ble.js:651"), uni.showToast({
                                    icon: "none",
                                    title: getApp().globalData.$t("message").yqx,
                                    position: "bottom",
                                    duration: 2e3
                                }), C && C.hasOwnProperty("model") && "V5X" == C["model"]);
                            else {
                                var i = "";
                                C && C.hasOwnProperty("ble_name") && C.ble_name && (i = C.ble_name), o.default.is_bq05_device(i) ? o.default.bq05_cancel_print() : j.print_hex("5178A30001000000FF5178A4000100348CFF5178A6000B00AA551738445F5F5F44382CA1FF5178AF0002001027A2FF5178BE0001000000FF5178BD0001000A36FF5178A10002003000F9FF", null, "V5G")
                            }
                            uni.$emit("success_cancel_print", {})
                        } else if ("\u5df2\u6253\u5370\u5b8c\u6210" == a) {
                            if (C && C.hasOwnProperty("model") && "V5X" == C["model"]) return;
                            if (C && C.hasOwnProperty("ble_name") && o.default.is_bq05_device(C.ble_name)) return;
                            C && ["BQ03", "BQ02", "BQ17"].includes(C.ble_name) && (uni.showToast({
                                icon: "none",
                                title: getApp().globalData.$t("message").dywc,
                                position: "bottom",
                                duration: 2e3
                            }), uni.$emit("v8s_print_complete", {}))
                        }
                    })(e);
                    break;
                case 2:
                    o.default.disconnected();
                    break;
                case 100:
                    if (getApp().globalData.is_wifi_connect) return void uni.$emit("CharacteristicValue", e.content);
                    u.default.notify_callback(e.content ? e.content : "", C);
                    break;
                case 101:
                    var k = e.totalPackages,
                        z = e.currentIndex;
                    if (C && C.hasOwnProperty("model") && "V5X" == C.model) return void(0, f.v5x_packages_callback)(e);
                    if (["BQ03", "BQ02", "BQ17"].includes(getApp().globalData.v5g_label_print_ble_name) && getApp().globalData.v5g_is_label_print) return void(0, h.bq02_packages_callback)(e);
                    k == z && k > 1 && (getApp().globalData.printing = 0, o.default.set_print_complete_time(), o.default.is_bq05_device() && uni.$emit("bq05_data_send_complete__notify"));
                    var w = Math.ceil(z / k * 100);
                    (!getApp().globalData.print_percent || w > getApp().globalData.print_percent) && (getApp().globalData.print_percent = w);
                    break;
                case 20:
                    var x, q;
                    if ("\u84dd\u7259\u5df2\u6253\u5f00\uff0c\u5e76\u4e14\u53ef\u7528 \u6743\u9650\u68c0\u67e5" == (null === e || void 0 === e ? void 0 : e.msg)) uni.$emit("bluetooth_status_notity", {
                        status: "\u5df2\u6253\u5f00"
                    }), null === (x = getApp().globalData) || void 0 === x || null === (q = x.wtr_printer) || void 0 === q || q.init();
                    break;
                default:
                    break
            }
        }, j.cancel_print = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
            m.cancelPrint({}, (function(a) {
                t("log", "\u53d6\u6d88\u6253\u5370", a, " at models/printer/ios_ble.js:230"), uni.$emit("start_cancel_print"), e && e()
            }))
        }, j.is_connected = function() {
            return t("log", "is_connected", " at models/printer/ios_ble.js:237"), new Promise((function(e, a) {
                m.queryConnectStatus({}, (function(a) {
                    t("log", a, " at models/printer/ios_ble.js:240"), e(-1 != a.code)
                }))
            }))
        }, j.search = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
            m.searchBlePrinter({
                research_uuid: e
            }, (function(e) {
                0 == e.code ? (setTimeout((function() {
                    j.stop_search_printer()
                }), 60), _fun && _fun(e)) : t("log", "search_ble_printer \u5931\u8d25\u4e86", " at models/printer/ios_ble.js:293")
            }))
        }, j.connect = function(e, a, i) {
            var s = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "";
            v.ble_uuid = e, v.ble_mac = a, v.isMXW01Board = s, v.broadcast = n, a, m.connectPrinter({
                uuid: e,
                isMXW01Board: s
            }, (function(e) {
                t("log", "connect_printer \u8c03\u7528\u7ed3\u679c\uff1a", e, " at models/printer/ios_ble.js:309"), 0 == e.code ? i && i(0) : t("log", "connect_printer \u5931\u8d25\u4e86", " at models/printer/ios_ble.js:313")
            }))
        }, j.print_hex = function() {
            var e = (0, n.default)(s.default.mark((function e(a, i, n) {
                var r, A, u, f, h, b, y, k, z, w, j, x, v, q, B, I, Q, E, D, F, P, S, M, U, Y, N, G, T, O, X, K, R, L, H, W, V, J, Z, _, $, ee, te, ae, ie, se = arguments;
                return s.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (r = se.length > 3 && void 0 !== se[3] ? se[3] : 1, A = se.length > 4 && void 0 !== se[4] ? se[4] : [], u = se.length > 5 && void 0 !== se[5] && se[5], f = se.length > 6 && void 0 !== se[6] && se[6], a) {
                                e.next = 6;
                                break
                            }
                            return e.abrupt("return");
                        case 6:
                            if (h = !1, b = "", y = "", k = null, C && C.ble_name && (y = C.ble_name, y = y.toUpperCase(), y = y.replace(/\s+/g, ""), n = n || C.model), a.length > 50 && "2221B5" != a.substr(0, 6).toUpperCase() ? getApp().globalData.printing = 1 : (getApp().globalData.printing = 0, "V5X" == n && (h = !0)), z = p.default.mx06_list, w = p.default.mx10_list, j = 4, x = !1, (z.indexOf(y) >= 0 || w.indexOf(y) >= 0 || A[3] >= A[1]) && (x = !0), a.length > 50 && r > j && 4 == A.length && x && (c.default.is_handle_d2_status(y) || w.indexOf(y) >= 0) && !u) {
                                for (v = Math.min(A[3], A[1]), q = !1, v != A[3] && (q = !0), B = !1, !1, I = 95, t("log", w.indexOf(y), " at models/printer/ios_ble.js:371"), z.indexOf(y) >= 0 && (Q = o.default.get_last_print_record(), Q ? (E = Date.parse(new Date), D = o.default.get_last_complete_time(), E - D <= 50 ? (v = Math.min(Q.nongdu, v) - 10, q = !0, B = !0) : (v = Math.min(110, v), q = !0)) : (v = Math.min(110, v), q = !0)), w.indexOf(y) >= 0 && (U = {}, t("log", q, " at models/printer/ios_ble.js:393"), t("log", j, " at models/printer/ios_ble.js:394"), t("log", I, " at models/printer/ios_ble.js:395"), t("log", A, " at models/printer/ios_ble.js:396"), U = ["PD01", "IM.17", "MINISO-M1", "MINISO-M12"].includes(y) ? p.default.pd01_serial_continuous_nongdu(q, j, I, A) : p.default.mx10_serial_continuous_nongdu(q, j, I, A), v = null === (F = U) || void 0 === F ? void 0 : F.begin_nongdu_value, j = null === (P = U) || void 0 === P ? void 0 : P.not_need_change_nongdu_nums, I = null === (S = U) || void 0 === S ? void 0 : S.mx10_min_nongdu, q = null === (M = U) || void 0 === M ? void 0 : M.flag_update_hex_cmd), t("log", "\u5f00\u59cb\u7684\u6d53\u5ea6", v, " at models/printer/ios_ble.js:408"), q && (Y = d.default.int2hex(v), 1 == Y.length && (Y = "0" + Y), N = o.default.hexStr2Bytes("01" + Y), G = "5178F2000200" + g.default.crc8(N) + "FF", a = G + a.substr(20)), T = 1; T <= j; T++) b += a, t("log", "\u6d53\u5ea6", v, " at models/printer/ios_ble.js:421");
                                O = r - j, ["PD01", "IM.17", "MINISO-M1", "MINISO-M12"].includes(y) ? (K = p.default.get_pd01_continuous_hex(b, a, v, O), b = K.hex_cmd, X = K.last_nongdu_value) : (R = p.default.get_continuous_hex(y, b, a, v, O, B, I), b = R.hex_cmd, X = R.last_nongdu_value), o.default.last_print_record(r, X)
                            } else
                                for (L = A[3], !1, a.length > 50 && c.default.is_handle_d2_status(y) && o.default.get_d2_status() && z.indexOf(y) >= 0 && (H = o.default.get_last_complete_time(), W = Date.parse(new Date) / 1e3, W - H < 50 && (L = o.default.get_last_nongdu(), L > 150 && (L = 150), L -= 20, L < 70 && (L = 70), !0)), a.length > 50 && w.indexOf(y) >= 0 && o.default.get_printer_wendu() >= 50 && (V = o.default.get_printer_wendu(), L = ["PD01", "IM.17", "MINISO-M1", "MINISO-M12"].includes(y) ? p.default.pd01_nongdu(V, A) : p.default.mx10_serial_nongdu(V, A), t("log", "\u6e29\u5ea6:", o.default.get_printer_wendu(), ",\u6d53\u5ea6:", L, " at models/printer/ios_ble.js:471"), J = d.default.int2hex(L), 1 == J.length && (J = "0" + J), Z = o.default.hexStr2Bytes("01" + J), _ = "5178F2000200" + g.default.crc8(Z) + "FF", a = _ + a.substr(20)), A.length >= 4 && o.default.set_last_nongdu(L), $ = 0; $ < r; $++) b += a;
                            if ("V5X" != n.toUpperCase() && (getApp().globalData.print_percent = 0), ee = 20, "V7S" != n.toUpperCase() && "V7SPRO" != n.toUpperCase() || (ee = 45), "V8" != n.toUpperCase() && "V8PRO" != n.toUpperCase() || (ee = 70), "V5N" != n.toUpperCase() && "V5NPRO" != n.toUpperCase() || (ee = 30), "V5X" == n.toUpperCase()) {
                                ee = 30;
                                try {
                                    parseInt(plus.os.version) >= 17 && !f && (ee = 45)
                                } catch (error) {
                                    t("error", error, " at models/printer/ios_ble.js:515")
                                }
                            }
                            "V10" == n.toUpperCase() && (te = l.default.get_printer_info(), te && te.ble_address && (ae = ["00:15:83:3B:E8:08", "00:15:83:37:99:58"], -1 != ae.indexOf(te.ble_address) && (ee = 50))), "V8SJP" == n.toUpperCase() && (ee = 50), c.default.is_handle_d2_status(y) && !u && (ee = 60), "5178A2" == b.substr(0, 6) && "5178A1" == b.substr(-6) && (ee = 30), "V10G" == n.toUpperCase() && (ee = 20), ie = {
                                hex_cmd: b,
                                speed: ee,
                                model: n,
                                is_command: h
                            }, k && (ie.package_length = k), o.default.is_q7_series_device(y) && (ie.speed = 10, ie.needSplitHex = !0, ie.pringModel = f ? "gray" : "dot"), m.printCmdFromHexstring(ie, (function(e) {
                                0 == e.code ? i && i(1) : t("log", "print_image_from_hexstring \u5931\u8d25\u4e86", " at models/printer/ios_ble.js:569")
                            }));
                        case 33:
                        case "end":
                            return e.stop()
                    }
                }), e)
            })));
            return function(t, a, i) {
                return e.apply(this, arguments)
            }
        }(), j.set_printer_info = function(e) {
            C = e
        }, j.get_deivce = function() {
            return C
        }, j.print_hex_cmd = function(e, a) {
            m.printCMDWithNotify({
                hex_cmd: e
            }, (function(e) {
                t("log", "print_hex_cmd \u8c03\u7528\u7ed3\u679c", e, " at models/printer/ios_ble.js:587")
            }))
        }, j.stop_search_printer = function() {
            m.stopSearchPrinter({}, (function(e) {
                t("log", "stop_search_printer \u8c03\u7528\u7ed3\u679c\uff1a", e, " at models/printer/ios_ble.js:594")
            }))
        }, j.print_cmd_without_notity = function(e) {
            m.printCMDWithoutNotify({
                hex_cmd: e
            }, (function(e) {
                t("log", "print_cmd_without_notity", e, " at models/printer/ios_ble.js:606")
            }))
        }, j.print_cmd_with_notify = function(e) {
            m.printCMDWithNotify({
                hex_cmd: e
            }, (function(e) {
                t("log", e, " at models/printer/ios_ble.js:619")
            }))
        }, j.disconnct = function(e) {
            m.disconnectPrinter({}, (function(a) {
                t("log", "disconnct \u8c03\u7528\u7ed3\u679c\uff1a", a, " at models/printer/ios_ble.js:629"), 0 == a.code ? e && e(a) : t("log", "disconnct \u5931\u8d25\u4e86", " at models/printer/ios_ble.js:633")
            }))
        }, j.test = function(e, a) {
            var i = q(e),
                s = I(a);
            t("log", "quality_cmd:" + i, " at models/printer/ios_ble.js:641"), t("log", "energy_cmd:" + s, " at models/printer/ios_ble.js:642")
        }, j.get_v5g_parameter_hex = function(e, t, a, i) {
            var s = q(a),
                n = I(i);
            return e = s + n + "5178A6000B00AA551738445F5F5F44382CA1FF5178BE0001000000FF5178BD0001000A36FF" + e + "5178BD000100194FFF5178A10002003000F9FF5178A6000B00AA5517000000000000001711FF", e
        }, e.exports = j
    }).call(this, a("f3b9")["default"])
}