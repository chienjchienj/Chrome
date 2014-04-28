/**
  Chrome environment specific functions and event attachments
**/
var Env = {};

Env.getSelectedTab = function(query, callback) {
  chrome.tabs.getSelected(query, callback);  
}

Env.setIcon = function(img_path) {
  chrome.browserAction.setIcon({path:img_path});
}

Env.sendMessage = function(window_id, payload, callback) {
  chrome.tabs.sendMessage(window_id, payload, callback);
}

/**
  Export module for use in NodeJs
**/
try { 
  module && (module.exports = Env); 
} catch(e){}



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