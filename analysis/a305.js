function(e, t, a) {
    "use strict";
    var i = a("47a9");
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = void 0;
    var s = i(a("127e")),
        n = i(a("3b2d")),
        r = i(a("ee10")),
        l = i(a("daf2")),
        o = i(a("0774")),
        A = i(a("4ab3")),
        g = i(a("5b77")),
        d = i(a("7869")),
        c = i(a("291c")),
        u = i(a("a061")),
        f = i(a("1ee9")),
        h = i(a("c652")),
        p = i(a("86c0")),
        m = i(a("11c6")),
        b = i(a("576f")),
        y = i(a("8601")),
        k = a("6b4e");

    function z(e) {
        if ("function" !== typeof WeakMap) return null;
        var t = new WeakMap,
            a = new WeakMap;
        return (z = function(e) {
            return e ? a : t
        })(e)
    }

    function w(e, t) {
        if (!t && e && e.__esModule) return e;
        if (null === e || "object" !== (0, n.default)(e) && "function" !== typeof e) return {
            default: e
        };
        var a = z(t);
        if (a && a.has(e)) return a.get(e);
        var i = {},
            s = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var r in e)
            if ("default" !== r && Object.prototype.hasOwnProperty.call(e, r)) {
                var l = s ? Object.getOwnPropertyDescriptor(e, r) : null;
                l && (l.get || l.set) ? Object.defineProperty(i, r, l) : i[r] = e[r]
            } return i.default = e, a && a.set(e, i), i
    }
    var j = {
        globalData: {
            get_ble_lists: {},
            sn_code: "",
            device_data: [],
            is_config_wifi: !1,
            device_id: 0,
            is_wifi_connect: !1,
            socket_port: 8081,
            ad_show_status: "unknown",
            show_cache_ad: !1,
            socket_client: null,
            app_name: "",
            dck: d.default,
            ble: null,
            ios_ble: null,
            android_ble: null,
            use_android_ble: !0,
            v5g_label: A.default,
            v5x_label: g.default,
            v5_printer: null,
            android_printer: o.default,
            ios_printer: l.default,
            vson_printer: null,
            wtr_printer: null,
            self: null,
            recordPoints: [],
            _i18n: "",
            $t: "",
            _theme: "",
            $th: "",
            third_party_file_path: "",
            third_party_platform_from: "",
            navigate_config: f.default,
            ytb_config: p.default,
            app_version: "",
            camera: h.default,
            user_config: b.default,
            app_config: m.default,
            ytb_xunfei: null,
            stop_print_flag: !0,
            ad: null,
            splashTimeoutId: null,
            open_ad_showing: !1,
            v5c_a1_is_query_status: !1,
            cn_open_status_flag: !1,
            Ytb: u.default,
            socket_last_connect_time: 0,
            device_sn: "",
            ai_menu_config: y.default,
            faceBeauty: {},
            socket: null
        },
        onLaunch: function() {
            var e = this;
            getApp().globalData.self = this, getApp().globalData.app_name = this.get_app_name(), this.get_app_version(), ("FriendAI" == getApp().globalData.app_name || ["printer_with_screen", "FriendAI"].includes(this.$ytb.get_working_app())) && Promise.resolve().then((function() {
                return w(a("bc71"))
            })).then((function(e) {
                getApp().globalData.socket = e
            })), "iOS" == plus.os.name ? Promise.resolve().then((function() {
                return w(a("81a4"))
            })).then((function(e) {
                getApp().globalData.ios_ble = e
            })) : (Promise.resolve().then((function() {
                return w(a("c543"))
            })).then((function(e) {
                getApp().globalData.ble = e
            })), Promise.resolve().then((function() {
                return w(a("dc2f"))
            })).then((function(e) {
                getApp().globalData.android_ble = e, getApp().globalData.android_ble.init()
            }))), "\u5370\u9898\u5b9d" != getApp().globalData.app_name && "iBleem" != getApp().globalData.app_name || (Promise.resolve().then((function() {
                return w(a("d51f"))
            })).then((function(e) {
                getApp().globalData.v5_printer = e
            })), Promise.resolve().then((function() {
                return w(a("8588"))
            })).then((function(e) {
                getApp().globalData.vson_printer = e
            })), Promise.resolve().then((function() {
                return w(a("e44e"))
            })).then((function(e) {
                getApp().globalData.wtr_printer = e, "Android" == plus.os.name && getApp().globalData.wtr_printer.init()
            }))), "\u5370\u9898\u5b9d" != getApp().globalData.app_name && ("iOS" == plus.os.name ? Promise.resolve().then((function() {
                return w(a("9b72"))
            })).then((function(e) {
                getApp().globalData.ytb_xunfei = e
            })) : Promise.resolve().then((function() {
                return w(a("c403"))
            })).then((function(e) {
                getApp().globalData.ytb_xunfei = e
            }))), "ios" != plus.os.name.toLocaleLowerCase() && uni.openBluetoothAdapter({
                complete: function(e) {}
            });
            var t = this;
            this.globalData._i18n = this._i18n, this.globalData.$t = function(e) {
                getApp().globalData._i18n;
                return t.$t(e)
            }, this.globalData._theme = this._theme, this.globalData.$th = function(e) {
                return t.$th(e)
            }, getApp().globalData.change_printer = !1, c.default.clear_printer_info(), u.default.change_mode(c.default.get_dark_mode_status() || this.globalData._theme.locale), this.arguments(), plus.globalEvent.addEventListener("newintent", (function(t) {
                e.arguments()
            })), getApp().globalData.splashTimeoutId = setTimeout((function(e) {
                getApp().globalData.splashTimeoutId = null, plus.navigator.closeSplashscreen()
            }), 5e3), (0, k.app_config_init)(), "FriendAI" == getApp().globalData.app_name && (c.default.has_login() ? uni.reLaunch({
                url: u.default.get_logged_index("logined"),
                success: function() {
                    plus.navigator.closeSplashscreen()
                }
            }) : plus.navigator.closeSplashscreen())
        },
        computed: {
            i18n: function() {
                return this.$t("message")
            }
        },
        onShow: function() {
            getApp().globalData.self.check_third_party();
            uni.getStorageSync("lang_select");
            getApp().globalData._i18n.locale = u.default.get_lang_locale(this.get_app_name()), getApp().globalData.show_cache_ad && "funprint" == getApp().globalData.app_name && getApp().globalData.ad && getApp().globalData.ad.open_ads(), getApp().globalData.socket && getApp().globalData.socket.send_message({
                action: "app_heart",
                data: "ping"
            })
        },
        onHide: function() {
            var e = u.default.get_show_times(),
                t = getApp().globalData._i18n.locale,
                a = getApp().globalData.user_config.get_config().show_cache_ad;
            "showed" != getApp().globalData.ad_show_status && "zh" != t && e < 2 && a && "funprint" == getApp().globalData.app_name && (getApp().globalData.show_cache_ad = !0)
        },
        onError: function(e) {
            c.default.upload_error_log(e)
        },
        methods: {
            get_app_version: function() {
                return (0, r.default)(s.default.mark((function e() {
                    return s.default.wrap((function(e) {
                        while (1) switch (e.prev = e.next) {
                            case 0:
                                return e.next = 2, m.default.get_app_version();
                            case 2:
                                getApp().globalData.app_version = e.sent;
                            case 3:
                            case "end":
                                return e.stop()
                        }
                    }), e)
                })))()
            },
            get_app_name: function() {
                var e = plus.runtime.appid,
                    t = "\u5370\u9898\u5b9d";
                return "__UNI__B4E9C0A" == e ? t = "\u5370\u9898\u5b9d" : "__UNI__C56BDCE" == e ? t = "\u55b5\u5b66\u738b" : "__UNI__86FA60C" == e ? t = "iBleem" : "__UNI__573AE67" == e ? t = "funprint" : "__UNI__D0DE9E4" == e ? t = "\u72b6\u5143\u9886\u8dd1" : "__UNI__F0887F6" == e && (t = "FriendAI"), getApp().globalData.haiwaiban = "funprint" == t || "iBleem" == t || "FriendAI" == t, t
            },
            arguments: function() {
                if (plus.runtime.arguments) {
                    var e;
                    try {
                        e = JSON.parse(plus.runtime.arguments)
                    } catch (t) {
                        return
                    }
                    e["path"] && void 0 != e["path"] && setTimeout((function() {
                        "cuotiben" == e["path"] ? uni.navigateTo({
                            url: "../ocrquestion/index"
                        }) : "tiku" == e["path"] ? uni.navigateTo({
                            url: "../tiku/subject"
                        }) : "search_question" == e["path"] && h.default.show_camera((function(e) {
                            uni.navigateTo({
                                url: "../question_search_result/question_search_result?src=" + e
                            })
                        }))
                    }), 1500)
                }
            },
            check_third_party: function() {
                "ios" == plus.os.name.toLocaleLowerCase() ? this.check_third_party_ios() : this.check_third_party_android()
            },
            check_third_party_ios: function() {
                var e = this;
                setTimeout((function() {
                    var t = plus.runtime.arguments;
                    if (t) {
                        var a = t;
                        plus.runtime.arguments = null, t = null, e.file_handle(a)
                    }
                }), 500)
            },
            check_third_party_android: function() {
                var e = plus.runtime.arguments;
                if (plus.runtime.arguments = "", e && -1 != e.indexOf("third_file_local_path")) {
                    e = JSON.parse(e);
                    var t = e.third_file_local_path;
                    if (t) {
                        "file:" != t.substr(0, 5) && (t = "file://" + t), getApp().globalData.third_party_file_path = t;
                        var a = e.data_string;
                        a ? -1 != a.indexOf("com.tencent.mm") ? getApp().globalData.third_party_platform_from = "weixin" : -1 != a.indexOf("com.tencent.mobileqq") ? getApp().globalData.third_party_platform_from = "qq" : getApp().globalData.third_party_platform_from = "other" : getApp().globalData.third_party_platform_from = "other", setTimeout((function() {
                            uni.$emit("check_third_party_file")
                        }), 1500)
                    }
                }
            },
            file_handle: function(e) {
                if (e && "file:" == e.substr(0, 5)) {
                    var t = e.split("."),
                        a = t.length,
                        i = "";
                    a && (i = t[a - 1], i = i.toLowerCase(), "txt" == i || "docx" == i || "doc" == i || "xlsx" == i || "xls" == i || "ppt" == i || "pptx" == i || "pdf" == i ? (plus.runtime.arguments = "", setTimeout((function() {
                        uni.navigateTo({
                            url: "/pages/v10/index?from=third_party&path=" + e
                        })
                    }), 1e3)) : "jpg" != i && "png" != i && "jpeg" != i || (plus.runtime.arguments = "", setTimeout((function() {
                        uni.navigateTo({
                            url: "/pages/print_preview/print_preview?url=" + e + "&from=three_image"
                        })
                    }), 500)))
                }
            }
        }
    };
    t.default = j
}