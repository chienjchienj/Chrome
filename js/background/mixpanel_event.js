mixpanel.init("6739c9644606bc42c8ac134c22e1d691");

// Unique user identity across web application and browser extension
setup_mixpanel_muuid = function() {
  console.log('Setting up muuid at ' + new Date());
  chrome.cookies.get({"url": 'https://getdata.io', "name": 'muuid'}, function(cookie) {

    // When MixPanel Unique User ID is already set for this browser extension    
    if(cookie) {

      mixpanel.identify(cookie.value);
      console.log('MUUID : %s', cookie.value);

      // When its the first time installing
      if(window.localStorage && localStorage.getItem('first_install') != 'yes'){
        mixpanel.track("developer - extension installed - browser", {
          'extension_version' : chrome.runtime.getManifest().version
        });
        //console.log('executed');
        localStorage.setItem('first_install', 'yes');
        localStorage.setItem('old_extension_version', chrome.runtime.getManifest().version );
        console.log('new browser extension install : ' +  chrome.runtime.getManifest().version);
      
      // When updating the browser extension
      } else if(localStorage.getItem('old_extension_version') && localStorage.getItem('old_extension_version') != chrome.runtime.getManifest().version) {
        mixpanel.track("developer - extension updated - browser", {
          'extension_version' : chrome.runtime.getManifest().version,
          'old_extension_version' : localStorage.getItem('old_extension_version')
        });
        localStorage.setItem('old_extension_version', chrome.runtime.getManifest().version );
        console.log('browser extension update : ' +  chrome.runtime.getManifest().version);
        
      };

    // When MixPanel Unique User ID is not set yet for this browser extension
    } else {
      setup_muuid_frame();
    }

  });
};


// Ensures the muuid cookie is set
setup_muuid_frame = function() {
  console.log('Setting Krake.IO Unique User ID cookie');
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://getdata.io/muuid", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      console.log('Loaded Krake.IO iframe');
      setup_mixpanel_muuid();
    }
  }
  xhr.send();  

};

console.log('Mixpanel 101');
setup_mixpanel_muuid();



/***************************************************************************/
/******************************  MixPanel **********************************/
/***************************************************************************/
var MixpanelEvents = {
  /*
   * This event is emitted each time the KRAKE button on the top right hand corner is clicked
   * to bring up the embedded KRAKE console
   */
  event_2 : function(e){
    chrome.tabs.getSelected(null, function(tab) {
      mixpanel.track("developer - extension activated", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url
      });//eo mixpanel.track
    });  
  },
  /*
   * This event is emitted each time the KRAKE button on the top right hand corner is clicked 
   * to disable the embedded KRAKE console
   */
  event_3 : function(e){
    chrome.tabs.getSelected(null, function(tab) {
      mixpanel.track("developer - extension deactivated", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url
      });//eo mixpanel.track
    }); 
  },
  /*
   * This event is emitted each time the "Make of list of items" button on the lower left hand corner is clicked
   */
  event_4 : function(e){
    chrome.tabs.getSelected(null, function(tab) {
      mixpanel.track("developer - extension select start", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url,
        'select_type' : 'list_type'
      });//eo mixpanel.track
    }); 
  },
  /*
   * This event is emitted each time the "Select single item" button on the lower left hand corner is clicked
   */
  event_5 : function(e){
    chrome.tabs.getSelected(null, function(tab) {   
      mixpanel.track("developer - extension select start", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url,
        'select_type' : 'single_type'
      });//eo mixpanel.track
    }); 
  },
  /*
   * This event is emitted each time a first item is selected when in make list of items mode is activated
   */
  event_6 : function(e){
    chrome.tabs.getSelected(null, function(tab) {   
      mixpanel.track("developer - extension item selected", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url,
        'select_type' : 'list_first_item'
      });//eo mixpanel.track
    }); 
  },
  /*
   * This event is emitted each time a second item is selected when in make list of items mode is activated
   */
  event_7 : function(e){
    chrome.tabs.getSelected(null, function(tab) {   
      mixpanel.track("developer - extension item selected", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url,
        'select_type' : 'list_second_item'
      });//eo mixpanel.track
    }); 
  },
  /*
   * This event is emitted each time an item is selected when in single item mode is activated
   */
  event_8 : function(e){
    chrome.tabs.getSelected(null, function(tab) {   
      mixpanel.track("developer - extension item selected", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url,
        'select_type' : 'single_item'
      });//eo mixpanel.track
    }); 
  },
  /*
   * This event is emitted each time an item is selected when the column save button is clicked
   */
  event_9 : function(e){
    chrome.tabs.getSelected(null, function(tab) {   
      mixpanel.track("developer - extension column saved", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url
      });//eo mixpanel.track
    }); 
  },
  /*
   * This event is emitted each time an item is selected when the column delete button is clicked
   */
  event_10 : function(e){
    chrome.tabs.getSelected(null, function(tab) {   
      mixpanel.track("developer - extension column deleted", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url
      });//eo mixpanel.track
    }); 
  },
  /*
   * This event is emitted each time the done button is clicked
   */
  event_11 : function(e){
    chrome.tabs.getSelected(null, function(tab) {   
      mixpanel.track("developer - extension done", {
        'extension_version' : chrome.runtime.getManifest().version,
        'url_location' : tab.url
      });//eo mixpanel.track
    }); 
  }
};//eo MixpanelEvents