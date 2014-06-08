var KTabController = {};

KTabController.create = function(data_obj, tab_obj) {
  var ktab       = new KTab(tab_obj.id);
  response        = {}
  response.data   = ktab.toJson();
  response.status = "success";
  return response;
}

KTabController.dispatch = function(data_obj, tab_obj) {
  var kpage         = new KPage(tab_obj.url, tab_obj.id, null, null, tab_obj.title);
  var root_kpage    = kpage.root();
  var creation_url  = CONFIG["server_host"] + CONFIG.paths.create_new_path + "?page_id=" + root_kpage.id;
  Env.redirectTo(tab_obj.id, creation_url);

  response        = {}
  response.data   = kpage.toJson();
  response.status = "success";
  return response;
}

KTabController.compile = function(data_obj, tab_obj) {
  var kpage       = new KPage.find({ id: data_obj.page_id })[0];
  response        = {}

  if(kpage) {
    response.data   = {
      page_title: kpage.page_title,
      definition: kpage.toParams(true)
    };
    response.status   = "success";

  } else {
    response.err_msg  = "KPage does not exist";
    response.status   = "error";        
  }

  return response;

}

/** Export for node testing **/
try { 
  module && (module.exports = KTabController); 
} catch(e){}