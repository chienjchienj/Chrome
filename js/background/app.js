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





// Backwards compatibility hack for Chrome 20 - 25, ensures the plugin works for Chromium as well
if(chrome.runtime && !chrome.runtime.onMessage) {
  chrome.runtime.onMessage = chrome.extension.onMessage
} 
  
// @Description : Listens for message calls from the front end
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
});


// @Description : handles page reload event
chrome.tabs.onUpdated.addListener(pageReloaded);

// @Description : handles extension Icon click event
chrome.browserAction.onClicked.addListener(handleIconClick);

// @Description : handles for tab change event
chrome.tabs.onActivated.addListener(newTabFocused);


