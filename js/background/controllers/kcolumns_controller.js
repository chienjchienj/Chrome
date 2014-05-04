try { var KColumn = require('../models/kcolumn'); } catch(e) {}
try { var KPage = require('../models/kpage'); } catch(e) {}
try { var KTab = require('../models/ktab'); } catch(e) {}

var KColumnsController = {};

KColumnsController.new = function(tab_obj) {
  var kpage       = new KPage(tab_obj.url, tab_obj.id, tab_obj.title);
  var kc          = new KColumn(kpage.id);

  response        = {}
  response.data   = kc.toJson();
  response.status = "success";
  return response;
}

KColumnsController.read = function(data, tab_obj) {
  console.log(data);
  
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