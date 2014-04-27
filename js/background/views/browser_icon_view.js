var BrowserIconView = function() {}

BrowserIconView.activate = function() {
  Env.setIcon(CONFIG["active_icon"]);
}

BrowserIconView.deactivate = function() {
  Env.setIcon(CONFIG["inactive_icon"]);
}