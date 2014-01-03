// Object that holds all the Krakes that were defined in the browser extension
/*
  Example holds an array of Krakes defined for tab id = 1 and tab id = 2
  var records = {
    <<tab_id_1>> : {
      isActive : boolean,
      shared_krakes : {
        url1 : shared_krake_definition,
        url2 : shared_krake_definition
      },
      sessionManager : SessionManager
      colorGenerator : ColorGenerator
    },
    <<tab_id_1>> : {
      isActive : boolean,
      shared_krakes : {
        url1 : shared_krake_definition,
        url2 : shared_krake_definition
      },
      sessionManager : SessionManager,
      colorGenerator : ColorGenerator
    }
  }

*/
var records = {};

// Variables that are tab specific — they are reinstantiated each time a new tab is clicked
var sessionManager = null;

// sharedKrake that corresponds to the current URL in the current tab
var sharedKrake = null;

// The actual krake definition object to be used for populating the edit field on https://krake.io/krakes/new
var compiledKDO = null;
var krake_title = null;

// Color generator object that corresponds to the current URL in the current tab
var colorGenerator = null;

// SharedKrakeHelper object that corresponds to the current URL in the current tab
var curr_SKH = null;

// id of the current tab. Reference to ease debugging of chrome browser extension
var curr_tab_id = null;

/***************************************************************************/
/************************  Browser Action Icon  ****************************/
/***************************************************************************/
var handleIconClick = function(tab) {
  
  // Sets the tab.id to global for easier reference during debugging
  curr_tab_id = tab.id;
  
  // Deactivation Krake within this Tab
  if(records[tab.id] && records[tab.id].isActive) {
    records[tab.id].isActive = false;
    updateBrowserActionIcon(tab.id);
        
    clearCache();
    MixpanelEvents.event_3();
    disableKrake();

  // Activating Krake within this Tab     
  } else {
  
    // Setting up of variables belonging to this tab
    records[tab.id] = records[tab.id] || {}
    records[tab.id].isActive = true;
    sessionManager = records[tab.id].sessionManager = records[tab.id].sessionManager || new SessionManager();    
    colorGenerator = records[tab.id].colorGenerator = records[tab.id].colorGenerator || new ColorGenerator();   
    curr_SKH = new SharedKrakeHelper(tab.id, tab.url, tab.title);
    sharedKrake = curr_SKH.SharedKrake;
    
    updateBrowserActionIcon(tab.id);
    clearCache();
    MixpanelEvents.event_2();

    enableKrake();
    
   }

};//eo handleIconClick



// @Description : When a new tab is clicks
var newTabFocused = function(action_info) {

  // Updates the Browser extension ICON
  updateBrowserActionIcon(action_info.tabId);
  
  // Gets the current tab
  chrome.tabs.get(action_info.tabId, function(tab) {
    curr_SKH = new SharedKrakeHelper(tab.id, tab.url, tab.title);
    sharedKrake = curr_SKH.SharedKrake;
  });
  
  // Sets the tab.id to global for easier reference during debugging
  curr_tab_id = action_info.tabId;
  
}



// @Description : When page was reloaded
var pageReloaded = function(tabId, changeInfo, tab) {
  //re-render panel using columns objects from storage if any. 
  records[tab.id] = records[tab.id] || {};
  curr_SKH = new SharedKrakeHelper(tab.id, tab.url, tab.title);
  sharedKrake = curr_SKH.SharedKrake;
  
  if(records[tab.id].isActive) {
    //Remove column that is not done editing from sessionManager
    sessionManager.currentState = "idle";
    sessionManager.currentColumn = null;

    chrome.tabs.sendMessage(tabId, { action : "enable_krake"}, function(response) {
      records[tab.id].isActive = true;
    });
  }//eo if
}



// @Description : Changes the icon on display depending on the current state of the browser extension
var updateBrowserActionIcon = function(tab_id) {
  if( records[tab_id] && records[tab_id].isActive ) {
    chrome.browserAction.setIcon({path:"images/krake_icon_24.png"});
    
  } else {
    chrome.browserAction.setIcon({path:"images/krake_icon_disabled_24.png"});
    
  }

};//eo updateBrowserActionIcon



/***************************************************************************/
/**************************** Action Methods  ******************************/
/***************************************************************************/



// @Description : Enabling the Krake functions and panel display on the front end
var enableKrake = function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, { action : "enable_krake"}, function(response) {} );
  });  
};//eo enableKrake



