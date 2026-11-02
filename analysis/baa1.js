function(e, t, a) {
    "use strict";
    (function(e, i) {
        var s = a("47a9");
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = void 0;
        var n = s(a("127e")),
            r = s(a("ee10")),
            l = s(a("0c36")),
            o = s(a("59cb"));

        function A() {
            return A = (0, r.default)(n.default.mark((function e() {
                var t, a, i;
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (!(uni.getSystemInfoSync().osVersion >= 12)) {
                                e.next = 5;
                                break
                            }
                            return e.next = 3, l.default.request_for_android_12();
                        case 3:
                            e.next = 9;
                            break;
                        case 5:
                            return e.next = 7, u("bluetooth");
                        case 7:
                            if (e.sent) {
                                e.next = 9;
                                break
                            }
                            return e.abrupt("return", !1);
                        case 9:
                            if (t = plus.android.importClass("android.bluetooth.BluetoothAdapter"), a = t.getDefaultAdapter(), !a.isEnabled()) {
                                e.next = 15;
                                break
                            }
                            return e.abrupt("return", !0);
                        case 15:
                            return i = a.enable(), i || uni.showModal({
                                title: getApp().globalData.app_name,
                                content: getApp().globalData.$t("message").qxdklyozdysjsx,
                                confirmText: getApp().globalData.$t("message").qr,
                                cancelText: getApp().globalData.$t("message").qx,
                                showCancel: !1,
                                success: function(e) {}
                            }), e.abrupt("return", !1);
                        case 18:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), A.apply(this, arguments)
        }

        function g() {
            return d.apply(this, arguments)
        }

        function d() {
            return d = (0, r.default)(n.default.mark((function e() {
                var t = arguments;
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            return t.length > 0 && void 0 !== t[0] ? t[0] : null, e.next = 3, u();
                        case 3:
                            if (!e.sent) {
                                e.next = 9;
                                break
                            }
                            return e.next = 6, c();
                        case 6:
                            return e.abrupt("return", e.sent);
                        case 9:
                            return e.abrupt("return", !1);
                        case 10:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), d.apply(this, arguments)
        }

        function c() {
            return new Promise((function(t, a) {
                e({
                    success: function(e) {
                        i("log", "\u521d\u59cb\u5316wifi\u6210\u529f", e, " at pages/friend_ai/tools/examine_permision.js:49"), t(!0)
                    },
                    fail: function(e) {
                        i("log", "\u521d\u59cb\u5316wifi\u5931\u8d25", e, " at pages/friend_ai/tools/examine_permision.js:53"), t(!1)
                    }
                })
            }))
        }

        function u(e) {
            return f.apply(this, arguments)
        }

        function f() {
            return f = (0, r.default)(n.default.mark((function e(t) {
                var a;
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (a = o.default.checkSystemEnableLocation(), !a) {
                                e.next = 5;
                                break
                            }
                            return e.abrupt("return", h(t));
                        case 5:
                            if (!("iOS" == plus.os.name && parseInt(plus.os.version) >= 26)) {
                                e.next = 8;
                                break
                            }
                            return uni.getStorageSync("location_tip") || uni.showModal({
                                title: getApp().globalData.$t("message").wkqdwfw,
                                content: getApp().globalData.$t("message").qqwszysyaqxdwfwkqhkhqdqsywifi,
                                showCancel: !0,
                                confirmText: getApp().globalData.$t("message").bztx,
                                cancelText: getApp().globalData.$t("message").qd,
                                success: function(e) {
                                    e.confirm && uni.setStorageSync("location_tip", !0)
                                }
                            }), e.abrupt("return", !1);
                        case 8:
                            return uni.showModal({
                                title: getApp().globalData.app_name,
                                content: getApp().globalData.$t("message").wkqwzfwqkq,
                                showCancel: !0,
                                cancelText: getApp().globalData.$t("message").qx,
                                confirmText: getApp().globalData.$t("message").sz,
                                success: function(e) {
                                    if (e.confirm) {
                                        try {
                                            if ("iOS" == plus.os.name) plus.runtime.openURL("App-Prefs:Privacy&path=LOCATION"), uni.$emit("re_check_permission");
                                            else {
                                                var t = plus.android.runtimeMainActivity(),
                                                    a = plus.android.importClass("android.content.Intent"),
                                                    s = plus.android.importClass("android.provider.Settings"),
                                                    n = new a(s.ACTION_LOCATION_SOURCE_SETTINGS);
                                                t.onActivityResult = function() {
                                                    var e = getCurrentPages(),
                                                        t = e[e.length - 1].route;
                                                    "pages/friend_ai/pages/bluetooth_wifi" == t ? uni.$emit("re_check_permission") : g()
                                                }, t.startActivityForResult(n, 1001)
                                            }
                                        } catch (r) {
                                            i("log", "checkSystemLocationStatus catch:" + r.message, " at pages/friend_ai/tools/examine_permision.js:116")
                                        }
                                        return !0
                                    }
                                }
                            }), e.abrupt("return", !1);
                        case 10:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), f.apply(this, arguments)
        }

        function h(e) {
            return p.apply(this, arguments)
        }

        function p() {
            return p = (0, r.default)(n.default.mark((function e(t) {
                var a;
                return n.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (a = 1, "iOS" != plus.os.name) {
                                e.next = 8;
                                break
                            }
                            return e.next = 4, o.default.judgeIosPermission("location");
                        case 4:
                            a = e.sent, a || (a = -1), e.next = 11;
                            break;
                        case 8:
                            return e.next = 10, o.default.requestAndroidPermission_33(["android.permission.ACCESS_FINE_LOCATION"], !0);
                        case 10:
                            a = e.sent;
                        case 11:
                            if (-1 != a) {
                                e.next = 17;
                                break
                            }
                            return uni.showModal({
                                title: uni.getSystemInfoSync().appName,
                                content: "bluetooth" == t ? getApp().globalData.$t("message").qdkwzqxybnjxlyss : getApp().globalData.$t("message").wlfbhqwifilbqndkdwqxbqgwjqwz,
                                cancelText: getApp().globalData.$t("message").qx,
                                confirmText: getApp().globalData.$t("message").qsz,
                                success: function(e) {
                                    if (e.confirm)
                                        if ("iOS" == plus.os.name) o.default.gotoAppPermissionSetting(), uni.$emit("re_check_permission");
                                        else {
                                            var t = plus.android.runtimeMainActivity(),
                                                a = plus.android.importClass("android.content.Intent"),
                                                i = plus.android.importClass("android.provider.Settings"),
                                                s = new a(i.ACTION_APPLICATION_DETAILS_SETTINGS),
                                                n = plus.android.importClass("android.net.Uri"),
                                                r = n.fromParts("package", t.getPackageName(), null);
                                            s.setData(r), t.onActivityResult = function() {
                                                var e = getCurrentPages(),
                                                    t = e[e.length - 1].route;
                                                "pages/friend_ai/pages/bluetooth_wifi" == t ? uni.$emit("re_check_permission") : g()
                                            }, t.startActivityForResult(s, 1001)
                                        }
                                }
                            }), e.abrupt("return", !1);
                        case 17:
                            if (0 != a) {
                                e.next = 19;
                                break
                            }
                            return e.abrupt("return", !1);
                        case 19:
                            return e.abrupt("return", !0);
                        case 20:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), p.apply(this, arguments)
        }
        var m = {
            check_ble_permission: function() {
                return A.apply(this, arguments)
            },
            check_WiFi_permission: g,
            init_wifi: c
        };
        t.default = m
    }).call(this, a("96e8")["startWifi"], a("f3b9")["default"])
}