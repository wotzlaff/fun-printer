function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = i(a("127e")),
            n = i(a("ee10")),
            r = (i(a("6660")), i(a("a061"))),
            l = i(a("e289")),
            o = (i(a("9673")), {
                ble_name: "",
                device_id: "",
                model: "",
                service_uuid: "",
                characteristics: "",
                notify_service_uuid: "",
                notify_characteristics: "",
                android_reset_bluetooth: 0
            }),
            A = {},
            g = !1,
            d = !1,
            c = "",
            u = 1,
            f = 1,
            h = !0,
            p = 20,
            m = {
                status: !1,
                distance: 0,
                dianya: [],
                road: ""
            },
            b = ["GT01", "YT01", "YT02", "MX01", "MX02", "MX03", "MX05", "MX06", "MINI PRINTER", "MX07", "MX09", "C21", "NEWSMY", "D1", "D2", "E2", "JL-BR22", "MX08", "URBANWORX KIDS CAMERA", "CYLO BT PRINTER", "MXTP-100", "AZ-P2108X", "MX10", "MX11", "MX12", "PD01", "XO POPPY", "MX13", "BQ01", "BQ02", "EWTTO ET-Z0499", "MXW009", "MXW010", "GV-MA211", "KP-IM606", "BQ03", "BQ17", "IM.17"];

        function y(e, a, i) {
            uni.getBLEDeviceCharacteristics({
                deviceId: e,
                serviceId: a,
                success: function(t) {
                    for (var s = t["characteristics"], n = 0; n < s.length; n++)
                        if (A.is_set_write_characteristics() || s[n]["properties"]["write"] && !s[n]["properties"]["read"] && A.set_write_characteristics(e, a, s[n]["uuid"], i), A.is_set_notify_characteristics() || (s[n]["properties"]["notify"] || s[n]["properties"]["indicate"]) && A.set_notify_characteristics(a, s[n]["uuid"]), A.is_set_notify_characteristics() && A.is_set_write_characteristics()) {
                            if (getApp().globalData.ios_connected = 1, A.get_connected_is_init()) return;
                            A.set_connected_is_init(!0), A.set_notify(), A.reset_mtu();
                            break
                        }
                },
                fail: function(i) {
                    t("log", "d:" + e + " s:" + a + ": device getBLEDeviceCharacteristics fail:", JSON.stringify(i), " at models/printer/ble.js:200")
                }
            })
        }

        function k() {
            return z.apply(this, arguments)
        }

        function z() {
            return z = (0, n.default)(s.default.mark((function e() {
                var t, a, i, n;
                return s.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            t = 0, a = "";
                        case 2:
                            if (!h) {
                                e.next = 16;
                                break
                            }
                            return a = 1 == f ? c : c.slice((u - 1) * p, u * p), e.next = 6, w(a);
                        case 6:
                            if (i = e.sent, 0 === i && (u += 1), n = Math.ceil(u / f * 100), n >= t + Math.floor(3 * Math.random() + 1) && (t = n, getApp().globalData.print_percent = n), !(u >= f + 1)) {
                                e.next = 14;
                                break
                            }
                            return getApp().globalData.print_percent = 100, f > 10 && A.print_complete(), e.abrupt("break", 16);
                        case 14:
                            e.next = 2;
                            break;
                        case 16:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), z.apply(this, arguments)
        }

        function w(e) {
            return new Promise((function(a) {
                uni.writeBLECharacteristicValue({
                    deviceId: o["device_id"],
                    serviceId: o["service_uuid"],
                    characteristicId: o["characteristics"],
                    value: e,
                    success: function(e) {
                        a(0)
                    },
                    fail: function(e) {
                        t("log", "write", e, " at models/printer/ble.js:599"), a(-1)
                    }
                })
            }))
        }
        A.get_adapter_state = function() {
            return new Promise((function(e) {
                uni.getBluetoothAdapterState({
                    success: function(a) {
                        a.available ? e(0) : uni.getBluetoothAdapterState({
                            success: function(t) {
                                t.available ? e(0) : e(-1)
                            },
                            fail: function(a) {
                                t("log", "getBluetoothAdapterState", a, " at models/printer/ble.js:62"), e(a.errCode)
                            }
                        })
                    },
                    fail: function(a) {
                        t("log", "getBluetoothAdapterState", a, " at models/printer/ble.js:71"), e(-1)
                    }
                })
            }))
        }, A.create_connected = function(e, a) {
            e && a && (o["device_id"] = e, o["ble_name"] = a, o["model"] = r.default.get_printer_model(a), uni.stopBluetoothDevicesDiscovery({}), A.set_listening_events(), uni.createBLEConnection({
                deviceId: e,
                success: function(i) {
                    A.set_connected_is_init(!1),
                        function(e, a) {
                            setTimeout((function() {
                                uni.getBLEDeviceServices({
                                    deviceId: e,
                                    success: function(i) {
                                        if (0 != i.services.length || "android" != uni.getSystemInfoSync().platform)
                                            for (var s = 0; s < i.services.length; s++) {
                                                var n = i.services[s]["uuid"];
                                                y(e, n, a)
                                            } else 0 == o["android_reset_bluetooth"] ? (function() {
                                                try {
                                                    var e = plus.android.runtimeMainActivity(),
                                                        a = plus.android.importClass("android.bluetooth.BluetoothAdapter"),
                                                        i = a.getDefaultAdapter();
                                                    i.disable();
                                                    var s = plus.android.importClass("android.content.Intent"),
                                                        n = new s(a.ACTION_REQUEST_ENABLE);
                                                    e.startActivityForResult(n, 1)
                                                } catch (r) {
                                                    t("log", "android_reset_bluetooth catch:" + r.message, " at models/printer/ble.js:148")
                                                }
                                            }(), A.create_connected(e, a), o["android_reset_bluetooth"] = 1) : uni.showModal({
                                                title: getApp().globalData.app_name,
                                                content: getApp().globalData.$t("message").qzqdyjrhzxlj
                                            })
                                    },
                                    fail: function(e) {
                                        t("log", "getBLEDeviceServices fail:", JSON.stringify(e), " at models/printer/ble.js:129")
                                    }
                                })
                            }), 1500)
                        }(e, a)
                },
                fail: function(e) {
                    t("log", "createBLEConnection fail:" + JSON.stringify(e), " at models/printer/ble.js:97")
                }
            }))
        }, A.set_listening_events = function() {
            uni.onBluetoothAdapterStateChange((function(e) {
                1 == e.available && uni.openBluetoothAdapter({
                    success: function(e) {}
                })
            })), uni.onBLECharacteristicValueChange((function(e) {
                if (e.value) {
                    var a = function(e) {
                        var t = Array.prototype.map.call(new Uint8Array(e), (function(e) {
                            return ("00" + e.toString(16)).slice(-2)
                        }));
                        return t.join("")
                    }(e.value);
                    if (getApp().globalData.cmd_debug && uni.$emit("cmd_debug", a), t("log", "CharacteristicValueChange receive:" + a, " at models/printer/ble.js:236"), "5178ae0101001070ff" == a) t("log", "\u89e6\u53d1\u6d41\u63a7", " at models/printer/ble.js:239"), A.set_is_can_write(!1);
                    else if ("5178ae0101000000ff" == a) {
                        if (t("log", "\u89e3\u9664\u6d41\u63a7", " at models/printer/ble.js:242"), A.set_is_can_write(!0), getApp().globalData.stop_print_flag) return void(getApp().globalData.stop_print_flag = !1);
                        1 != f && A.continue_print()
                    } else if ((18 == a.length || 22 == a.length) && "a3" == a.substr(4, 2)) {
                        var i = a.substr(12, 2),
                            s = "",
                            n = "",
                            r = !1,
                            l = "";
                        if (22 == a.length) {
                            if (getApp().globalData.biaoqianji = !0, m["status"]) {
                                var o = parseInt(a.substr(14, 2), 16);
                                A.v5g_dingwei(o)
                            }
                        } else getApp().globalData.biaoqianji = !1;
                        switch (i) {
                            case "00":
                                l = "zhengchang", uni.$emit("print_status_alter", l);
                                break;
                            case "01":
                            case "09":
                                l = "quezhi", s = getApp().globalData.$t("message").zywl, n = getApp().globalData.$t("message").qzywlqxzzzldy, r = !0;
                                break;
                            case "04":
                                l = "guore", s = getApp().globalData.$t("message").grtx, n = getApp().globalData.$t("message").qwtrlxxxzldyb, r = !0;
                                break;
                            case "08":
                                l = "didian", s = getApp().globalData.$t("message").dlbzl, n = getApp().globalData.$t("message").xzkmdlgwcxd, r = !0;
                                break
                        }
                        if (r) {
                            var g = getCurrentPages(),
                                d = g[g.length - 1].$getAppWebview();
                            "pages/print_preview/print_webview_preview" == d.__uniapp_route ? uni.$emit("print_status_alter", l) : function(e, t) {
                                uni.hideLoading(), uni.hideToast(), uni.showModal({
                                    title: e,
                                    content: t,
                                    showCancel: !1,
                                    success: function() {
                                        A.set_is_can_write(!1)
                                    }
                                })
                            }(s, n)
                        }
                    }
                }
            })), uni.onBLEConnectionStateChange((function(e) {
                t("log", "onBLEConnectionStateChange", e, " at models/printer/ble.js:315"), uni.$emit("ble_connect_state_change", e), e.connected || l.default.disconnected()
            }))
        }, A.v5g_dingwei = function(e) {
            if (0 == e ? m["status"] = !0 : m["dianya"].push(e), m["dianya"].length >= 8) {
                for (var a = 0, i = m["dianya"].length - 1; i >= m["dianya"].length - 8; i--) a += m["dianya"][i];
                t("log", "temp_sum:" + a, " at models/printer/ble.js:341"), "" == m["road"] ? m["road"] = a <= 166 ? "A" : "B" : ("B" == m["road"].substr(-1) && 168 - a >= 24 && (m["road"] += "A"), "A" == m["road"].substr(-1) && a >= 168 && (m["road"] += "B"))
            }
            if (t("log", m["road"], " at models/printer/ble.js:361"), "BA" == m["road"] && m["distance"] >= 64 || "BA" == m["road"].substr(-2)) {
                t("log", "\u5b9a\u4f4d\u5b8c\u6210", " at models/printer/ble.js:364");
                return A.print_hex("5178A1000200100057FF", "", "dingwei"), void(m = {
                    status: !1,
                    distance: 0,
                    dianya: [],
                    road: ""
                })
            }
            m["distance"]++,
                function(e) {
                    var t = new Date,
                        a = t.getTime() + e;
                    while (1)
                        if (t = new Date, t.getTime() > a) return
                }(50);
            A.print_hex("5178a30001000000ff5178a1000200010015ff", "", "dingwei")
        }, A.init = function(e, t, a, i) {
            o = {
                device_id: e,
                service_uuid: t,
                characteristics: a
            }
        }, A.disconnect = function(e) {
            uni.closeBLEConnection({
                deviceId: e,
                complete: function(e) {}
            })
        }, A.set_is_word_print = function(e) {
            d = e
        }, A.is_word_print = function() {
            return d
        }, A.get_is_can_write = function() {
            return h
        }, A.set_is_can_write = function(e) {
            h = e
        }, A.get_connected_is_init = function() {
            return g
        }, A.set_connected_is_init = function(e) {
            g = e
        }, A.set_write_characteristics = function(e, t, a, i) {
            o["device_id"] = e, o["service_uuid"] = t, o["characteristics"] = a, o["ble_name"] = i.trim()
        }, A.is_set_write_characteristics = function() {
            return !(!o.hasOwnProperty("characteristics") || !o["characteristics"])
        }, A.set_notify_characteristics = function(e, t) {
            o["notify_service_uuid"] = e, o["notify_characteristics"] = t
        }, A.is_set_notify_characteristics = function() {
            return !(!o.hasOwnProperty("notify_characteristics") || !o["notify_characteristics"])
        }, A.is_connected = function() {
            return !(!o || !o["device_id"])
        }, A.get_deivce = function() {
            return o
        }, A.print_hex = function(e, t, a) {
            if (!o["device_id"]) return r.default.modal_connect_printer(), !1;
            if (e) {
                f = Math.ceil(e.length / 2 / p);
                for (var i = new ArrayBuffer(e.length / 2), s = new DataView(i), n = 0; n < e.length / 2; n++) s.setUint8(n, parseInt(e.substr(2 * n, 2), 16));
                u = 1, c = i, h = !0, getApp().globalData.print_img_src = void 0 != t ? t : "", getApp().globalData.print_img_from = void 0 != a ? a : "", k()
            }
        }, A.continue_print = function() {
            k()
        }, A.sleep = function(e) {
            var t = (new Date).getTime() + parseInt(e, 10);
            while ((new Date).getTime() < t);
        }, A.print_complete = function() {
            uni.hideLoading(), uni.hideToast(), uni.$emit("can_print_next_word_page", {}), setTimeout((function() {
                l.default.print_log()
            }), 900)
        }, A.set_notify = function() {
            uni.notifyBLECharacteristicValueChange({
                state: !0,
                deviceId: o["device_id"],
                serviceId: o["notify_service_uuid"],
                characteristicId: o["notify_characteristics"],
                success: function(e) {
                    A.print_hex("5178A30001000000FF", "", ""), uni.$emit("connect_complete", {
                        ble_address: o["device_id"],
                        ble_name: o["ble_name"],
                        model: r.default.get_printer_model(o["ble_name"])
                    })
                }
            })
        }, A.reset_mtu = function() {
            var e = o["ble_name"].trim().toUpperCase();
            return b.indexOf(e) >= 0 && setTimeout((function() {
                uni.setBLEMTU({
                    deviceId: o["device_id"],
                    mtu: 82,
                    success: function(e) {
                        p = 50
                    },
                    fail: function(e) {
                        t("log", "setBLEMTU", e, " at models/printer/ble.js:655")
                    }
                })
            }), 100), !0
        }, e.exports = A
    }).call(this, a("f3b9")["default"])
}