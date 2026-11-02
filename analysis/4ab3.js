function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = i(a("9673")),
            n = i(a("e289")),
            r = {},
            l = null,
            o = {
                status: !1,
                distance: 0,
                learn_distance: 50,
                dianya: []
            };
        r.learn = function() {
            r.find(0)
        }, r.print = function() {
            if (getApp().globalData.v5g_label_print_printer_nums) {
                getApp().globalData.v5g_label_print_printer_nums--;
                var e = getApp().globalData.v5g_label_print_hex;
                getApp().globalData.v5g_label_print_printer_nums != getApp().globalData.v5g_label_print_printer_nums_total - 1 && (e = "5178a10002000900BDff" + e);
                var t = getApp().globalData.v5g_label_print_ble_name,
                    a = getApp().globalData.v5g_label_print_lable_page_height,
                    i = 2500;
                30 == a && (i = 4500), t && "MX05" != t && ("ios" == uni.getSystemInfoSync().osName ? (i = 3300, 30 == a && (i = 6200), t && ["BQ03", "BQ02", "BQ17"].includes(t) && (i = 2500, 30 == a && (i = 5e3))) : (i = 3200, 30 == a && (i = 6100), t && ["BQ03", "BQ02", "BQ17"].includes(t) && (i = 2500, 30 == a && (i = 5e3)))), ["BQ03", "BQ02", "BQ17", "MXW010"].includes(t) || 15 == a && (i = 3800), "Android" == plus.os.name ? getApp().globalData.android_ble.print_hex(e, getApp().globalData.v5g_label_print_model, (function(e) {
                    "MXW010" != getApp().globalData.v5g_label_print_ble_name && setTimeout((function() {
                        getApp().globalData.v5g_label.gujian_dingwei()
                    }), i)
                }), 1, [], !0) : getApp().globalData.ios_ble.print_hex(e, (function(e) {
                    setTimeout((function() {
                        getApp().globalData.v5g_label.gujian_dingwei()
                    }), i)
                }), "V5G", 1, [], !0)
            } else {
                var s = n.default.get_deivce("V5G");
                if (n.default.print_log(), s && s.hasOwnProperty("ble_name") && "BQ02" == s.ble_name) return;
                r.print_hex("5178a10002000900BDff")
            }
        }, r.notify = function(e) {
            if (22 == e.length) {
                var t = parseInt(e.substr(14, 4), 16);
                r.find(t)
            } else "5178ae0101000000ff" == e ? (o["status"] = !1, uni.hideLoading(), uni.showToast({
                title: getApp().globalData.$t("message").ywc,
                icon: "success",
                duration: 2e3
            }), r.gujian_dingwei()) : "5178f00101000107ff" == e || "5178f10101000107ff" == e ? (uni.hideLoading(), r.print()) : "5178f30101000107ff" == e && (uni.hideLoading(), l && (clearTimeout(l), l = null), r.bq_print())
        }, r.gujian_dingwei = function() {
            var e = uni.getStorageSync("v5g_label_avg_dianya_hex");
            e || (e = "0199");
            var t = e + "20",
                a = function(e) {
                    var t = 0,
                        a = e.length;
                    a % 2 != 0 && (e = "0" + e);
                    a /= 2;
                    for (var i = new Array, s = 0; s < a; s++) {
                        var n = e.substr(t, 2),
                            r = parseInt(n, 16);
                        i.push(r), t += 2
                    }
                    return i
                }(t),
                i = "5178F0000300" + s.default.crc8(a) + "FF";
            r.print_hex(i)
        }, r.print_hex = function(e) {
            "Android" == plus.os.name ? getApp().globalData.android_ble.print_hex(e, "V5G") : getApp().globalData.ios_ble.print_hex(e, "", "V5G")
        }, r.get_find_status = function() {
            return o["status"]
        }, r.find = function(e) {
            0 == e ? (o["status"] = !0, o["distance"] = 0, o["dianya"] = []) : o["dianya"].push(e), o["distance"]++;
            if (o["dianya"].length >= 4) {
                for (var a, i = o["dianya"].slice(-4), s = 0, l = 0; l < 4; l++) s += i[l];
                a = parseInt(s / 4);
                for (var A, g = 0, d = 0; d < 4; d++) g += Math.pow(a - i[d], 2);
                A = Math.sqrt(g / 4);
                if (A >= 60) {
                    var c = function(e, t) {
                        var a = "";
                        while (e) a = "0123456789abcdef".charAt(e % 16) + a, e = Math.floor(e / 16);
                        if ("undefined" === typeof t || t <= a.length) return a;
                        var i = t - a.length,
                            s = "";
                        while (i-- > 0) s += "0";
                        return s + a
                    }(a, 4);
                    return void uni.setStorageSync("v5g_label_avg_dianya_hex", c)
                }
            }
            if (o["learn_distance"] <= o["distance"]) t("log", "\u8d70\u5b8c\u6700\u5927\u8ddd\u79bb\uff0c\u672a\u627e\u5230", " at models/printer/v5g_label.js:205");
            else {
                var u = n.default.get_deivce("V5G"),
                    f = 50;
                u && u.hasOwnProperty("ble_name") && ["BQ03", "BQ02", "BQ17"].includes(u.ble_name) && (f = 30),
                    function(e) {
                        var t = new Date,
                            a = t.getTime() + e;
                        while (1)
                            if (t = new Date, t.getTime() > a) return
                    }(f);
                r.print_hex("5178a1000200040054ff5178a30001000000ff")
            }
        }, r.bq_learn = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
                t = "5178f30001000000ff";
            2 == e && (t = "5178f40001000000ff"), getApp().globalData.v5g_label_print_printer_nums = void 0, getApp().globalData.print_img_src = void 0, n.default.print_cmd(t, "V5G")
        }, r.bq_print = function() {
            if (getApp().globalData.v5g_label_print_printer_nums) {
                getApp().globalData.v5g_label_print_printer_nums--, getApp().globalData.v5g_label_print_printer_nums > 0 && (l = setTimeout((function(e) {
                    t("log", "BQ02 \u6ca1\u6709\u6536\u5230\u5b9a\u4f4d\u6210\u529f\u6307\u4ee4, \u5f00\u59cb\u6253\u5370\u4e0b\u4e00\u4efd", " at models/printer/v5g_label.js:303"), r.bq_print()
                }), 2e4));
                var e = getApp().globalData.v5g_label_print_hex;
                n.default.ble_print_hex(e, "V5G", (function(e) {}), 1, [], !0)
            } else {
                getApp().globalData.print_percent = 100;
                var a = uni.getStorageSync("last_connected_printer");
                a && ["BH03", "PD03", "BHSZY"].includes(null === a || void 0 === a ? void 0 : a.ble_name) || n.default.print_log()
            }
        }, r.bq02_packages_callback = function(e) {
            if (e.totalPackages > 1) {
                var t = e.writeLenght;
                "ios" == uni.getSystemInfoSync().platform && (t = 2 * parseInt(t)), getApp().globalData.bq02_lable_sended_length += t;
                var a = Math.ceil(getApp().globalData.bq02_lable_sended_length / getApp().globalData.bq02_lable_total_length * 100);
                getApp().globalData.print_percent = a > 99 ? 99 : a
            }
        }, r.mxw010_bq_learn = function() {
            n.default.print_cmd("5178D20101000000FF", "V5G")
        }, r.mxw010_paper_type_set = function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                t = e ? "5178D00101000107FF" : "5178D00101000000FF";
            n.default.print_cmd(t, "V5G")
        }, r.mxw010_label_end_cmd = function() {
            return "5178D10101000000FF"
        }, e.exports = r
    }).call(this, a("f3b9")["default"])
}