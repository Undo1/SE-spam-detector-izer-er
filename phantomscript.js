var page = require('webpage').create();
var page2 = require('webpage').create();
page2.open('https://meta.stackoverflow.com/users/login?returnurl=http%3a%2f%2fchat.meta.stackoverflow.com%2f', function() {
  page2.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js", function() {
    page2.evaluate(function() {
      
      $("#se-login").click();

      var emailField = document.getElementsByName("email")[0];
	  emailField.value = 'erwayjunk@me.com';
      var passField = document.getElementsByName("password")[0];
      passField.value = 'se1&Yezgonkt';

      $('#submit-button').click();
    });
    setTimeout(checkLogin, 5000);

    function checkLogin() {
		page2.render('img.png');
    }

  });
});

page.open('http://stackexchange.com/questions?tab=realtime', function() {

	var fkey = '09dcfc07509ab2da0c43659e89b4e061';

	var r = {
	    'JAVA - Bad keyword': function(el, qTitle) { return /\d{10}|jquery|java/i.test(qTitle) },
	    // this one got too many false positives
	    // 'SPAM - No spaces in title': function(el, qTitle) { return /^[^ ]+$/.test(qTitle) },
	    'Allcaps title': function(el, qTitle) { return qTitle.toUpperCase() === qTitle }
	}

	var previousTitle = "foobar";

    function doStuff()
	{
	  setTimeout(check, 200);
	}

	function check()
	{
		var title = page.evaluate(function() {
			return $("a.realtime-title").html();
		});
		var row = page.evaluate(function() {
			return $("realtime-question").html();
		});
		var body = page.evaluate(function() {
			return $("realtime-body-summary").html();
		});
		var site = page.evaluate(function() {
			return $("a.realtime-host").html();
		});
		var url = page.evaluate(function() {
			return $("a.realtime-title").href;
		});
		if (title != previousTitle)
		{
			console.log(site + ": " + title);
			previousTitle = title;
			qTitle = title;

			for (var str in r) {
				if (r[str](row, qTitle) || true) {
		            console.log("^^^ JQUERY FOUND ^^^");
		            alertTheTavern(str + ': ' + url + ' (' + title + ')')
		        }
			}
		}
		
        
		doStuff();
	}
	doStuff();

	function alertTheTavern(msg) {
		// page.evaluate(function() {
		// 	var fkey = '09dcfc07509ab2da0c43659e89b4e061';
		// 	$.post({
		//         method: "POST",
		//         url: "http://chat.meta.stackoverflow.com/chats/89/messages/new",
		//         data: "text=" + encodeURIComponent('[SE-spam-detector-izer] ') + "&fkey=" + fkey,
		//         headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": encodeURIComponent("__utma=128717072.165737728.1366838881.1386811452.1386877675.645; __utmz=128717072.1386811452.644.406.utmcsr=meta.space.stackexchange.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __qca=P0-1989879358-1387217393603; sgt=id=fb4a74f4-035e-45a3-bb40-e08fb780028d; sl=1; __utma=140029553.90165904.1387221286.1389568873.1389621898.123; __utmz=140029553.1389621898.123.86.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); mc=0; somusr=t=2ayvFl5mNE2F&s=mNy63MbjhkCQ; _ga=GA1.3.165737728.1366838881; usr=t=AnJGi7NUuzJM&s=NrDncPYH6EKx; _ga=GA1.2.90165904.1387221286; csr=t=ArvEu5ncT0u4") },
		//         success: function(msg){
		// 	         alert( "Data Saved: " + msg );
		// 		  },
		// 		  error: function(XMLHttpRequest, textStatus, errorThrown) {
		// 		     alert("some error");
		// 		  }
		//     });
			xhr.open("POST", "http://chat.meta.stackoverflow.com/chats/89/messages/new", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");//, "Cookie": "__utma=128717072.165737728.1366838881.1386811452.1386877675.645; __utmz=128717072.1386811452.644.406.utmcsr=meta.space.stackexchange.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __qca=P0-1989879358-1387217393603; sgt=id=fb4a74f4-035e-45a3-bb40-e08fb780028d; sl=1; __utma=140029553.90165904.1387221286.1389568873.1389621898.123; __utmz=140029553.1389621898.123.86.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); mc=0; somusr=t=2ayvFl5mNE2F&s=mNy63MbjhkCQ; _ga=GA1.3.165737728.1366838881; usr=t=AnJGi7NUuzJM&s=NrDncPYH6EKx; _ga=GA1.2.90165904.1387221286; csr=t=ArvEu5ncT0u4");
			xhr.send("text=" + encodeURIComponent('[SE-spam-detector-izer] ') + "&fkey=" + fkey);
	}
});
