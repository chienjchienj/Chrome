/**
  Chrome environment specific functions and event attachments
**/
var Env = {};

Env.getSelectedTab = function(query, callback) {
  chrome.tabs.getSelected(query, callback);  
}

Env.getVersion = function() {
  return chrome.runtime.getManifest().version;
}

Env.setIcon = function(img_path) {
  chrome.browserAction.setIcon({path:img_path});
}

Env.registerListener = function(event_type, listener) {
  switch(event_type) {
    case "runtime_on_message":
      chrome.runtime.onMessage.addListener(listener);
      break;
    case "tabs_on_update":
      chrome.tabs.onUpdated.addListener(listener);
      break;
    case "browser_action_onclick":
      chrome.browserAction.onClicked.addListener(listener);
      break;
    case "tabs_on_activate":
      chrome.tabs.onActivated.addListener(listener);
      break;
  }

}

Env.sendMessage = function(tab_id, payload, callback) {
  chrome.tabs.sendMessage(tab_id, payload, callback);
}

Env.redirectTo = function(tab_id, url) {
  chrome.tabs.update(tab_id, {url: url});
}

Env.getCookies = function(domain, callback) {
  // Gets the cookie and sets it
  chrome.cookies.getAll({
     domain : domain
  }, callback);
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