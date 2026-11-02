function(e, t, a) {
    "use strict";
    (function(e) {
        var i = a("47a9");
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = void 0;
        var s = i(a("127e")),
            n = i(a("ee10")),
            r = i(a("e289")),
            l = i(a("57d8")),
            o = i(a("0ef3")),
            A = i(a("9673")),
            g = i(a("a061")),
            d = i(a("1ddb")),
            c = a("d5ca"),
            u = (a("0483"), uni.requireNativePlugin("ImageProcess"));

        function f() {
            return f = (0, n.default)(s.default.mark((function e(t, a, i, n) {
                var r, l, o, A, d = arguments;
                return s.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (r = d.length > 4 && void 0 !== d[4] ? d[4] : 0, l = 0, o = 0, t = plus.io.convertLocalFileSystemURL(t), a) {
                                e.next = 10;
                                break
                            }
                            return e.next = 6, g.default.get_image_info(t);
                        case 6:
                            A = e.sent, a = A.width, i = A.width, n = A.height;
                        case 10:
                            return l = a - i, e.abrupt("return", new Promise((function(e) {
                                u.handleImageWithoutModel({
                                    image_path: t,
                                    bg_width: a,
                                    dst_width: i,
                                    dst_height: n,
                                    top: r,
                                    left: l,
                                    bottom: o
                                }, (function(a) {
                                    if (a.debug);
                                    else {
                                        var i = t;
                                        0 == a.code && (i = a.image), e(i)
                                    }
                                }))
                            })));
                        case 12:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), f.apply(this, arguments)
        }

        function h(t, a, i) {
            var s = 384,
                n = 1,
                l = 0;
            if ("v5" == a.toLowerCase() || "v5pro" == a.toLowerCase() || "v7" == a.toLowerCase() || "v7pro" == a.toLowerCase()) switch (a.toLowerCase()) {
                case "v5":
                    n = .95, l = 1, s = 384;
                    break;
                case "v5pro":
                    n = .95, l = 1, s = 576;
                    break;
                case "v7":
                    s = 576, n = .98, l = 30;
                    break;
                case "v7pro":
                    s = 832, n = .98, l = 38;
                    break
            }
            u.handleImage({
                image_path: t,
                model: a,
                print_mode: "text",
                scale: n,
                top: l,
                bottom: 0,
                needDither: !0,
                modified_px: s
            }, (function(s) {
                if (s.debug);
                else {
                    e("log", a, s, " at models/opencv.js:402");
                    var n = t;
                    0 == s.code && (n = s.image), getApp().globalData.v5_printer.write("", (function(e) {
                        "1" == e && (uni.showToast({
                            icon: "success",
                            title: "\u6253\u5370\u5b8c\u6210",
                            duration: 2e3
                        }), r.default.print_log())
                    }), !0, i, n)
                }
            }))
        }

        function p(e, t, a, i, s, n, r, l, o, A, g) {
            var d = arguments.length > 11 && void 0 !== arguments[11] ? arguments[11] : "",
                c = [];
            if (g && "http" == g[0].substring(0, 4))
                for (var f = 0; f < g.length; f++) c.push(g[f]);
            else
                for (var h = 0; h < g.length; h++) c.push("https://g.yintb.com/" + g[h]);
            var p = {
                images_path: JSON.stringify(c),
                model: t,
                print_mode: i,
                scale: s,
                left: n,
                top: r,
                rotate: l,
                modified_px: a,
                mixHeight: 2200,
                paperType: d
            };
            if ("ios" != uni.getSystemInfoSync().osName) u.hexForV10GHBPrints({
                images_path: JSON.stringify(c),
                model: t,
                print_mode: i,
                scale: s,
                left: n,
                top: r,
                rotate: l,
                modified_px: a,
                mixHeight: 2200
            }, (function(e) {
                0 == e.code && e.hex && k(e.hex, t, o, A, 0, 0, !1, 1, 0, [], !1)
            }));
            else {
                var m = u.hexForV10GHBPrints(p);
                0 == m.code && m.hex && k(m.hex, t, o, A, 0, 0, !1, 1, 0, [], !1)
            }
        }

        function m(e, t, a, i) {
            var s, n = a;
            "BQ02" == n ? s = {
                size40: {
                    rightBorder: 5,
                    topBorder: 2
                },
                size25: {
                    rightBorder: 3,
                    topBorder: 3
                },
                size50: {
                    rightBorder: 12,
                    topBorder: 5
                },
                size30: {
                    rightBorder: 10,
                    topBorder: 3
                },
                size20: {
                    rightBorder: 13,
                    topBorder: 0
                }
            } : "BQ03" == n ? s = {
                size40: {
                    rightBorder: 2,
                    topBorder: 17
                },
                size25: {
                    rightBorder: 1,
                    topBorder: 18
                },
                size50: {
                    rightBorder: 10,
                    topBorder: 19
                },
                size30: {
                    rightBorder: 8,
                    topBorder: 17
                },
                size20: {
                    rightBorder: 8,
                    topBorder: 18
                }
            } : "BQ17" == n ? s = {
                size40: {
                    rightBorder: 36,
                    topBorder: 14
                },
                size50: {
                    rightBorder: 10,
                    topBorder: 19
                }
            } : ["BH03", "PD03", "BHSZY"].includes(n) && (s = {
                "size40*20": {
                    rightBorder: 41,
                    topBorder: 0
                },
                "size50*15": {
                    rightBorder: 6,
                    topBorder: 0
                },
                "size50*70": {
                    rightBorder: 3,
                    topBorder: 6
                }
            });
            var r = {};
            return r = "BQ17" == n ? {
                40: {
                    rightBorder: s ? s.size40.rightBorder : 47,
                    topBorder: s ? s.size40.topBorder : 9,
                    v2LabelWidth: Math.floor(e / 25.4 * 200 * .98)
                },
                50: {
                    rightBorder: s ? s.size50.rightBorder : "v5g" == t ? 30 : -10,
                    topBorder: s ? s.size50.topBorder : "v5g" == t ? 20 : -3,
                    v2LabelWidth: Math.floor(e / 25.4 * 200 * .97)
                }
            } : ["BH03", "PD03", "BHSZY"].includes(n) ? {
                "40*20": {
                    rightBorder: s ? s["size40*20"].rightBorder : 47,
                    topBorder: s ? s["size40*20"].topBorder : 9,
                    v2LabelWidth: 295
                },
                "50*15": {
                    rightBorder: s ? s["size50*15"].rightBorder : -10,
                    topBorder: s ? s["size50*15"].topBorder : -3,
                    v2LabelWidth: 376
                },
                "50*70": {
                    rightBorder: s ? s["size50*70"].rightBorder : -10,
                    topBorder: s ? s["size50*70"].topBorder : -3,
                    v2LabelWidth: 378
                }
            } : {
                40: {
                    rightBorder: s ? s.size40.rightBorder : 47,
                    topBorder: s ? s.size40.topBorder : 9,
                    v2LabelWidth: "BQ03" == n ? Math.floor(e / 25.4 * 200 * .99) : Math.floor(e / 25.4 * 200 * .95)
                },
                25: {
                    rightBorder: s ? s.size25.rightBorder : 13,
                    topBorder: s ? s.size25.topBorder : 7,
                    v2LabelWidth: Math.floor(e / 25.4 * 200 * .95)
                },
                50: {
                    rightBorder: s ? s.size50.rightBorder : "v5g" == t ? 30 : -10,
                    topBorder: s ? s.size50.topBorder : "v5g" == t ? 20 : -3,
                    v2LabelWidth: Math.floor(e / 25.4 * 200 * .97)
                },
                30: {
                    rightBorder: s ? s.size30.rightBorder : 10,
                    topBorder: s ? s.size30.topBorder : 3,
                    v2LabelWidth: Math.floor(e / 25.4 * 200 * .97)
                },
                20: {
                    rightBorder: s ? s.size20.rightBorder : 7,
                    topBorder: s ? s.size20.topBorder : 3,
                    v2LabelWidth: Math.floor(e / 25.4 * 200 * .97)
                }
            }, ["BH03", "PD03", "BHSZY"].includes(n) && r.hasOwnProperty("".concat(e, "*").concat(i)) ? r["".concat(e, "*").concat(i)] : r.hasOwnProperty(e) ? r[e] : {
                rightBorder: 15,
                topBorder: 15,
                v2LabelWidth: Math.floor(e / 25.4 * 200 * .95)
            }
        }

        function b(e, t) {
            var a = {
                40: {
                    rightBorder: 5,
                    topBorder: -4,
                    v2LabelWidth: Math.floor(e / 25.4 * 200 * .95)
                },
                50: {
                    rightBorder: 5,
                    topBorder: -4,
                    v2LabelWidth: Math.floor(e / 25.4 * 200 * .97)
                },
                30: {
                    rightBorder: 10,
                    topBorder: 3,
                    v2LabelWidth: Math.floor(e / 25.4 * 200 * .97)
                }
            };
            return a.hasOwnProperty(e) ? a[e] : {
                rightBorder: 5,
                topBorder: 5,
                v2LabelWidth: Math.floor(e / 25.4 * 200 * .95)
            }
        }

        function y(t, a) {
            plus.io.resolveLocalFileSystemURL(t, (function(e) {
                e.file((function(e) {
                    var t = new plus.io.FileReader;
                    t.readAsText(e, "utf-8"), t.onloadend = function(e) {
                        var t = e.target.result;
                        a && a(t)
                    }
                }))
            }), (function(t) {
                e("log", "read_file fail", t.message, " at models/opencv.js:1258")
            }))
        }

        function k(e, t, a, i, s, n) {
            var r = arguments.length > 6 && void 0 !== arguments[6] && arguments[6],
                l = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 1,
                o = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : 15,
                A = arguments.length > 9 && void 0 !== arguments[9] ? arguments[9] : [],
                g = arguments.length > 10 && void 0 !== arguments[10] && arguments[10],
                d = arguments.length > 11 && void 0 !== arguments[11] ? arguments[11] : "";
            getApp().globalData.user_config.get_config().upload_hex && e.length > 1e3 ? getApp().globalData.upload_hex_str = e : getApp().globalData.upload_hex_str = "", getApp().globalData.v5g_is_label_print = !!r, setTimeout((function() {
                uni.hideLoading()
            }), 4e3), "Android" == plus.os.name ? z(e, t, a, i, s, n, r, l, "", o, A, g, d) : w(e, t, a, i, s, n, r, l, "", o, A, g, d)
        }

        function z(e, t, a, i, s, n) {
            var l = arguments.length > 6 && void 0 !== arguments[6] && arguments[6],
                o = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 1,
                A = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : "",
                g = arguments.length > 9 && void 0 !== arguments[9] ? arguments[9] : 15,
                d = arguments.length > 10 && void 0 !== arguments[10] ? arguments[10] : [],
                u = arguments.length > 11 && void 0 !== arguments[11] && arguments[11],
                f = arguments.length > 12 ? arguments[12] : void 0;
            if (t = t.toUpperCase(), "V5G" != t || !u || l)
                if (n || (n = "0F"), "V10" == t || "V8" == t || "V8PRO" == t) {
                    "V8" != t && "V8PRO" != t || getApp().globalData.android_printer.print_hex("1D8303", a, i, 6);
                    var p = getApp().globalData.android_printer.print_hex(e, a, i, e.length); - 1 != p && getApp().globalData.android_printer.print_hex("1B6460")
                } else if ("V8SJP" == t || "V8S" == t || "V8SPRO" == t || "X5" == t) {
                "X5" == t ? e = "1b370900CC" + e : "V8SJP" == t && (e += "1B6403");
                getApp().globalData.android_printer.print_hex(e, a, i, e.length);
                "V8SJP" == t && (uni.hideLoading(), uni.hideToast())
            } else if ("V5" == t || "V5PRO" == t || "V7" == t || "V7PRO" == t)
                if (e = "1B401223" + n + e, l) {
                    var m = "1B401223" + n;
                    A = A || a, getApp().globalData.v5_printer.write(m, (function(e) {
                        h(A, t, o)
                    }))
                } else getApp().globalData.v5_printer.write(e, (function(e) {
                    "1" == e && (uni.showToast({
                        icon: "success",
                        title: "\u6253\u5370\u5b8c\u6210",
                        duration: 2e3
                    }), r.default.print_log())
                }));
            else if ("V7S" == t || "V7SPRO" == t) {
                var b = "";
                b = "05" == n ? "40" : "0A" == n ? "30" : "20", e = "1D49F0" + b + e, getApp().globalData.android_printer.print_hex(e, a, i, e.length)
            } else if ("V5G" == t) {
                e = e.replace("5178A10002003000F9FF5178A10002003000F9FF", "5178A10002003000F9FF");
                var y = uni.getStorageSync("last_connected_printer"),
                    k = "";
                if (y && y.hasOwnProperty("ble_name") && (k = y.ble_name), l) return e = e.replace("5178A10002003000F9FF", ""), k && (getApp().globalData.v5g_label_print_ble_name = y["ble_name"], "MXW010" == k && (e = "5178D00101000107FF" + e)), getApp().globalData.v5g_is_label_print = !0, getApp().globalData.v5g_label_print_hex = e, getApp().globalData.v5g_label_print_model = t, getApp().globalData.v5g_label_print_printer_nums = o, getApp().globalData.v5g_label_print_printer_nums_total = o, getApp().globalData.v5g_label_print_lable_page_height = g, void(["BQ03", "BQ02", "BQ17"].includes(getApp().globalData.v5g_label_print_ble_name) ? (e = "5178F50001000107FF" + e + "5178A1000200010015FF", getApp().globalData.v5g_label_print_hex = e, getApp().globalData.bq02_lable_sended_length = 0, getApp().globalData.bq02_lable_total_length = e.length * o, getApp().globalData.v5g_label.bq_print()) : getApp().globalData.v5g_label.print());
                getApp().globalData.v5g_is_label_print = !1, "MXW010" == k && (e = "5178D00101000000FF" + e), getApp().globalData.use_android_ble ? getApp().globalData.android_ble.print_hex(e, t, (function(e) {
                    "1" == e && r.default.print_log()
                }), o, d) : getApp().globalData.ble.print_hex(e, a, i)
            } else if ("V5X" == t) {
                var z = "2221A9000400" + e.substr(12, 4),
                    w = uni.getStorageSync("last_connected_printer"),
                    j = "";
                w && w.hasOwnProperty("ble_name") && (j = w.ble_name), u && ["BH03", "PD03", "BHSZY"].includes(j) && "label_v2" == f ? z += "30030000" : z += l ? "30010000" : u ? "30020000" : "30000000", getApp().globalData.v5x_image_data_hex = e.substr(20), getApp().globalData.v5x_start_print_cmd = z, getApp().globalData.v5x_print_nums = o, getApp().globalData.selected_print_nums = o, getApp().globalData.v5x_hex_total_length = e.substr(20).length * o, getApp().globalData.v5x_hex_sended_length = 0, getApp().globalData.v5x_gray_print = u, (0, c.v5x_start_print)()
            } else "V5N" == t || "V5NPRO" == t ? (e = "1B401223" + n + e, getApp().globalData.use_android_ble ? getApp().globalData.android_ble.print_hex(e, t, (function(e) {
                "1" == e && r.default.print_log()
            })) : getApp().globalData.ble.print_hex(e, a, i)) : "V10G" == t || "V5C" == t ? getApp().globalData.android_ble.print_hex(e, t, (function(e) {
                "1" == e && r.default.print_log()
            })) : getApp().globalData.android_printer.print_hex(e, a, i, 6 * s + 10);
            else getApp().globalData.android_ble.print_hex(e, t, (function(e) {
                "1" == e && r.default.print_log()
            }), o, d)
        }

        function w(t, a, i, s, n, A) {
            var g = arguments.length > 6 && void 0 !== arguments[6] && arguments[6],
                d = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 1,
                u = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : "",
                f = arguments.length > 9 && void 0 !== arguments[9] ? arguments[9] : 15,
                h = arguments.length > 10 && void 0 !== arguments[10] ? arguments[10] : [],
                p = arguments.length > 11 && void 0 !== arguments[11] && arguments[11];
            if (a = a.toUpperCase(), "V5G" == a && p) getApp().globalData.ios_ble.print_hex(t, (function(e) {
                "1" == e && r.default.print_log()
            }), a, d, h, !1, p);
            else if (A || (A = "0F"), l.default.is_v5plugin_connect(a))
                if (t = t.substr(0, t.length - 2) + "04", t = "1B401223" + A + t, g) {
                    var m = "1B401223" + A;
                    u = u || i, e("log", "\u6d53\u5ea6:", m, " at models/opencv.js:1482"), getApp().globalData.v5_printer.write(m, (function(e) {
                        getApp().globalData.v5_printer.write(t, (function(e) {
                            "1" == e && (uni.showToast({
                                icon: "success",
                                title: "\u6253\u5370\u5b8c\u6210",
                                duration: 2e3
                            }), r.default.print_log())
                        }), g, d, u)
                    }))
                } else getApp().globalData.v5_printer.write(t, (function(e) {
                    "1" == e && (uni.showToast({
                        icon: "success",
                        title: "\u6253\u5370\u5b8c\u6210",
                        duration: 2e3
                    }), r.default.print_log())
                }));
            else if (l.default.is_ble_connect_by_model(a)) {
                if ("X5" == a) t = "1B4012230F1B3300" + t;
                else if ("V7S" == a || "V7SPRO" == a) {
                    var b = "";
                    b = "05" == A ? "40" : "0A" == A ? "30" : "20", t = "1D49F0" + b + t, "V7S" == a && (t += o.default.v7s_space_hex + o.default.v7s_space_hex + o.default.v7s_space_hex + o.default.v7s_space_hex)
                } else if ("V8" == a || "V8PRO" == a) t = "1D8303" + t;
                else if ("V10" == a) t += "1D83031B6460";
                else if ("V5N" == a || "V5NPRO" == a);
                else if ("V6" == a || "V6PRO" == a) t += "V6" == a ? "1B6404" : "1B6406";
                else if ("V8SJP" == a) t += "1B6403";
                else if ("V5G" == a) {
                    if (g) {
                        t = t.replace("5178A10002003000F9FF", "");
                        var y = uni.getStorageSync("last_connected_printer");
                        return y && void 0 != y["ble_name"] && (getApp().globalData.v5g_label_print_ble_name = y["ble_name"]), getApp().globalData.v5g_is_label_print = !0, getApp().globalData.v5g_label_print_hex = t, getApp().globalData.v5g_label_print_model = a, getApp().globalData.v5g_label_print_printer_nums = d, getApp().globalData.v5g_label_print_printer_nums_total = d, getApp().globalData.v5g_label_print_lable_page_height = f, void(["BQ03", "BQ02", "BQ17"].includes(getApp().globalData.v5g_label_print_ble_name) ? (t = "5178F50001000107FF" + t + "5178A1000200010015FF", getApp().globalData.v5g_label_print_hex = t, getApp().globalData.bq02_lable_sended_length = 0, getApp().globalData.bq02_lable_total_length = t.length * d, getApp().globalData.v5g_label.bq_print()) : getApp().globalData.v5g_label.print())
                    }
                    getApp().globalData.v5g_is_label_print = !1
                } else if ("V5X" == a) {
                    var k = "2221A9000400" + t.substr(12, 4),
                        z = uni.getStorageSync("last_connected_printer");
                    return g && p && z && ["BH03", "PD03", "BHSZY"].includes(null === z || void 0 === z ? void 0 : z.ble_name) ? k += "30030000" : k += g ? "30010000" : p ? "30020000" : "30000000", getApp().globalData.v5x_image_data_hex = t.substr(20), getApp().globalData.v5x_start_print_cmd = k, getApp().globalData.v5x_print_nums = d, getApp().globalData.selected_print_nums = d, getApp().globalData.v5x_hex_total_length = t.substr(20).length * d, getApp().globalData.v5x_hex_sended_length = 0, getApp().globalData.v5x_gray_print = p, void(0, c.v5x_start_print)()
                }
                getApp().globalData.ios_ble.print_hex(t, (function(e) {
                    "1" == e && r.default.print_log()
                }), a, d, h, !1, p)
            }
        }

        function j(e, t, a) {
            var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
                s = arguments.length > 4 ? arguments[4] : void 0,
                n = 1;
            "05" == a ? n = 0 : "0D" == a && (n = 2), getApp().globalData.p7_print_image = e, getApp().globalData.p7_print_paper_type = t, getApp().globalData.p7_print_density = n, getApp().globalData.p7_print_nums = i, getApp().globalData.p7_px_width = s, getApp().globalData.p7_uploaded_log = !0, getApp().globalData.wtr_printer.print()
        }
        var x = {
            init: function(e, t) {
                u.initOpenCV((function(a) {
                    0 == a.code ? (uni.setStorageSync("opencv_init", "success"), e && e()) : (uni.setStorageSync("opencv_init", "fail"), t && t())
                }))
            },
            dither: function(t, a, i, s) {
                t = t.replace("file://", ""), a = parseInt(a), i = parseInt(i), u.dither({
                    image_path: t,
                    width: a,
                    height: i
                }, (function(a) {
                    e("log", "dither", a, " at models/opencv.js:152"), a.debug ? e("log", "debug", a.debug, " at models/opencv.js:154") : 0 == a.code ? s && s(a.image) : s && s(t)
                }))
            },
            enhance_text: function(e, t, a, i, s) {
                e = e.replace("file://", ""), t = void 0 != t && t, a = void 0 != a && a, s = void 0 == s ? 39 : s, u.enhanceText({
                    image_path: e,
                    cut_red: t,
                    cut_blue: a,
                    slide_value: s
                }, (function(t) {
                    t.debug || (0 == t.code ? i && i(t.image) : i && i(e))
                }))
            },
            rotate: function(e, t, a) {
                var i = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3];
                e = e.replace("file://", ""), u.rotate({
                    image_path: e,
                    rotate_deg: t,
                    need_convert_color: i
                }, (function(t) {
                    t.debug || (0 == t.code ? a && a(t.image) : a && a(e))
                }))
            },
            hex: function(t, a, i, s, n, l, o, f, h, z, w, x, C) {
                var v = arguments.length > 13 && void 0 !== arguments[13] && arguments[13],
                    q = arguments.length > 14 && void 0 !== arguments[14] ? arguments[14] : 1,
                    B = arguments.length > 15 && void 0 !== arguments[15] ? arguments[15] : 15,
                    I = arguments.length > 16 && void 0 !== arguments[16] && arguments[16],
                    Q = arguments.length > 17 && void 0 !== arguments[17] ? arguments[17] : 50,
                    E = arguments.length > 18 && void 0 !== arguments[18] ? arguments[18] : 15,
                    D = arguments.length > 19 && void 0 !== arguments[19] ? arguments[19] : [],
                    F = arguments.length > 20 && void 0 !== arguments[20] ? arguments[20] : "",
                    P = arguments.length > 21 && void 0 !== arguments[21] ? arguments[21] : "";
                if (t = t.replace("file://", ""), "images_print" == s && (s = "photo_album"), getApp().globalData.print_img_src = t, getApp().globalData.print_img_from = z, "V10G" == a && D && D.length > 0 && ("ios" == uni.getSystemInfoSync().osName || F)) p(t, a, i, s, n, l, o, f, h, z, D, F);
                else if ("P7" != a)
                    if ("V8S" != a && "V8SPRO" != a) {
                        "v10" == a && l < 10 && (l += 20);
                        var S = "X5" == a ? "V5" : a;
                        S = "V8SJP" == a ? "V7" : a, "ios" == uni.getSystemInfoSync().platform && (S = S.toLowerCase());
                        var M = 10,
                            U = a,
                            Y = 12e3,
                            N = 100,
                            G = "",
                            T = "",
                            O = [],
                            X = getApp().globalData.app_config.get_hash(),
                            K = "";
                        "Android" == plus.os.name ? getApp().globalData.use_android_ble ? (T = getApp().globalData.android_ble.get_deivce().ble_name, K = getApp().globalData.android_ble.get_deivce().ble_address) : (T = getApp().globalData.ble.get_deivce().ble_name, K = getApp().globalData.ble.get_deivce().ble_address) : (T = getApp().globalData.ios_ble.get_deivce().ble_name, K = getApp().globalData.ios_ble.get_deivce().ble_address);
                        var R = !1,
                            L = 0;
                        if (["BQ03", "BQ02", "BQ17"].includes(T) && v && "lable" == z) {
                            R = !0;
                            var H = "".concat(Q, "*").concat(E);
                            switch (H) {
                                case "20*10":
                                    o = 11, L = 12;
                                    break;
                                case "30*15":
                                    o = 10, L = 10;
                                    break;
                                case "40*20":
                                    o = 8, L = 23;
                                    break;
                                case "50*15":
                                    o = 10, L = 3;
                                    break;
                                case "25*25":
                                    o = 13, L = 25;
                                    break;
                                case "50*50":
                                    o = 7, L = 12;
                                    break
                            }
                        }
                        var W = "",
                            V = C;
                        if (W = T, "v5g" == a.toLowerCase()) {
                            if ("1" == getApp().globalData.v5g_d1_cmd_status && (C = "05"), U = T, d.default.is_convert_mx11(U) ? (U = "MX11", T = "MX11") : d.default.is_convert_xoppoy(U) ? (U = "XO POPPY", T = "XO POPPY") : d.default.is_convert_to_mx06(U) ? (U = "MX06", T = "MX06") : d.default.is_convert_mx01(U) && (U = "MX01", T = "MX01"), "05" == C ? "text" == s ? (C = 3, Y = 15e3, N = 100, "MX07" == U ? N = 70 : "MX08" == U ? N = 50 : "MX09" == U && (N = 130)) : (C = 3, Y = 1e4, N = 90, "MX07" == U ? N = 60 : "MX05" == U || "MX06" == U ? N = 150 : "MX08" == U ? N = 60 : "MX09" == U && (N = 130)) : "0A" == C ? "text" == s ? (C = 4, Y = 15e3, N = 130, "MX07" == U ? N = 90 : "MX08" == U ? N = 70 : "MX09" == U && (N = 150)) : (C = 4, Y = 1e4, N = 110, "MX07" == U ? N = 80 : "MX05" == U || "MX06" == U ? N = 180 : "MX08" == U ? N = 90 : "MX09" == U && (N = 150)) : "0D" == C ? "text" == s ? (C = 5, Y = 2e4, N = 150, "MX07" == U ? N = 110 : "MX08" == U ? N = 100 : "MX09" == U && (N = 200)) : (C = 4, Y = 15e3, N = 130, "MX07" == U ? N = 100 : "MX05" == U || "MX06" == U ? N = 200 : "MX08" == U ? N = 110 : "MX09" == U && (N = 200)) : "0F" == C && (C = 4, Y = 15e3), d.default.is_support_config(U)) {
                                var J = d.default.get_nongde(U);
                                ["BQ02", "BQ03", "BQ17"].includes(W.toUpperCase()) && (J = d.default.get_nongde("BQ02"));
                                var Z = "text" == s ? "text_model" : "image_model",
                                    _ = "middle",
                                    $ = J[Z]["low"],
                                    ee = J[Z]["middle"],
                                    te = J[Z]["height"];
                                switch (V) {
                                    case "05":
                                        _ = "low";
                                        break;
                                    case "0A":
                                        _ = "middle";
                                        break;
                                    case "0D":
                                        _ = "height";
                                        break;
                                    case "0F":
                                        _ = "";
                                        var ae = d.default.get_custom_value(U, z, s, U);
                                        N = d.default.get_printer_value_from_percent(ae, s, U);
                                        break;
                                    default:
                                        break
                                }
                                if (_ && J && J[Z][_] && (N = J[Z][_]), d.default.is_handle_d2_status(U) && r.default.get_d2_status()) switch (V) {
                                    case "05":
                                        N = $ - 10 > 0 ? $ - 10 : 10;
                                        break;
                                    case "0A":
                                        N = $;
                                        break;
                                    case "0D":
                                        N = ee;
                                        break;
                                    case "0F":
                                        N > ee && (N = ee);
                                        break;
                                    default:
                                        break
                                }
                                d.default.is_handle_didian_status(U) && r.default.get_didain_status() && ("0D" == V || "0F" == V && N > ee) && (N = ee), O = [$, ee, te, N]
                            }
                            uni.getStorageSync("debug_nongdu") && (C = uni.getStorageSync("debug_nongdu_cengci") ? uni.getStorageSync("debug_nongdu_cengci") : 4, N = uni.getStorageSync("debug_nongdu_energy") ? uni.getStorageSync("debug_nongdu_energy") : 15e3);
                            var ie = ["MX05", "MX06", "MX07", "MX08", "MX09", "MINI PRINTER", "JL-BR22", "MX11", "MX12", "PD01", "XO POPPY", "MX13", "IM.17", "MINISO-M1", "LP212", "MINISO-M12"];
                            if (ie.includes(U) && N >= 1 && N <= 200) {
                                var se = g.default.int2hex(N);
                                1 == se.length && (se = "0" + se);
                                var ne = r.default.hexStr2Bytes("01" + se);
                                if (G = "5178F2000200" + A.default.crc8(ne) + "FF", getApp().globalData.history_config && getApp().globalData.history_config.print_mode) {
                                    var re = "\u4e2d";
                                    switch (V) {
                                        case "05":
                                            re = "\u6d45";
                                            break;
                                        case "0A":
                                            re = "\u4e2d";
                                            break;
                                        case "0D":
                                            re = "\u6df1";
                                            break;
                                        case "0F":
                                            re = "\u81ea\u5b9a\u4e49";
                                            break;
                                        default:
                                            re = "\u672a\u77e5";
                                            break
                                    }
                                    getApp().globalData.history_config.print_mode = getApp().globalData.history_config.print_mode + "_" + re + "_" + N + "_" + U
                                }
                            }
                            var le = ["MX05", "MX06", "MX07", "MX08", "MX09", "MINI PRINTER", "JL-BR22", "MX11", "MX12", "PD01", "XO POPPY", "MX13", "IM.17", "MINISO-M1", "LP212", "MINISO-M12"];
                            le.includes(U) && (U = "MX02"), U = U.replace("YT", "GT"), "MX03" != U && (U = U.replace("MX", "GT")), "MX03" == U && (i = 576)
                        }
                        if (v && "ios" == uni.getSystemInfoSync().platform && ("v5" == a.toLowerCase() || "v5pro" == a.toLowerCase() || "v7" == a.toLowerCase() || "v7pro" == a.toLowerCase())) {
                            var oe = 384;
                            switch (a.toLowerCase()) {
                                case "v5":
                                    oe = 384;
                                    break;
                                case "v5pro":
                                    oe = 576;
                                    break;
                                case "v7":
                                    oe = 576;
                                    break;
                                case "v7pro":
                                    oe = 832;
                                    break
                            }
                            n = .95, l = Math.floor(oe * (1 - n) / 2)
                        }
                        var Ae = 0;
                        "iPhone 11" == uni.getSystemInfoSync().deviceModel && (Ae = 1);
                        var ge = !1,
                            de = !0;
                        "V5X" == a.toUpperCase() && I && (ge = !1 !== (0, c.is_use_gamma_handle)(), de = (0, c.is_convert_to_16)()), "MXW010" == W && (U = "GT02");
                        var ce = 80,
                            ue = 700,
                            fe = 109545,
                            he = !1,
                            pe = 0,
                            me = 0;
                        if ("label_v2" == z && v) {
                            var be;
                            he = !0;
                            be = getApp().globalData.history_config.circle_lable_img ? b(Q, a.toLowerCase()) : m(Q, a.toLowerCase(), W, E), ["BQ03", "BQ02", "MXW010", "BQ17", "BH03", "PD03"].includes(W) ? (L = be.rightBorder, me = be.topBorder) : "V5X" == a ? (L = 4, me = -8) : (L = -9, me = -7), pe = be.v2LabelWidth
                        }
                        var ye = 0;
                        "V10G" != a || "hbz" != F && "wsz" != F || (ye = 2200);
                        var ke = "",
                            ze = !1;
                        r.default.is_bq95B_device(W, K) && (ze = !0, ke = r.default.is_bq95B_of_chongcheng(W, K) ? "chongcheng" : "chengong", ge = !0), ["BQ95B", "C18"].includes(U.trim()) && (U = "GT01", W = "BQ95");
                        var we = !1;
                        "chongcheng" == ke && r.default.is_q7_series_device(W) && (we = !0), "YTB01" == T && (ye = r.default.get_v5c_max_height(), ge = !0, de = !1, I || (ye *= 3));
                        var je = !1;
                        ["BH03", "PD03", "BHSZY"].includes(W) && v && ("text" == s && (s = "label_text"), I && (je = !0)), u.hex({
                            image_path: t,
                            model: S,
                            print_mode: s,
                            scale: n,
                            left: l,
                            top: o,
                            binaryValue: 170,
                            rotate: f,
                            modified_px: i,
                            print_speed: M,
                            blePrexName: U.trim(),
                            print_quelity: "V5G" == S ? C : 0,
                            energy: Y,
                            cut_side_lengh: Ae,
                            hash: X,
                            is_gray_print: I,
                            BQ02LablePrint: R,
                            rightBorder: L,
                            gammaHandle: ge,
                            convertTo16: de,
                            saveHandlerImage: !1,
                            originBleName: W,
                            compressQuality: ce,
                            shortSideMinSize: ue,
                            maxDataLength: fe,
                            isBQReceiveAndPrintDevice: ze,
                            bqFrom: ke,
                            isV2LablePrintfromBQ02: he,
                            v2LabelWidth: pe,
                            topBorder: me,
                            mixHeight: ye,
                            paperType: F,
                            neddAddSplitSymbol: we,
                            textModelPrehandle: !!v,
                            v5gLabelDeviceGrayPrint: je,
                            newPreHandler: getApp().globalData.user_config.get_config().ios_use_new_prehandler,
                            textPrint: "landscape" == z
                        }, (function(t) {
                            t.debug || (0 == t.code ? t.hex ? x ? x && x(t.hex) : ("V7S" == a || "V7SPRO" == a ? t.hex += "0A0A0A0A" : ze || "V5C" == a ? t.hex = r.default.get_hex_for_bq95b_v5c(t.hex, V, I, ze ? ke : "V5C") : "V5G" != a || I ? "MXW010" == W && I && !v ? t.hex = t.hex + "5178A10002003000F9FF" : "V5X" == a ? (getApp().globalData.print_percent = 0, getApp().globalData.v5x_hex_off_set = 0, getApp().globalData.selected_density_code = V, t.hasOwnProperty("black_dot") ? getApp().globalData.black_dot_percentage = (t.black_dot / (t.white_dot + t.black_dot)).toFixed(2) : getApp().globalData.black_dot_percentage = 0) : "V10G" == a && ("hbz" == F ? t.hex = t.hex + "1D0C" : "lxz" == F && (t.hex = t.hex + "1B6405")) : ("iOS" == plus.os.name && (t.hex = getApp().globalData.ios_ble.get_v5g_parameter_hex(t.hex, M, C, Y)), "YT" == T.substr(0, 2) && (t.hex = t.hex + "5178A1000200380051FF"), t.hex = G + "5178A30001000000FF" + t.hex + "5178A30001000000FF"), "YTB01" == T && t.heigthIsCuted ? uni.showModal({
                                content: getApp().globalData.$t("message").nydydnrjcsfjqbfnrdy,
                                cancelText: getApp().globalData.$t("message").bdy,
                                confirmText: getApp().globalData.$t("message").dy,
                                success: function(e) {
                                    e.confirm ? k(t.hex, a, h, z, w, C, v, q, B, O, I) : uni.$emit("success_cancel_print", {
                                        close_printing_popup: !0
                                    })
                                }
                            }) : k(t.hex, a, h, z, w, C, v, q, B, O, I, P)) : t.hex_file && y(t.hex_file, x) : e("log", "opencv hex fail", " at models/opencv.js:997"))
                        }))
                    } else u.v8sPrintImage({
                        image_path: t,
                        scale: n,
                        left: l,
                        top: o,
                        rotate: f,
                        modified_px: i
                    }, (function(t) {
                        0 == t.code ? getApp().globalData.vson_printer.print_image(t.image) : e("log", "opencv v8sPrintImage fail", t, " at models/opencv.js:471")
                    }));
                else j(t, F, C, q, w)
            },
            enhance_picture: function(t, a, i) {
                t = t.replace("file://", ""), u.enhancePicture({
                    image_path: t,
                    is_adapter: a
                }, (function(a) {
                    a.debug ? e("log", "debug", a.debug, " at models/opencv.js:210") : 0 == a.code ? i && i(a.image) : i && i(t)
                }))
            },
            index: function(t, a, i) {
                var s = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
                    n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
                    r = arguments.length > 5 ? arguments[5] : void 0,
                    l = arguments.length > 6 ? arguments[6] : void 0,
                    o = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : "";
                t = t.replace("file://", ""), "V8S" == l || "V8SPRO" == l ? u.v8sIndex({
                    image_path: t,
                    width: s,
                    height: n,
                    deg: i
                }, (function(a) {
                    e("log", "vson index", a, " at models/opencv.js:87"), 0 == a.code ? r && r(a.image) : r && r(t)
                })) : ("ios" == uni.getSystemInfoSync().platform && 0 == i && (i = 360), u.index({
                    image_path: t,
                    print_mode: a,
                    deg: i,
                    width: s,
                    height: n,
                    use_new_dither_flag: !0,
                    textPrint: "landscape" == o
                }, (function(e) {
                    e.debug || 0 == e.code && r && r(e.image)
                })))
            },
            merge: function(t, a) {
                if ("ios" == uni.getSystemInfoSync().platform) {
                    for (var i = t.split(","), s = 0; s < i.length; s++) i[s] = "file://" + i[s];
                    t = i.join(",")
                }
                e("log", t, " at models/opencv.js:254"), u.merge({
                    image_path: t
                }, (function(e) {
                    e.debug || (e.code, a && a(e.save_path))
                }))
            },
            _print_hex: k,
            _print_hex_v5: function(t, a, i, s, n) {
                return getApp().globalData.print_img_src = i, getApp().globalData.print_img_from = s, e("log", "origin_img:" + i, " at models/opencv.js:1620"), e("log", "_from:" + s, " at models/opencv.js:1621"), new Promise((function(e) {
                    getApp().globalData.v5_printer.write("12230F", (function(a) {
                        getApp().globalData.v5_printer.write("1F287302000500", (function(a) {
                            getApp().globalData.v5_printer.write(t, (function(t) {
                                "1" == t && (uni.showToast({
                                    icon: "success",
                                    title: "\u5df2\u6253\u5370\u5b8c\u6210\u4e00\u9875",
                                    duration: 2e3
                                }), r.default.print_log(), e(0))
                            }))
                        }))
                    }))
                }))
            },
            v8s_index: function() {
                u.v8sIndex({
                    image_path: src,
                    width: width,
                    height: height,
                    deg: 0
                }, (function(t) {
                    e("log", "opencv iOS", JSON.stringify(t), " at models/opencv.js:23"), 0 == t.code ? (_fun && _fun(t.image), e("log", "call opencv success", " at models/opencv.js:26")) : (_fun && _fun(src), e("log", "call opencv fail", " at models/opencv.js:29"))
                }))
            },
            v8s_print: function() {
                u.v8sPrintImage({
                    image_path: src,
                    width: width,
                    height: height,
                    scale: 1,
                    left: 0,
                    top: 0,
                    rotate: 0,
                    modified_px: 1280
                }, (function(t) {
                    e("log", "opencv iOS", JSON.stringify(t), " at models/opencv.js:45"), 0 == t.code ? (_fun && _fun(t.image), e("log", "call opencv success", " at models/opencv.js:48")) : (_fun && _fun(src), e("log", "call opencv fail", " at models/opencv.js:51"))
                }))
            },
            handle_image_v5g: function(e, t, a) {
                if ("iOS" != plus.os.name) {
                    u.handleImage({
                        image_path: e,
                        model: t,
                        print_mode: "text",
                        scale: .9,
                        top: 10,
                        bottom: 0,
                        needDither: !1,
                        modified_px: 384
                    }, (function(t) {
                        if (t.debug);
                        else {
                            var i = e;
                            0 == t.code && (i = t.image), a && a(i)
                        }
                    }))
                } else a && a(e)
            },
            gray: function(e, t) {
                e = e.replace("file://", ""), u.grayFilter({
                    image_path: e
                }, (function(a) {
                    a.debug || (0 == a.code ? t && t(a.image) : t && t(e))
                }))
            },
            resize_bg_size: function(e, t, a, i) {
                return f.apply(this, arguments)
            },
            v5g_nongdu_print: function(t, a, i) {
                var s = "ios" == uni.getSystemInfoSync().platform ? "v5g" : "V5G",
                    n = "";
                t = t.replace("file://", ""), getApp().globalData.print_img_src = t, getApp().globalData.print_img_from = "nongdu_set", n = "Android" == plus.os.name ? getApp().globalData.android_ble.get_deivce().ble_name : getApp().globalData.ios_ble.get_deivce().ble_name;
                var l = n;
                d.default.is_convert_to_mx06(l) ? (l = "MX06", n = "MX06") : "URBANWORX KIDS CAMERA" != l && "BQ01" != l || (l = "MX01", n = "MX01"), i = d.default.get_printer_value_from_percent(i, a, l), e("log", "real", i, " at models/opencv.js:1678");
                var o = g.default.int2hex(i);
                1 == o.length && (o = "0" + o);
                var c = r.default.hexStr2Bytes("01" + o),
                    f = "5178F2000200" + A.default.crc8(c) + "FF";
                l = l.replace("YT", "GT"), l = "MX03" == l ? l : "GT02", u.hex({
                    image_path: t,
                    model: s,
                    print_mode: a,
                    scale: 1,
                    left: 0,
                    top: 0,
                    rotate: 0,
                    modified_px: "384",
                    print_speed: 10,
                    blePrexName: l,
                    print_quelity: 3,
                    energy: 12e3
                }, (function(t) {
                    t.debug || (0 == t.code ? t.hex && ("ios" == uni.getSystemInfoSync().platform && (t.hex = getApp().globalData.ios_ble.get_v5g_parameter_hex(t.hex, 10, 1, 12e3)), t.hex = f + "5178A30001000000FF" + t.hex + "5178A30001000000FF", "ios" == uni.getSystemInfoSync().platform ? getApp().globalData.ios_ble.print_hex(t.hex, (function(e) {
                        "1" == e && r.default.print_log()
                    }), s, 1) : (t.hex = t.hex.replace("5178A10002003000F9FF5178A10002003000F9FF", "5178A10002003000F9FF"), getApp().globalData.android_ble.print_hex(t.hex, s, (function(e) {
                        "1" == e && r.default.print_log()
                    }), 1))) : e("log", "opencv hex fail", " at models/opencv.js:1728"))
                }))
            },
            adjustBrightnessContrastFlip: function(e, t, a, i, s) {
                e = e.replace("file://", "");
                var n = -2;
                i && (n = 1), u.adjustBrightnessContrast({
                    image_path: e,
                    alpha: t,
                    beta: a,
                    flip: n
                }, (function(t) {
                    0 == t.code ? s && s(t.image) : s && s(e)
                }))
            }
        };
        t.default = x
    }).call(this, a("f3b9")["default"])
}