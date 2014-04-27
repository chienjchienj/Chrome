var BrowserIconView = function() {}

BrowserIconView.activate = function() {
  chrome.browserAction.setIcon({path:"images/krake_icon_24.png"});
}

BrowserIconView.deactivate = function() {
  chrome.browserAction.setIcon({path:"images/krake_icon_disabled_24.png"});
}