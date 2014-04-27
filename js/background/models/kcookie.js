// @Description : this class retrieves cookies from specific domain
var KCookie = function(page_id, page_url) {
  var self      = this;
  self.page_id  = page_id;
  self.page_url = page_url;
  self.set();
}

KCookie.instances = [];

KCookie.prototype.set = function() {
  var self = this;  
  // gets the domain name
  domain_name = $('<a>').prop('href', self.page_url).prop('hostname');
  
  // Gets the cookie and sets it
  chrome.cookies.getAll({
     domain : domain_name
  }, function(cookies) {

    self.cookies = cookies;

  });
  
}
