var KPaginationController = {};

KPaginationController.create = function(data_obj, tab_obj) {
  var kpage       = new KPage(tab_obj.url, tab_obj.id, tab_obj.title);
  var kpagination = new KPagination(kpage.id);
  response        = {}
  response.data   = kpagination.toJson();
  response.status = "success";
  return response;
}

/** Export for node testing **/
try { 
  module && (module.exports = KPaginationController); 
} catch(e){}