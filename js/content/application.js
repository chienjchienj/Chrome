Application = {}

Application.msgEvent = function(request, sender, sendResponse) {

  var method      = request.method
  var args_array  = request.args_array || [];

  if(!method) {
    console.log("Controller %s, method %s does not exist", "Application", method)
    return;
  }
  
  if(method && !Application[method]) {
    console.log("Controller %s, method %s does not exist", "Application", method)
    return;
  }

  console.log("Calling method : %s", method);
  Application[method].apply(Application, args_array);
}

Application.activate = function() {
  $("body").css({ paddingLeft: "0px" });
}

Application.deactivate = function() {
  $("body").css({ paddingLeft: CONFIG["sidebar_width"] });
}
