(function() {

var panel = null;
var elementUIManager = null;
var behavioral_mode = TUTORIAL_MODE;


// @Description : Checks if the domain allows for loading of the Krake Panel in the Page
function isKrakeDomain() {
  if( document.domain == 'krake.io' || document.domain == 'localhost' ) {
    return true;
  } else {
    return false;
  }
}

// @Description : Checks if jQuery library exist in the page
$.fn.isExist = function() {
  return jQuery(this).length > 0;
};

// @Description : Shows the panel within the page by loading all the scripts
var showPanel = function() {
  if(!$('#k-panel-wrapper').isExist()) {
    var element = document.createElement('div');
    element.id = "k-panel-wrapper";
    $('body').prepend(element); 
    var panelWrapper = $('#k-panel-wrapper');

    panelWrapper.load(chrome.extension.getURL("html/panel.html"),function() {
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/params.js" } }); 
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/xpath_helper.js" } });
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/mixpanel_helper.js" } });
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/ui_element_selector.js" } });          
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/ui_column_factory.js" } });   
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/page_diving_handler.js" } });        
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/pagination_handler.js" } });
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/panel.js" } });         
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/notification_manager.js" } });         
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/libs/bootstrap/bootstrap.min.js" } });   
        chrome.extension.sendMessage({ action: "insert_css", params: { filename: "css/bootstrap.min.css" } });     
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/krake.js" } });        
      }); 
  }//eo if
  
};



// @Description : Hides the panel
var hidePanel = function() {
  if($('#k-panel-wrapper').isExist()) {
    $('#k-panel-wrapper').remove();
    //elementUIManager.disableElementSelection();
    //elementUIManager = null;
  }
};



// @Description : In case there was a page reload, populates the panel 
//   with data from previously existing column in the Krake definitions of theinjectKrakeJson
//   current Tab.
var reloadExistingColumns = function() {
  chrome.extension.sendMessage({ action: "get_all_shared_krakes" },  function(response) { 
    var wrapper = $("#inner-wrapper");
    
    // Populates the current pages columns first
    var curr_page_shared_krakes = response.sharedKrakes[document.location.href].columns;
    populateColumns(wrapper, curr_page_shared_krakes);    
    delete response.sharedKrakes[document.location.href];

    // Populates other pages columns later
    var all_other_pages = Object.keys(response.sharedKrakes);
    for( var x = 0 ; x < all_other_pages.length ; x++ ) {
      if( response.sharedKrakes[ all_other_pages[x] ].columns && response.sharedKrakes[ all_other_pages[x] ].columns.length > 0 ) {
        var other_page_shared_krakes = response.sharedKrakes[ all_other_pages[x] ].columns;
        populateColumns(wrapper, other_page_shared_krakes, true);
        
      }
    }
        
  });
};//eo reloadExistingColumns



// @Description : Given an array of columns populates the columns wrapper
// @param : wrapper:Object — The object to append this column to
// @param : columns:Array — The array of column objects to append to the wrapper
// @param : is_alien:boolean — If true, means the column does not belong to this page
var populateColumns = function(wrapper, columns, is_alien) {
  for(var i=0; i<columns.length; i++) {
      
    //highlight all elements depicted by genericXpath
    !is_alien && UIElementSelector.highlightElements(
      columns[i].url, 
      columns[i].genericXpath, 
      columns[i].colorCode );    
    
    columns[i].is_alien = is_alien;
    wrapper.append(UIColumnFactory.recreateUIColumn(columns[i]));
    Panel.addBreadCrumbToColumn(columns[i]);

  }
};



// @Description : Extending JSON object to include pretty formating method
JSON.format = function(oData, sIndent) {

  var realTypeOf = function(v) {
    if (typeof(v) == "object") {
      if (v === null) return "null";
      if (v.constructor == (new Array).constructor)  return "array";
      if (v.constructor == (new Date).constructor)   return "date";
      if (v.constructor == (new RegExp).constructor) return "regex";
      return "object";
    }
    return typeof(v);
  }

  var self = this;
  if (arguments.length < 2) {
      var sIndent = "";
  }
  var sIndentStyle = "    ";
  var sDataType = realTypeOf(oData);

  // open object
  if (sDataType == "array") {
      if (oData.length == 0) {
          return "[]";
      }
      var sHTML = "[";
  } else {
      var iCount = 0;
      $.each(oData, function() {
          iCount++;
          return;
      });
      if (iCount == 0) { // object is empty
          return "{}";
      }
      var sHTML = "{";
  }

  // loop through items
  var iCount = 0;
  $.each(oData, function(sKey, vValue) {
      if (iCount > 0) {
          sHTML += ",";
      }
      if (sDataType == "array") {
          sHTML += ("\n" + sIndent + sIndentStyle);
      } else {
          sHTML += ("\n" + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
      }

      // display relevant data type
      switch (realTypeOf(vValue)) {
          case "array":
          case "object":
              sHTML += self.format(vValue, (sIndent + sIndentStyle));
              break;
          case "regex": 
              sHTML  += vValue.toString();
              break;
          case "boolean":
          case "number":
              sHTML += vValue.toString();
              break;
          case "null":
              sHTML += "null";
              break;
          case "string":
              sHTML += ("\"" + vValue.replace(/"/g, "\\\"") + "\"");
              break;
          default:
              sHTML += ("TYPEOF: " + typeof(vValue));
      }

      // loop
      iCount++;
  });

  // close object
  if (sDataType == "array") {
      sHTML += ("\n" + sIndent + "]");
  } else {
      sHTML += ("\n" + sIndent + "}");
  }

  // return
  return sHTML;
}



// @Description : Handles calls from the background script
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	switch(request.action) {
      case "enable_krake":
        if(document.domain != 'krake.io') {      
          showPanel();
        }
      break;

      case "disable_krake":
        hidePanel();
        UIElementSelector.restoreElementDefaultActions();
      break;

      case "load_script_done":

        if(request.params.filename == "js/content/krake.js") {
          UIElementSelector.init();
          NotificationManager.init(behavioral_mode);          
          Panel.init();
          reloadExistingColumns();

        }//eo if


      break;

  	}//eo switch
  });


// @Description : Declaration of the actual URL on this document
var param = {
  currentUrl : document.URL
}

// @Description : Checks the current domain loaded and activates different mode
// Normal mode
if( !isKrakeDomain() ) { 
  behavioral_mode = DEFAULT_MODE;
  chrome.extension.sendMessage({ action:'load_session', params: { attribute:'previous_column', values:param }}, function(response) {
    if(response.status == 'success') {
      console.log('-- load_session');
    }
  });

// A tutorial on how to use browser ext
} else if ( isKrakeDomain() && document.location.pathname == '/tutorial' ) { 

  behavioral_mode = TUTORIAL_MODE;
  chrome.extension.sendMessage({ action:'load_session', params: { attribute:'previous_column', values:param }}, function(response) {
    if(response.status == 'success') {
      console.log('-- load_session');
    }
  });

// injects Krake Def
} else if ( isKrakeDomain() && document.location.pathname == '/krakes/new') { 

  behavioral_mode = CREATION_MODE;
  chrome.extension.sendMessage({ action:'inject_krake' }, function(response) {
    if(response.status == 'success') {
      $('#krake_content').html(JSON.format(response.krakeDefinition));        

    }
  });

// redirect 
} else if ( isKrakeDomain() && document.location.pathname == '/loggedin-via-extension' ) { 
  document.location = 'https://krake.io/krakes/new'
}

})();//eof