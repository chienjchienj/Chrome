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
  var kc          = new KColumn.find({ id: new_attributes.id })[0];
  KColumnsController.can_update.forEach(function(attr) {
    kc[attr] = new_attributes[attr];
  });
  response        = {};
  response.data   = kc.toJson();
  response.status = "success";
  return response;
}

KColumnsController.read = function(data_obj, tab_obj) {
  data_obj = data_obj || {};
  response        = {}
  response.data   = KColumn.find(data_obj).map(function(kcol) {
    return kcol.toJson();
  });
  response.status = "success";
  return response;

}

KColumnsController.merge = function(data_obj, tab_obj) {

  response = {};
  data_obj = data_obj || {}

  if(!data_obj.id) {
    response.status = "error";
    response.err_msg = "Merge cannot be called with kcolumn id";

  } else if (!data_obj.new_array_dom) {
    response.status = "error";
    response.err_msg = "Merge cannot be called with new_array_dom";

  } else{
    var kc = new KColumn.find({ id: data_obj.id })[0];
    result = kc.merge(data_obj.new_array_dom);

    if(result) {
      response.status = "success"
      response.data   = kc.toJson();

    } else {
      response.status = "error";
      response.err_msg = "Merge cannot be performed with new_array_dom provided";

    }
  }

  return response;
}


/** Export for node testing **/
try { 
  module && (module.exports = KColumnsController); 
} catch(e){}