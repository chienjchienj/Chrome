var KWindow = function(window_id){
  var kwins = KWindow.find({ id: window_id });
  if(kwins.length > 0) return kwins[0];

  var self = this;
  self.active = false;
  self.id = window_id;
  KWindow.instances.push(self);
  return self;
}

KWindow.instances = [];

KWindow.reset = function() {
  KWindow.instances = [];
}

KWindow.find = function(param) {
  param = param || {};
  return KWindow.instances.filter(function(obj) {
    to_return = true;
    Object.keys(param).forEach(function(attr) {
      to_return &= param[attr] == obj[attr];
    });
    return to_return;
  });  
}

KWindow.prototype.isActive = function() {
  var self = this;
  return self.active;
}

KWindow.prototype.activate = function() {
  var self = this;
  self.active = true;
}

KWindow.prototype.deactivate = function() {
  var self = this;
  self.active = false;
}

/**
  Explore module for use in NodeJs
**/
try { 
  module && (module.exports = KWindow); 
} catch(e){}