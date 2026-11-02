function(e, t, a) {
    "use strict";
    (function(e, i, s) {
        var n = a("47a9");
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = void 0;
        var r, l = n(a("127e")),
            o = n(a("ee10")),
            A = n(a("7ca3")),
            g = n(a("cc92")),
            d = n(a("11c6")),
            c = n(a("6660")),
            u = n(a("291c")),
            f = n(a("e289")),
            h = n(a("59cb")),
            p = n(a("8ed4")),
            m = ["C21", "D1", "D2", "E2", "NEWSMY"],
            b = ["MXW-A4"],
            y = ["YTB01"],
            k = ["58P7_", "15P1_", "58D3_", "A47", "A55", "15P3_", "A42", "A55Pro", "A41"];
        var z = (r = {
            zh: "zh",
            "zh-Hans": "zh",
            "zh-Hans-CN": "zh",
            "zh-Hans-HK": "zh",
            "zh-Hans-MO": "zh",
            "zh-Hans-SG": "zh",
            "zh-Hans-US": "zh",
            "zh-Hant": "cht",
            "zh-Hant-HK": "cht",
            "zh-Hant-MO": "cht",
            "zh-Hant-TW": "cht",
            "zh-CN": "zh",
            "zh-HK": "zh",
            "zh-MO": "zh",
            "zh-SG": "zh"
        }, (0, A.default)(r, "zh-Hant", "cht"), (0, A.default)(r, "zh-HK", "cht"), (0, A.default)(r, "zh-MO", "cht"), (0, A.default)(r, "zh-TW", "cht"), (0, A.default)(r, "en", "en"), (0, A.default)(r, "ko", "kor"), (0, A.default)(r, "fr", "fra"), (0, A.default)(r, "es", "spa"), (0, A.default)(r, "th", "tha"), (0, A.default)(r, "ar", "ara"), (0, A.default)(r, "ru", "ru"), (0, A.default)(r, "de", "de"), (0, A.default)(r, "it", "it"), (0, A.default)(r, "pt", "pt"), (0, A.default)(r, "vi", "vie"), (0, A.default)(r, "el", "el"), (0, A.default)(r, "ja", "jp"), (0, A.default)(r, "pl", "pl"), (0, A.default)(r, "tr", "tk"), (0, A.default)(r, "nl", "nl"), (0, A.default)(r, "cs", "cs"), (0, A.default)(r, "he", "il"), (0, A.default)(r, "iw", "il"), (0, A.default)(r, "uk", "uk"), (0, A.default)(r, "uk-UA", "uk"), (0, A.default)(r, "af", "af"), (0, A.default)(r, "am", "am"), (0, A.default)(r, "as", "as"), (0, A.default)(r, "az", "az"), (0, A.default)(r, "bg", "bg"), (0, A.default)(r, "bn", "bn"), (0, A.default)(r, "bs", "bs"), (0, A.default)(r, "ca", "ca"), (0, A.default)(r, "cy", "cy"), (0, A.default)(r, "da", "da"), (0, A.default)(r, "et", "et"), (0, A.default)(r, "eu", "eu"), (0, A.default)(r, "fa", "fa"), (0, A.default)(r, "fi", "fi"), (0, A.default)(r, "ga", "ga"), (0, A.default)(r, "gl", "gl"), (0, A.default)(r, "gu", "gu"), (0, A.default)(r, "hi", "hi"), (0, A.default)(r, "hr", "hr"), (0, A.default)(r, "hu", "hu"), (0, A.default)(r, "hy", "hy"), (0, A.default)(r, "id", "id"), (0, A.default)(r, "is", "is"), (0, A.default)(r, "iu_cans", "iu_cans"), (0, A.default)(r, "iu_latn", "iu_latn"), (0, A.default)(r, "jv", "jv"), (0, A.default)(r, "ka", "ka"), (0, A.default)(r, "kk", "kk"), (0, A.default)(r, "km", "km"), (0, A.default)(r, "kn", "kn"), (0, A.default)(r, "lo", "lo"), (0, A.default)(r, "lt", "lt"), (0, A.default)(r, "lv", "lv"), (0, A.default)(r, "mk", "mk"), (0, A.default)(r, "ml", "ml"), (0, A.default)(r, "mn", "mn"), (0, A.default)(r, "mr", "mr"), (0, A.default)(r, "ms", "ms"), (0, A.default)(r, "mt", "mt"), (0, A.default)(r, "my", "my"), (0, A.default)(r, "ne", "ne"), (0, A.default)(r, "no", "no"), (0, A.default)(r, "or", "or"), (0, A.default)(r, "pa", "pa"), (0, A.default)(r, "ps", "ps"), (0, A.default)(r, "ro", "ro"), (0, A.default)(r, "si", "si"), (0, A.default)(r, "sk", "sk"), (0, A.default)(r, "sl", "sl"), (0, A.default)(r, "so", "so"), (0, A.default)(r, "sq", "sq"), (0, A.default)(r, "sr_cyrl", "sr_cyrl"), (0, A.default)(r, "sr_latn", "sr_latn"), (0, A.default)(r, "su", "su"), (0, A.default)(r, "sv", "sv"), (0, A.default)(r, "sw", "sw"), (0, A.default)(r, "ta", "ta"), (0, A.default)(r, "te", "te"), (0, A.default)(r, "tl", "tl"), (0, A.default)(r, "ur", "ur"), (0, A.default)(r, "uz", "uz"), (0, A.default)(r, "zu", "zu"), r);

        function w(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            if (!t) {
                var a = uni.getStorageSync("setting_locale");
                if (a && "follow" != a) return a
            }
            var i = "en",
                s = uni.getSystemInfoSync();
            if (["Fun Print", "FriendAI", "iBleem"].includes(uni.getSystemInfoSync().appName)) {
                try {
                    if (s.hasOwnProperty("osLanguage") && s.osLanguage) {
                        var n = s.osLanguage,
                            r = n.split("-");
                        i = "zh" == r[0] ? n : r[0]
                    }
                } catch (l) {
                    i = "en"
                }
                return z.hasOwnProperty(i) && z[i] ? z[i] : "en"
            }
            return "zh"
        }

        function j() {
            uni.setTabBarStyle({
                backgroundColor: getApp().globalData.$th("index").tabbar_bgc,
                borderStyle: getApp().globalData.$th("index").tabbar_border_color,
                color: getApp().globalData.$th("index").tabbar_font_color,
                selectedColor: "#2aa3f0",
                complete: function(e) {}
            })
        }

        function x(e) {
            var t = {};
            void 0 != e && void 0 != e[0] && "" != e[0] && (e = e[0], t.latitude = e.latitude, t.longitude = e.longitude, t.province = e.regeocodeData.addressComponent.province, t.city = e.regeocodeData.addressComponent.city, t.district = e.regeocodeData.addressComponent.district, t.town_ship = e.regeocodeData.addressComponent.township, t.near = e.desc, t.street = e.regeocodeData.addressComponent.streetNumber.street + e.regeocodeData.addressComponent.streetNumber.number);
            var a = uni.getSystemInfoSync();
            t.brand = a.brand, t.model = a.model, t.width = a.screenWidth, t.height = a.screenHeight, t.os_version = a.system, t.client_id = d.default.get_ytb_client_id(), t.uuid = d.default.get_ytb_uuid(), t.app_version = d.default.YTB_VERSION, c.default.post("/location/index", t)
        }

        function C(e, t, a, i, s) {
            for (var n = [], r = 0; r < e.length; r++) {
                var l = {
                    name: "image_" + r,
                    uri: e[r]
                };
                n.push(l)
            }
            var o = void 0 == s ? d.default.get_ytb_api_url() : s;
            uni.uploadFile({
                url: o + "File/upload",
                files: n,
                formData: {
                    user_id: t.user_id,
                    from: a,
                    token: t.token
                },
                success: function(e) {
                    i && i(e.data)
                },
                fail: function(e) {
                    uni.hideToast()
                }
            })
        }

        function v(e) {
            plus.key.hideSoftKeybord(), uni.navigateTo({
                url: e
            })
        }

        function q() {
            return q = (0, o.default)(l.default.mark((function t() {
                var a, i, s = arguments;
                return l.default.wrap((function(t) {
                    while (1) switch (t.prev = t.next) {
                        case 0:
                            return a = s.length > 0 && void 0 !== s[0] && s[0], uni.hideLoading(), t.next = 4, f.default.is_connected(!1);
                        case 4:
                            if (i = t.sent, !i) {
                                t.next = 8;
                                break
                            }
                            return uni.showModal({
                                title: getApp().globalData.app_name,
                                content: getApp().globalData.$t("message").sbylj,
                                showCancel: !1,
                                success: function(e) {}
                            }), t.abrupt("return", !1);
                        case 8:
                            a ? a.scan((function(e) {
                                var t = e.split(":");
                                t[1] = t[1].replace(/-/g, ":"), "BTID" == t[0] ? ("Android" == plus.os.name && getApp().globalData.v5_printer.connect({
                                    ble_name: "P100S",
                                    ble_address: t[1]
                                }), "iOS" == plus.os.name && getApp().globalData.v5_printer.connect({
                                    ble_name: "P100S",
                                    ble_address: t[1]
                                }, (function(e) {
                                    e && getApp().globalData.v5_printer.v5_callback({
                                        type: 1,
                                        ble_name: "P100S",
                                        ble_address: t[1]
                                    })
                                })), uni.hideLoading()) : uni.showToast({
                                    title: getApp().globalData.$t("message").smdbsbzewmqsyqtfslj,
                                    duration: 3e3
                                })
                            })) : uni.scanCode({
                                success: function(t) {
                                    e("log", "\u6761\u7801\u7c7b\u578b\uff1a" + t.scanType, " at common/ytb.js:1137"), e("log", "\u6761\u7801\u5185\u5bb9\uff1a" + t.result, " at common/ytb.js:1138")
                                }
                            });
                        case 9:
                        case "end":
                            return t.stop()
                    }
                }), t)
            }))), q.apply(this, arguments)
        }
        var B = {
            follow: "follow",
            zh: "zh",
            cht: "zh-rHK",
            en: "en",
            kor: "ko",
            fra: "fr",
            spa: "es",
            tha: "th",
            ara: "ar",
            ru: "ru",
            de: "de",
            it: "it",
            pt: "pt",
            vie: "vi",
            el: "el",
            jp: "ja",
            pl: "pl",
            tk: "tr",
            nl: "nl",
            cs: "cs",
            il: "iw",
            uk: "uk",
            ro: "ro",
            af: "af",
            am: "am",
            as: "as",
            az: "az",
            bg: "bg",
            bn: "bn",
            bs: "bs",
            ca: "ca",
            cy: "cy",
            da: "da",
            et: "et",
            eu: "eu",
            fa: "fa",
            fi: "fi",
            ga: "ga",
            gl: "gl",
            gu: "gu",
            hi: "hi",
            hr: "hr",
            hu: "hu",
            hy: "hy",
            id: "in",
            is: "is",
            iu_cans: "iu-rCA",
            iu_latn: "iu-rUS",
            jv: "jv",
            ka: "ka",
            kk: "kk",
            km: "km",
            kn: "kn",
            lo: "lo",
            lt: "lt",
            lv: "lv",
            mk: "mk",
            ml: "ml",
            mn: "mn",
            mr: "mr",
            ms: "ms",
            mt: "mt",
            my: "my",
            ne: "ne",
            no: "no",
            or: "or",
            pa: "pa",
            ps: "ps",
            si: "si",
            sk: "sk",
            sl: "sl",
            so: "so",
            sq: "sq",
            sr_cyrl: "sr-rRS",
            sr_latn: "sr",
            su: "su",
            sv: "sv",
            sw: "sw",
            ta: "ta",
            te: "te",
            tl: "tl",
            ur: "ur",
            uz: "uz",
            zu: "zu"
        };

        function I() {
            var e = "../index/mxw_index";
            return "\u5370\u9898\u5b9d" == getApp().globalData.app_name && (e = "../index/ytb_index"), "\u55b5\u5b66\u738b" == getApp().globalData.app_name && (e = "../index/mxw_index"), "iBleem" == getApp().globalData.app_name && (e = "../index/iBleem_index"), "funprint" == getApp().globalData.app_name && (e = "../index/funprint_index"), "\u72b6\u5143\u9886\u8dd1" == getApp().globalData.app_name && (e = "../index/zylp_index"), "FriendAI" == getApp().globalData.app_name && (e = "/pages/friend_ai/index?tab=index"), e
        }

        function Q() {
            return Q = (0, o.default)(l.default.mark((function e(t) {
                return l.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            return t.substr(0, 4), "ios" == uni.getSystemInfoSync().platform ? "file://" == t.substr(0, 7) && (t = t.substr(7)) : "http" != t.substr(0, 4) && "file" != t.substr(0, 4) && (t = "file://" + t), e.abrupt("return", t);
                        case 3:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), Q.apply(this, arguments)
        }

        function E() {
            return E = (0, o.default)(l.default.mark((function e(t) {
                var a, i, s, n, r, o, A, g = arguments;
                return l.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (a = g.length > 1 && void 0 !== g[1] ? g[1] : 1024, i = !(g.length > 2 && void 0 !== g[2]) || g[2], "http" != t.substr(0, 4)) {
                                e.next = 4;
                                break
                            }
                            return e.abrupt("return", t);
                        case 4:
                            return e.next = 6, p.default.get_image_info(t);
                        case 6:
                            if (s = e.sent, !(s.width > a || s.height > a)) {
                                e.next = 19;
                                break
                            }
                            if (n = 0, s.width > s.height ? n = a : (r = s.height / a, n = parseInt(s.width / r)), e.prev = 10, !i) {
                                e.next = 15;
                                break
                            }
                            return e.next = 14, p.default.compress_with_promise(t, n);
                        case 14:
                            t = e.sent;
                        case 15:
                            e.next = 19;
                            break;
                        case 17:
                            e.prev = 17, e.t0 = e["catch"](10);
                        case 19:
                            return o = u.default.detail(), A = [], A.push({
                                name: "image_0",
                                uri: t
                            }), e.abrupt("return", new Promise((function(e) {
                                uni.uploadFile({
                                    url: "".concat(getApp().globalData.ytb_config.ytb_url, "app/File/upload"),
                                    files: A,
                                    formData: {
                                        user_id: o.user_id,
                                        from: "image",
                                        token: o.token
                                    },
                                    success: function(t) {
                                        var a = JSON.parse(t.data);
                                        a = a.data, a = a[0], e(getApp().globalData.ytb_config.ytb_url + a.path)
                                    },
                                    fail: function(e) {
                                        uni.hideToast()
                                    }
                                })
                            })));
                        case 23:
                        case "end":
                            return e.stop()
                    }
                }), e, null, [
                    [10, 17]
                ])
            }))), E.apply(this, arguments)
        }

        function D() {
            return D = (0, o.default)(l.default.mark((function e(t, a, i, s, n) {
                var r, o, A, g, d;
                return l.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (r = {
                                    success: function(e) {
                                        s && s(e)
                                    },
                                    fail: function(e) {
                                        n && n(e)
                                    }
                                }, t && (r.count = t), a && (r.sizeType = a), i && (r.sourceType = i), !["FriendAI", "funprint"].includes(getApp().globalData.app_name) || !F() || "ios" == uni.getSystemInfoSync().platform) {
                                e.next = 10;
                                break
                            }
                            return r.mediaType = ["image"], r.success = function(e) {
                                var t = e.tempFiles.map((function(e) {
                                    return e.tempFilePath
                                }));
                                s && s({
                                    tempFilePaths: t
                                })
                            }, r.fail = function(e) {
                                n && n(e)
                            }, uni.chooseMedia(r), e.abrupt("return");
                        case 10:
                            if ("android" !== uni.getSystemInfoSync().platform) {
                                e.next = 33;
                                break
                            }
                            if (o = !0, A = !0, ["\u5370\u9898\u5b9d", "iBleem"].includes(getApp().globalData.app_name) && 1 == i.length && (i.includes("camera") ? A = !1 : o = !1), !A) {
                                e.next = 23;
                                break
                            }
                            return e.next = 18, P();
                        case 18:
                            if (g = e.sent, g) {
                                e.next = 22;
                                break
                            }
                            return n && n(), e.abrupt("return");
                        case 22:
                        case 23:
                            if (!o) {
                                e.next = 32;
                                break
                            }
                            return e.next = 27, M();
                        case 27:
                            if (d = e.sent, d) {
                                e.next = 31;
                                break
                            }
                            return n && n(), e.abrupt("return");
                        case 31:
                        case 32:
                        case 33:
                            uni.chooseImage(r);
                        case 35:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), D.apply(this, arguments)
        }

        function F() {
            return "ios" == uni.getSystemInfoSync().platform || uni.getSystemInfoSync().osAndroidAPILevel >= 33
        }

        function P() {
            return S.apply(this, arguments)
        }

        function S() {
            return S = (0, o.default)(l.default.mark((function t() {
                var a, i, s, n, r;
                return l.default.wrap((function(t) {
                    while (1) switch (t.prev = t.next) {
                        case 0:
                            if ("ios" != uni.getSystemInfoSync().platform) {
                                t.next = 2;
                                break
                            }
                            return t.abrupt("return", !0);
                        case 2:
                            if (a = 1, i = "", !F()) {
                                t.next = 20;
                                break
                            }
                            return s = ["android.permission.READ_MEDIA_IMAGES", "android.permission.READ_MEDIA_VIDEO"], n = ["\u5370\u9898\u5b9d", "iBleem"].includes(getApp().globalData.app_name) ? s : [].concat(s, ["android.permission.READ_MEDIA_AUDIO"]), t.next = 9, h.default.requestAndroidPermission_33(n, !0);
                        case 9:
                            a = t.sent, r = uni.getStorageSync("LAST_DENY_PERMISSIONS"), t.t0 = r, t.next = "android.permission.READ_MEDIA_VIDEO" === t.t0 || "android.permission.READ_MEDIA_IMAGES" === t.t0 ? 14 : "android.permission.READ_MEDIA_AUDIO" === t.t0 ? 16 : 18;
                            break;
                        case 14:
                            return i = getApp().globalData.$t("message").zpyspqxbjjqdk, t.abrupt("break", 18);
                        case 16:
                            return i = getApp().globalData.$t("message").ypqxbjjqdk, t.abrupt("break", 18);
                        case 18:
                            t.next = 24;
                            break;
                        case 20:
                            return t.next = 22, h.default.requestAndroidPermission("android.permission.WRITE_EXTERNAL_STORAGE");
                        case 22:
                            a = t.sent, i = getApp().globalData.$t("message").cckdxqxybjjqxkq;
                        case 24:
                            if (e("log", a, " at common/ytb.js:1601"), -1 != a || !i) {
                                t.next = 30;
                                break
                            }
                            return uni.showModal({
                                title: uni.getSystemInfoSync().appName,
                                content: i,
                                cancelText: getApp().globalData.$t("message").qx,
                                confirmText: getApp().globalData.$t("message").qsz,
                                success: function(t) {
                                    if (t.confirm) {
                                        var a = plus.android.importClass("android.content.Intent"),
                                            i = plus.android.importClass("android.provider.Settings"),
                                            s = plus.android.importClass("android.net.Uri"),
                                            n = plus.android.runtimeMainActivity(),
                                            r = new a;
                                        r.setAction(i.ACTION_APPLICATION_DETAILS_SETTINGS), e("log", n.getPackageName(), " at common/ytb.js:1616");
                                        var l = s.fromParts("package", n.getPackageName(), null);
                                        r.setData(l), n.startActivity(r)
                                    }
                                }
                            }), t.abrupt("return", !1);
                        case 30:
                            if (0 != a) {
                                t.next = 32;
                                break
                            }
                            return t.abrupt("return", !1);
                        case 32:
                            return t.abrupt("return", !0);
                        case 33:
                        case "end":
                            return t.stop()
                    }
                }), t)
            }))), S.apply(this, arguments)
        }

        function M() {
            return U.apply(this, arguments)
        }

        function U() {
            return U = (0, o.default)(l.default.mark((function e() {
                var t;
                return l.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if ("ios" != uni.getSystemInfoSync().platform) {
                                e.next = 2;
                                break
                            }
                            return e.abrupt("return", !0);
                        case 2:
                            return e.next = 4, h.default.requestAndroidPermission("android.permission.CAMERA");
                        case 4:
                            if (t = e.sent, -1 != t) {
                                e.next = 10;
                                break
                            }
                            return uni.showModal({
                                title: uni.getSystemInfoSync().appName,
                                content: getApp().globalData.$t("message")["xzhqxjbjlkddkb!"],
                                cancelText: getApp().globalData.$t("message").qx,
                                confirmText: getApp().globalData.$t("message").qsz,
                                success: function(e) {
                                    if (e.confirm) {
                                        var t = plus.android.importClass("android.content.Intent"),
                                            a = plus.android.importClass("android.provider.Settings"),
                                            i = plus.android.importClass("android.net.Uri"),
                                            s = plus.android.runtimeMainActivity(),
                                            n = new t;
                                        n.setAction(a.ACTION_APPLICATION_DETAILS_SETTINGS);
                                        var r = i.fromParts("package", s.getPackageName(), null);
                                        n.setData(r), s.startActivity(n)
                                    }
                                }
                            }), e.abrupt("return", !1);
                        case 10:
                            if (0 != t) {
                                e.next = 12;
                                break
                            }
                            return e.abrupt("return", !1);
                        case 12:
                            return e.abrupt("return", !0);
                        case 13:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), U.apply(this, arguments)
        }

        function Y() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                t = "";
            try {
                t = uni.getStorageSync("CURRENT_WORK_APP")
            } catch (a) {}
            return "logining" == e ? t || "" : "FriendAI" == getApp().globalData.app_name || "funprint" == getApp().globalData.app_name ? t : t || getApp().globalData.app_name
        }

        function N() {
            var e = new Date;
            e.setHours(0, 0, 0, 0);
            var t = e.getTime();
            return t.toString()
        }
        var G = ["BQ02", "BQ03", "BQ17"];

        function T() {
            return T = (0, o.default)(l.default.mark((function e() {
                var t;
                return l.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            return t = uni.getStorageSync("last_connected_printer"), e.abrupt("return", G.includes(null === t || void 0 === t ? void 0 : t.ble_name));
                        case 2:
                        case "end":
                            return e.stop()
                    }
                }), e)
            }))), T.apply(this, arguments)
        }
        var O = 0;
        var X = {
            is_allow_push: function() {
                "Android" == plus.os.name ? function() {
                    try {
                        var t = plus.android.runtimeMainActivity(),
                            a = t.getPackageName(),
                            i = plus.android.importClass("android.support.v4.app.NotificationManagerCompat"),
                            s = "";
                        if (!i) return;
                        s = i.from(t), s.areNotificationsEnabled() || uni.showModal({
                            title: getApp().globalData.app_name,
                            content: getApp().globalData.$t("message").qxdkapptzqx,
                            showCancel: !1,
                            success: function(e) {
                                if (e.confirm) {
                                    var i = plus.android.importClass("android.content.Intent"),
                                        s = new i("android.settings.APP_NOTIFICATION_SETTINGS");
                                    s.putExtra("android.provider.extra.APP_PACKAGE", a), t.startActivity(s)
                                }
                            }
                        })
                    } catch (n) {
                        e("log", "android_allow_push catch:" + n.message, " at common/ytb.js:503")
                    }
                }() : function() {
                    var e = plus.ios.import("UIApplication"),
                        t = e.sharedApplication(),
                        a = 0;
                    if (t.currentUserNotificationSettings) {
                        var i = t.currentUserNotificationSettings();
                        a = i.plusGetAttribute("types")
                    } else a = t.enabledRemoteNotificationTypes();
                    0 == a && uni.showModal({
                        content: getApp().globalData.$t("message").ztzlzkqxxts
                    });
                    plus.ios.deleteObject(t)
                }()
            },
            get_location: function(t) {
                var a = plus.navigator.checkPermission("LOCATION"),
                    i = function() {
                        var e = new g.default.AMapWX({
                            key: d.default.get_ytb_wx_map_key()
                        });
                        e.getRegeo({
                            success: function(e) {
                                x(e), t && t(e)
                            }
                        })
                    };
                switch (a) {
                    case "authorized":
                        i();
                        break;
                    default:
                        plus.geolocation.getCurrentPosition((function(e) {
                            i()
                        }), (function(t) {
                            e("log", JSON.stringify(t), " at common/ytb.js:557")
                        }));
                        break
                }
            },
            upload_file: C,
            ocr: function(e, t, a) {
                e[0].indexOf("http") > -1 ? c.default.post("ocr/ocr", {
                    src: e[0],
                    is_new: 1
                }, a) : C(e, t, "ocr", (function(e) {
                    var t = JSON.parse(e);
                    if (0 == t.errno) {
                        var i = t.data[0];
                        c.default.post("ocr/ocr", {
                            src: i.path,
                            is_new: 1
                        }, a)
                    }
                }))
            },
            to: v,
            toast: function(e, t, a, i, s) {
                e = e || "none", a = a || 1500, i = i || !1, s = s || !1;
                var n = {};
                n.icon = e || "none", t && (n.title = t), a && (n.duration = a), i && (n.mask = i), s && (n.position = s), uni.showToast(n)
            },
            to_print_preview: function(e, t) {
                t = t || "unknow";
                var a = "/pages/print_preview/print_preview?url=" + e + "&from=" + t;
                uni.navigateTo({
                    url: a
                })
            },
            to_webview_preview: function(e, t) {
                var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
                    i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
                    s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "";
                t = t || "unknow";
                var n = "/pages/print_preview/print_webview_preview?id=" + e + "&from=" + t;
                n += "&menu_from=" + (a || t), s && (n += "&params=".concat(s)), uni.navigateTo({
                    url: n,
                    complete: function() {
                        i && i()
                    }
                })
            },
            upload_phone_info: x,
            format_time: function(e) {
                e *= 1e3;
                var t = new Date(e),
                    a = new Date,
                    i = a.getDate(),
                    s = a.getMonth() + 1,
                    n = t.getMonth() + 1,
                    r = t.getDate(),
                    l = t.getHours() < 10 ? "0" + t.getHours() + ":" : t.getHours() + ":",
                    o = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
                return n + r == s + i ? (n = "", r = "") : (n += "\u6708", r += "\u65e5 ", l = "", o = ""), n + r + l + o
            },
            set_badge: function(e) {
                getApp().globalData.badge = e, plus.runtime.setBadgeNumber(e), uni.$emit("update_badge")
            },
            ringing: function() {
                var e = uni.createInnerAudioContext();
                e.src = "/static/bell/DuangDuangDuang.wav", e.play()
            },
            to_print_bridge: function(e, t) {
                t = t || "unknow";
                var a = "";
                a = "\u55b5\u5b66\u738b" != getApp().globalData.app_name && "\u72b6\u5143\u9886\u8dd1" != getApp().globalData.app_name || "search" != t ? "/pages/print_preview/print_bridge?url=" + e + "&from=" + t : "/pages/print_preview/print_bridge_mxw?url=" + e + "&from=" + t, uni.navigateTo({
                    url: a
                })
            },
            run_back: function() {
                try {
                    var t = "android" == plus.os.name.toLocaleLowerCase() ? "android" : "ios";
                    if ("android" == t) {
                        var a = plus.android.runtimeMainActivity();
                        a.moveTaskToBack(!1)
                    }
                } catch (i) {
                    e("log", "run_back catch:" + i.message, " at common/ytb.js:803")
                }
            },
            hex_to_str: function(e) {
                for (var t, a = e.trim(), i = "0x" === a.substr(0, 2).toLowerCase() ? a.substr(2) : a, s = i.length, n = [], r = 0; r < s; r += 2) t = parseInt(i.substr(r, 2), 16), n.push(String.fromCharCode(t));
                return n.join("")
            },
            upload_media: function(e, t, a, i, s) {
                uni.uploadFile({
                    url: d.default.get_ytb_api_url() + "file/media_upload",
                    filePath: e,
                    formData: {
                        user_id: t.user_id,
                        from: a,
                        type: i,
                        token: t.token
                    },
                    name: "media",
                    success: function(e) {
                        s && s(e.data)
                    },
                    fail: function(e) {
                        uni.hideToast()
                    }
                })
            },
            download_file: function(e) {
                return new Promise((function(t, a) {
                    uni.downloadFile({
                        url: e,
                        success: function(e) {
                            200 === e.statusCode && t(e.tempFilePath)
                        }
                    })
                }))
            },
            save_file: function(t) {
                return new Promise((function(a, i) {
                    uni.saveFile({
                        tempFilePath: t,
                        success: function(t) {
                            e("log", "save:" + t.savedFilePath, " at common/ytb.js:454"), a(t.savedFilePath)
                        }
                    })
                }))
            },
            format_clipboard: function() {
                uni.getClipboardData({
                    success: function(e) {
                        if (e.data) {
                            var t = e.data.replace(/\n(\n)*( )*(\n)*\n/g, "\n");
                            "\n" == t.substring(0, 1) && (t = t.substring(1)), uni.setClipboardData({
                                data: t,
                                success: function(e) {
                                    uni.hideToast()
                                }
                            })
                        }
                    }
                })
            },
            change_navbar_mode: function(t) {
                setTimeout((function() {
                    var a = getApp().globalData._theme.locale,
                        i = getCurrentPages(),
                        s = i[i.length - 1],
                        n = s.$getAppWebview(),
                        r = n.getStyle().titleNView;
                    "dark" == a ? (void 0 != r && (void 0 != r.buttons && (r.buttons[0].color = "#FFFFFF"), void 0 != r.searchInput && (e("log", r.searchInput, " at common/ytb.js:369"), r.searchInput.backgroundColor = "#333333", r.searchInput.color = "#FFFFFF", r.searchInput.placeholderColor = "#FFFFFF", r.searchInput.placeholder = getApp().globalData.$t("message").poetry.placeholder), n && n.setStyle({
                        titleNView: r
                    })), uni.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: "#000000"
                    })) : "light" == a && ("[object Object]" === Object.prototype.toString.call(t) && t.hasOwnProperty("txt_color") && t.hasOwnProperty("bg_color") ? (void 0 != r && (void 0 != r.buttons && (r.buttons[0].color = t.txt_color), n && n.setStyle({
                        titleNView: r
                    })), uni.setNavigationBarColor({
                        frontColor: t.txt_color,
                        backgroundColor: t.bg_color
                    })) : uni.setNavigationBarColor({
                        frontColor: "#000000",
                        backgroundColor: "#F8F8F8"
                    }))
                }), 200)
            },
            change_tabbar_mode: j,
            change_tabbar_langauge: function(e) {
                var t = getApp().globalData.app_name,
                    a = uni.getStorageSync("is_full_edition"),
                    i = [];
                if ("\u55b5\u5b66\u738b" == t || "\u5370\u9898\u5b9d" == t ? i = [{
                        index: 0,
                        text: e.xx
                    }, {
                        index: 1,
                        text: e.dy
                    }, {
                        index: 2,
                        text: e.sc_381
                    }, {
                        index: 3,
                        text: e.wd
                    }] : "funprint" == t ? i = [{
                        index: 0,
                        text: e.sy_554
                    }, {
                        index: 1,
                        text: a ? "AI" : e.mb,
                        pagePath: a ? "/pages/tabbar_ai/ai" : "/pages/lable_app_v2/components/index"
                    }, {
                        index: 2,
                        text: e.sc_381
                    }, {
                        index: 3,
                        text: e.wd
                    }] : "iBleem" == t && (i = [{
                        index: 0,
                        text: e.sy_554
                    }, {
                        index: 1,
                        text: a ? "AI" : e.bq,
                        pagePath: a ? "/pages/tabbar_ai/ibleem" : "/pages/lable_app_v2/components/index"
                    }, {
                        index: 2,
                        text: e.sc_381
                    }, {
                        index: 3,
                        text: e.wd
                    }]), i)
                    for (var s = 0; s < i.length; s++) uni.setTabBarItem(i[s])
            },
            change_mode: function(e) {
                getApp().globalData._theme.locale = e, j(), u.default.set_dark_mode_status(e)
            },
            get_printer_model: function(e, t) {
                var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
                if (!e) return null;
                if (e = e.toUpperCase(), e = e.replace(/\s+/g, ""), "\u5370\u9898\u5b9d" == getApp().globalData.app_name && ("JXPRINTER" == e.substr(0, 9) || "PRINTER-" == e.substr(0, 8))) return "V10";
                if ("FriendAI" == getApp().globalData.app_name) return getApp().globalData.get_ble_lists.V5X_S_LIST.includes(e) ? "V5X_S" : null;
                if ("FYT2" == e.substr(0, 4)) return "X5";
                var i = e.split("#");
                if (2 == i.length && 18 == e.length) return "V8SPRO";
                if ("YINTIBAO-V8SPRO" == e || "YINTIBAO-V8S" == e) {
                    var s = e.split("-");
                    return s[1]
                }
                if ("P4" == e.substr(0, 2) || "BAYPAGE" == e.substr(0, 7) || "BAYPAGE_P4_203DPI" == e) return "V8SJP";
                if ("JX400R06P" == e.substr(0, 9)) return "V8PRO";
                if ("JX400R" == e.substr(0, 6)) return "V8";
                if ("YINTIBAO" == e || "PAPERGO" == e) return t.substr(0, 2), "V6";
                if (d.default.TWO_INCH_203_BLE_NAME.indexOf(e) > -1) return "V5";
                if (d.default.TWO_INCH_304_BLE_NAME.indexOf(e) > -1) return "V5PRO";
                if (d.default.NEW_TWO_INCH_203_BLE_NAME.indexOf(e) > -1) return "V5N";
                if (d.default.NEW_TWO_INCH_304_BLE_NAME.indexOf(e) > -1) return "V5NPRO";
                if (d.default.THREE_INCH_203_BLE_NAME.indexOf(e) > -1) return "V7";
                if (d.default.THREE_INCH_304_BLE_NAME.indexOf(e) > -1) return "V7PRO";
                if ("YHK" == e.substr(0, 3) && getApp().globalData.app_name, getApp().globalData.get_ble_lists.V5G_LIST.indexOf(e) >= 0) return "" == a || 20 != a.length && 14 != a.length || "59" != a.substr(-2) ? "V5G" : "V5X_S";
                if (getApp().globalData.get_ble_lists.V5X_LIST.indexOf(e) >= 0) return "V5X";
                if (getApp().globalData.get_ble_lists.V5X_S_LIST.indexOf(e) >= 0) return "JK01" == e ? "\u5370\u9898\u5b9d" == getApp().globalData.app_name || "iBleem" == getApp().globalData.app_name ? "V5X_S" : null : "V5X_S";
                if ("AEQ918N4" == e || "AEQ918N4-LE" == e) return "V5";
                if (m.indexOf(e) >= 0) return "DCK";
                if (b.indexOf(e) >= 0) return "V10G";
                if ("\u5370\u9898\u5b9d" == getApp().globalData.app_name || "iBleem" == getApp().globalData.app_name) {
                    if (y.indexOf(e) >= 0) return "V5C";
                    if (k.some((function(t) {
                            return e.startsWith(t)
                        }))) return "P7"
                }
                return null
            },
            is_ios_checkdate: function() {
                var e = new Date("2021/12/27 12:59:59").getTime(),
                    t = (new Date).getTime();
                return e - t > 0
            },
            modal_connect_printer: function(e) {
                var t = uni.getStorageSync("last_connected_printer"),
                    a = getApp().globalData.$t("message").fh,
                    i = getApp().globalData.$t("message").dyjkjrhljndsbo;
                t && void 0 != t["ble_address"] && void 0 != t["ble_name"] && "V5G" == t["model"] && (a = getApp().globalData.$t("message").qx), "AI" == e && (a = getApp().globalData.$t("message").qx, i = getApp().globalData.$t("message").ljsbhcksyggno), uni.showModal({
                    title: getApp().globalData.app_name,
                    content: i,
                    showCancel: !0,
                    cancelText: getApp().globalData.$t("message").ljsb,
                    confirmText: a,
                    success: function(e) {
                        if (e.confirm) a == getApp().globalData.$t("message").fh && uni.navigateBack({});
                        else {
                            var t = "/pages/bluetooth/ios";
                            "funprint" == getApp().globalData.app_name ? t = "/pages/index/friendAI_entry" : "Android" == plus.os.name && (t = getApp().globalData.use_android_ble ? "/pages/bluetooth/android_ble" : "/pages/bluetooth/bluetooth"), v(t)
                        }
                    }
                })
            },
            get_font_info: function() {
                var e = uni.getStorageSync("ytb_font_family"),
                    t = e["font_family_url"];
                return {
                    font_family: e,
                    font_family_url: t
                }
            },
            to_wx_mini_program: function() {
                plus.share.getServices((function(e) {
                    for (var t = null, a = 0; a < e.length; a++) {
                        var i = e[a];
                        "weixin" == i.id && (t = i)
                    }
                    t && t.launchMiniProgram({
                        id: "gh_65e0a4d7d205",
                        path: "pages/product/product?spreadUrl=&wareId=10024822139564&apk=0&sjgd=1&sl=2",
                        type: 0
                    })
                }), (function(t) {
                    e("log", JSON.stringify(t), " at common/ytb.js:1045")
                }))
            },
            set_navigationbar_badgeText: function(e, t) {
                var a = getCurrentPages(),
                    i = a[a.length - 1],
                    s = i.$getAppWebview();
                "number" == typeof t && (t = t.toString()), s.setTitleNViewButtonBadge({
                    index: e,
                    text: t
                })
            },
            remove_navigationbar_badgeText: function(e) {
                var t = getCurrentPages(),
                    a = t[t.length - 1],
                    i = a.$getAppWebview();
                i.removeTitleNViewButtonBadge({
                    index: e
                })
            },
            scan_qrcode: function() {
                return q.apply(this, arguments)
            },
            load_font: function() {
                var e = uni.getStorageSync("ytb_font_family"),
                    t = e["font_family_url"];
                e["font_family"] && uni.loadFontFace({
                    family: "html_print_font",
                    source: 'url("'.concat(t, '")')
                })
            },
            get_lang_type: function(e) {
                var t = e.locale ? e.locale : "en";
                return t = t.split("-"), t[0]
            },
            get_agreement: function(e) {
                var t = "";
                if ("\u5370\u9898\u5b9d" == getApp().globalData.app_name && (t = "service" == e ? "https://cn.yintb.com/protocol/ytb/service.html" : "https://cn.yintb.com/protocol/ytb/policy.html"), "\u55b5\u5b66\u738b" == getApp().globalData.app_name && (t = "service" == e ? "https://cn.yintb.com/protocol/mxw/service.html" : "https://cn.yintb.com/protocol/mxw/policy.html"), "iBleem" == getApp().globalData.app_name && (t = d.default.is_zh_app_store() ? "service" == e ? "https://cn.yintb.com/protocol/ibleem/service_cn.html" : "https://cn.yintb.com/protocol/ibleem/policy_cn.html" : "service" == e ? "https://cn.yintb.com/protocol/ibleem/service.html" : "https://cn.yintb.com/protocol/ibleem/policy.html"), "funprint" == getApp().globalData.app_name && (t = d.default.is_zh_app_store() ? "service" == e ? "https://g.yintb.com/protocol/funprint/service_cn.html" : "https://g.yintb.com/protocol/funprint/policy_cn.html" : "service" == e ? "https://g.yintb.com/funprint/service.html" : "https://g.yintb.com/funprint/policy.html"), "FriendAI" == getApp().globalData.app_name)
                    if (d.default.is_zh_app_store()) t = "service" == e ? "https://g.yintb.com/friendai/service_cn.html" : "https://g.yintb.com/friendai/policy_cn.html";
                    else {
                        var a = w(getApp().globalData.app_name);
                        t = "service" == e ? "https://g.yintb.com/friendai/service_".concat(B[a], ".html") : "https://g.yintb.com/friendai/policy_".concat(B[a], ".html")
                    } return t
            },
            get_logo: function() {
                var e = "";
                return "\u5370\u9898\u5b9d" == getApp().globalData.app_name && (e = "../../static/logo.png"), "\u55b5\u5b66\u738b" == getApp().globalData.app_name && (e = "../../static/mxw_logo.png"), "iBleem" == getApp().globalData.app_name && (e = "../../static/ibleem/logo.png"), "funprint" == getApp().globalData.app_name && (e = "../../static/funprint_logo.png"), "\u72b6\u5143\u9886\u8dd1" == getApp().globalData.app_name && (e = "../../static/zylp_logo.png"), "FriendAI" == getApp().globalData.app_name && (e = "../../static/FriendAI_logo.png"), e
            },
            get_webview_image_url: function(e) {
                return Q.apply(this, arguments)
            },
            upload_image: function(e) {
                return E.apply(this, arguments)
            },
            get_lang_locale: w,
            is_zh_language: function() {
                var e = plus.os.language;
                return "zh" == e.substr(0, 2)
            },
            get_locale_full_name: function(e) {
                return {
                    ara: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
                    cht: "\u4e2d\u6587\uff08\u7e41\u9ad4\uff09",
                    de: "Deutsch",
                    en: "English",
                    el: "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",
                    fra: "French",
                    it: "Italiano",
                    jp: "\u65e5\u672c\u8a9e",
                    kor: "\ud55c\uad6d\uc5b4",
                    pt: "Portugu\xeas",
                    ru: "\u0440\u0443\u0441\u0441\u043a\u0438\u0439",
                    spa: "Espa\xf1ol",
                    tha: "\u0e44\u0e17\u0e22",
                    vie: "Ti\u1ebfng Vi\u1ec7t",
                    zh: "\u4e2d\u6587\uff08\u7b80\u4f53\uff09",
                    pl: "Polski",
                    tk: "T\xfcrk\xe7e",
                    nl: "Nederlands",
                    cs: "\u010de\u0161tina",
                    il: "\u05e2\u05d1\u05e8\u05d9\u05ea",
                    uk: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430"
                } [e]
            },
            get_function_index: function() {
                var e = "/pages/function/mxw_index";
                return "\u5370\u9898\u5b9d" == getApp().globalData.app_name && (e = "/pages/function/ytb_index"), "\u55b5\u5b66\u738b" == getApp().globalData.app_name && (e = "/pages/function/mxw_index"), e
            },
            get_index: I,
            int2hex: function(e, t) {
                var a = "";
                while (e) a = "0123456789abcdef".charAt(e % 16) + a, e = Math.floor(e / 16);
                if ("undefined" === typeof t || t <= a.length) return a;
                var i = t - a.length,
                    s = "";
                while (i-- > 0) s += "0";
                return s + a
            },
            down_image: function(t) {
                return new Promise((function(a) {
                    uni.downloadFile({
                        url: t,
                        success: function(e) {
                            if (200 === e.statusCode) {
                                var i = plus.io.convertLocalFileSystemURL(e.tempFilePath);
                                a(i)
                            } else a(t)
                        },
                        fail: function(t) {
                            e("log", t, " at common/ytb.js:1486"), a(-1)
                        }
                    })
                }))
            },
            request_storge_permission: P,
            is_horizontal_screen: function() {
                return uni.getSystemInfoSync().windowWidth > uni.getSystemInfoSync().windowHeight
            },
            set_working_app: function(e) {
                try {
                    uni.setStorageSync("CURRENT_WORK_APP", e)
                } catch (t) {}
            },
            get_working_app: Y,
            get_logged_index: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                    t = Y(e);
                return t ? "dck" == t ? "/pages/word_card/index?tab=ciku" : "lable" == t ? "/pages/lable_app/index_v2?tab=lable" : "ccd" == t ? "/pages/ccd/index" : "FriendAI" == t || ["printer_with_screen", "ai_camera"].includes(t) ? "/pages/friend_ai/index?tab=index" : ["simple_b3_ble"].includes(t) ? "/pages/simple_b3_pages/tab_index" : I() : "\u5370\u9898\u5b9d" == getApp().globalData.app_name || "iBleem" == getApp().globalData.app_name ? I() : "FriendAI" == getApp().globalData.app_name || "funprint" == getApp().globalData.app_name ? "/pages/index/friendAI_entry?is_entry=true" : "/pages/login/device?login=login"
            },
            get_image_info: function(e) {
                return new Promise((function(t) {
                    uni.getImageInfo({
                        src: e,
                        success: function(e) {
                            t(e)
                        },
                        fail: function(e) {
                            t(e)
                        }
                    })
                }))
            },
            file_is_exist: function(e) {
                return new Promise((function(t) {
                    uni.getFileInfo({
                        filePath: e,
                        success: function(e) {
                            "getFileInfo:ok" == e.errMsg ? t(!0) : t(!1)
                        },
                        fail: function(e) {
                            t(!1)
                        }
                    })
                }))
            },
            choose_image: function(e, t, a, i, s) {
                return D.apply(this, arguments)
            },
            get_show_times: function() {
                var e = 0;
                try {
                    e = uni.getStorageSync(N())
                } catch (error) {}
                return e || 0
            },
            increment_show_times: function() {
                var e = 0,
                    t = N();
                try {
                    e = uni.getStorageSync(t), e ? e++ : e = 1
                } catch (error) {}
                uni.setStorageSync(t, e)
            },
            get_today_nums_key: N,
            get_change_wifi: function() {
                return "funprint" != getApp().globalData.app_name || new Promise((function(e, t) {
                    i({
                        success: function(t) {
                            s({
                                success: function(t) {
                                    var a = t.wifi.SSID.slice(0, 4);
                                    "cam_" != a ? e(!1) : (uni.setStorageSync("ccd_wifi_ssid", t.wifi.SSID), e(!0))
                                }
                            })
                        }
                    })
                }))
            },
            set_change_tabbar: function(e, t) {
                uni.setTabBarItem({
                    index: 1,
                    pagePath: e,
                    text: t
                })
            },
            judge_full_edition: function(e) {
                return !!["PD01", "IM.17", "MXW-W5", "MINISO-M1", "MINISO-M12", "INSTAPRINT", "PD03"].includes(e.ble_name)
            },
            is_interval_paper_printer: function() {
                return T.apply(this, arguments)
            },
            is_show_ai_print: function() {
                if (["funprint", "\u55b5\u5b66\u738b"].includes(getApp().globalData.app_name)) return !0
            },
            handle_click: function() {
                var t = Date.now();
                return t - O < 1e3 ? (e("log", "\u91cd\u590d", " at common/ytb.js:1877"), !1) : (O = t, !0)
            },
            api_level_is_greater_33: F,
            is_online: function(e, t) {
                var a = getApp().globalData.$t("message"),
                    i = e;
                return "printer_with_screen" == Y() && (getApp().globalData.sn_code ? (uni.showToast({
                    icon: "loading",
                    title: a.jzz,
                    mask: !0,
                    duration: 15e3
                }), getApp().globalData.socket.send_message({
                    action: "app_get_device_status",
                    parameter: t
                })) : plus.nativeUI.confirm(a.nhmypwcgdjqqpwcghzlsyb + "\n1," + a.rndsbywcwlljqxzbdsnm + "\n2," + a.rndsbzcyewmymqxzpw, (function(e) {
                    var a = e.index;
                    0 == a ? uni.$emit("distribution_network") : 1 == a && i.$refs.manual_input_sn.open(t)
                }), a.ts, [a.xsbbd, a.bdsnm, a.qx]), !0)
            }
        };
        t.default = X
    }).call(this, a("f3b9")["default"], a("96e8")["startWifi"], a("96e8")["getConnectedWifi"])
}