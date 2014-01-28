// ==UserScript==
// @name       Spam-detector-izer for SE
// @version    0.1
// @description  Does stuff
// @match      *stackexchange.com/questions?tab=realtime
// @copyright  MIT License
// ==/UserScript==

/*
Run this in the console on http://stackexchange.com/questions?tab=realtime.
Or, run it as a userscript. If you run it in GreaseMonkey or TamperMonkey, it will automatically post to Tavern on the Meta with a message notifying of spam.
*/

// This is a flag telling whether to post to the Tavern or not.
c=true
// If the flag is true, you'll have to insert your fkey here. To find it, run
//   prompt('Here is your fkey',fkey().fkey)
// in the console of the Tavern page.
fkey="6be2d79ba9e6e175facf8786949d8874" // this is only an example (it was mine, once)

// This is the current spam-detector regex:
r=/<h2>[\s\S]*?\b(?:\d{10}|vashikaran|baba)\b[\s\S]*?<\/h2>/i

// This used to be minified, so I jsbeauttifier-ed it. Will work on more readability later. (I lost the dev version)
s = document.createElement('style');
s.innerHTML = '.metaInfo,.siteLink,.realtime-body-summary{display:none}.question-container{padding:2px!important}#mainArea a:visited{color:#F44!important}';
document.head.appendChild(s);
b = document.createElement('base');
b.setAttribute('target', '_blank');
document.head.appendChild(b)
d = document.title;
(u = document.createElement('audio')).src = 'http://cdn-chat.sstatic.net/chat/so.mp3';
document.body.appendChild(u);
(new(MutationObserver || WebKitMutationObserver)(function (m) {
    m.forEach(function (l) {
        for (i = 0; i < l.addedNodes.length; i++) {
            n = l.addedNodes[i], h = n.innerHTML;
            if (r.test(h)) {
                u.play();
                document.title = '### SPAM FOUND ###';
                n.style.backgroundColor = '#FAA';
                alertTheTavern(n.getElementsByTagName('a')[0].href + ' (' + n.getElementsByTagName('h2')[0].innerText + ')')
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
        data: "text=" + encodeURIComponent("SPAM: " + msg) + "&fkey=" + fkey,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
}
