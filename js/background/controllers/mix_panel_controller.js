var MixPanelController = function(mixpanel_key) {
  var self = this;
  mixpanel.init(mixpanel_key);
  self.setId();
  self.trackVersion();

}

MixPanelController.prototype.setId = function() {
  var self = this;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://getdata.io/muuid", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      self.id = JSON.parse(xhr.responseText)["muuid"];
      console.log("Identity : %s", self.id);
      mixpanel.identify(self.id);
    }
  }
  xhr.send();
}

/** Returns the current User id on MixPanel **/
MixPanelController.prototype.getId = function(something) {
  var self = this;
  return self.id;
}

MixPanelController.prototype.trackVersion = function() {
  if(!localStorage.getItem('version')){
    mixpanel.track("developer - extension installed - browser", { 'extension_version' : chrome.runtime.getManifest().version });
    localStorage.setItem('version', chrome.runtime.getManifest().version );


  // When updating the browser extension
  } else if(localStorage.getItem('version') != chrome.runtime.getManifest().version) {
    
    mixpanel.track( "developer - extension updated - browser",{
      'extension_version' : chrome.runtime.getManifest().version,
      'old_extension_version' : localStorage.getItem('version')
    });
    localStorage.setItem('version', chrome.runtime.getManifest().version );

  };

}

MixPanelController.prototype.trackExtensionActivation = function() {
  chrome.tabs.getSelected(null, function(tab) {
    mixpanel.track("developer - extension activated", {
      'extension_version' : chrome.runtime.getManifest().version,
      'url_location' : tab.url
    });
  });  
}

MixPanelController.prototype.trackExtensionDeactivation = function() {
  chrome.tabs.getSelected(null, function(tab) {
    mixpanel.track("developer - extension deactivated", {
      'extension_version' : chrome.runtime.getManifest().version,
      'url_location' : tab.url
    });//eo mixpanel.track
  }); 
}

MixPanelController.prototype.trackColumnCreation = function() {
  chrome.tabs.getSelected(null, function(tab) {
    mixpanel.track("developer - extension select start", {
      'extension_version' : chrome.runtime.getManifest().version,
      'url_location' : tab.url,
      'select_type' : 'list_type'
    });
  }); 
}

MixPanelController.prototype.trackColumnAddedFirst = function() {
  chrome.tabs.getSelected(null, function(tab) {   
    mixpanel.track("developer - extension item selected", {
      'extension_version' : chrome.runtime.getManifest().version,
      'url_location' : tab.url,
      'select_type' : 'list_first_item'
    });//eo mixpanel.track
  }); 
}

MixPanelController.prototype.trackColumnAddedMore = function() {
  chrome.tabs.getSelected(null, function(tab) {   
    mixpanel.track("developer - extension item selected", {
      'extension_version' : chrome.runtime.getManifest().version,
      'url_location' : tab.url,
      'select_type' : 'list_second_item'
    });//eo mixpanel.track
  }); 
}

MixPanelController.prototype.trackColumnSaved = function() {
  chrome.tabs.getSelected(null, function(tab) {   
    mixpanel.track("developer - extension column saved", {
      'extension_version' : chrome.runtime.getManifest().version,
      'url_location' : tab.url
    });//eo mixpanel.track
  });  
}

MixPanelController.prototype.trackColumnDeleted = function() {
  chrome.tabs.getSelected(null, function(tab) {   
    mixpanel.track("developer - extension column deleted", {
      'extension_version' : chrome.runtime.getManifest().version,
      'url_location' : tab.url
    });//eo mixpanel.track
  }); 
}

MixPanelController.prototype.trackDone = function() {
  chrome.tabs.getSelected(null, function(tab) {   
    mixpanel.track("developer - extension done", {
      'extension_version' : chrome.runtime.getManifest().version,
      'url_location' : tab.url
    });//eo mixpanel.track
  }); 
}