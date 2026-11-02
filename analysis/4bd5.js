function(e, t, a) {
    "use strict";
    (function(e) {
        var i = a("47a9");
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = void 0, t.get_pd01_pirnt_is_shallow = o, t.set_pd01_pirnt_is_shallow = A;
        var s = i(a("e289")),
            n = i(a("a061")),
            r = i(a("9673")),
            l = (a("0483"), ["MX10", "AZ-P2108X", "MX11", "MX12", "PD01", "XOPOPPY", "MX13", "MXW009", "MXW010", "GV-MA211", "KP-IM606", "IM.17", "MINISO-M1", "LP212", "MINISO-M12"]);

        function o() {
            try {
                return !0 === uni.getStorageSync("PD01_PRINT_SHALLOW_FLAG")
            } catch (t) {
                e("log", t, " at models/printer/cc_nongdu_helper.js:411")
            }
            return !1
        }

        function A(e) {
            uni.setStorageSync("PD01_PRINT_SHALLOW_FLAG", e)
        }
        var g = {
            mx10_serial_nongdu: function(t, a) {
                e("log", "mx10_serial_nongdu", a, " at models/printer/cc_nongdu_helper.js:14");
                var i = a[3];
                return t < 55 ? i >= a[1] && (i = a[1] - 20) : t < 60 ? i >= a[0] && (i = a[0] - 10) : t < 65 ? i >= a[0] && (i = a[0] - 30) : t < 70 ? i >= a[0] && (i = a[0] - 55) : t < 75 && (i = 80), i
            },
            pd01_nongdu: function(e, t) {
                return function(e, t) {
                    var a = t[3];
                    e < 55 ? a >= t[1] && (a = t[1] - 10) : e < 60 ? a >= t[1] && (a = t[1] - 20) : e < 65 || e < 70 ? a >= t[0] && (a = t[0]) : a = e < 75 ? 90 : 80;
                    return a
                }(e, t)
            },
            mx10_serial_continuous_nongdu: function(e, t, a, i) {
                var n = s.default.get_printer_wendu(),
                    r = Math.min(i[1], i[3]);
                return n <= 50 ? r >= i[1] - 20 && (r = i[1] - 20, t = 1, a = 90, e = !0) : n <= 55 ? r >= i[0] - 5 && (r = i[0] - 5, t = 1, a = 85, e = !0) : n <= 60 ? r >= i[0] - 20 && (r = i[0] - 20, t = 1, a = 75, e = !0) : n <= 65 ? r >= i[0] - 50 && (r = i[0] - 50, t = 1, a = 70, e = !0) : (r = 80, t = 1, a = 70, e = !0), {
                    begin_nongdu_value: r,
                    not_need_change_nongdu_nums: t,
                    mx10_min_nongdu: a,
                    flag_update_hex_cmd: e
                }
            },
            pd01_serial_continuous_nongdu: function(e, t, a, i) {
                return !0 === o() ? function(e, t, a, i) {
                    var n = s.default.get_printer_wendu(),
                        r = Math.min(i[1], i[3]);
                    n <= 50 ? r >= i[1] && (r = i[1], t = 1, a = 90, e = !0) : n <= 55 ? r >= i[1] - 10 && (r = i[1] - 10, t = 1, a = 85, e = !0) : n <= 60 ? r >= i[0] && (r = i[0], t = 1, a = 75, e = !0) : n <= 65 ? r >= i[0] && (r = i[0], t = 1, a = 70, e = !0) : (r = 90, t = 1, a = 70, e = !0);
                    return {
                        begin_nongdu_value: r,
                        not_need_change_nongdu_nums: t,
                        mx10_min_nongdu: a,
                        flag_update_hex_cmd: e
                    }
                }(e, t, a, i) : function(e, t, a, i) {
                    var n = s.default.get_printer_wendu(),
                        r = Math.min(i[1], i[3]);
                    n <= 50 ? r >= i[1] - 10 && (r = i[1] - 10, t = 1, a = 90, e = !0) : n <= 55 ? r >= i[0] - 5 && (r = i[0] - 5, t = 1, a = 85, e = !0) : n <= 60 ? r >= i[0] - 20 && (r = i[0] - 20, t = 1, a = 75, e = !0) : n <= 65 ? r >= i[0] - 50 && (r = i[0] - 50, t = 1, a = 70, e = !0) : (r = 80, t = 1, a = 70, e = !0);
                    return {
                        begin_nongdu_value: r,
                        not_need_change_nongdu_nums: t,
                        mx10_min_nongdu: a,
                        flag_update_hex_cmd: e
                    }
                }(e, t, a, i)
            },
            get_pd01_continuous_hex: function(t, a, i, l) {
                return !0 === o() ? function(e, t, a, i) {
                    var l = a;
                    while (i > 0) {
                        l -= 5, l = l < 95 ? 95 : l;
                        var o = n.default.int2hex(l);
                        1 == o.length && (o = "0" + o);
                        var A = s.default.hexStr2Bytes("01" + o),
                            g = "5178F2000200" + r.default.crc8(A) + "FF",
                            d = g + t.substr(20);
                        e += d, i -= 1
                    }
                    return {
                        hex_cmd: e,
                        last_nongdu_value: l
                    }
                }(t, a, i, l) : function(t, a, i, l) {
                    var o = i,
                        A = 10;
                    while (l > 0) {
                        A = o > 105 || o > 90 ? 15 : 90 == o ? 10 : 5, o -= A, o = o < 55 ? 55 : o;
                        var g = n.default.int2hex(o);
                        1 == g.length && (g = "0" + g);
                        var d = s.default.hexStr2Bytes("01" + g),
                            c = "5178F2000200" + r.default.crc8(d) + "FF",
                            u = c + a.substr(20);
                        t += u, e("log", "\u6d53\u5ea6", o, i, A, " at models/printer/cc_nongdu_helper.js:316"), l -= 1
                    }
                    return {
                        hex_cmd: t,
                        last_nongdu_value: o
                    }
                }(t, a, i, l)
            },
            mx06_list: ["MX06"],
            mx10_list: l,
            get_continuous_hex: function(e, t, a, i, o, A, g) {
                var d, c = A ? 5 : 10,
                    u = 1;
                l.indexOf(e) >= 0 && (c = 15, i <= 135 && (c = 10));
                while (o > 0) {
                    d = i - c * u, A && d < 70 && (d = 70), l.indexOf(e) >= 0 && d < g && (d = g);
                    var f = n.default.int2hex(d);
                    1 == f.length && (f = "0" + f);
                    for (var h = s.default.hexStr2Bytes("01" + f), p = "5178F2000200" + r.default.crc8(h) + "FF", m = p + a.substr(20), b = 1; o - b >= 0 && b <= 1; b++) t += m;
                    o -= 1, ++u
                }
                return {
                    hex_cmd: t,
                    last_nongdu_value: d
                }
            },
            set_pd01_pirnt_is_shallow: A,
            get_pd01_pirnt_is_shallow: o
        };
        t.default = g
    }).call(this, a("f3b9")["default"])
}