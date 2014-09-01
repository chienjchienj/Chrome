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

Env.sendMessage = (tab_id, payload, callback)->

Env.getVersion = ->
  "test version"

Env.registerListener = (event_type, listener)->
