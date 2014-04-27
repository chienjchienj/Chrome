/** Node environmental dependencies **/
try { var KColumn = require('./kcolumn'); } catch(e) {}
try { var KPagination = require('./kpagination'); } catch(e) {}

/**
  Constructor: Instantiates a new page Instance if it not already exist. Returns the existing one otherwise

  Params: 
    origin_url:String
    window_id:Integer
    parent_url:String
    parent_column_id:String
    page_title:String

  Return:
    page:KPage

**/ 
var KPage = function(origin_url, window_id, parent_url, parent_column_id, page_title) { 

  pages = KPage.find({ origin_url: origin_url, window_id: window_id });
  if(pages.length > 0) return pages[0];
  
  var self = this;
  self.id                   = KPage.getId();
  self.origin_url           = origin_url;
  self.window_id            = window_id;
  self.parent_url           = parent_url;
  self.parent_column_id     = parent_column_id;
  self.page_title           = page_title;
  KPage.instances.push(self);

};

/** Class level methods **/

/** page instances **/
KPage.instances = [];

/** Generates a unique id for a new KPage **/
KPage.getId = function() {
  return KPage.instances.length + 1;
};

/**
  Static: Finds and returns a page object

  Params: 
    param:Hash
      origin_url:String
      window_id:Integer

  Return:
    page:KPage
**/
KPage.find = function(param) {
  param = param || {};
  return KPage.instances.filter(function(obj) {
    to_return = true;
    Object.keys(param).forEach(function(attr) {
      to_return &= param[attr] == obj[attr];
    });
    return to_return;
  });
};

/**
  clears all the page instances from memory
**/
KPage.reset = function() {
  KPage.instances = [];
};

/**
  Returns true if page has parent, false otherwise
**/
KPage.prototype.hasParent = function() {
  var self = this;
  return !!self.parent_url;
};

/**
  Returns the parent page object or false
**/
KPage.prototype.parent = function() {
  var self = this;
  if(!self.parent_url) {
    return false;

  } else {
    return KPage.find({ origin_url: self.parent_url, window_id: self.window_id })[0];

  }
  
};

/**
  Returns child pages of current page object
**/ 
KPage.prototype.children = function() {
  var self = this;
  return KPage.find({ parent_url: self.origin_url, window_id: self.window_id });  
};

/** Returns the most ancient of pages that is ancestor of this page that has not parent **/
KPage.prototype.root = function() {
  var self = this;
  var current_page = this;
  while(current_page.hasParent()) {
    current_page = current_page.parent();
  }
  return current_page;
};


/** 
  Returns a column object
**/
KPage.prototype.newKColumn = function() {
  var self = this;
  return new KColumn(self.id);
};


/** Returns all the columns belonging to this KPage **/
KPage.prototype.kcolumns = function() {
  var self = this;
  return KColumn.find({page_id: self.id});
}

KPage.prototype.kpaginationIsSet = function() {
  var self = this;
  return KPagination.find({page_id: self.id}).length > 0 && KPagination.find({page_id: self.id})[0].isSet();
}

/** Returns true if Kcolumns have been set for this KPage **/
KPage.prototype.kcolumnsIsSet = function() {
  var self = this;
  return KColumn.find({page_id: self.id}).length > 0;
}

/**
  Returns the JSON partial for the data definition schema

  Params:
    include_url: Boolean

  Returns:
    options_object: https://getdata.io/docs/define-data#options_object

**/
KPage.prototype.toParams = function(include_url) {
  var self = this;

  var partial = {};
  if(self.kcolumnsIsSet())      partial.columns = self.kcolumnsToParams();  
  else return false;

  if(include_url)               partial.origin_url = self.origin_url;
  if(self.kpaginationIsSet())   partial.next_page = self.kpaginationToParams();
  return partial;
}

KPage.prototype.kpaginationToParams = function() {
  var self = this;
  var paginations = KPagination.find({ page_id: self.id });
  if(paginations.length > 0) return paginations[0].toParams();
}

/**
  Returns the JSON partial for the data definition schema

  Returns:
    columns_object: https://getdata.io/docs/define-data#columns

**/
KPage.prototype.kcolumnsToParams = function() {
  var self = this;
  return self.kcolumns().map(function(kcolumn) {
    var col_partial = kcolumn.toParams();
    var child_pages = KPage.find({ parent_column_id: kcolumn.id });

    if(child_pages.length > 0) {
      var child_page = child_pages[0];
      if(col_partial.required_attribute == 'href' || col_partial.required_attribute == 'src' ) {
        col_partial.options = child_page.toParams();
      } else {
        col_partial.options = child_page.toParams(true);  
      }
    }
    return col_partial;

  });
}



/**
  Export module for use in NodeJs
**/
try { 
  module && (module.exports = { 
    KPage:        KPage, 
    KColumn:      KColumn,
    KPagination:  KPagination
  }); 
} catch(e){}