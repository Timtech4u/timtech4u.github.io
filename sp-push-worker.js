"use strict";
var sServerApi = "https://pushdata.sendpulse.com:4434";
var gcmServer = "https://android.googleapis.com/gcm/send/";
var sFirefoxServer = "https://updates.push.services.mozilla.com/push/";
var sFirefoxServer2 = "https://updates.push.services.mozilla.com/wpush/v1/";

function endpointWorkaround(a) {
    if (~a.indexOf(gcmServer)) {
        var b = a.split(gcmServer);
        return b[1]
    } else {
        if (~a.indexOf(sFirefoxServer)) {
            var b = a.split(sFirefoxServer);
            return b[1]
        } else {
            if (~a.indexOf(sFirefoxServer2)) {
                var b = a.split(sFirefoxServer2);
                return b[1]
            } else {
                return a
            }
        }
    }
}

self.addEventListener("push", function (b) {
    var a = false;
    if (b.data) {
        a = b.data.json()
    }
    b.waitUntil(self.registration.pushManager.getSubscription().then(function (h) {
        var d = null;
        if ("subscriptionId" in h) {
            d = h.subscriptionId
        } else {
            d = h.endpoint
        }
        d = endpointWorkaround(d);
        if (a) {
            var i = Base64.decode(a.message.title);
            var g = Base64.decode(a.message.message);
            var f = a.message.icon;
            var e = a.message.tag;
            var c = Base64.decode(a.message.url);
            var j = {
                action: "statisctic",
                subscriptionId: d,
                statisctic_action: "delivered",
                task_id: a.message.task_id,
                user_id: a.message.user_id
            };
            return fetch(sServerApi, {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(j)
            }).then(function (l) {
                var k = {body: g, icon: f, tag: e, data: {redirectUrl: c}, requireInteraction: true};
                if (a.message.buttons !== undefined) {
                    k.actions = a.message.buttons;
                    k.data["buttons"] = a.message.buttons
                }
                if (a.message.image !== undefined) {
                    k.image = a.message.image
                }
                return self.registration.showNotification(i, k)
            })
        } else {
            return fetch(sServerApi + "/message/" + d).then(function (k) {
                if (k.status !== 200) {
                    throw new Error()
                }
                return k.json().then(function (r) {
                    if (r.error || !r.notification) {
                        throw new Error()
                    }
                    if (r.notifications !== undefined) {
                        var l = false;
                        for (var o = 0; o < r.notifications.length; o++) {
                            var s = r.notifications[o].title;
                            var q = r.notifications[o].message;
                            var p = r.notifications[o].icon;
                            var n = r.notifications[o].tag;
                            var m = r.notifications[o].url;
                            l = self.registration.showNotification(s, {
                                body: q,
                                icon: p,
                                tag: n + o,
                                data: {redirectUrl: m},
                                requireInteraction: true
                            })
                        }
                        return l
                    } else {
                        var s = r.notification.title;
                        var q = r.notification.message;
                        var p = r.notification.icon;
                        var n = r.notification.tag;
                        var m = r.notification.url;
                        return self.registration.showNotification(s, {
                            body: q,
                            icon: p,
                            tag: n,
                            data: {redirectUrl: m},
                            requireInteraction: true
                        })
                    }
                })
            })
        }
    }))
});
self.addEventListener("notificationclick", function (b) {
    var d = b.notification.data.redirectUrl;
    if (b.action !== undefined) {
        var c = b.action;
        if (b.notification.data.buttons !== undefined) {
            for (var a = 0; a < b.notification.data.buttons.length; a++) {
                if (b.notification.data.buttons[a].action == c) {
                    d = b.notification.data.buttons[a].url
                }
            }
        }
    }
    b.notification.close();
    b.waitUntil(clients.matchAll({type: "window"}).then(function (g) {
        for (var f = 0; f < g.length; f++) {
            var e = g[f];
            if (e.url == "/" && "focus" in e) {
                return e.focus()
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(d)
        }
    }))
});
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (c) {
        var a = "";
        var k, h, f, j, g, e, d;
        var b = 0;
        c = Base64._utf8_encode(c);
        while (b < c.length) {
            k = c.charCodeAt(b++);
            h = c.charCodeAt(b++);
            f = c.charCodeAt(b++);
            j = k >> 2;
            g = ((k & 3) << 4) | (h >> 4);
            e = ((h & 15) << 2) | (f >> 6);
            d = f & 63;
            if (isNaN(h)) {
                e = d = 64
            } else {
                if (isNaN(f)) {
                    d = 64
                }
            }
            a = a + this._keyStr.charAt(j) + this._keyStr.charAt(g) + this._keyStr.charAt(e) + this._keyStr.charAt(d)
        }
        return a
    }, decode: function (c) {
        var a = "";
        var k, h, f;
        var j, g, e, d;
        var b = 0;
        c = c.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (b < c.length) {
            j = this._keyStr.indexOf(c.charAt(b++));
            g = this._keyStr.indexOf(c.charAt(b++));
            e = this._keyStr.indexOf(c.charAt(b++));
            d = this._keyStr.indexOf(c.charAt(b++));
            k = (j << 2) | (g >> 4);
            h = ((g & 15) << 4) | (e >> 2);
            f = ((e & 3) << 6) | d;
            a = a + String.fromCharCode(k);
            if (e != 64) {
                a = a + String.fromCharCode(h)
            }
            if (d != 64) {
                a = a + String.fromCharCode(f)
            }
        }
        a = Base64._utf8_decode(a);
        return a
    }, _utf8_encode: function (b) {
        b = b.replace(/\r\n/g, "\n");
        var a = "";
        for (var e = 0; e < b.length; e++) {
            var d = b.charCodeAt(e);
            if (d < 128) {
                a += String.fromCharCode(d)
            } else {
                if ((d > 127) && (d < 2048)) {
                    a += String.fromCharCode((d >> 6) | 192);
                    a += String.fromCharCode((d & 63) | 128)
                } else {
                    a += String.fromCharCode((d >> 12) | 224);
                    a += String.fromCharCode(((d >> 6) & 63) | 128);
                    a += String.fromCharCode((d & 63) | 128)
                }
            }
        }
        return a
    }, _utf8_decode: function (a) {
        var d = "";
        var f = 0;
        var h = 0;
        var g = 0;
        var e = 0;
        var b = 0;
        while (f < a.length) {
            h = a.charCodeAt(f);
            if (h < 128) {
                d += String.fromCharCode(h);
                f++
            } else {
                if ((h > 191) && (h < 224)) {
                    e = a.charCodeAt(f + 1);
                    d += String.fromCharCode(((h & 31) << 6) | (e & 63));
                    f += 2
                } else {
                    e = a.charCodeAt(f + 1);
                    b = a.charCodeAt(f + 2);
                    d += String.fromCharCode(((h & 15) << 12) | ((e & 63) << 6) | (b & 63));
                    f += 3
                }
            }
        }
        return d
    }
};