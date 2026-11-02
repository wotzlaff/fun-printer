function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = i(a("a061")),
            n = (i(a("291c")), i(a("e289"))),
            r = uni.requireNativePlugin("Vsonprinter"),
            l = {},
            o = "",
            A = !1;

        function g(e, a) {
            var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
            "ios" == uni.getSystemInfoSync().platform && e.length > 12 && (e = e.substr(1)), o = i, t("log", "vson \u5f00\u59cb\u8fde\u63a5\u6253\u5370\u673a:", e, o, " at models/printer/vson.js:162"), r.connectPrinter({
                ble_address: e.trim().toString()
            }, (function(e) {
                t("log", "vson_printer connect", e, " at models/printer/vson.js:166"), 0 == e.code && 1 == e.flag && a && a(!0)
            }))
        }
        l.init = function(e) {
            A ? e && e() : (A = !0, "ios" == uni.getSystemInfoSync().platform ? r.uniInit({}, (function(a) {
                t("log", "vson ios:", a, " at models/printer/vson.js:17"), 0 == a.code ? 1 == a.flag ? l.vson_callback(a) : 0 == a.flag && 0 == a.type && e && e() : t("log", "ble_init \u5931\u8d25\u4e86", " at models/printer/vson.js:25")
            })) : r.init({}, (function(a) {
                0 == a.code ? 1 == a.status && 0 == a.type && 0 == a.flag ? e && e() : 1 == a.flag && l.vson_callback(a) : t("log", "ble_init \u5931\u8d25\u4e86", " at models/printer/vson.js:37")
            })))
        }, l.vson_callback = function(e) {
            var a = e.type;
            switch (a = parseInt(a), a) {
                case 4:
                    if ("ios" == uni.getSystemInfoSync().platform)
                        for (var i = e.device, r = 0; r < i.length; r++) {
                            var A = i[r].ble_name,
                                g = i[r].ble_address,
                                d = A.split("#");
                            if (2 == d.length && 18 == A.length && A && g) {
                                var c = {
                                    ble_name: A,
                                    ble_address: g,
                                    ble_type: "V8SSSP"
                                };
                                uni.$emit("vson_search_callback", c)
                            }
                        } else {
                            var u = e.ble_name,
                                f = u.split("#");
                            if (2 == f.length && 18 == u.length) {
                                var h = {
                                    ble_name: e.ble_name,
                                    ble_address: e.ble_address,
                                    ble_type: "V8SSSP"
                                };
                                t("log", "vson_callback 4", h, " at models/printer/vson.js:81"), uni.$emit("vson_search_callback", h)
                            }
                        }
                    break;
                case 10:
                    t("log", "vson", "\u94fe\u63a5\u6210\u529f", " at models/printer/vson.js:87"),
                        function(e) {
                            l.get_printer_resolution((function(t) {
                                1280 == t.dpi_px ? e.ble_name = "Yintibao-V8SPRO" : e.ble_name = "Yintibao-V8S", uni.$emit("connect_complete", {
                                    ble_address: e.ble_address,
                                    ble_name: e.ble_name,
                                    model: "V8SPRO",
                                    research_uuid: o
                                })
                            }))
                        }(e);
                    break;
                case 9:
                    n.default.disconnect({
                        model: "V8S"
                    });
                    break;
                case 1:
                    "android" == uni.getSystemInfoSync().platform && uni.$emit("vson_scan_status_change", {
                        status: 1
                    });
                    break;
                case 3:
                    "android" == uni.getSystemInfoSync().platform && uni.$emit("vson_scan_status_change", {
                        status: 2
                    });
                    break;
                case 13:
                    uni.hideLoading(), uni.hideToast(), uni.$emit("v8s_print_complete"), s.default.toast("success", "\u6253\u5370\u5b8c\u6210", 2e3);
                    break;
                default:
                    t("log", "\u72b6\u6001\u53d1\u751f\u53d8\u5316\u4e86:", e, " at models/printer/vson.js:111");
                    break
            }
        }, l.get_printer_resolution = function(e) {
            r.getPrinterResolution({}, (function(t) {
                if (0 == t.code) {
                    var a = t.resolution;
                    e && e({
                        dpi_px: a
                    })
                }
            }))
        }, l.connect = function(e, t) {
            A ? g(e, t, "") : l.init((function() {
                setTimeout((function() {
                    g(e, t, "")
                }), 600)
            }))
        }, l.print_image = function(e, a) {
            t("log", "vson \u8981\u6253\u5370\u7684\u56fe\u7247:", e, " at models/printer/vson.js:174"), r.printImageFromPath({
                image_path: e
            }, (function(e) {}))
        }, l.search = function() {
            r.searchBlePrinter({}, (function(e) {
                t("log", "search_ble_printer \u8c03\u7528\u7ed3\u679c\uff1a", e, " at models/printer/vson.js:184"), 0 == e.code || t("log", "search_ble_printer \u5931\u8d25\u4e86", " at models/printer/vson.js:188")
            }))
        }, l.is_connected = function() {
            return new Promise((function(e) {
                r.queryConnectStatus({}, (function(a) {
                    t("log", "queryConnectStatus", a, " at models/printer/vson.js:196"), 0 == a.code && 1 == a.status ? e(!0) : e(!1)
                }))
            }))
        }, e.exports = l
    }).call(this, a("f3b9")["default"])
}