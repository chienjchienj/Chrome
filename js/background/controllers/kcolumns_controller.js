try { var KColumn = require('../models/kcolumn'); } catch(e) {}
try { var KPage = require('../models/kpage'); } catch(e) {}
try { var KTab = require('../models/ktab'); } catch(e) {}

var KColumnsController = {};

KColumnsController.create = function(data_obj, tab_obj) {
  var kpage       = new KPage(tab_obj.url, tab_obj.id, tab_obj.title);
  var kc          = new KColumn(kpage.id, tab_obj.id);

  response        = {}
  response.data   = kc.toJson();
  response.status = "success";
  return response;
}

KColumnsController.can_update = [ "col_name", "dom_array", "required_attribute", "count", "is_active" ];

KColumnsController.update = function(new_attributes, tab_obj) {
  console.log(new_attributes);
  var kc          = new KColumn.find({ id: new_attributes.id })[0];
  KColumnsController.can_update.forEach(function(attr) {
    kc[attr] = new_attributes[attr];
  });
  console.log("=== Updated KColumn ===");
  console.log(kc);
  response        = {};
  response.data   = kc.toJson();
  response.status = "success";
  return response;
}

KColumnsController.read = function(data_obj, tab_obj) {
  console.log(data_obj);
  data_obj = data_obj || {};
  response        = {}
  response.data   = KColumn.find(data_obj).map(function(kcol) {
    return kcol.toJson();
  });
  response.status = "success";
  return response;

}

/** Export for node testing **/
try { 
  module && (module.exports = KColumnsController); 
} catch(e){}