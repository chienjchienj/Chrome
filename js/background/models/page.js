/**
  Constructor: Instantiates a new page Instance if it not already exist. Returns the existing one otherwise

  Params: 
    origin_url:String
    window_id:Integer
    parent_url:String
    parent_column_id:String
    page_title:String

  Return:
    page:Page

**/ 
var Page = function(origin_url, window_id, parent_url, parent_column_id, page_title) { 

  pages = Page.find({ origin_url: origin_url, window_id: window_id });
  if(pages.length > 0) return pages[0];
  
  var self = this;
  self.origin_url       = origin_url;
  self.window_id        = window_id;
  self.parent_url       = parent_url;
  self.parent_column_id = parent_column_id;
  self.page_title       = page_title;
  self.columns          = [];
  Page.instances.push(self);

};

/** Class level methods **/

/** page instances **/
Page.instances = [];

/**
  Static: Finds and returns a page object

  Params: 
    param:Hash
      origin_url:String
      window_id:Integer

  Return:
    page:Page
**/
Page.find = function(param) {
  return Page.instances.filter(function(page) {
    to_return = true;
    Object.keys(param).forEach(function(attribute) {
      to_return &= param[attribute] == page[attribute];
    });
    return to_return;
  });
};

/**
  clears all the page instances from memory
**/
Page.reset = function() {
  Page.instances = [];
};



/**
  Returns true if page has parent, false otherwise
**/
Page.prototype.hasParent = function() {
  var self = this;
  return !!self.parent_url;
};

/**
  Returns the parent page object or false
**/
Page.prototype.parent = function() {
  var self = this;
  if(!self.parent_url) {
    return false;

  } else {
    return Page.find({ origin_url: self.parent_url, window_id: self.window_id })[0];

  }
  
};

/**
  Returns child pages of current page object
**/ 
Page.prototype.children = function() {
  var self = this;
  return Page.find({ parent_url: self.origin_url, window_id: self.window_id });  
};

/** Returns the most ancient of pages that is ancestor of this page that has not parent **/
Page.prototype.root = function() {
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
Page.prototype.newColumn = function() {
  var self = this;
  var column = new Column();
  self.columns.push(column);
}

/** Node environmental dependencies **/
try { var Column = require('./column'); } catch(e) {}
try { module && (module.exports = Page); } catch(e){}