// @Description : Disabling the Krake functions and panel display on the front end
var disableKrake = function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, { action : "disable_krake"}, function(response) {} );
  });  
};//eo disableKrake



// @Description : Clearing records associated with the current tab
var clearCache = function() {
  // SharedKrake.reset();
  // var sessionManager = null;
};



// @Description : Loads the indicated javascript file to the front end
var loadScript = function(filename, sender) {
    chrome.tabs.executeScript(sender.tab.id, {file: filename}, function() {
      chrome.tabs.sendMessage(sender.tab.id, 
          { action: "load_script_done", params: { filename: filename } }, 
          function(response) {});
      
    });
};//eo loadScript



// @Description : Loads the indicated CSS file to the front end
var insertCss = function(filename, sender) {
    chrome.tabs.insertCSS(sender.tab.id, {file: filename}, function() {
      chrome.tabs.sendMessage(sender.tab.id, { action: "insert_css_done", params: { filename: filename } }, function(response) {
        
      });
    });
}



// @Description : Gets the actual krake definition for the current sharedKrake
// @param : callback:Function
//    status:String — 'success' || 'error'
//    krakeDefinition:Object
var getKrakeJson = function(callback) {
  if(compiledKDO) {
    callback({status: 'success', krakeDefinition: compiledKDO, krakeTitle : krake_title });
    
  } else {
    callback({status: 'error', krakeDefinition: compiledKDO, krakeTitle : krake_title });
    
  }
  
};//eo getKrakeJson



// @Description : Compiles the current sharedKraked to an actual KrakeDefinitionObject
//    sets the KDO to local variable for latter reference
var compileKrakeJson = function(callback) {
  curr_SKH.getFullKrakeDefinition(function(status, krakeDefinitionObj) {
    compiledKDO = krakeDefinitionObj;
    callback && callback();
  });
}

/* 
 *  @Description : Creates a new Tab to location https://krake.io/krakes/new
 *    when the Done button is clicked on the front end
 */
var sendKrakeToApp = function() {
  checkKrakeCookies(function(is_logged_in) {
    if(is_logged_in) {
      chrome.tabs.create({'url': 'https://krake.io/krakes/new' }, function(tab) {
        // Tab opened.
        console.log(tab)
      });
    } else {
      chrome.tabs.create({'url': 'https://krake.io/members/sign_in?ext_login=true' }, function(tab) {
        // Tab opened.
        console.log(tab)
      });      
    }
    
  })
}


/*
 *  @Description : Checks if the following two cookies on Krake.IO exist
 *      _mbd_dev_session
 *      remember_member_token
 *  @param callback( cookie_exist:boolean )
 */
var checkKrakeCookies = function(callback) {
  chrome.cookies.get({"url": 'https://krake.io', "name": '_mbd_dev_session'}, function(cookie) {
    if(cookie) {
      callback(true);
    } else {
      chrome.cookies.get({"url": 'https://krake.io', "name": '  remember_member_token'}, function(cookie) {
        if(cookie) {
          callback(true);
        } else {
          callback(false);          
        }        
      });
    }
  });  
}



/*
 * @Param: params:object { attribute:"xpath_1", values:params } 
 */
var loadSession = function(params, callback) {
    
  switch(params.attribute) {
    case 'current_state':
      sessionManager.goToNextState(params.values.state);
    break;
    
  }//eo switch

  if (callback && typeof(callback) === "function")  
    callback({status: 'success', session: sessionManager}); 
      
};//eo loadSession



var newColumn = function(params, callback) {
  try{

    sessionManager.currentColumn = ColumnFactory.createColumn(params);
    sessionManager.goToNextState();

    if (callback && typeof(callback) === "function")  
      callback({status: 'success', session: sessionManager});  
  } catch(err) {
    console.log(err);
    if (callback && typeof(callback) === "function")  callback({status: 'error'}); 
  }
};//eo addColumn



// @Description : sets the pagination xpath to the current Krake
// @param : params:Object
// @param : callback:function({ 
//   status : 'success' || 'error'
//   session : sessionManager : Object
// })
var setPagination = function(params, callback) {

  try {
    curr_SKH.setNextPager(params.values.xpath);
    sessionManager.goToNextState(); //current state := 'idle'
    
    if (callback && typeof(callback) === "function")  
      callback({status: 'success', session: sessionManager, sharedKrake: sharedKrake }); 
      
  }catch(err) {
    console.log(err);
    if (callback && typeof(callback) === "function")  callback({status: 'error'});
  }  
  
}



