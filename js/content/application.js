var Application = {}

Application.views = {
  sidebar: SideBar,
  page: Page
}

/** Holds all compiled handlebar templates **/
Application.templates = {}

/** 
  List of all the templates to be compiled and loaded. 
  Actual templates can be found in the following location
    /js/content/templates/*.*
**/
Application.handle_bars = ["sidebar", "column"];

/** 
  Executes to load all environmental variables
**/
Application.init = function() {
  Application.loadHandleBarTemplates();
  Application.page = new Page();
}

/** 
  Handles all message events from background.js
**/
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

/** 
  Activates the Application within this Window
**/
Application.activate = function() {
  $("body").css({ paddingLeft: CONFIG["sidebar_width"] });
  Application.page.render();
  Application.page.el;
}

/** 
  Deactivates the Application within this Window
**/
Application.deactivate = function() {
  $("body").css({ paddingLeft: "0px" });  
}

/** 
  Loads and compiles all handlebar .hbs files to Application.templates for easy use in Application
**/
Application.loadHandleBarTemplates = function(callback) {
  var curr_temp = Application.handle_bars.pop();
  var loading_bay = $('<div>');

  loading_bay.load(chrome.extension.getURL("js/content/templates/" + curr_temp + ".hbs"), function() {
    Application.templates[curr_temp] = Handlebars.compile($(loading_bay).html());

    if(Application.handle_bars.length > 0) {
      Application.loadHandleBarTemplates();

    } else {
      console.log("=== Finished loading ===");
      console.log(Application.templates);
      callback && callback();

    }

  });  
}

Application.init();