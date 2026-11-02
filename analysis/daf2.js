function(e, t, a) {
    "use strict";
    (function(t) {
        var i = a("47a9"),
            s = (i(a("6660")), i(a("a061"))),
            n = i(a("e289")),
            r = null,
            l = null,
            o = {},
            A = "",
            g = 1,
            d = 2314,
            c = 0;
        o.init = function(e, t, a, i) {
            r = {
                device_id: e,
                service_uuid: t,
                characteristics: a,
                notify_characteristics: i
            }
        }, o.is_connected = function() {
            return !(!r || !r["device_id"])
        }, o.get_deivce = function() {
            return r
        }, o.print_hex = function(e, t, a, i) {
            if (!r["device_id"]) return s.default.modal_connect_printer(), !1;
            if (e) {
                l = new ArrayBuffer(e.length / 2);
                for (var n = new DataView(l), u = 0; u < e.length / 2; u++) n.setUint8(u, parseInt(e.substr(2 * u, 2), 16));
                g = 1, d = void 0 == i ? 2314 : i, A = l, c = Math.ceil(l.byteLength / d), getApp().globalData.print_img_src = void 0 != t ? t : "", getApp().globalData.print_img_from = void 0 != a ? a : "", o.write()
            }
        }, o.write = function() {
            if (g > c) A.byteLength > 100 && o.print_complete(d);
            else {
                uni.hideToast(), c > 1 && (s.default.toast("loading", getApp().globalData.$t("message").csz + ":" + g + "/" + c), t("log", "percent:" + g + "/" + c, " at models/printer/ios.js:89"));
                var e = A.byteLength > 20 ? A.slice((g - 1) * d, g * d) : A;
                uni.writeBLECharacteristicValue({
                    deviceId: r["device_id"],
                    serviceId: r["service_uuid"],
                    characteristicId: r["characteristics"],
                    value: e,
                    success: function(e) {
                        1157 != d && 1733 != d || (getApp().globalData.ios_v6_complete = !0, o.v6_write()), 3e3 == d && (g++, o.write())
                    },
                    fail: function(e) {},
                    complete: function(e) {
                        t("log", "complete:" + g, " at models/printer/ios.js:116")
                    }
                })
            }
        }, o.v6_write = function() {
            getApp().globalData.ios_v6_complete && getApp().globalData.ios_v6_11 && (getApp().globalData.ios_v6_complete = !1, getApp().globalData.ios_v6_11 = !1, g++, o.write())
        }, o.sleep = function(e) {
            var t = (new Date).getTime() + parseInt(e, 10);
            while ((new Date).getTime() < t);
        }, o.print_complete = function(e) {
            n.default.print_log();
            var t = "";
            t = e > 6e3 ? "1B4A50" : 3e3 == e ? "1B6460" : "1B6201C0", o.print_hex(t)
        }, o.get_print_package_num = function() {
            return g
        }, e.exports = o
    }).call(this, a("f3b9")["default"])
}