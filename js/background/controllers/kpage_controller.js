var KPageController = {};

KPageController.create = function(data_obj, tab_obj) {
  var kpage       = new KPage(tab_obj.url, tab_obj.id, null, null, tab_obj.title, data_obj.domain);
  response        = {}
  response.data   = kpage.toJson();
  response.status = "success";
  return response;
}

/** Export for node testing **/
try { 
  module && (module.exports = KPageController); 
} catch(e){}