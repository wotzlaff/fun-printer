function(e, t, a) {
    "use strict";
    (function(e) {
        var i = a("47a9");
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = void 0;
        var s = i(a("127e")),
            n = i(a("ee10")),
            r = i(a("59cb"));
        i(a("a061"));

        function l() {
            return l = (0, n.default)(s.default.mark((function e() {
                var t, a, i;
                return s.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (t = -1, a = r.default.checkSystemEnableLocation(), !a) {
                                e.next = 9;
                                break
                            }
                            return e.next = 5, r.default.requestAndroidPermission("android.permission.ACCESS_FINE_LOCATION");
                        case 5:
                            i = e.sent, t = i, e.next = 10;
                            break;
                        case 9:
                            t = -2;
                        case 10:
                            return e.abrupt("return", t);
                        case 11:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), l.apply(this, arguments)
        }

        function o() {
            return o = (0, n.default)(s.default.mark((function e() {
                var t;
                return s.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            return e.abrupt("return");
                        case 3:
                            t = e.sent, 1 == t ? uni.$emit("permission_complete", {}) : 0 == t ? uni.showModal({
                                title: getApp().globalData.app_name,
                                content: getApp().globalData.$t("message").nyjjsqqkq,
                                showCancel: !1,
                                confirmText: getApp().globalData.$t("message").qr
                            }) : uni.showModal({
                                title: getApp().globalData.app_name,
                                content: getApp().globalData.$t("message").yyjjjwzfwsqqkq,
                                showCancel: !1,
                                confirmText: getApp().globalData.$t("message").sz,
                                success: function() {
                                    r.default.gotoAppPermissionSetting()
                                }
                            });
                        case 5:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), o.apply(this, arguments)
        }

        function A() {
            return A = (0, n.default)(s.default.mark((function e() {
                var t;
                return s.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (!("android" == uni.getSystemInfoSync().osName && uni.getSystemInfoSync().osVersion >= 12)) {
                                e.next = 10;
                                break
                            }
                            return e.next = 3, r.default.requestAndroidPermission_33(["android.permission.BLUETOOTH_SCAN", "android.permission.BLUETOOTH_CONNECT"]);
                        case 3:
                            if (t = e.sent, 1 != t) {
                                e.next = 8;
                                break
                            }
                            return e.abrupt("return", !0);
                        case 8:
                            return uni.showModal({
                                title: getApp().globalData.app_name,
                                content: "\u5141\u8bb8\u5e94\u7528\u53d1\u73b0\u548c\u626b\u63cf\u9644\u8fd1\u7684\u8bbe\u5907\uff0c\u6743\u9650\u88ab\u62d2\uff0c\u8bf7\u5f00\u542f",
                                cancelText: getApp().globalData.$t("message").qx,
                                showCancel: !0,
                                confirmText: getApp().globalData.$t("message").sz,
                                success: function(e) {
                                    e.confirm && d()
                                }
                            }), e.abrupt("return", !1);
                        case 10:
                            return e.abrupt("return", !0);
                        case 11:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), A.apply(this, arguments)
        }

        function g() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
            uni.openBluetoothAdapter({
                success: function(a) {
                    e("log", "success", a, " at models/printer/permission.js:188"), t && t()
                },
                fail: function(e) {
                    1e4 == e.errCode ? uni.showModal({
                        title: getApp().globalData.app_name,
                        content: getApp().globalData.$t("message").qdklybqbyjcykjzt,
                        confirmText: getApp().globalData.$t("message").qd,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && d()
                        }
                    }) : 10001 == e.errCode && plus.ios.newObject("CBCentralManager")
                }
            })
        }

        function d() {
            plus.runtime.openURL("app-settings:")
        }
        var c = {
            checkSystemLocationStatus: function() {
                var t = r.default.checkSystemEnableLocation();
                t ? "iOS" == plus.os.name ? function(e) {
                    var t = r.default.judgeIosPermission(e);
                    t || uni.showModal({
                        title: getApp().globalData.app_name,
                        content: getApp().globalData.$t("message").whdwzfwsqqkq,
                        showCancel: !1,
                        confirmText: getApp().globalData.$t("message").sz,
                        success: function(e) {
                            e.confirm && r.default.gotoAppPermissionSetting()
                        }
                    })
                }("location") : function() {
                    o.apply(this, arguments)
                }() : uni.showModal({
                    title: getApp().globalData.app_name,
                    content: getApp().globalData.$t("message").wkqwzfwqkq,
                    showCancel: !0,
                    cancelText: getApp().globalData.$t("message").qx,
                    confirmText: getApp().globalData.$t("message").sz,
                    success: function(t) {
                        if (t.confirm) try {
                            if ("iOS" == plus.os.name) {
                                var a = plus.ios.import("UIApplication"),
                                    i = a.sharedApplication(),
                                    s = plus.ios.import("NSURL"),
                                    n = s.URLWithString("app-settings:");
                                i.openURL(n), plus.ios.deleteObject(n), plus.ios.deleteObject(s), plus.ios.deleteObject(i)
                            } else {
                                var r = plus.android.runtimeMainActivity(),
                                    l = plus.android.importClass("android.content.Intent"),
                                    o = plus.android.importClass("android.provider.Settings"),
                                    A = new l(o.ACTION_LOCATION_SOURCE_SETTINGS);
                                r.startActivity(A)
                            }
                        } catch (g) {
                            e("log", "checkSystemLocationStatus catch:" + g.message, " at models/printer/permission.js:44")
                        }
                    }
                })
            },
            check_android_gprs_status: function() {
                return l.apply(this, arguments)
            },
            goto_app_sets_panel: d,
            request_for_android_12: function() {
                return A.apply(this, arguments)
            },
            bluetooth: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                "iOS" == plus.os.name && uni.getBluetoothAdapterState({
                    success: function(t) {
                        (t.available || (g(e), "FriendAI" != getApp().globalData.app_name)) && e && e(0)
                    },
                    fail: function(t) {
                        1e4 != t.errCode && 10001 != t.errCode || g(e)
                    }
                })
            },
            permisson_for_ios_ble: g
        };
        t.default = c
    }).call(this, a("f3b9")["default"])
}