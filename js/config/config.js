var CONFIG = {
  sidebar_width: "180px",
  mixpanel_key:   "6739c9644606bc42c8ac134c22e1d691",
  version:        chrome.runtime.getManifest().version,
  active_icon:    "images/krake_icon_24.png",
  inactive_icon:  "images/krake_icon_disabled_24.png",
};

/** Export for node testing **/
try { 
  module && (module.exports = CONFIG); 
} catch(e){}