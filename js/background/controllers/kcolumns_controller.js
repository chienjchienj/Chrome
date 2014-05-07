try { var KColumn = require('../models/kcolumn'); } catch(e) {}
try { var KPage = require('../models/kpage'); } catch(e) {}
try { var KTab = require('../models/ktab'); } catch(e) {}

var KColumnsController = {};

KColumnsController.create = function(data_obj, tab_obj) {
  var kpage       = new KPage(tab_obj.url, tab_obj.id, tab_obj.title);
  var kc          = new KColumn(kpage.id);

  response        = {}
  response.data   = kc.toJson();
  response.status = "success";
  return response;
}

KColumnsController.update = function(new_attributes, tab_obj) {
  console.log(new_attributes);
  var kc          = new KColumn.find({ id: new_attributes.id })[0];
  console.log("=== Start : Updating Column Object ===");
  console.log(kc);
  console.log(new_attributes);
  console.log("=== End : Updating Column Object ===");
  response        = {}
  response.status = "success";
}

KColumnsController.read = function(data_obj, tab_obj) {
  console.log(data_obj);
  
  response        = {}
  response.data   = KColumn.find({ }).map(function(kcol) {
    return kcol.toJson();
  });
  response.status = "success";
  return response;

}

/** Export for node testing **/
try { 
  module && (module.exports = KColumnsController); 
} catch(e){}