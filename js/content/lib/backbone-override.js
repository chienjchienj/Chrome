/** 
  Overriding of default Backbone.sync method to call wrapper method which 
  communicates with Background.JS to get Data from the background
**/
Backbone.sync = function (method, model, options) {
  options || (options = {});
  method        = options.method || method;
  var data      = options.data || {};
  var deferred  = $.Deferred();

  var payload   = { 
    controller: model.url,
    method:     method,
    args_array: [data]
  };

  Env.sendMessage(payload, function(response) {
    if(response.status == "success") {
      options.success(response.data);
      deferred.resolve(response.data);

    } else if(response.status == "error") {
      options.error(response.err_msg);
      deferred.reject(response.err_msg);
    }
  });
  return deferred.promise();

};