// @Description : deletes this column from the records
var deleteColumn = function(params, callback) {

  var deletedColumn;

  // when current column is deleted
  if(sessionManager.currentColumn && sessionManager.currentColumn.columnId == params.columnId) {
    deletedColumn = sessionManager.currentColumn;
    sessionManager.currentColumn = null;
    sessionManager.goToNextState('idle');
  
  // when some other column is deleted
  }else{

    var temp_SKH = new SharedKrakeHelper(curr_tab_id, params.url);
    deletedColumn = temp_SKH.removeColumn(params.columnId);
    
  }//eo if-else

  if (callback && typeof(callback) === "function")  
    callback({status: 'success', session: sessionManager, deletedColumn: deletedColumn}); 

};//eo deleteColumn



/*
 * @Description : Adding more data to this particular column
 * @Param: params:object { attribute:"xpath_1", values:params } 
 */
var editCurrentColumn = function(params, callback) {
  
  //console.log('-- before "editCurrentColumn"');
  //console.log( JSON.stringify(sessionManager) );
 
  switch(params.attribute) {
    case 'xpath':
      sessionManager.currentColumn.addSelection(params.values);
      // sessionManager.goToNextState().goToNextState(); //current state := 'pre_selection_2'
    break;

    case 'column_name':
      console.log('=== 366 ===');
      sessionManager.currentColumn.columnName = params.values.columnName;
      console.log('=== 368 ===');
    break;

  }//eo switch
  
  //console.log('-- after "editCurrentColumn"');
  //console.log( JSON.stringify(sessionManager) );

  if (callback && typeof(callback) === "function")  
    callback({status: 'success', session: sessionManager, sharedKrake: SharedKrake }); 
  
};//eo editCurrentColumn



var saveColumn = function(params, callback) {

  // when the current column exist
  if(sessionManager.currentColumn && sessionManager.currentColumn.validate()) {
    sessionManager.previousColumn = sessionManager.currentColumn;
    curr_SKH.saveColumn(sessionManager.currentColumn);
    var curr_column_obj = sessionManager.currentColumn;
    sessionManager.currentColumn = null;
    sessionManager.goToNextState('idle');

    if (callback && typeof(callback) === "function")
      callback({status: 'success', session: sessionManager, sharedKrake: sharedKrake, column: curr_column_obj });
      
  // when the current column does not exist
  } else {
    if (callback && typeof(callback) === "function")
      callback({status: 'error', session: sessionManager, sharedKrake: sharedKrake});
      
  }
      
};//eo saveButton




// @Description : Method that wraps the generic xPath call
// TODO : to refactor this method to generate generiXpath using the entire array of columns elements
var matchPattern = function(callback) {

  var result ={};
  sessionManager.currentColumn.genericXpath = sessionManager.currentColumn.selections[0].xpath;
  sessionManager.currentColumn.genericXpath = sessionManager.currentColumn.computeGenericXpath();
  sessionManager.currentColumn.genericAncestorLinkXpath = sessionManager.currentColumn.computeGenericAncestorLinkXpath();  
  result.status = 'matched';  
  
  var response = {
    status : 'success',
    patternMatchingStatus : result.status,
    column : sessionManager.currentColumn
  }
  
  if (callback && typeof(callback) === "function")   callback(response); 

};//eo matchPattern



var getColumnById = function(params, callback) {
  try{
    if(sessionManager.currentColumn && sessionManager.currentColumn.columnId == params.columnId) {
      if (callback && typeof(callback) === "function") 
        callback({ status : 'success', column : sessionManager.currentColumn }); 
    }else{
      //search in sharedKrake for column
      var result = curr_SKH.findColumnByKey('columnId', params.columnId);
      
      if(result) {
        if (callback && typeof(callback) === "function") 
          callback({ status : 'success', column: result }); 
      }else{
        if (callback && typeof(callback) === "function") 
          callback({ status : 'error' }); 
      }    
    }//eo if-else
    
  }catch(err) {
    console.log(err);
  }
};//eo getColumnById



var getBreadcrumb = function(params, callback) {
  var result = curr_SKH.getBreadcrumbArray(params.columnId);
  //console.log('-- getBreadcrumb');
  //console.log( JSON.stringify(result) );
  if(result) {
    if (callback && typeof(callback) === "function") 
      callback({ status: 'success', breadcrumbArray: result });
  }else{
    if (callback && typeof(callback) === "function") 
      callback({ status: 'error' });
  } 
};//eo getBreadcrumb


