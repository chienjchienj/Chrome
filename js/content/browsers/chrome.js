/**
  Chrome environment specific functions and event attachments
**/
var Env = {};

Env.sendMessage = function(payload, callback) {
  chrome.runtime.sendMessage(payload, callback);
}

Env.imagePath = function(img_path) {
  return "'" + chrome.extension.getURL(img_path) + "'";
}

Env.filePath = function(file_path) {
  return chrome.extension.getURL(file_path);
}

Env.registerListener = function(listener) {
 chrome.extension.onMessage.addListener(Application.msgEvent); 
}

Env.loadTemplate = function(template_name, callback) {
  var file_path = "js/content/templates/" + template_name + ".hbs";
  var loading_bay = $('<div>');
  loading_bay.load(Env.filePath(file_path), function() {  
    callback && callback( $(loading_bay).html() );
  });
}

Env.redirect = function(page_url) {
  window.redirect = page_url;
}