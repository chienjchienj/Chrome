var Application = function() {}

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

Application.reloadEvent = function(tabId, changeInfo, tab) {
  var kwin = new KWindow(tab.id);
  if(kwin.isActive()) BrowserIconView.activate();
  else BrowserIconView.deactivate();
}

Application.messageEvent = function(request, sender, sendResponse){
  
}

// Backwards compatibility hack for Chrome 20 - 25, ensures the plugin works for Chromium as well
if(chrome.runtime && !chrome.runtime.onMessage) {
  chrome.runtime.onMessage = chrome.extension.onMessage
} 
  
// @Description : Listens for message calls from the front end
chrome.runtime.onMessage.addListener(Application.messageEvent);

// @Description : handles page reload event
chrome.tabs.onUpdated.addListener(Application.reloadEvent);

// @Description : handles extension Icon click event
chrome.browserAction.onClicked.addListener(Application.iconEvent);

// @Description : handles for tab change event
chrome.tabs.onActivated.addListener(Application.tabEvent);


