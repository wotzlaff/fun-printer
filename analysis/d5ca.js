function(e, t, a) {
    "use strict";
    (function(e) {
        var i = a("47a9");
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.bq_dignwei = b, t.bq_learn = function() {
            n.default.print_cmd("2221B2000100000000", "V5X")
        }, t.cancel_print = function() {
            getApp().globalData.v5x_print_nums = 0, n.default.print_cmd("2221AC0001000000ff", "V5X")
        }, t.get_print_head_type = c, t.get_v5x_custom_density_value = function(e, t, a) {
            if (!t) return;
            var i = uni.getStorageSync("V5X_LAST_CUSTOM_DENSITY_VALUE" + e + t + a);
            if (!i)
                if ("gray" == a) i = 100;
                else {
                    var s = f();
                    i = s[a][1] + 10, i = i >= 100 ? 100 : i
                } return i > 100 ? 100 : i
        }, t.hex_density_convert = function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "image",
                a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "dot",
                i = "05" == e ? 0 : "0A" == e ? 1 : 2,
                s = f();
            "gray" == a && "image" == t && (t = "gray");
            return s[t][i]
        }, t.hex_to_utf8 = function(e) {
            "string" === typeof e && e.length % 2 === 0 || uni.$emit("get_device_wifi_list", "");
            var t = new Uint8Array(e.match(/.{1,2}/g).map((function(e) {
                    return parseInt(e, 16)
                }))),
                a = "",
                i = 0;
            while (i < t.length) {
                var s = t[i],
                    n = void 0;
                if (s < 128) n = s, i += 1;
                else if (s < 224) {
                    var r = t[i + 1];
                    n = (31 & s) << 6 | 63 & r, i += 2
                } else if (s < 240) {
                    var l = t[i + 1],
                        o = t[i + 2];
                    n = (15 & s) << 12 | (63 & l) << 6 | 63 & o, i += 3
                } else {
                    var A = t[i + 1],
                        g = t[i + 2],
                        d = t[i + 3];
                    n = (7 & s) << 18 | (63 & A) << 12 | (63 & g) << 6 | 63 & d, i += 4
                }
                a += String.fromCodePoint(n)
            }
            return a
        }, t.is_convert_to_16 = function() {
            var e = g();
            if (e) {
                var t = e.substr(4, 3);
                return t = t.split("."), 2 != t.length || !(t[0] <= 1) && !(t[1] <= 0)
            }
            return !0
        }, t.is_use_gamma_handle = function() {
            var e = !1;
            try {
                e = !1 !== uni.getStorageSync("V5X_GRAY_PRINT_USE_GAMMA_HANDLE");
                var t = g();
                t && 9 == t.length || (e = !1)
            } catch (a) {}
            return e
        }, t.save_v5x_custom_density_value = function(e, t, a, i) {
            if (!t) return;
            uni.setStorageSync("V5X_LAST_CUSTOM_DENSITY_VALUE" + e + t + a, i)
        }, t.update_density = h, t.v5x_density_kv_map = function() {
            var e = f(),
                t = {
                    text: {
                        "05": e["text"][0],
                        "0A": e["text"][1],
                        "0D": e["text"][2]
                    },
                    image: {
                        "05": e["image"][0],
                        "0A": e["image"][1],
                        "0D": e["image"][2]
                    },
                    gray: {
                        "05": e["gray"][0],
                        "0A": e["gray"][1],
                        "0D": e["gray"][2]
                    }
                };
            return t
        }, t.v5x_notify_handler = function(t, a) {
            (getApp().globalData.v5x_label.get_find_status() || "2221f00101000107ff" == t) && getApp().globalData.v5x_label.notify(t);
            var i = t.substr(4, 2);
            switch (i) {
                case "a1":
                    (function(e, t) {
                        var a = e.match(/.{1,2}/g),
                            i = a[6],
                            s = parseInt(a[9], 16),
                            n = parseInt(a[10], 16),
                            r = a[12],
                            l = a[13],
                            o = "",
                            A = "",
                            g = !1,
                            d = "";
                        if (function(e) {
                                uni.setStorageSync("V5X_CURRENT_WEN_DU_VALUE", e)
                            }(n), "00" == r) {
                            switch (i) {
                                case "00":
                                    A = "\u6b63\u5e38";
                                    break;
                                case "01":
                                    A = "\u6253\u5370\u4e2d";
                                    break;
                                case "02":
                                    A = "\u8d70\u7eb8\u4e2d";
                                    break;
                                case "03":
                                    A = "\u9000\u7eb8\u4e2d";
                                    break;
                                default:
                                    break
                            }
                            d = "zhengchang", o = "\u6253\u5370\u673a\u4efb\u52a1\u72b6\u6001:", A += "; \u7535\u91cf:" + s + "; \u6e29\u5ea6:" + n, g = !0
                        } else if ("01" == r) switch (l) {
                            case "01":
                                o = getApp().globalData.$t("message").zywl, A = getApp().globalData.$t("message").qzywlqxzzzldy, d = "quezhi", g = !0;
                                break;
                            case "04":
                                o = getApp().globalData.$t("message").grtx, A = getApp().globalData.$t("message").qwtrlxxxzldyb, d = "guore", g = !0;
                                break;
                            case "08":
                                o = getApp().globalData.$t("message").dlbzl, A = getApp().globalData.$t("message").xzkmdlgwcxd, d = "didian", g = !0;
                                break;
                            case "09":
                                o = getApp().globalData.$t("message").zywl, A = getApp().globalData.$t("message").qzywlqxzzzldy, d = "quezhi", g = !0;
                                break;
                            default:
                                break
                        }
                        if (g) {
                            var c = getCurrentPages(),
                                u = getApp().globalData.$t("message")["zt:"],
                                f = c[c.length - 1].$getAppWebview();
                            "pages/print_preview/print_webview_preview" == f.__uniapp_route || "pages/print_preview/print_tattoo_preview" == f.__uniapp_route ? uni.$emit("print_status_alter", d) : "zhengchang" == d ? "pages/setting/v5x_test" == f.__uniapp_route && y(o, "".concat(u).concat(A)) : y(o, "".concat(u).concat(A))
                        }
                    })(t);
                    break;
                case "ab":
                    parseInt(t.substr(-4, 2), 16);
                    break;
                case "a6":
                    n.default.print_cmd("2221A70000000000", "V5X");
                    break;
                case "a7":
                    n.default.ble_auth(null === a || void 0 === a ? void 0 : a.ble_name, null === a || void 0 === a ? void 0 : a.ble_address, t, null === a || void 0 === a ? void 0 : a.model);
                    break;
                case "a3":
                    uni.hideLoading();
                    break;
                case "aa":
                    t.substr(12, 2);
                    u();
                    break;
                case "a9":
                    var s = t.substr(-4, 2);
                    "00" == s ? function() {
                        var t = getApp().globalData.v5x_image_data_hex;
                        if (!t) return void e("log", "to_send_image_data hex \u4e3a\u7a7a", " at models/printer/v5x_print.js:927");
                        n.default.ble_print_hex(t, "V5X", (function(e) {}), 1, [], !1, getApp().globalData.v5x_gray_print)
                    }() : (e("log", "A9\u8fd4\u56de, \u975e\u6b63\u5e38\u72b6\u6001:" + s, " at models/printer/v5x_print.js:114"), uni.$emit("v5x_a9_error_status"));
                    break;
                case "b0":
                    var o = "01" == t.substr(12, 2) ? "gaoya" : "ff" == t.substr(12, 2) ? "weishibie" : "diya";
                    d(o), uni.$emit("v5x_show_print_type", {
                        type: o
                    });
                    break;
                case "b1":
                    var A = t.substr(12, 18);
                    if (A = r.default.hex_to_str(A), A) {
                        var g = "2" == A.substr(-1) ? "gaoya" : "1" == A.substr(-1) ? "diya" : "weishibie";
                        d(g), uni.$emit("v5x_show_print_type", {
                            type: g
                        })
                    }(function(e) {
                        uni.setStorageSync("V5X_FIREWARE_VERSION", e)
                    })(A);
                    break;
                case "b2":
                    setTimeout((function(e) {
                        b()
                    }), 700);
                    break;
                case "b3":
                    var c = (0, l.get_sign_cmd_for_mxw01)(t.substr(12, 20));
                    n.default.print_cmd(c, "V5X");
                    break;
                case "b6":
                    "01" == t.substr(6, 2) ? uni.$emit("support_device_wifi_list", !0) : uni.$emit("support_device_wifi_list", !1);
                    break;
                default:
                    break
            }
        }, t.v5x_packages_callback = function(e) {
            if (e.totalPackages > 1) {
                e.totalPackages == e.currentIndex && (n.default.print_log(), n.default.print_cmd("2221ad000100000000", "V5X"));
                var t = e.writeLenght;
                "ios" == uni.getSystemInfoSync().platform && (t = 2 * parseInt(t)), getApp().globalData.v5x_hex_sended_length += t;
                var a = Math.ceil(getApp().globalData.v5x_hex_sended_length / getApp().globalData.v5x_hex_total_length * 100);
                getApp().globalData.print_percent = a > 99 ? 99 : a
            }
        }, t.v5x_start_print = u;
        var s = i(a("9673")),
            n = i(a("e289")),
            r = i(a("a061")),
            l = (a("0483"), a("c2e7")),
            o = {
                text: [88, 93, 98],
                image: [88, 93, 98],
                gray: [75, 88, 98]
            },
            A = {
                text: [90, 93, 98],
                image: [90, 93, 98],
                gray: [75, 85, 98]
            };

        function g() {
            try {
                return uni.getStorageSync("V5X_FIREWARE_VERSION")
            } catch (e) {}
            return ""
        }

        function d(e) {
            uni.setStorageSync("V5X_PRINT_HEAD_TYPE", e)
        }

        function c() {
            var e = "gaoya";
            try {
                e = uni.getStorageSync("V5X_PRINT_HEAD_TYPE")
            } catch (t) {}
            return e
        }

        function u() {
            var t, a = getApp().globalData.v5x_start_print_cmd;
            if (!a || getApp().globalData.v5x_print_nums <= 0) return getApp().globalData.print_percent = 100, getApp().globalData.v5x_image_data_hex = null, void e("log", "\u6ca1\u6709\u9700\u8981\u6253\u5370\u7684\u5185\u5bb9\u4e86", " at models/printer/v5x_print.js:388");
            var i = 1 * function() {
                    var e = 0;
                    try {
                        e = uni.getStorageSync("V5X_CURRENT_WEN_DU_VALUE")
                    } catch (t) {}
                    return e
                }(),
                s = 1 * function() {
                    var e = 0;
                    try {
                        e = uni.getStorageSync("V5X_USER_CHOOSE_NONG_DU_KEY")
                    } catch (t) {}
                    return e
                }(),
                r = 1 * function() {
                    var e = 0;
                    try {
                        e = uni.getStorageSync("V5X_REAL_NONG_DU_KEY")
                    } catch (t) {}
                    return e
                }(),
                l = 0,
                o = 0,
                A = c(),
                g = getApp().globalData.v5x_gray_print ? "gray" : "dot",
                d = getApp().globalData.black_dot_percentage;
            o = "0F" == getApp().globalData.selected_density_code ? function(e, t, a) {
                var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "dot",
                    s = t;
                if ("gray" == i) return e >= 70 ? s = 56 : e >= 65 ? s = 65 : e >= 60 ? s = 75 : e >= 55 ? s = 80 : e >= 50 && (s = 85), s > t && (s = t), s;
                e >= 35 && (s = e <= 40 ? 95 : e <= 45 ? 80 : e <= 50 ? 75 : e <= 55 ? 55 : e <= 60 ? 45 : e <= 65 ? 40 : e <= 70 ? 35 : 25);
                s > t && (s = t);
                return s
            }(i, s, r, g, d) : "gaoya" == A ? function(e, t, a) {
                var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "dot",
                    s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
                    n = t;
                if ("gray" == i) return e >= 70 ? n = 56 : e >= 65 ? n = 65 : e >= 60 ? n = 75 : e >= 55 ? n = 80 : e >= 50 && (n = 85), n > t && (n = t), n;
                var r = 1;
                s > .4 && (r = s < .5 ? 2 : s < .7 ? 3 : 4);
                var l = 45;
                1 == getApp().globalData.selected_print_nums && (l = 60);
                var o = uni.getStorageSync("last_connected_printer");
                if (o && "INSTAPRINT" == o["ble_name"]) e >= 80 ? n = 55 : e >= 70 ? n = 65 : e >= 60 ? n = 75 : e >= 50 && (n = 85);
                else if (e >= l)
                    if (e < 50) switch (r) {
                        case 1:
                            n = 87;
                            break;
                        case 2:
                            n = 48;
                            break;
                        case 3:
                            n = 22;
                            break;
                        case 4:
                            n = 15;
                            break
                    } else if (e < 55) switch (r) {
                        case 1:
                            n = 74;
                            break;
                        case 2:
                            n = 36;
                            break;
                        case 3:
                            n = 20;
                            break;
                        case 4:
                            n = 10;
                            break
                    } else if (e < 60) switch (r) {
                        case 1:
                            n = 61;
                            break;
                        case 2:
                            n = 25;
                            break;
                        case 3:
                            n = 15;
                            break;
                        case 4:
                            n = 10;
                            break
                    } else if (e < 65) switch (r) {
                        case 1:
                            n = 48;
                            break;
                        case 2:
                            n = 15;
                            break;
                        case 3:
                            n = 15;
                            break;
                        case 4:
                            n = 10;
                            break
                    } else if (e < 70) switch (r) {
                        case 1:
                            n = 36;
                            break;
                        case 2:
                            n = 9;
                            break;
                        case 3:
                            n = 5;
                            break;
                        case 4:
                            n = 5;
                            break
                    } else switch (r) {
                        case 1:
                            n = 22;
                            break;
                        case 2:
                            n = 5;
                            break;
                        case 3:
                            n = 3;
                            break;
                        case 4:
                            n = 3;
                            break
                    } else n = t;
                n > t && (n = t);
                return n
            }(i, s, r, g, d) : function(e, t, a) {
                var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "gray",
                    s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
                    n = t;
                if ("gray" == i) return e >= 70 ? n = 56 : e >= 65 ? n = 60 : e >= 60 ? n = 65 : e >= 55 ? n = 75 : e >= 50 && (n = 80), n > t && (n = t), n;
                var r = 1;
                s > .4 && (r = s < .5 ? 2 : r < .7 ? 3 : 4);
                var l = 45;
                1 == getApp().globalData.selected_print_nums && (l = 60);
                if (e > l)
                    if (e <= 50) switch (r) {
                        case 1:
                            n = 90;
                            break;
                        case 2:
                            n = 85;
                            break;
                        case 3:
                            n = 85;
                            break;
                        case 4:
                            n = 65;
                            break
                    } else if (e <= 55) switch (r) {
                        case 1:
                            n = 85;
                            break;
                        case 2:
                            n = 75;
                            break;
                        case 3:
                            n = 75;
                            break;
                        case 4:
                            n = 55;
                            break
                    } else if (e <= 60) switch (r) {
                        case 1:
                            n = 75;
                            break;
                        case 2:
                            n = 65;
                            break;
                        case 3:
                            n = 65;
                            break;
                        case 4:
                            n = 45;
                            break
                    } else if (e <= 65) switch (r) {
                        case 1:
                            n = 60;
                            break;
                        case 2:
                            n = 50;
                            break;
                        case 3:
                            n = 50;
                            break;
                        case 4:
                            n = 30;
                            break
                    } else if (e <= 70) switch (r) {
                        case 1:
                            n = 50;
                            break;
                        case 2:
                            n = 40;
                            break;
                        case 3:
                            n = 40;
                            break;
                        case 4:
                            n = 20;
                            break
                    } else switch (r) {
                        case 1:
                            n = 40;
                            break;
                        case 2:
                            n = 30;
                            break;
                        case 3:
                            n = 30;
                            break;
                        case 4:
                            n = 10;
                            break
                    } else n = t;
                return n
            }(i, s, r, g, d);
            var u = uni.getStorageSync("last_connected_printer"),
                f = "";
            u && u.hasOwnProperty("ble_name") && (f = u.ble_name);
            var p = null === (t = getApp().globalData.get_ble_lists) || void 0 === t ? void 0 : t.V5X_DATA_LIST,
                m = p.find((function(e) {
                    return e.name == f
                }));
            if (m && m.density) try {
                var b = m.density;
                o = function(e, t, a, i, s) {
                    var n = "diya" == a ? "diyaHeader" : "gaoyaHeader",
                        r = "gray" == t ? "grayPrint" : "dotPrint",
                        l = i[n]["imageModel"][r];
                    for (var o in l)
                        if (e >= l[o][0] && e < l[o][1]) return o;
                    return s
                }(i, g, A, b, o)
            } catch (y) {
                e("error", "density \u89e3\u6790\u5931\u8d25:", y, " at models/printer/v5x_print.js:424")
            }
            o > 0 && r != o && (h(o, !1), !0, l = 60), "gaoya" == A && d > .4 && (l = 200), setTimeout((function(e) {
                getApp().globalData.v5x_print_nums--, n.default.print_cmd(a, "V5X")
            }), l)
        }

        function f() {
            var e = c();
            return "gaoya" == e ? o : A
        }

        function h(t) {
            var a = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
            a && p(t), m(t), e("log", "debug_level v5x", t, " at models/printer/v5x_print.js:865"), t = parseInt(t).toString(16), 1 == t.length && (t = "0" + t);
            var i = "2221A2000100" + s.default.crc8(n.default.hexStr2Bytes(t)) + "FF";
            n.default.print_cmd(i, "V5X")
        }

        function p(e) {
            uni.setStorageSync("V5X_USER_CHOOSE_NONG_DU_KEY", e)
        }

        function m(e) {
            uni.setStorageSync("V5X_REAL_NONG_DU_KEY", e)
        }

        function b() {
            n.default.print_cmd("2221A300020000000000", "V5X")
        }

        function y(e, t) {
            uni.hideLoading(), uni.hideToast(), uni.showModal({
                title: e,
                content: t,
                confirmText: getApp().globalData.$t("message").qd,
                showCancel: !1,
                success: function() {}
            })
        }
    }).call(this, a("f3b9")["default"])
}