var KColumnsController = {};

KColumnsController.new = function(tab_obj) {
  console.log(tab_obj);
  console.log("Fetching new kcolumn");
  var kc = new KColumn();
  response = kc.toJson();
  return response;
}

/** Export for node testing **/
try { 
  module && (module.exports = KColumnsController); 
} catch(e){}