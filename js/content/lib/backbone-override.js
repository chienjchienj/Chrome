/** 
  Overriding of default Backbone.sync method to call wrapper method which 
  communicates with Background.JS to get Data from the background
**/
Backbone.sync = function (method, model, options) {
  options || (options = {});
  method        = options.method || method;
  var data      = options.data || {};
  var deferred  = $.Deferred();

  var payload = {};
  payload["controller"] = model.url;
  payload["method"]     = method;  

  console.log(method);
  switch(method) {
    case "read" :
    case "create" :
    case "new" :
      payload["args_array"] = [data];
      break;
    case "update" :
      payload["args_array"] = [model.attributes];
      break;

  }


  Env.sendMessage(payload, function(response) {
    if(response.status == "success") {
      options.success(response.data);
      deferred.resolve(response.data);

    } else if(response.status == "error") {
      console.log(response.err_msg);
      options.error(response.err_msg);
      deferred.reject(response.err_msg);
    }
  });
  return deferred.promise();

};