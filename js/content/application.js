Application = {}

Application.msgEvent = function(request, sender, sendResponse) {

  if(!request.method) {
    console.log("Controller %s, method %s does not exist", "Application", request.method)
  }
  
  if(request.method && !Application[request.method]) {
    console.log("Controller %s, method %s does not exist", "Application", request.method)
  }
  console.log("Calling method : %s", request.method);
}

Application.activate = function() {
  $("body").css({ paddingLeft: "0px" });
}

Application.deactivate = function() {
  $("body").css({ paddingLeft: CONFIG["sidebar_width"] });
}
