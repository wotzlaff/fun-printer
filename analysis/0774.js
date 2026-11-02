function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = i(a("127e")),
            n = i(a("ee10")),
            r = (i(a("6660")), i(a("a061"))),
            l = i(a("291c")),
            o = i(a("e289")),
            A = {
                ble_address: "",
                ble_name: "",
                device_no: "",
                model: "",
                fireware_version: "",
                battery_img: ""
            },
            g = null,
            d = null,
            c = "",
            u = {},
            f = null,
            h = null;

        function p(e, a, i) {
            var s = getApp().globalData.package_num,
                n = e.substr(s * i, i);
            if (!n) {
                o.default.print_log();
                var r = "";
                return 3e3 == i ? r = "1B6460" : 2314 == i ? r = "1B6201B0" : 3466 == i ? r = "1B6406" : 2322 == i || 3474 == i || (r = "1B4A50"), t("log", "feed:" + r + "," + i, " at models/printer/android.js:318"), void u.print_hex(r)
            }
            var l = z(n);
            a.write(l), a.flush(), getApp().globalData.package_num++, m(e, a, i)
        }

        function m(e, t, a) {
            return b.apply(this, arguments)
        }

        function b() {
            return b = (0, n.default)(s.default.mark((function e(a, i, n) {
                var g, d, f, h, m, b, k, z;
                return s.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if ("1B79445300" != a && "1B79445301" != a && "1B79445302" != a && "1B7944530" != a && "1B620060" != a && "1B79534643" != a && "1B6201B0" != a && "1B6460" != a && "1B6450" != a && "1B40" != a && "1F287302001200" != a && "1F2873010002" != a && "1F2873010000" != a && "12230F" != a && "1D8303" != a && "1D8302" != a && "1D8301" != a && "1B6406" != a && "1B64061B4A50" != a) {
                                e.next = 2;
                                break
                            }
                            return e.abrupt("return");
                        case 2:
                            if ("1D82" != a.substr(0, 4)) {
                                e.next = 5;
                                break
                            }
                            return o.default.print_log(), e.abrupt("return");
                        case 5:
                            if ("1D7630" != a.substr(0, 6) && "1D49F0" != a.substr(0, 6)) {
                                e.next = 8;
                                break
                            }
                            return o.default.print_log(), e.abrupt("return");
                        case 8:
                            if ("1B6406" != a.substr(-6) && "1B6404" != a.substr(-6)) {
                                e.next = 11;
                                break
                            }
                            return o.default.print_log(), e.abrupt("return");
                        case 11:
                            return g = !1, "1B7944454E" == a && (g = !0), "1B02" != a && "1E4700" != a || (g = "v8"), e.next = 16, y(g);
                        case 16:
                            if (d = e.sent, f = r.default.hex_to_str(d), !(f.length >= 10 && "DPI" == f.substr(-9, 3))) {
                                e.next = 23;
                                break
                            }
                            return h = f.substr(-5, 3), m = 576 == h ? "V7S" : "V7SPRO", l.default.update_printer_info_attr("model", m), e.abrupt("return");
                        case 23:
                            if ("1B02" != a) {
                                e.next = 26;
                                break
                            }
                            return getApp().globalData.v8_cmd_connected = "oldversion" == d ? "error" : d, e.abrupt("return");
                        case 26:
                            if ("oldversion" != d) {
                                e.next = 29;
                                break
                            }
                            return uni.$emit("update_printer_status", {
                                status: 3
                            }), e.abrupt("return");
                        case 29:
                            if ("" != d || getApp().globalData.fireware_update_cmd && void 0 != getApp().globalData.fireware_update_cmd) {
                                e.next = 33;
                                break
                            }
                            return t("log", "remedy", " at models/printer/android.js:393"), u.print_hex(a, getApp().globalData.print_img_src, getApp().globalData.print_img_from, n), e.abrupt("return");
                        case 33:
                            if ("11" != d) {
                                e.next = 36;
                                break
                            }
                            return p(a, i, n), e.abrupt("return");
                        case 36:
                            if ("1e0008000001b6dd" == d && u.print_hex(uni.getStorageSync("fireware_start_cmd")), "1e0008030001aad4" != d && "1e0008030001aad41e0008030001aad4" != d) {
                                e.next = 40;
                                break
                            }
                            return getApp().globalData.fireware_update_cmd && void 0 != getApp().globalData.fireware_update_cmd ? (getApp().globalData.fireware_update_cmd = "", uni.hideToast(), uni.showModal({
                                title: getApp().globalData.app_name,
                                content: "\u5347\u7ea7\u5b8c\u6210\uff01\r\n\u8bf7\u957f\u6309\u6253\u5370\u673a\u5f00\u5173\u952e6\u79d2\u5f00\u673a\uff01",
                                showCancel: !1,
                                success: function(e) {}
                            })) : fireware.update_cmd(uni.getStorageSync("fireware_model")), e.abrupt("return");
                        case 40:
                            if ("1e0008030002aad5" != d) {
                                e.next = 43;
                                break
                            }
                            return uni.showModal({
                                title: getApp().globalData.app_name,
                                content: "\u5347\u7ea7\u5931\u8d25\uff01\u8bf7\u4fdd\u8bc1\u5c4f\u5e55\u5e38\u4eae\uff0c\u5e76\u5728\u5347\u7ea7\u9875\u9762\uff01",
                                showCancel: !1,
                                success: function(e) {}
                            }), e.abrupt("return");
                        case 43:
                            if ("1e000a03" != d.substr(0, 8)) {
                                e.next = 48;
                                break
                            }
                            return getApp().globalData.fireware_update_cmd_num++, b = getApp().globalData.fireware_update_cmd[getApp().globalData.fireware_update_cmd_num], b && u.print_hex(b), e.abrupt("return");
                        case 48:
                            k = d.substr(2, 2), e.t0 = k, e.next = "01" === e.t0 ? 52 : "02" === e.t0 ? 55 : "03" === e.t0 ? 58 : "04" === e.t0 ? 62 : 68;
                            break;
                        case 52:
                            return A["fireware_version"] = r.default.hex_to_str(d.substr(4, d.length - 8)), uni.$emit("connect_complete", {
                                ble_address: c,
                                ble_name: A["ble_name"],
                                model: A["model"]
                            }), e.abrupt("break", 68);
                        case 55:
                            return A["device_no"] = A["model"] + r.default.hex_to_str(d.substr(12, 18)), u.print_hex("1B79424154"), e.abrupt("break", 68);
                        case 58:
                            return A["battery_img"] = "/static/index/battery_" + d.substr(4, 2) + ".png", A["battery"] = d.substr(4, 2), u.print_hex("1B79564552"), e.abrupt("break", 68);
                        case 62:
                            return z = d.length, 24 == z ? z = 12 : 36 == z && (z = 18), A["model"] = r.default.hex_to_str(d.substr(4, z - 8)).toUpperCase(), "V6PRO" == A["model"] && (uni.setStorageSync("model_img_width", 576), uni.setStorageSync("printer_model", "V6PRO")), u.print_hex("1B794D4143"), e.abrupt("break", 68);
                        case 68:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), b.apply(this, arguments)
        }

        function y(e) {
            var a = d.getInputStream();
            return plus.android.importClass(a), new Promise((function(i) {
                e ? "v8" == e ? setTimeout((function() {
                    var e = a.available();
                    t("log", "byte_count:" + e, " at models/printer/android.js:498");
                    var s = e ? k(a) : "oldversion";
                    i(s)
                }), 1500) : setTimeout((function() {
                    var e = a.available();
                    t("log", "byte_count:" + e, " at models/printer/android.js:505");
                    var s = e ? k(a) : "oldversion";
                    i(s)
                }), 5e3) : i(k(a))
            }))
        }

        function k(e) {
            var t = "",
                a = "",
                i = e.available();
            while (1) {
                if (t = e.read(), null == t) break;
                var s = t.toString(16);
                if (s = 1 == s.length ? "0" + s : s, a += s, "0D0A" == a.substr(-4).toUpperCase() || "11" == a.substr(-2) && 2 == a.length || "1e0008000001b6dd" == a || "1e0008030001aad4" == a || "1e000a03" == a.substr(0, 8) && 20 == a.length) break;
                if ("1b" != a.substr(0, 2) && a.length >= 2 * i) break
            }
            return a
        }

        function z(e) {
            for (var t, a = e.trim(), i = "0x" === a.substr(0, 2).toLowerCase() ? a.substr(2) : a, s = i.length, n = [], r = 0; r < s; r += 2) t = parseInt(i.substr(r, 2), 16), n.push(w(t));
            return n
        }

        function w(e) {
            var t = 255 & e,
                a = 0;
            return t >= 128 ? (a = t % 128, a = -1 * (128 - a)) : a = t, a
        }
        u.is_connected = function() {
            var e = l.default.get_printer_info();
            return !(null == e || !e.hasOwnProperty("model") || !e["model"] || !e["ble_address"] && !e["ble_address"] || "V5" == e["model"] || "V5PRO" == e["model"] || "V7" == e["model"] || "V7PRO" == e["model"] || "V8" == e["model"] || "V8PRO" == e["model"])
        }, u.v8_is_connected = function() {
            return getApp().globalData.v8_cmd_connected = "", new Promise((function(e, t) {
                u.print_hex("1B02", "", "", 0), setTimeout((function() {
                    if ("" != getApp().globalData.v8_cmd_connected) {
                        var t = "error" == getApp().globalData.v8_cmd_connected ? "" : getApp().globalData.v8_cmd_connected;
                        e(t)
                    }
                }), 2e3), setTimeout((function() {
                    if ("" != getApp().globalData.v8_cmd_connected) {
                        var t = "error" == getApp().globalData.v8_cmd_connected ? "" : getApp().globalData.v8_cmd_connected;
                        e(t)
                    }
                }), 5e3)
            }))
        }, u.search = function(e, a) {
            try {
                var i = plus.android.runtimeMainActivity(),
                    s = plus.android.importClass("android.content.IntentFilter"),
                    n = plus.android.importClass("android.bluetooth.BluetoothAdapter"),
                    l = plus.android.importClass("android.bluetooth.BluetoothDevice");
                if (g = n.getDefaultAdapter(), !g.isEnabled()) {
                    var o = g.enable();
                    if (!o) return void uni.showModal({
                        title: getApp().globalData.app_name,
                        content: getApp().globalData.$t("message").qxdklyo,
                        showCancel: !1,
                        success: function(e) {}
                    })
                }
                g.startDiscovery(), f = plus.android.implements("io.dcloud.android.content.BroadcastReceiver", {
                    onReceive: function(i, s) {
                        if (plus.android.importClass(s), "android.bluetooth.adapter.action.DISCOVERY_FINISHED" == s.getAction());
                        else {
                            var n = s.getParcelableExtra(l.EXTRA_DEVICE),
                                o = n.getName().toUpperCase().replace(/ /g, ""),
                                A = n.getAddress();
                            "JX400R06P" != o.substr(0, 9) && "00:15:83:3B" == A.substr(0, 11) && (o = "JX400R");
                            var g = r.default.get_printer_model(o, A);
                            if ("V7S" == g) {
                                var d = A.replace(/:/g, "");
                                if (d.substr(-4) != o.substr(-4)) return
                            }
                            t("log", e + "," + o, " at models/printer/android.js:112"), e == o && a && a({
                                ble_address: A,
                                ble_name: o
                            })
                        }
                    }
                }), h = new s;
                var A = new l;
                h.addAction(A.ACTION_FOUND), h.addAction(g.ACTION_DISCOVERY_STARTED), h.addAction(g.ACTION_DISCOVERY_FINISHED), h.addAction(g.ACTION_STATE_CHANGED), i.registerReceiver(f, h)
            } catch (d) {
                t("log", "search catch:" + d.message, " at models/printer/android.js:130")
            }
        }, u.connect = function(e, t) {
            c = e;
            var a = r.default.get_printer_model(t, c);
            if ("V8SPRO" != a && "V8S" != a) {
                if (null == g) {
                    var i = plus.android.importClass("android.bluetooth.BluetoothAdapter");
                    g = i.getDefaultAdapter()
                }
                r.default.toast("loading", getApp().globalData.$t("message").ljsb, 3e3);
                var s = plus.android.importClass("java.util.UUID"),
                    n = s.fromString("00001101-0000-1000-8000-00805F9B34FB");
                g.isEnabled() || uni.showModal({
                    title: getApp().globalData.app_name,
                    content: getApp().globalData.$t("message").qxdklyo,
                    success: function(e) {}
                });
                var l = g.getRemoteDevice(c);
                plus.android.importClass(l), d = l.createInsecureRfcommSocketToServiceRecord(n), plus.android.importClass(d), d.isConnected() || d.connect(), r.default.toast("loading", getApp().globalData.$t("message").ljz, 1e4), setTimeout((function() {
                    if (d.isConnected()) {
                        if (A["ble_address"] = c, A["ble_name"] = t, A["model"] = a, "V6" == a || "V6PRO" == a) return void u.print_hex("1B7944454E", "", "", 0);
                        uni.$emit("connect_complete", {
                            ble_address: c,
                            ble_name: t,
                            model: a
                        })
                    } else uni.showModal({
                        title: getApp().globalData.$t("message").ljz,
                        content: getApp().globalData.$t("message").qzqjqzhzzs,
                        success: function(e) {}
                    })
                }), 4e3)
            } else getApp().globalData.vson_printer.connect(c)
        }, u.cancel_discovery = function() {
            if (g && g.cancelDiscovery(), f) try {
                var e = plus.android.runtimeMainActivity();
                e.unregisterReceiver(f)
            } catch (a) {
                t("log", "cancel_discovery catch:" + a.message, " at models/printer/android.js:205")
            }
        }, u.print_hex = function(e, t, a, i) {
            if (getApp().globalData.print_img_src = void 0 == t ? "" : t, getApp().globalData.print_img_from = void 0 == a ? "" : a, i = void 0 == i ? 0 : i, !c) return -1;
            if (d && d.isConnected()) {
                var s = d.getOutputStream();
                plus.android.importClass(s), e.length < 100 || "1E" == e.substr(0, 2) ? function(e, t) {
                    var a = z(e);
                    t.write(a), t.flush(), m(e, t, "")
                }(e, s) : (getApp().globalData.package_num = 0, p(e, s, i))
            } else "1B02" != e && uni.showModal({
                title: getApp().globalData.app_name,
                content: getApp().globalData.$t("message").ljsb_503,
                success: function(e) {}
            })
        }, u.get_donded_devices = function() {
            var e = [];
            try {
                var a = plus.android.runtimeMainActivity(),
                    i = plus.android.importClass("android.content.Context"),
                    s = a.getSystemService(i.BLUETOOTH_SERVICE);
                plus.android.importClass(s);
                var n = s.getAdapter();
                plus.android.importClass(n);
                var r = n.getBondedDevices();
                if (!r) return e;
                plus.android.importClass(r);
                var l = r.iterator();
                plus.android.importClass(l);
                while (l.hasNext()) {
                    var o = l.next();
                    plus.android.importClass(o), o && o.getName() && o.getAddress() && e.push({
                        name: o.getName(),
                        address: o.getAddress()
                    })
                }
            } catch (A) {
                t("log", "get_donded_devices catch:" + A.message, " at models/printer/android.js:275")
            }
            return e
        }, e.exports = u
    }).call(this, a("f3b9")["default"])
}