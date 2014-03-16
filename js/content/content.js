(function() {

var panel = null;
var elementUIManager = null;
var behavioral_mode = TUTORIAL_MODE;


// @Description : Checks if the domain allows for loading of the Krake Panel in the Page
function isKrakeDomain() {
  if( document.domain == 'getdata.io' || document.domain == 'localhost' ) {
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
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/mappers/xpath_mapper.js" } });
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/mappers/pagination_mapper.js" } });
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/mixpanel_helper.js" } });
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/selectors/element_selector.js" } });
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/selectors/column_element_selector.js" } });
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/selectors/pagination_element_selector.js" } });
        chrome.extension.sendMessage({ action: "load_script", params: { filename: "js/content/column_display_factory.js" } });
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


// @Description : Loads the hyperlinks found within the Krake panel for linking to other mapped pages from this one
var reloadKrakeNavigation = function() {
  chrome.extension.sendMessage({ action: "get_ancestry" },  function(response) { 
    if(response.ancestry) {
      for(var x = 0; x < response.ancestry.length ; x++) {

        var link = $("<a>", { attr : { href : response.ancestry[x].origin_url },
                              html : response.ancestry[x].title });
        
        if(x > 0) $('#krake-nav-link-holder').prepend("<span> > </span>");
        if(x== 0) $(link).addClass("current k_panel");
        $('#krake-nav-link-holder').prepend(link);

      }
    }
  });
}


// @Description : In case there was a page reload, populates the panel and the current page
//   with data from previously defined Krake definitions for this
//   current Tab if it exist
var reloadExistingKrake = function() {
  chrome.extension.sendMessage({ action: "get_all_shared_krakes" },  function(response) { 
    var wrapper = $("#inner-wrapper");
    
    if(response.sharedKrakes[document.location.href]) {
      var curr_page_krake = response.sharedKrakes[document.location.href];

      // Populates the next page 
      curr_page_krake.next_page && curr_page_krake.next_page.xpath && PaginationHandler.setNextPager(curr_page_krake.next_page);

      // Populates the current pages columns first      
      populateColumns(wrapper, curr_page_krake.columns);
      delete response.sharedKrakes[document.location.href];

    }

    // Populates other pages columns later
    var all_other_pages = Object.keys(response.sharedKrakes);
    for( var x = 0 ; x < all_other_pages.length ; x++ ) {
      if( response.sharedKrakes[ all_other_pages[x] ].columns && response.sharedKrakes[ all_other_pages[x] ].columns.length > 0 ) {
        var other_page_shared_krakes = response.sharedKrakes[ all_other_pages[x] ].columns;
        populateColumns(wrapper, other_page_shared_krakes, true);
        
      }
    }
        
  });
};//eo reloadExistingKrake



// @Description : Given an array of columns populates the columns wrapper
// @param : wrapper:Object — The object to append this column to
// @param : columns:Array — The array of column objects to append to the wrapper
// @param : is_alien:boolean — If true, means the column does not belong to this page
var populateColumns = function(wrapper, columns, is_alien) {
  for(var i=0; i<columns.length; i++) {
      
    //highlight all elements depicted by genericXpath
    !is_alien && ColumnElementSelector.highlightXpathElements(
      columns[i].url, 
      columns[i].genericXpath, 
      columns[i].colorCode );    

    columns[i].is_alien = is_alien;
    wrapper.append(ColumnDisplayFactory.recreateUIColumn(columns[i]));
    Panel.attachEnterKeyEventToColumnTitle(columns[i].columnId);
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
        ColumnElementSelector.stop();
        PaginationElementSelector.stop();
      break;

      case "load_script_done":

        if(request.params.filename == "js/content/krake.js") {
          NotificationManager.init(behavioral_mode);          
          Panel.init();
          reloadExistingKrake();
          reloadKrakeNavigation();

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
    if(response.status == 'success') {}
  });

// A tutorial on how to use browser ext
} else if ( isKrakeDomain() && document.location.pathname == '/tutorial' ) { 

  behavioral_mode = TUTORIAL_MODE;
  chrome.extension.sendMessage({ action:'load_session', params: { attribute:'previous_column', values:param }}, function(response) {
    if(response.status == 'success') {}
  });

// injects Krake Def
} else if ( isKrakeDomain() && document.location.pathname == '/krakes/new') { 

  behavioral_mode = CREATION_MODE;
  chrome.extension.sendMessage({ action:'inject_krake' }, function(response) {
    if(response.status == 'success') {
      response.krakeDefinition.client_version = chrome.runtime.getManifest().version;
      $('#krake_content').html(JSON.format(response.krakeDefinition));
      $('#krake_name').val(response.krakeTitle);
    }
  });

// redirect 
} else if ( isKrakeDomain() && document.location.pathname == '/loggedin-via-extension' ) { 
  document.location = 'https://getdata.io/krakes/new'
}

})();//eof