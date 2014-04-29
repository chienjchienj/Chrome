(function (e, b) {
    if (!b.__SV) {
        var a, f, i, g;
        window.mixpanel = b;
        a = e.createElement("script");
        a.type = "text/javascript";
        a.async = !0;
        a.src = 'https://cdn.mxpnl.com/libs/mixpanel-2.2.min.js';
        f = e.getElementsByTagName("script")[0];
        f.parentNode.insertBefore(a, f);
        b._i = [];
        b.init = function (a, e, d) {
            function f(b, h) {
                var a = h.split(".");
                2 == a.length && (b = b[a[0]], h = a[1]);
                b[h] = function () {
                    b.push([h].concat(Array.prototype.slice.call(arguments, 0)))
                }
            }
            var c = b;
            "undefined" !==
                typeof d ? c = b[d] = [] : d = "mixpanel";
            c.people = c.people || [];
            c.toString = function (b) {
                var a = "mixpanel";
                "mixpanel" !== d && (a += "." + d);
                b || (a += " (stub)");
                return a
            };
            c.people.toString = function () {
                return c.toString(1) + ".people (stub)"
            };
            i = "disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");
            for (g = 0; g < i.length; g++) f(c, i[g]);
            b._i.push([a,
                e, d
            ])
        };
        b.__SV = 1.2
    }
})(document, window.mixpanel || []);
mixpanel.init("6739c9644606bc42c8ac134c22e1d691");

// Ensures the muuid cookie is set
get_muuid = function(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://getdata.io/muuid", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var muuid = JSON.parse(xhr.responseText)["muuid"];
      console.log("User mixpanel id : %s", muuid);
      setup_mixpanel(muuid);
    }
  }
  xhr.send();  

};

// Unique user identity across web application and browser extension
setup_mixpanel = function(muuid) {
  mixpanel.identify(muuid);

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

};

get_muuid();


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