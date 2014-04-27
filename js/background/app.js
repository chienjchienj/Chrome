var Application = {};

Application.msg_controllers = {
  mixpanel: new MixPanelController(CONFIG["MixPanelKey"])
};

/**
  When served a request calls a controller's method

  Params:
    request:Object
      controller:String - the name of the controller register with the Application object
      method:String     - the name of the method
      args_array:Array  - the arguments to be past into the method

    sender:Object
    sendResponse:Object

**/
Application.msgEvent = function(request, sender, sendResponse){
  var controller = request.controller;
  var method     = request.method;
  var args_array = request.args_array || [];

  if(!controller) {
    console.log("controller needs to be specificed");
    return;
  } 

  if (!Application.msg_controllers[controller]) {
    console.log("controller does not exist: %s", controller);
    return;
  } 

  if (Application.msg_controllers[controller] && !Application.msg_controllers[controller][method]) {
    console.log("controller %s, method %s does not exist: %s", controller, method);
    return;

  }

  controller_obj = Application.msg_controllers[controller]
  var results = controller_obj[method].apply(controller_obj, args_array);
  console.log(results);
}

Application.iconEvent = function(tab) {  
  var window_id = tab.id;
  var kwin = new KWindow(window_id);
  
  if(kwin.isActive()) {
    console.log("DeActiving");
    kwin.deactivate();
    BrowserIconView.deactivate();

  } else {
    kwin.activate();
    BrowserIconView.activate();
  }
};

Application.tabEvent = function(action_info) {
  var window_id = action_info.tabId;
  var kwin = new KWindow(window_id);
  if(kwin.isActive()) BrowserIconView.activate();
  else BrowserIconView.deactivate();
    
}

Application.refreshEvent = function(tabId, changeInfo, tab) {
  var kwin = new KWindow(tab.id);
  if(kwin.isActive()) BrowserIconView.activate();
  else BrowserIconView.deactivate();
}