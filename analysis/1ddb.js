function(e, t, a) {
    "use strict";
    var i = a("47a9");
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = void 0;
    var s = i(a("7b53")),
        n = ["MX05", "MX06", "MX08", "MX09", "MX11", "PD01", "XO POPPY", "MX13", "IM.17", "MINISO-M1", "LP212", "MINISO-M12"],
        r = ["MX08", "MX09", "MX06"],
        l = ["MX09"],
        o = ["MX08", "MX09"],
        A = ["CYLO BT PRINTER", "MXTP-100", "AZ-P2108X", "MX10", "MX11", "MX12", "PD01", "XO POPPY", "MX13", "BQ02", "EWTTO ET-Z0499", "MXW009", "GV-MA211", "KP-IM606", "BQ03", "BQ17", "IM.17", "MINISO-M1", "LP212", "MINISO-M12"],
        g = ["MX10", "MX11", "MX12", "PD01", "XO POPPY", "MX13", "AZ-P2108X", "MXW009", "MXW010", "GV-MA211", "KP-IM606", "IM.17", "MINISO-M1", "LP212", "MINISO-M12"],
        d = ["URBANWORX KIDS CAMERA", "BQ01", "BQ05", "BQ06", "BQ07", "BQ7A", "BQ7B", "BQ08", "BQ95", "BQ96", "EWTTO ET-N3689", "EWTTO ET-N3687", "MXPC-100"],
        c = ["MX11", "MX12", "PD01", "MXW-A4", "IM.17", "MINISO-M1", "LP212", "MINISO-M12"],
        u = ["XO POPPY", "XOPOPPY", "MX13"];

    function f(e) {
        u.indexOf(e) >= 0 && (e = "XOPOPPY");
        var t = uni.getStorageSync("".concat("NONGDU_CONFIG_STORAGE_KEY").concat(e));
        return e && !t && (c.indexOf(e) >= 0 && (e = "MX11"), t = s.default[e]), t
    }

    function h(e, t, a) {
        "image_model" != t && "text_model" != t && (t = "image" == t ? "image_model" : "text_model");
        var i = p(t, a),
            s = 100 * e / i;
        return s = parseInt(s), s
    }

    function p(e, t) {
        var a = f(t);
        return "image_model" != e && "text_model" != e && (e = "image" == e ? "image_model" : "text_model"), a[e]["max"]
    }
    var m = {
        get_nongde: f,
        set_nongdu: function(e, t) {
            t && (u.indexOf(e) >= 0 && (e = "XOPOPPY"), uni.setStorageSync("".concat("NONGDU_CONFIG_STORAGE_KEY").concat(e), t))
        },
        get_config_by_name: function(e) {
            return c.indexOf(e) >= 0 && (e = "MX11"), u.indexOf(e) >= 0 && (e = "XOPOPPY"), s.default[e]
        },
        is_support_config: function(e) {
            return !!(e && n.indexOf(e) >= 0)
        },
        set_nongdu_code: function(e, t, a, i) {
            t && uni.setStorageSync("print_preview_nongdu_code_prefix" + e + t + a, i)
        },
        get_nongdu_code: function(e, t, a) {
            if (t) return uni.getStorageSync("print_preview_nongdu_code_prefix" + e + t + a)
        },
        set_custom_value: function(e, t, a, i) {
            var s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "";
            t && (c.indexOf(s) >= 0 && (e = "MX11"), u.indexOf(s) >= 0 && (e = "XOPOPPY"), uni.setStorageSync("print_preview_nongdu_value_prefix" + e + t + a, i))
        },
        get_custom_value: function(e, t, a) {
            var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "";
            c.indexOf(i) >= 0 && (e = "MX11"), u.indexOf(i) >= 0 && (e = "XOPOPPY");
            var s = uni.getStorageSync("print_preview_nongdu_value_prefix" + e + t + a);
            if (!s) {
                var n = f(e),
                    r = "text" == a ? "text_model" : "image_model";
                s = n[r]["low"] + 10, s = h(s, r, e)
            }
            return s
        },
        get_kv_map: function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            c.indexOf(t) >= 0 && (e = "MX11"), u.indexOf(t) >= 0 && (e = "XOPOPPY");
            var a = f(e),
                i = {
                    text: {
                        "05": h(a["text_model"]["low"], "text_model", e),
                        "0A": h(a["text_model"]["middle"], "text_model", e),
                        "0D": h(a["text_model"]["height"], "text_model", e)
                    },
                    image: {
                        "05": h(a["image_model"]["low"], "image_model", e),
                        "0A": h(a["image_model"]["middle"], "image_model", e),
                        "0D": h(a["image_model"]["height"], "image_model", e)
                    }
                };
            return i
        },
        convert_to_percent_number: h,
        max_convert: function(e, t, a) {
            var i = f(a),
                s = (e / 200).toFixed(2),
                n = i[t]["max"];
            return parseInt(s * n)
        },
        get_max_value: p,
        get_printer_value_from_percent: function(e, t, a) {
            var i = p(t, a);
            return parseInt(e * (i / 100))
        },
        is_handle_d2_status: function(e) {
            return e = e.toUpperCase(), e = e.replace(/\s+/g, ""), r.indexOf(e) >= 0
        },
        is_handle_didian_status: function(e) {
            return l.indexOf(e) >= 0
        },
        show_font_weight: function(e) {
            return o.indexOf(e) >= 0
        },
        is_convert_to_mx06: function(e) {
            return e && (e = e.toUpperCase()), A.indexOf(e) >= 0
        },
        is_convert_to_mx10: function(e) {
            return e && (e = e.toUpperCase()), g.indexOf(e) >= 0
        },
        is_convert_mx01: function(e) {
            return e && (e = e.toUpperCase()), d.indexOf(e) >= 0
        },
        is_convert_mx11: function(e) {
            return e && (e = e.toUpperCase()), c.indexOf(e) >= 0
        },
        is_convert_xoppoy: function(e) {
            return e && (e = e.toUpperCase()), u.indexOf(e) >= 0
        }
    };
    t.default = m
}