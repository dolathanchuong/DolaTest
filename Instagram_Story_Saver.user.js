// ==UserScript==
// @name         Instagram Story Saver
// @version      2.8
// @description  Click a button to open the IG story video/image in new tab. IG stories can then be viewed/downloaded.
// @author       navchandar
// @copyright    2019, navchandar (https://openuserjs.org/users/navchandar)
// @license      MIT
// @match        https://www.instagram.com/*
// @match        https://www.instagram.com/stories/*
// excludes      *
// @grant        GM_openInTab
// @grant        GM_addStyle
// @homepage     https://navchandar.github.io/
// @homepage     https://github.com/navchandar/
// @homepageURL  https://navchandar.github.io/
// @contributionURL https://paypal.me/navchandar
// @contributionAmount $1.00
// @updateURL    https://openuserjs.org/meta/navchandar/Instagram_Story_Saver.meta.js
// @downloadURL  https://openuserjs.org/install/navchandar/Instagram_Story_Saver.user.js
// @supportURL   https://openuserjs.org/scripts/navchandar/Instagram_Story_Saver/issues
// @setupURL     https://openuserjs.org/install/navchandar/Instagram_Story_Saver.user.js
// @icon         https://cdn.iconscout.com/icon/free/png-256/instagram-53-151118.png
// ==/UserScript==

function getElementsByXPath(xpath, parent) {
  let results = [];
  let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    results.push(query.snapshotItem(i))
  }
  return results
}

function has(String, search) {
  try {
    if (String.indexOf(search) > -1) {
      return !0
    }
  }
  catch (err) {}
  return !1
}

function openStory(zEvent) {
  let parent = document.elementFromPoint(innerWidth / 2, innerHeight / 2).parentNode.parentNode.parentNode.parentNode,
    video = parent.querySelector("video source"),
    image = parent.querySelector("img");

  if (!video && !image) {
    parent = document.elementFromPoint(innerWidth / 2, innerHeight / 2).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    video = parent.querySelector("video source");
    image = parent.querySelector("img");
  }

  if (!video && !image) {
    parent = document.elementFromPoint(innerWidth / 2, innerHeight / 2).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    video = parent.querySelector("video source");
    image = parent.querySelector("img");
  }

  if (video) {
    GM_openInTab(video.getAttribute("src"), false);
  }
  else if (image) {
    GM_openInTab(GetFirstSrcsetUrl(image.getAttribute("srcset")), false);
  }
  else {
    console.log("Nothing img/video found to open.")
  }
}

function GetFirstSrcsetUrl(imageSrc) {
  var firstUrl = /(^http.*?) /g.exec(imageSrc)[0];
  console.log(firstUrl);
  return firstUrl
}

function AddButton() {
  var t = document.createElement("div");
  t.innerHTML = '<button id="myButton" title="Click to open this Story" type="button">OPEN</button>', t.setAttribute("id", "myContainer"), document.body.appendChild(t), document.getElementById("myButton").addEventListener("click", openStory, !1), GM_addStyle("#myContainer{position:fixed;bottom:0;left:49%;right:48%;margin:0;width:3.5%;height:3%;text-align:center}\n#myButton{opacity:.55;cursor:pointer;background-color:#262626;color:#fff;font-size:7px;border-radius:7px;padding:0}#myButton:hover{color:#fff;opacity:.65}")
}

function sleep(e) {
  return new Promise(n => setTimeout(n, e))
}
async function sleepFunc() {
  await sleep(1e3)
}

function Login() {
  // Auto login if creds autofilled
  setTimeout(function () {
    sleepFunc();
    var login = getElementsByXPath("//*[text() = 'Log In']");
    if (login.length > 0) {
      login[0].click();
    }
    var notNow = getElementsByXPath("(//button[text()='Not Now'])[1]");
    if (notNow.length > 0) {
      notNow[0].click();
    }
  }, 2000)

  // click the link NOT NOW after login!!
  var NotNow = getElementsByXPath("//a[@href='/']");
  if (NotNow.length > 0) {
    NotNow[0].click();
  }
}

function HideBtn() {
  document.getElementById("myButton").style.visibility = "hidden"
}

function UnHideBtn() {
  document.getElementById("myButton").style.visibility = "visible"
}

function AddShortcut() {
  document.addEventListener('keydown', keyHandler);

  function keyHandler(event) {
    if (window.location.href === 'https://www.instagram.com/') return;
    // alt + x
    if (event.altKey && event.keyCode === 88) {
      document.getElementById("myButton").click();
    }
  }

}

! function () {
  "use strict";
  AddButton(), HideBtn(), Login(), AddShortcut(), setInterval(function () {
    var t = window.location.href;
    has(t, "stories") && has(t, "instagram") ? UnHideBtn() : HideBtn()
  }, 1e3)
}();
