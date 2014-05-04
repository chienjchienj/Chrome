var KTab = function(tab_id){
  var kwins = KTab.find({ id: tab_id });
  if(kwins.length > 0) return kwins[0];

  var self = this;
  self.active = false;
  self.id = tab_id;
  KTab.instances.push(self);
  return self;
}

KTab.instances = [];

KTab.reset = function() {
  KTab.instances = [];
}

KTab.find = function(param) {
  param = param || {};
  return KTab.instances.filter(function(obj) {
    to_return = true;
    Object.keys(param).forEach(function(attr) {
      to_return &= param[attr] == obj[attr];
    });
    return to_return;
  });  
}

KTab.prototype.isActive = function() {
  var self = this;
  return self.active;
}

KTab.prototype.activate = function() {
  var self = this;
  self.active = true;
  Env.sendMessage(self.id, { method: "activate" }, function() {});
}

KTab.prototype.deactivate = function() {
  var self = this;
  self.active = false;
  Env.sendMessage(self.id, { method: "deactivate" }, function() {});  
}

/**
  Export module for use in NodeJs
**/
try { 
  module && (module.exports = KTab); 
} catch(e){}