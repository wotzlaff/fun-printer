function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = i(a("127e")),
            n = i(a("ee10")),
            r = i(a("a061")),
            l = (i(a("291c")), i(a("e289"))),
            o = uni.requireNativePlugin("AutoPrinterV5"),
            A = {},
            g = {
                ble_address: "",
                ble_name: "",
                device_no: "",
                model: "",
                fireware_version: "",
                battery_img: ""
            },
            d = !1;

        function c(e, t) {
            var a = {};
            "ios" == uni.getSystemInfoSync().platform && (e.ble_type = "btspp"), a.ble_address = e.ble_address, a.ble_name = e.ble_name, a.ble_type = e.ble_type, o.connectPrinter(a, (function(e) {
                0 == e.code && 1 == e.flag && t && t(!0)
            }))
        }
        A.init = function(e) {
            d ? e && e() : (d = !0, "ios" == uni.getSystemInfoSync().platform ? o.uniModuleInit({}, (function(a) {
                t("log", "init \u6216\u8005 \u72b6\u6001\u53d8\u5316\u56de\u8c03", a, " at models/printer/v5.js:24"), 0 == a.code && (1 == a.flag && 1 == a.type ? A.v5_callback({
                    type: 2
                }) : 0 == a.flag && 0 == a.type ? e && e(a) : A.v5_callback(a))
            })) : o.init({}, (function(t) {
                0 == t.code && (1 == t.status && 0 == t.type && 0 == t.flag ? e && e() : A.v5_callback(t))
            })))
        }, A.v5_callback = function(e) {
            var a = e.type;
            if (1 == a) {
                A.get_printer_resolution((function(t) {
                    e.ble_name || (864 == t.dpi_px ? e.ble_name = "P3S" : 576 == t.dpi_px ? 72 == t.height ? e.ble_name = "P3" : e.ble_name = "Yintibao-V5Pro" : e.ble_name = "Yintibao-V5"), uni.$emit("connect_complete", {
                        ble_address: e.ble_address,
                        ble_name: e.ble_name,
                        model: r.default.get_printer_model(e.ble_name)
                    })
                }))
            } else 2 == a ? (t("log", g, " at models/printer/v5.js:96"), uni.$emit("ble_connect_state_change", {
                connected: !1
            }), l.default.disconnected()) : 4 == a ? 1 == e.status ? uni.showToast({
                title: "Learning complete"
            }) : t("log", "\u5b66\u4e60\u4e2d...", " at models/printer/v5.js:107") : t("log", "V5_Printer v5_callback", " at models/printer/v5.js:110")
        }, A.search = function(e) {
            o.searchBlePrinter({}, (function(a) {
                if (0 == a.code && 1 == a.flag) {
                    var i = {
                        ble_name: a.ble_name,
                        ble_address: a.ble_address,
                        ble_type: a.ble_type
                    };
                    t("log", i, " at models/printer/v5.js:124"), e && e(i)
                }
            }))
        }, A.connect = function(e, t) {
            d ? c(e, t) : A.init((function() {
                c(e, t)
            }))
        }, A.connect_success = function(e) {
            t("log", "V5_Printer connect_success", e, " at models/printer/v5.js:167"), uni.$emit("connect_complete", {
                ble_address: e["ble_address"],
                ble_name: e["ble_name"],
                ble_uuid: e["ble_uuid"],
                research_uuid: e["research_uuid"] ? e["research_uuid"] : "",
                model: r.default.get_printer_model(e["ble_name"], e["ble_address"])
            })
        }, A.disconnect = function(e, a) {
            o.disconnectPrinter({}, (function(e) {
                t("log", "disconnectPrinter \u8c03\u7528\u7ed3\u679c\uff1a", e, " at models/printer/v5.js:179"), 0 == e.code && 1 == e.flag && a && a(!0)
            }))
        }, A.print_image = function(e) {
            o.printImageFromPath({
                image_path: e
            }, (function(e) {
                t("log", "print_image_from_path \u8c03\u7528\u7ed3\u679c\uff1a", e, " at models/printer/v5.js:194"), 0 == e.code || t("log", "print_image_from_path \u5931\u8d25\u4e86", " at models/printer/v5.js:198")
            }))
        }, A.lable_learn = function() {
            A.write("1f284c03006cfe92", (function(e) {
                uni.showToast({
                    icon: "loading",
                    duration: 2e4,
                    title: "Learning..."
                }), "ios" == uni.getSystemInfoSync().platform && setTimeout((function() {
                    t("log", "time out", " at models/printer/v5.js:214"), uni.hideToast(), uni.showToast({
                        title: "Learning complete"
                    })
                }), 36e3)
            }))
        }, A.image_printer = function(e, t) {
            var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
                i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 15,
                s = "0";
            a += "", i += "", o.printImageFromPath({
                is_reset_writing: s,
                image_path: e,
                printer_nums: a,
                feed_paper: i
            }, (function(e) {
                0 == e.code && 1 == e.flag && t && t(e.flag)
            }))
        }, A.write = function() {
            var e = (0, n.default)(s.default.mark((function e(a, i) {
                var n, r, l, A, g, d, c = arguments;
                return s.default.wrap((function(e) {
                    while (1) switch (e.prev = e.next) {
                        case 0:
                            if (n = c.length > 2 && void 0 !== c[2] && c[2], r = c.length > 3 && void 0 !== c[3] ? c[3] : 1, l = c.length > 4 && void 0 !== c[4] ? c[4] : "", A = "0", g = 1, r = r || 1, n && (g = 2), d = {}, d = {
                                    is_reset_writing: A,
                                    paper_type: g,
                                    printer_nums: r
                                }, 2 != g) {
                                e.next = 16;
                                break
                            }
                            if (l) {
                                e.next = 13;
                                break
                            }
                            return t("log", "lable printer image is null", " at models/printer/v5.js:271"), e.abrupt("return", !1);
                        case 13:
                            d.image_path = l, e.next = 17;
                            break;
                        case 16:
                            d.hex_cmd = a;
                        case 17:
                            "ios" == uni.getSystemInfoSync().platform && (d.paper_type = d.paper_type + ""), o.printCmdFromHexstring(d, (function(e) {
                                0 == e.code && 1 == e.flag && i && i(e.flag)
                            }));
                        case 19:
                        case "end":
                            return e.stop()
                    }
                }), e)
            })));
            return function(t, a) {
                return e.apply(this, arguments)
            }
        }(), A.is_connected = function() {
            return new Promise((function(e, t) {
                o.queryConnectStatus({}, (function(t) {
                    0 == t.code && 1 == t.flag ? e(1 == t.status) : e(!0)
                }))
            }))
        }, A.get_battery = function() {
            o.queryBatteryLevel({}, (function(e) {
                t("log", "query_battery_level \u8c03\u7528\u7ed3\u679c", e, " at models/printer/v5.js:306"), 0 == e.code ? 1 == e.flag && _fun && _fun(e) : t("log", "query_battery_level \u5931\u8d25\u4e86", " at models/printer/v5.js:312")
            }))
        }, A.stop_search_printer = function() {
            o.stopSearchPrinter({}, (function(e) {
                t("log", "stop_search_printer \u8c03\u7528\u7ed3\u679c\uff1a", e, " at models/printer/v5.js:319")
            }))
        }, A.debug = function(e) {
            t("log", "V5_printer:" + e, " at models/printer/v5.js:325")
        }, A.get_serial_number = function(e) {
            o.queryPrinterSerialNumber({}, (function(a) {
                t("log", "get_serial_number \u8c03\u7528\u7ed3\u679c\uff1a", a, " at models/printer/v5.js:332"), 0 == a.code && 1 == a.flag && e && e(a.serialNumber)
            }))
        }, A.get_printer_resolution = function(e) {
            o.getPrinterResolution({}, (function(t) {
                if (0 == t.code) {
                    var a = 0,
                        i = 0;
                    if ("ios" == uni.getSystemInfoSync().platform) a = t.height_mm * t.dots_mm, i = t.height_mm;
                    else {
                        var s = t.resolution.split(" "),
                            n = s[0].split(":"),
                            r = s[1].split(":"),
                            l = s[2].split(":");
                        a = n[1] * l[1], i = r[1]
                    }
                    e && e({
                        dpi_px: a,
                        height: i
                    })
                }
            }))
        }, e.exports = A
    }).call(this, a("f3b9")["default"])
}