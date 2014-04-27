/**
  Wrapper of chrome environment specific functions
**/
var Env = {};

Env.getSelectedTab = function(query, callback) {
  chrome.tabs.getSelected(query, callback);  
}

Env.setIcon = function(img_path) {
  chrome.browserAction.setIcon({path:img_path});
}



// Backwards compatibility hack for Chrome 20 - 25, ensures the plugin works for Chromium as well
if(chrome.runtime && !chrome.runtime.onMessage) {
  chrome.runtime.onMessage = chrome.extension.onMessage
} 
  
// @Description : Listens for message calls from the front end
chrome.runtime.onMessage.addListener(Application.msgEvent);

// @Description : handles page reload event
chrome.tabs.onUpdated.addListener(Application.refreshEvent);

// @Description : handles extension Icon click event
chrome.browserAction.onClicked.addListener(Application.iconEvent);

// @Description : handles for tab change event
chrome.tabs.onActivated.addListener(Application.tabEvent);  