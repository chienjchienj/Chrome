/**
  Chrome environment specific functions and event attachments
**/
var Env = {};

Env.sendMessage = function(payload, callback) {

}

Env.imagePath = function(img_path) {
  return
}

Env.filePath = function(file_path) {
  return "../" + file_path;
}

Env.registerListener = function(listener) {
 
}

Env.loadTemplate = function(template_name, callback) {
  callback && callback( $("#fixture_" + template_name).html() );
}

Env.redirect = function() {}

Env.getVersion = function() {
  return "test version";  
}

Env.registerListener = function(event_type, listener) {

}

Env.getDomain = function() {
  return "testing.com";
}

Env.getLocation = function() {
  return "http://testing.com";
}