// @Description : the standard template to use when instantiating a SharedKrake Object
var SharedKrake = function() {
  var self = this;  
  self.origin_url = null;
  self.destinationUrl = null;
  self.columns = [];
  
};

SharedKrake.prototype.reset = function(){
  var self = this;
  self.origin_url = null;
  self.destinationUrl = null;
  self.columns = [];
};