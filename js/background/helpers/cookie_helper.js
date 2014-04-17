// @Description : this class retrieves cookies from specific domain
var CookieHelper = function() {}

// @Description : given a sharedKrake Object sets the fullset of cookies corresponding to its origin_url 
//    to the sharedKrake Object. makes the callback once done
// @param : sharedKrake:Object
// @param : callback:function
//    status:String — 'success' || 'error'
//    sharedKrake:Object
CookieHelper.prototype.setCookie = function(sharedKrake, callback) {
  
  // gets the domain name
  domain_name = $('<a>').prop('href', sharedKrake.origin_url).prop('hostname');  
  
  // Gets the cookie and sets it
  chrome.cookies.getAll({
     domain : domain_name
     
  }, function(cookies) {

    sharedKrake.cookies = cookies;
    callback && callback( 'success', sharedKrake );
    
  });
  
}
