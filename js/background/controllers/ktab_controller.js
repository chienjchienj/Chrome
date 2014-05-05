var KTabController = {};

KTabController.new = function(data_obj, tab_obj) {
  var ktab       = new KTab(tab_obj.id);
  response        = {}
  response.data   = ktab.toJson();
  response.status = "success";
  return response;
}

/** Export for node testing **/
try { 
  module && (module.exports = KTabController); 
} catch(e){}