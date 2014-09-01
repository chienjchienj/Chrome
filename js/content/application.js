var Application = {}

/** Holds all compiled handlebar templates **/
Application.templates = {}

/** 
  List of all the templates to be compiled and loaded.
  Actual templates can be found in the following location
    /js/content/templates/*.*
**/
Application.handle_bars = ["sidebar", "column"];

Application.path_disabled_patterns = [
  new RegExp(CONFIG.server_host)
];

Application.path_injection_pattern = new RegExp(CONFIG.server_host + CONFIG.paths.create_new_path );

/** 
  Executes to load all environmental variables
**/
Application.init = function() {
  
  if(Application.shouldRenderSubViews()) {
    Application.loadHandleBarTemplates(Application.renderTabView);
    Env.registerListener(Application.msgEvent);

  } else if(Application.shouldInjectDefinition()) {
    Application.injectDefinition();

  }
}


/**
  Makes possible the display and hiding of the sidebar
**/
Application.renderTabView = function() {
  Application.tab_view = new TabView();  
}

/**
  Checks if should render sub display of chrome browser extension
**/
Application.shouldRenderSubViews = function() {
  return Application.path_disabled_patterns.reduce(function(prev_result, curr_regex) {
    return prev_result && !curr_regex.test(window.location.href)
  }, true);
}

Application.shouldInjectDefinition = function() {
  return Application.path_injection_pattern.test(window.location.href);
}

/**
  Injects the krake definition into the Krake editor
**/
Application.injectDefinition = function(crawler_def) {

  var getUrlVars = function() {
    var vars = {};
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    hashes.forEach(function(hash) {
      hash          = hash.split('=');
      vars[hash[0]] = hash[1];
    });
    return vars;
  }

  self.tab = new Tab();  
  var promise = self.tab.compile(getUrlVars()["page_id"]);

  promise.then(function(data_response) {
    $("#krake_name.krake_name_input").val(data_response.page_title);
    $("#krake_content.krake_json_input").html(JSON.stringify(data_response.definition));
    $("#refresh_content").trigger("click");

  }, function() {
    console.log("Opps... Something went wrong");
  })

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