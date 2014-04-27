var CONFIG = {
  mixpanel_key: "6739c9644606bc42c8ac134c22e1d691",
  version: chrome.runtime.getManifest().version
};

/** Export for node testing **/
try { 
  module && (module.exports = CONFIG); 
} catch(e){}