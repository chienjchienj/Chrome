var Application = {}

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
  Application.loadHandleBarTemplates(Application.render);
  Env.registerListener(Application.msgEvent);
}

Application.render = function() {
  Application.tab_view = new TabView();  
}

/**
  Handles all message events from background.js
**/
Application.msgEvent = function(request, sender, sendResponse) {
  var method      = request.method
  var args_array  = request.args_array || [];

  if(!method) {
    console.log("Controller %s, method %s does not exist", "Application", method);
    return;
  }
  
  if(method && !Application[method]) {
    console.log("Controller %s, method %s does not exist", "Application", method);
    return;
  }

  console.log("Calling method : %s", method);
  Application[method].apply(Application, args_array);
}

/** 
  Activates the Application within this Window
**/
Application.activate = function() {
  Application.tab_view.activate();
}

/** 
  Deactivates the Application within this Window
**/
Application.deactivate = function() {
  Application.tab_view.deactivate();
}

/**
  Loads and compiles all handlebar .hbs files to Application.templates for easy use in Application
**/
Application.loadHandleBarTemplates = function(callback) {
  var template_name = Application.handle_bars.pop();

  Env.loadTemplate(template_name, function(html_text) {
    Application.templates[template_name] = Handlebars.compile(html_text);

    if(Application.handle_bars.length > 0) {
      Application.loadHandleBarTemplates(callback);

    } else {
      callback && callback();

    }
    
  });

}

Application.init();