// @Description : checks if the current tab has already any columns defined already
var hasColumns = function(params, callback) {
  var has_columns = false;
  var krake_pages = Object.keys(records[curr_tab_id].shared_krakes);
  for( var x = 0; x < krake_pages.length; x++ ) {
    var curr_sk = records[curr_tab_id].shared_krakes[ krake_pages[x] ];
    if( curr_sk.columns && curr_sk.columns.length > 0 ) {
      has_columns = true;
      break;
      
    }
  }
  callback({ has_columns: has_columns });  
}; //eo hasColumns



// @Description : MixPanel events
var executeMixpanelEvent = function(eventNumber, callback) {
  switch(eventNumber) {
    case 'event_4':
      MixpanelEvents.event_4();
    break;

    case 'event_5':
      MixpanelEvents.event_5();
    break;

    case 'event_6':
      MixpanelEvents.event_6();
    break;

    case 'event_7':
      MixpanelEvents.event_7();
    break;

    case 'event_8':
      MixpanelEvents.event_8();
    break;

    case 'event_9':
      MixpanelEvents.event_9();
    break;

    case 'event_10':
      MixpanelEvents.event_10();
    break;

    case 'event_11':
      MixpanelEvents.event_11();
    break;

    default:
      console.log('** invalid mixpanel event type **');
  }//eo switch
};


// Backwards compatibility hack for Chrome 20 - 25, ensures the plugin works for Chromium as well
if(chrome.runtime && !chrome.runtime.onMessage) {
  chrome.runtime.onMessage = chrome.extension.onMessage
} 
  
// @Description : Listens for message calls from the front end
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.action) {
      
      case "load_script":
        loadScript(request.params.filename, sender);
      break;

      case "insert_css":
        insertCss(request.params.filename, sender);
      break;

      case "get_session":
        sendResponse({ 
          session: sessionManager,
          sharedKrake : sharedKrake
        });
      break;
      
      case "get_ancestry":
        sendResponse({ 
          ancestry: curr_SKH.getAncestry()
        });        
      break;

      case 'load_session':
        loadSession(request.params, sendResponse);
      break;

      // gets all the shared_krakes belonging to current tab
      case 'get_all_shared_krakes':
        sendResponse({ sharedKrakes: records[curr_tab_id].shared_krakes  });
      break;

      case 'get_breadcrumb':
        getBreadcrumb(request.params, sendResponse);
      break;

      case "add_column":
        newColumn(request.params, sendResponse);
      break;
      
      case "has_columns":
        hasColumns(request.params, sendResponse);
      break;      
      
      // transits into state for handling pagination selection event
      case "add_pagination":
        sessionManager.goToNextState(request.params.values.state);
        sendResponse({status: 'success', session: sessionManager, sharedKrake: sharedKrake});
      break;
      
      case "set_pagination":
        setPagination(request.params, sendResponse);
      break;
      
      case "remove_pagination":
        curr_SKH.unsetNextPager();
      break;

      case "add_nested_krake":
        // TODO : To Extend      
      break;      

      case 'get_column_by_id':
        getColumnById(request.params, sendResponse);
      break;

      case 'edit_current_column':
        editCurrentColumn(request.params, sendResponse);
      break;

      case 'delete_column':
        deleteColumn(request.params, sendResponse);
      break;

      case 'save_column':
        saveColumn(request.params, sendResponse);
      break;

      case 'stage_column':
        stageColumn(request.params, sendResponse);
      break;

      // method is to be called only at the end of the items selection exercise for columns;
      case 'match_pattern':
        matchPattern(sendResponse);
      break;

      // Action gets triggered when the done button is clicked
      case 'complete':
        compileKrakeJson(function() {
          sendKrakeToApp();          
        });
      break;
      
      // Injects the complete Krake Definition into the Edit Tab of the page
      case 'inject_krake':
        getKrakeJson(sendResponse); 
      break;

      case 'fire_mixpanel_event':
        executeMixpanelEvent(request.params.eventNumber);
      break;
      
    }//eo switch
  });


// @Description : handles page reload event
chrome.tabs.onUpdated.addListener(pageReloaded);

// @Description : handles extension Icon click event
chrome.browserAction.onClicked.addListener(handleIconClick);

// @Description : handles for tab change event
chrome.tabs.onActivated.addListener(newTabFocused);


