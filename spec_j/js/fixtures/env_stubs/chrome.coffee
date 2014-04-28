global.chrome = {}
chrome.runtime = {}
chrome.runtime.getManifest = ()->
  { version: "STUBBED" }

chrome.tabs = {}
chrome.tabs.getSelected = ()->

chrome.tabs.sendMessage = ()->

global.Env = {};

Env.getSelectedTab = (query, callback)->

Env.setIcon = (img_path)->

Env.sendMessage = (window_id, payload, callback)->