// ==UserScript==
// @name       Spam-detector-izer for SE
// @version    1.0
// @description  Does stuff
// @match      *stackexchange.com/questions?tab=realtime
// @copyright  2012+, You
// ==/UserScript==

/*
Run this in the console on http://stackexchange.com/questions?tab=realtime.
Or, run it as a userscript. If you run it in GreaseMonkey or TamperMonkey, it will automatically post to Tavern on the Meta with a message notifying of spam.
*/

// This is a flag telling whether to post to the Tavern or not.
var c = confirm('Post to the Tavern? (requires that this be run as a GreaseMonkey or TamperMonkey userscript)'),
    fkey = c ? prompt('Please enter your fkey. If you don\'t know it, click cancel, find it (see the github page to learn how), and then refresh this page.') : 0

// These are the current spam-detector conditions:
var r = {
    'SPAM - Bad keyword': function(el, qTitle) { return /\d{10}|vashikaran|baba/i.test(qTitle) },
    // this one got too many false positives
    // 'SPAM - No spaces in title': function(el, qTitle) { return /^[^ ]+$/.test(qTitle) },
    'Allcaps title': function(el, qTitle) { return qTitle.toUpperCase() === qTitle }
}

// This used to be minified, so I jsbeauttifier-ed it. Will work on more readability later. (I lost the dev version)
var s = document.createElement('style');
s.innerHTML = '.metaInfo,.siteLink,.realtime-body-summary{display:none}.question-container{padding:2px!important}' +
              '#mainArea a:visited{color:#F44!important}'
document.head.appendChild(s);

var b = document.createElement('base');
b.setAttribute('target', '_blank');
document.head.appendChild(b)

var d = document.title;
(u = document.createElement('audio')).src = 'http://cdn-chat.sstatic.net/chat/so.mp3';
document.body.appendChild(u);
(new(MutationObserver || WebKitMutationObserver)(function (m) {
    m.forEach(function (l) {
        for (i = 0; i < l.addedNodes.length; i++) {
            n = l.addedNodes[i], qTitle = n.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].innerText;
            for (var str in r) {
                if (r[str](n, qTitle)) {
                    u.play();
                    document.title = '### SPAM FOUND ###';
                    n.style.backgroundColor = '#FAA';
                    alertTheTavern(str + ': ' + n.getElementsByTagName('a')[0].href + ' (' + n.getElementsByTagName('h2')[0].innerText + ')')
                }
            }
        }
    })
})).observe(document.getElementById('mainArea'), {
    childList: true
});
window.onfocus = function () {
    document.title = d
}

function alertTheTavern(msg) {
    if (!c) return
    if (typeof GM_xmlhttpRequest === "undefined") return
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://chat.meta.stackoverflow.com/chats/89/messages/new",
        data: "text=" + encodeURIComponent('[SE-spam-detector-izer] ' + msg) + "&fkey=" + fkey,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
}
