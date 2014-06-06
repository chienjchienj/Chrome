/** Node environmental dependencies **/
try { var BrowserIconView       = require('./views/browser_icon_view'); } catch(e) {}
try { var CONFIG                = require('../config/config'); } catch(e) {}
try { var KTab                  = require('./models/ktab'); } catch(e) {}
try { var MixPanelController    = require('./controllers/mix_panel_controller'); } catch(e) {}
try { var KColumnsController    = require('./controllers/kcolumns_controller'); } catch(e) {}
try { var KTabController        = require('./controllers/ktab_controller'); } catch(e) {}
try { var KPageController       = require('./controllers/kpage_controller'); } catch(e) {}
try { var KPaginationController = require('./controllers/kpagination_controller'); } catch(e) {}


var Application = {};

Application.msg_controllers = {
  mixpanel: new MixPanelController(CONFIG["mixpanel_key"], CONFIG["version"]),
  kcolumns:       KColumnsController,
  ktab:           KTabController,
  kpage:          KPageController,
  kpagination:    KPaginationController
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

  if(sender.tab) args_array.push(sender.tab);
  res = {}
  if(!controller) {
    res.status  = "error";
    res.err_msg = "controller needs to be specificed";
    
  } else if (!Application.msg_controllers[controller]) {
    res.status  = "error";
    res.err_msg = "controller is not registered: " + controller;
    
  } else if (Application.msg_controllers[controller] && !Application.msg_controllers[controller][method]) {
    res.status  = "error";
    res.err_msg = "controller " + controller + ", method " + method + " does not exist"
    
  } else {
    controller_obj  = Application.msg_controllers[controller];
    res             = controller_obj[method].apply(controller_obj, args_array);

  }
  sendResponse && sendResponse(res);

}


/** Called when the icon on the top right hand corner of the browser is clicked **/
Application.iconEvent = function(tab) {  
  var tab_id = tab.id;
  var kwin = new KTab(tab_id);
  
  if(kwin.isActive()) {
    kwin.deactivate();
    BrowserIconView.deactivate();

  } else {
    kwin.activate();
    BrowserIconView.activate();
  }
};

/** Called when user clicks to activate another window in the browser **/
Application.tabEvent = function(action_info) {
  var tab_id = action_info.tabId;
  var kwin = new KTab(tab_id);
  if(kwin.isActive()) BrowserIconView.activate();
  else BrowserIconView.deactivate();
    
}

/** Called when user refreshes a window in the browser **/
Application.refreshEvent = function(tabId, changeInfo, tab) {
  var kwin = new KTab(tab.id);
  if(kwin.isActive()) BrowserIconView.activate();
  else BrowserIconView.deactivate();
}

/** Export for node testing **/
try { 
  module && (module.exports = { 
    Application:            Application,     
    BrowserIconView:        BrowserIconView,
    CONFIG:                 CONFIG,
    KTab:                   KTab,    
    MixPanelController:     MixPanelController,
    KColumnsController:     KColumnsController,
    KPaginationController:  KPaginationController
  }); 
} catch(e){}