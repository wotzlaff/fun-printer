function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = i(a("9673")),
            n = i(a("a061"));

        function r(e, t) {
            var a = "undefined" !== typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (!a) {
                if (Array.isArray(e) || (a = function(e, t) {
                        if (!e) return;
                        if ("string" === typeof e) return l(e, t);
                        var a = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === a && e.constructor && (a = e.constructor.name);
                        if ("Map" === a || "Set" === a) return Array.from(e);
                        if ("Arguments" === a || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)) return l(e, t)
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
                o = !1;
            return {
                s: function() {
                    a = a.call(e)
                },
                n: function() {
                    var e = a.next();
                    return r = e.done, e
                },
                e: function(e) {
                    o = !0, n = e
                },
                f: function() {
                    try {
                        r || null == a.return || a.return()
                    } finally {
                        if (o) throw n
                    }
                }
            }
        }

        function l(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var a = 0, i = new Array(t); a < t; a++) i[a] = e[a];
            return i
        }
        var o = {},
            A = "00",
            g = 0,
            d = 0,
            c = null;
        o.current_work_cmd = "", o.get_version = function() {
            p("55AAF00001010100001FFF")
        }, o.get_book_info = function() {
            o.current_work_cmd = "get_book_info", p("55AAF40001010100001FFF")
        }, o.get_flash_size = function() {
            o.current_work_cmd = "get_flash_size", p("55AAF40001010100001FFF")
        };
        var u = "";

        function f(e) {
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

        function h(e, t) {
            var a = "";
            while (e) {
                var i = 15 & e;
                a = String.fromCharCode((i > 9 ? 55 : 48) + i) + a, e >>= 4
            }
            if (t)
                while (a.length < t) a = "0" + a;
            return a
        }

        function p(e) {
            "Android" == plus.os.name ? getApp().globalData.android_ble.print_hex(e, "", "") : getApp().globalData.ios_ble.print_hex(e, "", "V5G")
        }

        function m(e) {
            uni.setStorageSync("dck_firmware_verison", e)
        }
        o.import_book_info = function(e) {
            e = e || "\u897f\u5de5\u5927\u51fa\u7248\u793e|\u8bbe\u8ba1\u6a21\u5f0f";
            for (var a = o.str_to_unicode_hex(e), i = a.length / 2, n = 0; n < 100 - i; n++) a += "00";
            var r = "55AAFB000101",
                l = h(a.length / 2);
            l.length < 4 && (l = "00" + l), l = l.substr(-2) + l.substr(0, 2), r += l, a = r + a, a = "55AAFB" + s.default.crc8(f(a.substr(6))) + "FF", t("log", "\u5bfc\u5165\u7684\u6570\u636e", a, " at models/printer/dck.js:78"), u = a, o.current_work_cmd = "importing_book_info", p("55AAF40001010100001FFF")
        }, o.import_words = function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                a = this;
            o.current_work_cmd = "importing_word", g = e.length, A = "01", getApp().globalData.dck_import_words = e, getApp().globalData.dck_import_words_index = 0, getApp().globalData.dck_import_percent = 0, getApp().globalData.app_config.get_hash(), p(1 === t ? "55AAF400010101000118FF" : "55AAF40001010100001FFF"), c = setInterval((function() {
                Date.parse(new Date) - d >= 3e3 && a.send_f5(A)
            }), 3e3)
        }, o.notify_handler = function(e) {
            var a = e.substr(4, 2);
            switch (a) {
                case "f4":
                    break;
                case "f5":
                    break;
                case "f6":
                    if (p("55AAF600010101000118FF"), "get_book_info" == o.current_work_cmd) return void p("55AAFC0001010100001FFF");
                    if ("get_flash_size" == o.current_work_cmd) return void p("55AAFA0001010100001FFF");
                    if ("importing_book_info" == o.current_work_cmd) return p(u), void(u = "");
                    getApp().globalData.dck_import_percent = Math.floor(1 / g * 100), o.send_f5();
                    break;
                case "f7":
                    d = Date.parse(new Date);
                    p("55AAF700010101000118ff");
                    e.substr(-6, 2);
                    var i = e.substr(8, 2),
                        s = e.substr(10, 2);
                    if ("00" == s && parseInt(A, 16) > parseInt(i, 16)) return;
                    if ("01" == s && parseInt(A, 16) < parseInt(i, 16)) return;
                    if ("00" == s) {
                        var l = parseInt(i, 16) + 1,
                            b = h(l, 2);
                        A = b, this.send_f5(b)
                    } else if (A = "01", getApp().globalData.dck_import_words_index++, getApp().globalData.dck_import_percent = Math.floor((getApp().globalData.dck_import_words_index + 1) / g * 100), getApp().globalData.dck_import_words_index + 1 > getApp().globalData.dck_import_words.length) {
                        p("55AAF800010101000118ff")
                    } else o.send_f5();
                    break;
                case "f8":
                    "importing_word" == o.current_work_cmd && (getApp().globalData.dck_import_words_index + 1 > getApp().globalData.dck_import_words.length && (uni.hideLoading(), uni.showToast({
                        title: "\u5168\u90e8\u4f20\u8f93\u5b8c\u6210",
                        duration: 2e3,
                        icon: "success"
                    })), A = "00", clearInterval(c), uni.$emit("words_import_complete", {
                        complete: !0
                    }), t("log", "\u5168\u90e8\u4f20\u8f93\u5b8c\u6210", " at models/printer/dck.js:216"));
                    break;
                case "fc":
                    var y = e.substr(16, 200);
                    t("log", "\u51fa\u7248\u793e\u7b49\u4fe1\u606f", function(e) {
                        e = e.replace(/(.{2})/g, "$1,"), e = e.substr(0, e.length - 1), e = e.split(",");
                        var t, a = "",
                            i = r(e);
                        try {
                            for (i.s(); !(t = i.n()).done;) {
                                var s = t.value;
                                s = s.substr(-2) + s.substr(0, 2), a += String.fromCharCode(o.hex_to_int(s))
                            }
                        } catch (n) {
                            i.e(n)
                        } finally {
                            i.f()
                        }
                        return a = a.replace(/\u0000/g, ""), a.trim()
                    }(y), " at models/printer/dck.js:221"), p("55AAF800010101000118ff");
                    break;
                case "fa":
                    uni.$emit("dck_get_flash_size", function(e) {
                        var t = f(e),
                            a = 256 * t[3] * 256 * 256 + 256 * t[2] * 256 + 256 * t[1] + t[0];
                        return a
                    }(e.substr(16, 8)));
                    break;
                case "f0":
                    var k = n.default.hex_to_str(e.substr(-16, 12));
                    m(k);
                    break
            }
        }, o.send_f5 = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "01";
            if (!(getApp().globalData.dck_import_words_index + 1 > getApp().globalData.dck_import_words.length)) {
                var t = getApp().globalData.dck_import_words[getApp().globalData.dck_import_words_index],
                    a = "";
                if ("01" == e) {
                    var i = t["word"].replace(/[\n]/g, "\r\n\r\n"),
                        n = t["ph"] ? "[" + t["ph"] + "]".replace(/[\n]/g, "\r\n\r\n") : "",
                        r = t["mean"];
                    if (t["sentence"].length) {
                        var l = t["sentence"];
                        l = JSON.parse(l), l.length && (r += "\r\n" + l[0]["ex"] + "\r\n" + l[0]["tr"])
                    }
                    r = r.replace(/[\n]/g, "\r\n\r\n").replace(/[\uff0c]/g, ",").replace(/[\uff1b]/g, ";").replace(/[\uff08]/g, "(").replace(/[\uff09]/g, ")"), a = r ? "55AAF5000100" : "55AAF5000101";
                    var A = o.str_to_unicode_hex(r);
                    getApp().globalData.dck_import_words[getApp().globalData.dck_import_words_index]["example_hex"] = A;
                    var g = h(o.str_to_unicode_hex(i + n).length / 2 + 8, 4);
                    g = g.substr(-2) + g.substr(0, 2), a += g;
                    var d = h(o.str_to_unicode_hex(i).length / 2, 2);
                    a += d;
                    var c = h(o.str_to_unicode_hex(n).length / 2, 2);
                    a += c;
                    var u = h(A.length / 2, 4);
                    u = u.substr(-2) + u.substr(0, 2), a += u;
                    var m = h(t.tts_hex.length / 2, 8);
                    m = m.substr(-2) + m.substr(-4, 2) + m.substr(-6, 2) + m.substr(0, 2), a += m, a += o.str_to_unicode_hex(i) + o.str_to_unicode_hex(n);
                    var b = f(a.substr(6));
                    a = "55AAF5" + s.default.crc8(b) + "FF", getApp().globalData.dck_import_words[getApp().globalData.dck_import_words_index]["other_hex"] = A + t.tts_hex
                } else {
                    var y = 960;
                    "iOS" == plus.os.name && (y = 300), getApp().globalData.user_config.get_config().dck_send_length > 0 && (y = getApp().globalData.user_config.get_config().dck_send_length);
                    var k = Math.ceil(t.other_hex.length / y),
                        z = parseInt(e, 16);
                    a = z - 1 >= k ? "55AAF500" + e + "01" : "55AAF500" + e + "00";
                    var w = t.other_hex.substr((z - 2) * y, y),
                        j = h(w.length / 2, 4);
                    j = j.substr(-2) + j.substr(0, 2), a += j, a += w;
                    var x = f(a.substr(6));
                    a = "55AAF5" + s.default.crc8(x) + "FF"
                }
                p(a)
            }
        }, o.str_to_unicode_hex = function(e) {
            if (!e) return "";
            for (var t = "", a = 0; a < e.length; a++) {
                for (var i = e.charCodeAt(a).toString(16), s = 0; s < 4 - i.length; s++) i = "0" + i;
                4 == i.length ? t += i.substr(-2) + i.substr(0, 2) : t += i.substr(-2) + "00"
            }
            return t
        }, o.cancel_update = function() {
            p("55AAF800010101000118ff")
        }, o.hex_to_int = function(e) {
            for (var t, a = e.length, i = new Array(a), s = 0; s < a; s++) t = e.charCodeAt(s), 48 <= t && t < 58 ? t -= 48 : t = (223 & t) - 65 + 10, i[s] = t;
            return i.reduce((function(e, t) {
                return e = 16 * e + t, e
            }), 0)
        }, o.clear_last_version = function() {
            m("")
        }, o.get_last_version = function() {
            var e = "1.0.0";
            try {
                e = uni.getStorageSync("dck_firmware_verison")
            } catch (t) {}
            return e
        }, o.compare_version = function(e, t) {
            e = "".concat(e).trim(), t = "".concat(t).trim();
            var a = "".concat(e).split(".").length,
                i = "".concat(t).split(".").length,
                s = Math.max(a, i);
            if (s > a)
                for (var n = 0; n < s - a; n++) e = "".concat(e).concat(".0");
            if (s > i)
                for (n = 0; n < s - i; n++) t = "".concat(t).concat(".0");

            function r(e) {
                for (var t = e.toString().split("."), a = ["", "0", "00", "000", "0000"].reverse(), i = 0; i < t.length; i++) {
                    var s = t[i].length;
                    t[i] = a[s] + t[i]
                }
                return t.join("")
            }
            return function(e, t) {
                var a = r(e),
                    i = r(t);
                return a > i ? 1 : a < i ? -1 : 0
            }(e, t)
        }, o.compute_total_byte_size = function(e) {
            var t, a = 0,
                i = r(e);
            try {
                for (i.s(); !(t = i.n()).done;) {
                    var s = t.value,
                        n = s["word"].replace(/[\n]/g, "\r\n\r\n"),
                        l = s["ph"] ? "[" + s["ph"] + "]".replace(/[\n]/g, "\r\n\r\n") : "",
                        A = s["mean"];
                    if (s["sentence"].length) {
                        var g = s["sentence"];
                        g = JSON.parse(g), g.length && (A += "\r\n" + g[0]["ex"] + "\r\n" + g[0]["tr"])
                    }
                    A = A.replace(/[\n]/g, "\r\n\r\n").replace(/[\uff0c]/g, ",").replace(/[\uff1b]/g, ";").replace(/[\uff08]/g, "(").replace(/[\uff09]/g, ")");
                    var d = o.str_to_unicode_hex(n).length / 2,
                        c = o.str_to_unicode_hex(l).length / 2,
                        u = o.str_to_unicode_hex(A).length / 2,
                        f = s.tts_hex.length / 2;
                    a += d + c + u + f
                }
            } catch (h) {
                i.e(h)
            } finally {
                i.f()
            }
            return a
        }, e.exports = o
    }).call(this, a("f3b9")["default"])
}