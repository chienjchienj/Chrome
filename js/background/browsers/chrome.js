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

Env.sendMessage = function(tab_id, payload, callback) {
  chrome.tabs.sendMessage(tab_id, payload, callback);
}

Env.redirectTo = function(tab_id, url) {
  chrome.tabs.update(tab_id, {url: url});
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