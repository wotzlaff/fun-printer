function(e, t, a) {
    "use strict";
    (function(e) {
        var i = a("47a9");
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = void 0;
        var s = i(a("e289")),
            n = i(a("a061")),
            r = i(a("1ddb")),
            l = i(a("291c")),
            o = a("d5ca"),
            A = a("59e8"),
            g = i(a("9673")),
            d = a("c2e7"),
            c = "",
            u = 0;

        function f(e, t) {
            if (e && e.length >= 6) {
                var a = "",
                    i = "",
                    s = !1,
                    n = "zhengchang",
                    r = e.substr(10, 2),
                    l = e.substr(12, 2);
                "1" == h(r).substr(6, 1) ? (a = getApp().globalData.$t("message").grtx, i = getApp().globalData.$t("message").qwtrlxxxzldyb, n = "guore", s = !0) : "11" == h(l).substr(4, 2) && (a = getApp().globalData.$t("message").zywl, i = getApp().globalData.$t("message").qzywlqxzzzldy, n = "quezhi", s = !0);
                var o = getCurrentPages(),
                    A = o[o.length - 1].$getAppWebview();
                "pages/print_preview/print_webview_preview" == A.__uniapp_route ? uni.$emit("print_status_alter", n) : s && m(a, i)
            }
        }

        function h(e) {
            var t = parseInt(e, 16),
                a = t.toString(2);
            while (a.length < 8) a = "0" + a;
            return a
        }

        function p(t, a) {
            if (!(a && ["MX01", "URBANWORX KIDS CAMERA", "BQ01"].indexOf(a["ble_name"]) >= 0) || "5178f00101000000ff" != t && "5178f00101000107ff" != t)
                if ((getApp().globalData.v5g_label.get_find_status() || "5178f00101000107ff" == t || "5178f10101000107ff" == t || "5178f30101000107ff" == t) && getApp().globalData.v5g_label.notify(t), a && a.hasOwnProperty("ble_name") && "MXW009" == a.ble_name && "5178b901010000ff" == t) uni.$emit("mxw009_receive_label_print_notify", {
                    receive: t
                });
                else if ("a3" == t.substr(4, 2)) {
                var i = t.substr(12, 2),
                    o = "",
                    A = "",
                    c = !1,
                    u = "";
                switch (i) {
                    case "00":
                        u = "zhengchang", uni.$emit("print_status_alter", u), uni.$emit("bq95_is_stop_in_app_page"), s.default.set_didian_status(!1);
                        break;
                    case "01":
                    case "09":
                        o = getApp().globalData.$t("message").zywl, A = getApp().globalData.$t("message").qzywlqxzzzldy, u = "quezhi", c = !0;
                        break;
                    case "04":
                    case "d2":
                    case "D2":
                        o = getApp().globalData.$t("message").grtx, A = getApp().globalData.$t("message").qwtrlxxxzldyb, u = "guore", c = !0;
                        break;
                    case "08":
                        o = getApp().globalData.$t("message").dlbzl, A = getApp().globalData.$t("message").xzkmdlgwcxd, u = "didian", c = !0, s.default.set_didian_status(!0);
                        break
                }
                if (c) {
                    var f = getCurrentPages(),
                        h = f[f.length - 1].$getAppWebview();
                    "pages/print_preview/print_webview_preview" == h.__uniapp_route || "pages/print_preview/print_tattoo_preview" == h.__uniapp_route ? uni.$emit("print_status_alter", u) : m(o, A)
                }
            } else if ("d3" == t.substr(4, 2)) {
                var p = t.match(/.{1,2}/g),
                    b = p[6];
                if ("ff" == b || "fe" == b) return void e("log", "\u672c\u5730\u6e29\u5ea6\u83b7\u53d6\u51fa\u9519", " at models/printer/notify_handler.js:166");
                s.default.set_printer_wendu(parseInt(b, 16), null === a || void 0 === a ? void 0 : a.ble_name)
            } else if (t.substr(0, 6) && "5178D2" == t.substr(0, 6).toUpperCase()) {
                var y = s.default.get_deivce("V5G");
                y && r.default.is_handle_d2_status(y.ble_name) && (s.default.set_d2_status(!0), s.default.update_d2_info("nums"))
            } else if ("1b047636" == t.substr(0, 8)) {
                var k = t.length;
                24 == k ? k = 12 : 36 == k && (k = 18);
                var z = function(e) {
                    for (var t, a = e.trim(), i = "0x" === a.substr(0, 2).toLowerCase() ? a.substr(2) : a, s = i.length, n = [], r = 0; r < s; r += 2) t = parseInt(i.substr(r, 2), 16), n.push(String.fromCharCode(t));
                    return n.join("")
                }(t.substr(4, k - 8)).toUpperCase();
                uni.$emit("update_printer_info", z)
            } else if ("a8" == t.substr(4, 2)) {
                var w = t.substr(18, t.length - 18 - 6);
                w = n.default.hex_to_str(w);
                var j = w.split("."),
                    x = 0;
                3 == j.length && (x = parseInt(1e3 * j[0]) + parseInt(100 * j[1]) + parseInt(j[2])), x >= 1011 && ("ios" == uni.getSystemInfoSync().osName ? l.default.update_printer_info_attr("support_label", 1) : a["support_label"] = 1)
            } else if ("d1" == t.substr(4, 2)) getApp().globalData.v5g_d1_cmd_status = "5178d10101000107ff" == t ? "1" : "0";
            else if ("5178bb0106" == t.substr(0, 10)) s.default.ble_auth(a["ble_name"], a["ble_address"], t, a["model"]);
            else if ("a4" == t.substr(4, 2)) "5178a40101000107ff" == t && uni.$emit("bq05_print_complete__notify");
            else if ("d6" == t.substr(4, 2)) {
                var C = (0, d.get_print_sign)(t.substr(12, 20));
                if (C) {
                    var v = s.default.hexStr2Bytes(C),
                        q = "5178D6002000" + g.default.crc8(v) + "FF";
                    s.default.print_cmd(q, "V5G")
                }
            } else "a7" == t.substr(4, 2) && uni.$emit("bq95_is_stop_in_app_page")
        }

        function m(e, t) {
            uni.hideLoading(), uni.hideToast(), uni.showModal({
                title: e,
                content: t,
                showCancel: !1,
                success: function() {}
            })
        }
        var b = {
            notify_callback: function(e, t) {
                var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
                if (!["printer_with_screen", "ai_camera"].includes(n.default.get_working_app()) || "2221b7" != e.substr(0, 6) && !c) "5178" == e.substr(0, 4) ? p(e, t) : "2221" == e.substr(0, 4) ? (0, o.v5x_notify_handler)(e, t) : "55aa" == e.substr(0, 4) ? getApp().globalData.dck.notify_handler(e) : "6572723a" == e.substr(0, 8) ? f(e, t, a) : "5688" == e.substr(0, 4) && (0, A.v5c_notify_handler)(e, t);
                else try {
                    c || (u = 2 * parseInt(e.slice(10, 12) + e.slice(8, 10), 16)), c += e, c.length >= u && (uni.$emit("get_device_wifi_list", c.slice(12, -4)), c = "", u = 0)
                } catch (i) {
                    uni.$emit("get_device_wifi_list", ""), c = "", u = 0
                }
            }
        };
        t.default = b
    }).call(this, a("f3b9")["default"])
}