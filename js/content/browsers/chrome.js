/**
  Chrome environment specific functions and event attachments
**/

chrome.extension.onMessage.addListener(Application.msgEvent);

var Env = {};

Env.sendMessage = function(payload, callback) {
  chrome.runtime.sendMessage(payload, callback);
}

Env.imagePath = function(img_path) {
  return "'" + chrome.extension.getURL(img_path) + "'";
}