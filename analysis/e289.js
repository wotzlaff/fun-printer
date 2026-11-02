function(e, t, a) {
    "use strict";
    (function(e) {
        var i = a("47a9"),
            s = a("3b2d");
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = void 0;
        var n = i(a("127e")),
            r = i(a("ee10")),
            l = i(a("6660")),
            o = i(a("a061")),
            A = (i(a("11c6")), i(a("291c"))),
            g = (i(a("8ed4")), i(a("57d8"))),
            d = i(a("9673")),
            c = a("4bd5");
        a("c7a2");

        function u(e) {
            if ("function" !== typeof WeakMap) return null;
            var t = new WeakMap,
                a = new WeakMap;
            return (u = function(e) {
                return e ? a : t
            })(e)
        }

        function f(e, t) {
            if (!t && e && e.__esModule) return e;
            if (null === e || "object" !== s(e) && "function" !== typeof e) return {
                default: e
            };
            var a = u(t);
            if (a && a.has(e)) return a.get(e);
            var i = {},
                n = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var r in e)
                if ("default" !== r && Object.prototype.hasOwnProperty.call(e, r)) {
                    var l = n ? Object.getOwnPropertyDescriptor(e, r) : null;
                    l && (l.get || l.set) ? Object.defineProperty(i, r, l) : i[r] = e[r]
                } return i.default = e, a && a.set(e, i), i
        }

        function h(e, t) {
            var a = "undefined" !== typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (!a) {
                if (Array.isArray(e) || (a = function(e, t) {
                        if (!e) return;
                        if ("string" === typeof e) return p(e, t);
                        var a = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === a && e.constructor && (a = e.constructor.name);
                        if ("Map" === a || "Set" === a) return Array.from(e);
                        if ("Arguments" === a || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)) return p(e, t)
                    }(e)) || t && e && "number" === typeof e.length) {
                    a && (e = a);
                    var i = 0,
                        s = function() {};
                    return {
                        s: s,
                        n: function() {
                            return i >= e.length ? {
                                done: !0
                            } : {
                                done: !1,
                                value: e[i++]
                            }
                        },
                        e: function(e) {
                            throw e
                        },
                        f: s
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }
            var n, r = !0,
                l = !1;
            return {
                s: function() {
                    a = a.call(e)
                },
                n: function() {
                    var e = a.next();
                    return r = e.done, e
                },
                e: function(e) {
                    l = !0, n = e
                },
                f: function() {
                    try {
                        r || null == a.return || a.return()
                    } finally {
                        if (l) throw n
                    }
                }
            }
        }

        function p(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var a = 0, i = new Array(t); a < t; a++) i[a] = e[a];
            return i
        }
        var m = "D2_RECEIVED_INFO_KEY",
            b = ["GB01", "GB02", "GB03", "YT01", "YT02", "X5", "X6", "X7h", "YHK", "Paperang", "M02A", "M02S", "M02 pro", "M03A", "M04AH", "M04S", "M04AS", "BUXIAODING", "Buding-B3", "TP6-S", "peripage"],
            y = ["BQ95C", "BQ7A", "BQ7B", "BQ06B", "K06"],
            k = ["BQ7A", "BQ7B", "BQ95C", "BQ06B", "K06"],
            z = ["BQ95", "BQ96", "MXPC-100"],
            w = ["MXPC-100"],
            j = ["BQ05", "BQ06", "BQ07", "BQ7A", "BQ7B", "BQ95", "EWTTO ET-N3689", "EWTTO ET-N3687", "MXPC-100", "BQ95B", "BQ95C", "BQ96", "BQ06B", "K06", "C18"],
            x = ["V5G", "V5", "V5PRO", "V5N", "V5NPRO", "V7", "V7PRO", "V5X_S", "V5X", "V5C", "P7"];

        function C(e) {
            "Android" == plus.os.name ? function(e) {
                var t = e.model;
                if ("DCK" == t || "V5G" == t || "V5X" == t || "V5N" == t || "V5NPRO" == t || "V10G" == t || "V5C" == t)
                    if (getApp().globalData.use_android_ble) {
                        getApp().globalData.android_ble.set_printer_info(e);
                        var a = !!e.hasOwnProperty("isMXW01Board") && e["isMXW01Board"],
                            i = e.hasOwnProperty("broadcast") ? e["broadcast"] : "";
                        getApp().globalData.android_ble.connect(e["ble_address"], null, a, i)
                    } else getApp().globalData.ble.create_connected(e["ble_address"], e["ble_name"]);
                "V5" != t && "V5PRO" != t && "V7" != t && "V7PRO" != t || getApp().globalData.v5_printer.connect(e);
                "V6" != t && "V6PRO" != t && "V10" != t && "V7S" != t && "V7SPRO" != t && "V8" != t && "V8PRO" != t && "V8SJP" != t || getApp().globalData.android_printer.connect(e["ble_address"], e["ble_name"]);
                "V8S" != t && "V8SPRO" != t || getApp().globalData.vson_printer.connect(e.ble_address);
                "P7" == t && (v(), getApp().globalData.wtr_printer.connect(e.ble_address))
            }(e) : function(e) {
                var t = e.model;
                if (g.default.is_ble_connect_by_model(t)) {
                    getApp().globalData.ios_ble.set_printer_info(e);
                    var a = !!e.hasOwnProperty("isMXW01Board") && e["isMXW01Board"],
                        i = e.hasOwnProperty("broadcast") ? e["broadcast"] : "";
                    getApp().globalData.ios_ble.connect(e["ble_uuid"], e["ble_address"], null, a, i)
                } else g.default.is_v5plugin_connect(t) ? (getApp().globalData.ios_ble.stop_search_printer(), getApp().globalData.v5_printer.connect(e, (function() {
                    getApp().globalData.v5_printer.connect_success(e)
                }))) : g.default.is_vson_plugin_connect(t) && (getApp().globalData.ios_ble.stop_search_printer(), getApp().globalData.vson_printer.connect(e["ble_address"], null, e["research_uuid"]));
                "P7" == t && (v(), getApp().globalData.wtr_printer.connect(e["ble_uuid"]))
            }(e)
        }

        function v() {
            "Android" == plus.os.name ? getApp().globalData.android_ble.stop_search_printer() : getApp().globalData.ios_ble.stop_search_printer()
        }

        function q() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                t = e && e.model ? e.model : "",
                a = e && e.ble_address ? e.ble_address : "",
                i = A.default.get_printer_info();
            i && (t || (t = i.model), a || (a = i.ble_address), "DCK" == t || "V5G" == t || "V7S" == t || "V7SPRO" == t || "V5X" == t || "V5N" == t || "V5NPRO" == t || "V10G" == t || "V5C" == t ? "Android" == plus.os.name ? getApp().globalData.use_android_ble ? getApp().globalData.android_ble.disconnect(null) : getApp().globalData.ble.disconnect(a) : getApp().globalData.ios_ble.disconnct(null) : "V5" == t || "V5PRO" == t || "V7" == t || "V7PRO" == t ? getApp().globalData.v5_printer.disconnect() : "P7" == t && getApp().globalData.wtr_printer.disconnect())
        }

        function B() {
            return I.apply(this, arguments)
        }

        function I() {
            return I = (0, r.default)(n.default.mark((function e() {
                var t, a, i, s, r, l, d = arguments;
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            return t = !(d.length > 0 && void 0 !== d[0]) || d[0], a = A.default.get_printer_info(), e.abrupt("return", !(!a || !a.model));
                        case 6:
                            if (i = e.sent, !i) {
                                e.next = 9;
                                break
                            }
                            return e.abrupt("return", !0);
                        case 9:
                            if ("ios" != uni.getSystemInfoSync().platform || !g.default.is_ble_connect_by_model(t)) {
                                e.next = 13;
                                break
                            }
                            return e.next = 12, getApp().globalData.ios_ble.is_connected();
                        case 12:
                            return e.abrupt("return", e.sent);
                        case 13:
                            return e.next = 15, getApp().globalData.v5_printer.is_connected();
                        case 15:
                            if (s = e.sent, !s) {
                                e.next = 18;
                                break
                            }
                            return e.abrupt("return", !0);
                        case 18:
                            if ("iOS" != plus.os.name || !getApp().globalData.ios_printer.is_connected()) {
                                e.next = 20;
                                break
                            }
                            return e.abrupt("return", !0);
                        case 20:
                            if ("Android" != plus.os.name) {
                                e.next = 30;
                                break
                            }
                            if (r = A.default.get_printer_info(), null == r || !r.hasOwnProperty("model") || "V8" != r["model"] && "V8PRO" != r["model"]) {
                                e.next = 28;
                                break
                            }
                            return e.next = 25, getApp().globalData.android_printer.v8_is_connected();
                        case 25:
                            if (l = e.sent, "" == l) {
                                e.next = 28;
                                break
                            }
                            return e.abrupt("return", !0);
                        case 28:
                            if (!getApp().globalData.android_printer.is_connected()) {
                                e.next = 30;
                                break
                            }
                            return e.abrupt("return", !0);
                        case 30:
                            return A.default.clear_printer_info(), !0 === t && o.default.modal_connect_printer(), e.abrupt("return", !1);
                        case 33:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), I.apply(this, arguments)
        }

        function Q(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            "V5G" != t && "V5X" != t && "V10G" != t && "V5C" != t || ("ios" == uni.getSystemInfoSync().platform ? getApp().globalData.ios_ble.print_hex(e, "", t) : getApp().globalData.use_android_ble ? getApp().globalData.android_ble.print_hex(e, t, "") : getApp().globalData.ble.print_hex(e, t, ""))
        }

        function E(t, a, i, s) {
            var n = "";
            n = "V5C" == s ? null === i || void 0 === i ? void 0 : i.substr(12, 16) : "P7" == s ? i : null === i || void 0 === i ? void 0 : i.substr(12, 12), getApp().globalData.device_sn = n;
            var r = !1;
            0 === parseInt(n) && (r = !0), "V5X" != s && "V5X_S" != s || "ffffffffffff" == n && (r = !0), r ? l.default.post("v2/Bluetooth/get_sn", {
                ble_name: t,
                ble_address: a,
                ble_sn: n,
                ble_model: s
            }, (function(t) {
                var a, i;
                (e("log", "ge_sn", t, " at models/printer/common.js:360"), 0 == t.errno) ? 1 === t.data.status ? "P7" == s ? (null === (a = getApp().globalData) || void 0 === a || null === (i = a.wtr_printer) || void 0 === i || i.set_sn(t.data.sn), getApp().globalData.device_sn = t.data.strict ? "" : t.data.sn) : Q(t.data.write_cmd, s) : -2 == t.data.status && F(): -200 == t.errno && F()
            })) : (e("log", "\u5f00\u59cb\u9274\u6743", n, s, " at models/printer/common.js:379"), D(t, a, n, s))
        }

        function D(t, a, i, s) {
            l.default.post("/v2/bluetooth/auth", {
                ble_name: t,
                ble_address: a,
                ble_sn: i,
                ble_model: s
            }, (function(t) {
                1 == t.data.result ? (e("log", "\u9274\u6743\u901a\u8fc7", " at models/printer/common.js:393"), getApp().globalData.device_sn = i) : -1 == t.data.result ? (e("log", "\u9274\u6743\u4e0d\u901a\u8fc7, \u4e0d\u8ba9\u6253\u5370", " at models/printer/common.js:396"), getApp().globalData.device_sn = "") : -2 == t.data.result && (e("log", "\u9274\u6743\u4e0d\u901a\u8fc7, \u65ad\u5f00\u94fe\u63a5", " at models/printer/common.js:399"), F())
            }))
        }

        function F() {
            uni.showModal({
                content: getApp().globalData.$t("message")["bqsbwsqqlxkf!"],
                showCancel: !1,
                confirmText: getApp().globalData.$t("message").qd,
                success: function(e) {
                    q()
                }
            })
        }

        function P() {
            return S.apply(this, arguments)
        }

        function S() {
            return S = (0, r.default)(n.default.mark((function e() {
                var t, a, i, s;
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (t = getApp().globalData.print_img_from, getApp().globalData.user_config.get_config().upload_print_log || "label_v2" == t) {
                                e.next = 3;
                                break
                            }
                            return e.abrupt("return");
                        case 3:
                            if (a = getApp().globalData.print_img_src, i = getApp().globalData.history_config, "label_v2" == i.from && (t = "label_v2"), void 0 != a) {
                                e.next = 8;
                                break
                            }
                            return e.abrupt("return");
                        case 8:
                            (getApp().globalData.user_config.get_config().upload_history_img > 0 || "label_v2" == t) && "http" != a.substring(0, 4) ? o.default.upload_file([a], A.default.detail(), t, (function(e) {
                                e = JSON.parse(e), 0 == e.errno && e.data[0] && M(e.data[0].path, t, i, a)
                            })) : (s = "http" == a.substring(0, 4) ? a : "", M(s, t, i, a));
                        case 9:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), S.apply(this, arguments)
        }

        function M(e, t, a, i) {
            void 0 != e && l.default.post("/Printer/complete", {
                img_src: e,
                original_path: i,
                img_from: t,
                history_config: a,
                model_img_width: uni.getStorageSync("model_img_width"),
                hex: getApp().globalData.upload_hex_str ? getApp().globalData.upload_hex_str : ""
            }, (function(e) {
                t && "label_v2" == t && uni.$emit("refresh_list", 1)
            }))
        }

        function U() {
            return U = (0, r.default)(n.default.mark((function e() {
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (0 != getApp().globalData.user_config.get_config().upload_history_img) {
                                e.next = 2;
                                break
                            }
                            return e.abrupt("return");
                        case 2:
                            try {
                                l.default.post("/Printer/get_need_upload_imgs", {}, function() {
                                    var e = (0, r.default)(n.default.mark((function e(t) {
                                        var a, i, s;
                                        return n.default.wrap((function(e) {
                                            while (1) switch (e.prev = e.next) {
                                                case 0:
                                                    if (0 != t.errno) {
                                                        e.next = 15;
                                                        break
                                                    }
                                                    a = t.data, i = 0;
                                                case 3:
                                                    if (!(i < a.length)) {
                                                        e.next = 15;
                                                        break
                                                    }
                                                    if (a[i].print_img || !a[i].original_path) {
                                                        e.next = 12;
                                                        break
                                                    }
                                                    return e.next = 7, o.default.file_is_exist(a[i].original_path);
                                                case 7:
                                                    if (!e.sent) {
                                                        e.next = 12;
                                                        break
                                                    }
                                                    return e.next = 10, N(a[i].original_path, a[i].from);
                                                case 10:
                                                    s = e.sent, Y(a[i].id, s);
                                                case 12:
                                                    i++, e.next = 3;
                                                    break;
                                                case 15:
                                                case "end":
                                                    return e.stop()
                                            }
                                        }), e)
                                    })));
                                    return function(t) {
                                        return e.apply(this, arguments)
                                    }
                                }())
                            } catch (t) {}
                        case 3:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), U.apply(this, arguments)
        }

        function Y(e, t) {
            return new Promise((function(a) {
                l.default.post("/Printer/update_print_img_attr", {
                    log_id: e,
                    http_path: t
                }, (function(e) {
                    a(0)
                }))
            }))
        }

        function N(e, t) {
            return e = plus.io.convertLocalFileSystemURL(e), new Promise((function(a) {
                o.default.upload_file([e], A.default.detail(), t, (function(e) {
                    e = JSON.parse(e), 0 == e.errno && e.data[0] ? a(e.data[0].path) : a(-1)
                }))
            }))
        }

        function G(e) {
            var t = 0,
                a = e.length;
            a % 2 != 0 && (e = "0" + e), a /= 2;
            for (var i = new Array, s = 0; s < a; s++) {
                var n = e.substr(t, 2),
                    r = parseInt(n, 16);
                i.push(r), t += 2
            }
            return i
        }

        function T() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            return !!O(e, t) || !!X(e, t)
        }

        function O() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            return !(!w.includes(e) || !t || "13:03" != t.substr(0, 5)) || !(!z.includes(e) || !t || "13:03" != t.substr(0, 5))
        }

        function X() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            return (!w.includes(e) || !t || "13:03" != t.substr(0, 5)) && !!y.includes(e)
        }
        var K = ["INSTANT PRINT PLUS", "MXW-W5", "INSTAPRINT"];

        function R(e, t) {
            return L.apply(this, arguments)
        }

        function L() {
            return L = (0, r.default)(n.default.mark((function e(t, i) {
                var s;
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            s = A.default.detail(), uni.showToast({
                                title: getApp().globalData.$t("message").ljz,
                                icon: "loading"
                            }), s && (o.default.set_working_app(t.jump_to), !getApp().globalData.socket && ["FriendAI", "printer_with_screen"].includes(t.jump_to) ? Promise.resolve().then((function() {
                                return f(a("bc71"))
                            })).then((function(e) {
                                getApp().globalData.socket = e, uni.reLaunch({
                                    url: t.url,
                                    success: function() {
                                        H(i)
                                    }
                                })
                            })) : (getApp().globalData.socket && getApp().globalData.socket.close_connect(), uni.reLaunch({
                                url: t.url,
                                success: function() {
                                    H(i)
                                }
                            })));
                        case 3:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), L.apply(this, arguments)
        }

        function H(e) {
            return W.apply(this, arguments)
        }

        function W() {
            return W = (0, r.default)(n.default.mark((function e(t) {
                var a, i;
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            return e.next = 2, B(!0);
                        case 2:
                            a = e.sent, i = uni.getStorageSync("last_connected_printer"), a && i && i["ble_address"] && q({
                                model: i["model"],
                                ble_address: i["ble_address"]
                            }), uni.removeStorageSync("last_connected_printer", null), C(t);
                        case 7:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), W.apply(this, arguments)
        }

        function V(e, t) {
            return J.apply(this, arguments)
        }

        function J() {
            return J = (0, r.default)(n.default.mark((function e(t, a) {
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            t.content ? uni.showModal({
                                content: t.content,
                                cancelText: getApp().globalData.$t("message").qx,
                                confirmText: getApp().globalData.$t("message").qw,
                                success: function() {
                                    var e = (0, r.default)(n.default.mark((function e(i) {
                                        return n.default.wrap((function(e) {
                                            while (1) switch (e.prev = e.next) {
                                                case 0:
                                                    i.confirm && R(t, a);
                                                case 1:
                                                case "end":
                                                    return e.stop()
                                            }
                                        }), e)
                                    })));
                                    return function(t) {
                                        return e.apply(this, arguments)
                                    }
                                }()
                            }) : R(t, a);
                        case 1:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), J.apply(this, arguments)
        }

        function Z() {
            return Z = (0, r.default)(n.default.mark((function e(t) {
                var i, s, r, l = arguments;
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (i = !(l.length > 1 && void 0 !== l[1]) || l[1], o.default.set_working_app(t.jump_to), !getApp().globalData.socket && ["FriendAI", "printer_with_screen"].includes(t.jump_to) ? Promise.resolve().then((function() {
                                    return f(a("bc71"))
                                })).then((function(e) {
                                    getApp().globalData.socket = e
                                })) : getApp().globalData.socket && getApp().globalData.socket.close_connect(), uni.reLaunch({
                                    url: t.url
                                }), !i) {
                                e.next = 11;
                                break
                            }
                            return e.next = 7, B(!0);
                        case 7:
                            s = e.sent, r = uni.getStorageSync("last_connected_printer"), s && r && r["ble_address"] && q({
                                model: r["model"],
                                ble_address: r["ble_address"]
                            }), uni.removeStorageSync("last_connected_printer", null);
                        case 11:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), Z.apply(this, arguments)
        }
        var _ = {
            is_connected: B,
            connect: C,
            disconnect: q,
            disconnected: function() {
                var e = A.default.get_printer_info();
                if (e) {
                    if (A.default.clear_printer_info(), e && !getApp().globalData.change_printer) {
                        var t = getCurrentPages(),
                            a = t[t.length - 1].route;
                        if (uni.setStorageSync("bluetooth_list", null), "pages/friend_ai/pages/bluetooth_wifi" == a) {
                            if (!getApp().globalData.is_wifi_connect) return void uni.$emit("bluetooth_wifi")
                        } else "printer_with_screen" != o.default.get_working_app() && uni.showModal({
                            titile: getApp().globalData.app_name,
                            confirmText: getApp().globalData.$t("message").qd,
                            content: "DCK" == e["model"] ? "\u5355\u8bcd\u5361\u5df2\u65ad\u5f00" : getApp().globalData.$t("message").dyjydk,
                            showCancel: !1
                        });
                        "pages/bluetooth/android_ble" != a && "pages/bluetooth/ios" != a || uni.$emit("bluebooth_research")
                    }
                    getApp().globalData.change_printer = !1
                }
            },
            save_deivce: function(e, t, a) {
                e && t && l.default.post("/Printer/save_deivce", {
                    device_no: e,
                    model: t,
                    software_version: "1.0",
                    ble_name: a
                }, (function(e) {}))
            },
            print_log: P,
            print_hex: function(e, t, a, i) {
                "Android" == plus.os.name ? getApp().globalData.android_printer.print_hex(e, t, a, i) : getApp().globalData.ios_printer.print_hex(e, t, a, i)
            },
            print_success: function() {
                uni.hideLoading(), uni.hideToast(), P(), uni.showToast({
                    title: getApp().globalData.$t("message").dywc,
                    position: "bottom"
                })
            },
            print_cmd: Q,
            get_deivce: function(e) {
                return e = e.toUpperCase(), "android" == uni.getSystemInfoSync().platform && getApp().globalData.use_android_ble && e && ("V5G" == e || "V5X" == e) ? getApp().globalData.android_ble.get_deivce() : "P7" === e ? getApp().globalData.wtr_printer.get_deivce() : A.default.get_printer_info()
            },
            upload_history_img: function() {
                return U.apply(this, arguments)
            },
            set_d2_status: function(e) {
                e = e ? "received" : "", uni.setStorageSync("MXW_D2_RECEICIVEED_STATUS", e)
            },
            get_d2_status: function() {
                try {
                    return "received" == uni.getStorageSync("MXW_D2_RECEICIVEED_STATUS")
                } catch (t) {
                    e("log", "get_d2_status", t, " at models/printer/common.js:556")
                }
                return !1
            },
            set_didian_status: function(e) {
                e = e ? "didian" : "", uni.setStorageSync("MXW_IS_DIDIAN_STATUS", e)
            },
            get_didain_status: function() {
                try {
                    return "didian" == uni.getStorageSync("MXW_IS_DIDIAN_STATUS")
                } catch (t) {
                    e("log", "get_didain_status", t, " at models/printer/common.js:605")
                }
                return !1
            },
            hexStr2Bytes: G,
            get_sn: function(e, t) {
                var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
                a || (a = e ? o.default.get_printer_model(e) : ""), -1 != x.indexOf(a) && ("V5G" == a ? O(e, t) ? D(e, t, "", "V5G_CG") : Q("5178BB0001000107FF", a) : "V5X" == a || "V5X_S" == a ? Q("2221A70000000000", a) : "V5C" == a ? Q("5688a90001000000ff", a) : "P7" != a && getApp().globalData.v5_printer.get_serial_number((function(e) {
                    E(A.default.get_printer_info().ble_name, A.default.get_printer_info().ble_address, e, a)
                })))
            },
            ble_auth: E,
            last_print_record: function(e, t) {
                var a = Date.parse(new Date);
                uni.setStorageSync("LAST_PRINT_RECORD_KEY", {
                    copies: e,
                    print_time: a,
                    nongdu: t
                })
            },
            get_last_print_record: function() {
                try {
                    var e = uni.getStorageSync("LAST_PRINT_RECORD_KEY");
                    return e
                } catch (t) {}
                return !1
            },
            set_print_complete_time: function() {
                var e = Date.parse(new Date) / 1e3;
                uni.setStorageSync("LAST_SEND_DATA_COMPLETE_TIME_KEY", e)
            },
            get_last_complete_time: function() {
                try {
                    return uni.getStorageSync("LAST_SEND_DATA_COMPLETE_TIME_KEY")
                } catch (e) {}
                return 0
            },
            set_last_nongdu: function(e) {
                uni.setStorageSync("SINGLE_PRINT_LAST_NONGDU", e)
            },
            get_last_nongdu: function() {
                try {
                    return uni.getStorageSync("SINGLE_PRINT_LAST_NONGDU")
                } catch (e) {}
                return 0
            },
            update_d2_info: function(t) {
                var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                if ("clear" != t) try {
                    var i = uni.getStorageSync(m);
                    "nums" == t ? i.nums = i.hasOwnProperty("nums") ? i.nums + 1 : 1 : i[t] = a, uni.setStorageSync(m, i)
                } catch (s) {
                    e("log", "update_d2_info", s, " at models/printer/common.js:583")
                } else uni.setStorageSync(m, {})
            },
            get_d2_info: function() {
                try {
                    return uni.getStorageSync(m)
                } catch (t) {
                    e("log", "get_d2_info", t, " at models/printer/common.js:591")
                }
            },
            set_printer_wendu: function(t) {
                var a, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                if (e("log", "\u6253\u5370\u673a\u5f53\u524d\u6e29\u5ea6", t, i, " at models/printer/common.js:678"), ["PD01", "IM.17", "MINISO-M1", "MINISO-M12"].includes(i) && 0 === (null === (a = getApp().globalData) || void 0 === a ? void 0 : a.printing)) try {
                    var s = uni.getStorageSync("PRINTER_WENDU_KEY"),
                        n = !0 === (0, c.get_pd01_pirnt_is_shallow)() ? 50 : 60;
                    if (t < s && t <= n || -1 == t) {
                        var r = o.default.int2hex(120);
                        1 == r.length && (r = "0" + r);
                        var l = G("01" + r),
                            A = "5178F2000200" + d.default.crc8(l) + "FF";
                        e("log", "\u91cd\u7f6e\u4e86\u6253\u5370\u6d53\u5ea6", " at models/printer/common.js:692"), Q(A, "V5G")
                    }
                } catch (g) {}
                uni.setStorageSync("PRINTER_WENDU_KEY", t)
            },
            get_printer_wendu: function() {
                var e = -1;
                try {
                    e = uni.getStorageSync("PRINTER_WENDU_KEY")
                } catch (t) {}
                return e || -1
            },
            ble_print_hex: function(e, t, a) {
                var i = arguments.length > 6 && void 0 !== arguments[6] && arguments[6];
                "ios" == uni.getSystemInfoSync().platform ? getApp().globalData.ios_ble.print_hex(e, a, t, 1, [], !1, i) : getApp().globalData.android_ble.print_hex(e, t, a, 1, [], !1, i)
            },
            reset_bq05_nongdu_and_type: function(e) {
                var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
                    a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
                    i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "",
                    s = t ? "02" : "01",
                    n = "5178BC0001" + d.default.crc8([e, s]) + "FF";
                if (O(a, i)) {
                    var r = {
                            "01": "8214F0",
                            "02": "4C1DF4",
                            "03": "1626DB"
                        },
                        l = "5178AF000200" + r[e] + "FF";
                    Q(l, "V5G")
                } else Q(n, "V5G");
                T(a, i) || "BQ95" == a && (setTimeout((function(e) {
                    Q(n, "V5G")
                }), 30), setTimeout((function(e) {
                    Q(n, "V5G")
                }), 60), setTimeout((function(e) {
                    Q(n, "V5G")
                }), 90), setTimeout((function(e) {
                    Q(n, "V5G")
                }), 120))
            },
            is_bq05_device: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                if (!e) {
                    var t = A.default.get_printer_info();
                    if (!t || !t.hasOwnProperty("ble_name")) return !1;
                    e = t.ble_name
                }
                return "ios" == uni.getSystemInfoSync().platform && (e = e.toUpperCase()), j.indexOf(e) > -1
            },
            v5x_support_gray_print: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                if (e) {
                    if (e.hasOwnProperty("ble_name") && K.includes(e.ble_name.toUpperCase())) return !1;
                    if (e.hasOwnProperty("isMXW01Board") && !0 === e.isMXW01Board) return !0;
                    if (e.hasOwnProperty("model") && "V5X" == e.model) return !0
                }
                return !1
            },
            bq05_cancel_print: function() {
                Q("5178A10000000000FF", "V5G")
            },
            is_third_ble_name: function(e) {
                if (!e) return !1;
                var t = null;
                e = e.toUpperCase();
                try {
                    t = uni.getStorageSync("third_ble_name_from_serice")
                } catch (l) {}
                var a = t || b;
                if (a.forEach((function(e, t, a) {
                        a[t] = e.toUpperCase()
                    })), a.includes(e)) return !0;
                var i = e.split(/[-_]/);
                i = i[0];
                var s, n = h(a);
                try {
                    for (n.s(); !(s = n.n()).done;) {
                        var r = s.value;
                        if (0 === r.indexOf(i)) return !0
                    }
                } catch (o) {
                    n.e(o)
                } finally {
                    n.f()
                }
                return !1
            },
            save_last_print_mode: function(e, t) {
                if (e && t) {
                    var a = "LAST_PRINT_MODE_".concat(e);
                    uni.setStorageSync(a, t)
                }
            },
            get_last_print_mode: function(e) {
                if (e) try {
                    var t = "LAST_PRINT_MODE_".concat(e);
                    return uni.getStorageSync(t)
                } catch (a) {}
            },
            save_last_print_method: function(e, t) {
                if (e && t) {
                    var a = "LAST_PRINT_METHOD_".concat(e);
                    uni.setStorageSync(a, t)
                }
            },
            get_last_print_method: function(e) {
                if (e) try {
                    var t = "LAST_PRINT_METHOD_".concat(e);
                    return uni.getStorageSync(t)
                } catch (a) {}
            },
            save_print_auth_str: function(e) {
                uni.setStorageSync("wtx_print_auth_str", e)
            },
            get_print_auth_str: function() {
                try {
                    return uni.getStorageSync("wtx_print_auth_str")
                } catch (e) {}
                return ""
            },
            is_bq95B_device: T,
            get_hex_for_bq95b_v5c: function(e, t, a, i) {
                var s = {
                        "05": "01",
                        "0A": "02",
                        "0D": "03"
                    } [t],
                    n = a ? "02" : "01";
                return "chongcheng" == i ? function(e, t, a) {
                    for (var i = {
                            "01": 1e4,
                            "02": 15e3,
                            "03": 2e4
                        } [t], s = i.toString(16), n = s.length; n < 4; n++) s = "0".concat(s);
                    s = s.substr(-2) + s.substr(0, 2);
                    var r = G(s),
                        l = d.default.crc8(r),
                        o = "5178AF000200".concat(l, "FF"),
                        A = "5178BE000100".concat(d.default.crc8([a]), "FF");
                    return "5178A30001000000FF".concat(o).concat(A).concat(e, "5178A10002003000F9FF5178A30001000000FF")
                }(e, s, n) : "chengong" == i ? function(e, t, a) {
                    var i = parseInt(t, 16) + parseInt(a, 16),
                        s = i.toString(16);
                    s.length % 2 != 0 && (s = "0".concat(s));
                    s = s.slice(-2);
                    var n = "5178BC000200".concat(t).concat(a).concat(s, "FF");
                    return "5178A30001000000FF".concat(n).concat("5178BD0001000101FF").concat(e, "5178A10002003000F9FF5178A30001000000FF")
                }(e, s, n) : "V5C" == i ? function(e, t, a) {
                    var i = "".concat(t).concat(a),
                        s = G(i),
                        n = d.default.crc8(s),
                        r = "5688A2000200".concat(n, "FF");
                    return "".concat(r).concat("5688A30001000101FF").concat(e, "5688A60002003000F9FF5688A10001000000FF")
                }(e, s, n) : ""
            },
            get_display_name: function(e) {
                var t = e;
                return "CYLO BT PRINTER" == e ? t = "CYLO BT Printer" : "URBANWORX KIDS CAMERA" == e ? t = "Urbanworx Kids Camera" : "EWTTO ET-Z0499" == e ? t = "ewtto ET-Z0499" : "EWTTO ET-N3689" == e ? t = "ewtto ET-N3689" : "EWTTO ET-N3687" == e ? t = "ewtto ET-N3687" : "PORTABLE PRINTER" == e ? t = "Portable Printer" : "INSTANT PRINT PLUS" == t ? t = "Instant Print Plus" : "REKA" == t && (t = "Reka"), t
            },
            display_name_of_index: function(e, t) {
                var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                return e ? a ? e : (e = e.trim().toUpperCase(), "MINI PRINTER" == e && (t = "Mini Printer"), "URBANWORX KIDS CAMERA" == e && (t = "Kids Camera"), "EWTTO ET-Z0499" == e && (t = "ET-Z0499"), "EWTTO ET-N3689" == e && (t = "ET-N3689"), "EWTTO ET-N3687" == e && (t = "ET-N3687"), "PORTABLE PRINTER" == e && (t = "Portable Printer"), "JL-BR22" == e && (t = "JL-BR22"), "INSTANT PRINT PLUS" == e && (t = "Instant Print Plus"), t) : ""
            },
            v5c_support_gray_print: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                    t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                return !(!e || "V5C" != e.model) && ("YTB01" == e.ble_name && ("photo_album" == t || "image_filter" == t))
            },
            is_bq95B_of_chongcheng: X,
            set_v5c_max_height: function(e) {
                uni.setStorageSync("V5C_MAX_PRINT_HEIGHT", e)
            },
            get_v5c_max_height: function() {
                var e = 800;
                try {
                    e = uni.getStorageSync("V5C_MAX_PRINT_HEIGHT")
                } catch (t) {
                    e = 800
                }
                return e || 800
            },
            is_q7_series_device: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                return k.includes(e)
            },
            allow_print_v2: function(e) {
                var t, a;
                return !x.includes(e) || 0 !== (null === (t = getApp().globalData) || void 0 === t || null === (a = t.device_sn) || void 0 === a ? void 0 : a.length) || -2 != getApp().globalData.user_config.get_config().not_sn_allow_print && "P7" != e
            },
            to_auth: D,
            is_valid_connect: function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                    a = ["funprint", "\u55b5\u5b66\u738b", "iBleem", "FriendAI"];
                if (a.includes(getApp().globalData.app_name)) {
                    var i = {
                            jump_to: "",
                            content: "",
                            url: ""
                        },
                        s = e.ble_name.toUpperCase();
                    s = s.replace(/\s+/g, "");
                    var n = getApp().globalData.$t("message");
                    if (getApp().globalData.get_ble_lists.P1_LIST.includes(s)) i.url = "/pages/friend_ai/index?tab=index", i.content = n.dqsbsyaiprinterxlqqhzaiprintermk + n["tzhqxwcsbwldszyqbzcsy!"], i.jump_to = "FriendAI";
                    else if (getApp().globalData.get_ble_lists.P3_LIST.includes(s)) i.jump_to = "printer_with_screen", i.content = n.dqsbsyaiprinterwithscreenxlqqhzaiprinterwithscreenmk + n["tzhqxwcsbwldszyqbzcsy!"], i.url = "/pages/friend_ai/index?tab=index";
                    else if (getApp().globalData.get_ble_lists.Z1_LIST.includes(s)) i.jump_to = "ai_camera", i.content = n.dqsbsyaicameraxlqqhzaicameramk + n["tzhqxwcsbwldszyqbzcsy!"], i.url = "/pages/friend_ai/index?tab=index";
                    else {
                        if ("lable" == o.default.get_working_app()) return !0;
                        "\u55b5\u5b66\u738b" == getApp().globalData.app_name && ["C21", "D1", "D2", "E2", "NEWSMY"].includes(s) ? (i.jump_to = "dck", i.content = "\u5f53\u524d\u8bbe\u5907\u5c5e\u4e8e\u5355\u8bcd\u5361\u7cfb\u5217,\u8bf7\u5207\u6362\u81f3\u5355\u8bcd\u5361\u6a21\u5757\u3002", i.url = "/pages/word_card/index?tab=ciku") : "funprint" == getApp().globalData.app_name && ["BHSZY"].includes(s) ? (i.jump_to = "simple_b3_ble", i.content = "", i.url = "/pages/simple_b3_pages/tab_index") : (i.jump_to = getApp().globalData.app_name, i.content = n.dqsbsymndyjxlqqhzmndyjmk, i.url = o.default.get_index())
                    }
                    if (t) return i;
                    if ("FriendAI" != getApp().globalData.app_name && "funprint" != getApp().globalData.app_name || (i.content = ""), i.jump_to != o.default.get_working_app()) return V(i, e), !1
                }
                return !0
            },
            reLaunch_to_modal: function(e) {
                return Z.apply(this, arguments)
            }
        };
        t.default = _
    }).call(this, a("f3b9")["default"])
}