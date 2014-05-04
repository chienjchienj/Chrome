var MixPanelController = function(mixpanel_key, version) {
  var self      = this;
  self.version  = version;
  mixpanel.init(mixpanel_key);
  self.setId();
  self.trackVersion();

}

MixPanelController.prototype.setId = function() {
  var self = this;
  self.xhr = new XMLHttpRequest();
  self.xhr.open("GET", "https://getdata.io/muuid", true);
  self.xhr.onreadystatechange = function() {
    if (self.xhr.readyState == 4) {  
      self.id = JSON.parse(self.xhr.responseText)["muuid"];
      console.log("Identity : %s", self.id);
      mixpanel.identify(self.id);
    }
  }
  self.xhr.send();
}

/** Returns the current User id on MixPanel **/
MixPanelController.prototype.getId = function() {
  var self = this;
  return self.id;
}

MixPanelController.prototype.trackVersion = function() {
  var self = this;

  if(!localStorage.getItem('version')){
    mixpanel.track("developer - extension installed - browser", { 'extension_version' : self.version });
    localStorage.setItem('version', self.version );


  // When updating the browser extension
  } else if(localStorage.getItem('version') != self.version) {
    
    mixpanel.track( "developer - extension updated - browser",{
      'extension_version' : chrome.runtime.getManifest().version,
      'old_extension_version' : localStorage.getItem('version')
    });
    localStorage.setItem('version', self.version );

  };

}

MixPanelController.prototype.trackExtensionActivation = function() {
  var self = this;

  Env.getSelectedTab(null, function(tab) {
    mixpanel.track("developer - extension activated", {
      'extension_version' : self.version,
      'url_location' : tab.url
    });
  });  
}

MixPanelController.prototype.trackExtensionDeactivation = function() {
  var self = this;
  Env.getSelectedTab(null, function(tab) {
    mixpanel.track("developer - extension deactivated", {
      'extension_version' : self.version,
      'url_location' : tab.url
    });//eo mixpanel.track
  }); 
}

MixPanelController.prototype.trackColumnCreation = function() {
  var self = this;
  Env.getSelectedTab(null, function(tab) {
    mixpanel.track("developer - extension select start", {
      'extension_version' : self.version,
      'url_location' : tab.url,
      'select_type' : 'list_type'
    });
  }); 
}

MixPanelController.prototype.trackColumnAddedFirst = function() {
  var self = this;
  Env.getSelectedTab(null, function(tab) {   
    mixpanel.track("developer - extension item selected", {
      'extension_version' : self.version,
      'url_location' : tab.url,
      'select_type' : 'list_first_item'
    });//eo mixpanel.track
  }); 
}

MixPanelController.prototype.trackColumnAddedMore = function() {
  var self = this;
  Env.getSelectedTab(null, function(tab) {   
    mixpanel.track("developer - extension item selected", {
      'extension_version' : self.version,
      'url_location' : tab.url,
      'select_type' : 'list_second_item'
    });//eo mixpanel.track
  }); 
}

MixPanelController.prototype.trackColumnSaved = function() {
  var self = this;
  Env.getSelectedTab(null, function(tab) {   
    mixpanel.track("developer - extension column saved", {
      'extension_version' : self.version,
      'url_location' : tab.url
    });//eo mixpanel.track
  });  
}

MixPanelController.prototype.trackColumnDeleted = function() {
  var self = this;
  Env.getSelectedTab(null, function(tab) {   
    mixpanel.track("developer - extension column deleted", {
      'extension_version' : self.version,
      'url_location' : tab.url
    });//eo mixpanel.track
  }); 
}

MixPanelController.prototype.trackDone = function() {
  var self = this;
  Env.getSelectedTab(null, function(tab) {   
    mixpanel.track("developer - extension done", {
      'extension_version' : self.version,
      'url_location' : tab.url
    });//eo mixpanel.track
  }); 
}

/** Export for node testing **/
try { 
  module && (module.exports = MixPanelController); 
} catch(e){}