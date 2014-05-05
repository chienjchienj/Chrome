var KPageController = {};

KPageController.new = function(data_obj, tab_obj) {
  var kpage       = new KPage(tab_obj.url, tab_obj.id, tab_obj.title);
  response        = {}
  response.data   = kpage.toJson();
  response.status = "success";
  return response;
}

/** Export for node testing **/
try { 
  module && (module.exports = KPageController); 
} catch(e){}