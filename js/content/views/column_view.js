var ColumnView = Backbone.View.extend({

  className: "column",

  events: {
    "keypress .col-name"  : "validateColName",
    "keyup .col-name"     : "updateColName",
    "focus .col-name"     : "focusColName",
    "focusout .col-name"  : "unfocusColName",
    "click"               : "activate"
  },

  /** 
    Dom elements that cannot be selected by our mouse click events
    The list of css queries describes either these doms, their direct parents or ancestore further up the DOM tree
  **/
  unselectable_doms: [ ".getdata-sidebar" ],

  /** List of all the DOM elements within a HTML Dom that are selectable **/
  selectable_doms: [ "h1", "h2", "h3", "h4", "h5", "h6", "span", "p", "div", "td", "img", "a" ],

  /** 
    List of all the dom overlays that are recommended for addition to the existing set of DOMs. 
  **/
  recommended_doms: [],

  /** List of all the dom overlays rendered on the current page  **/
  selected_dom_views: [],

  /** List of characters that are not allowed for use in col_names **/
  disabled_keycodes : {
    break_line: 13,
    single_quote: 39,
    double_quote: 34,
    back_slash: 92
  },

  states: {
    not_page:   "other_page",           // When the column does not belong to this page
    fresh:      "fresh",                // When no DOM elements have been selected for this column
    recommends: "showing_recommends",   // When the initial DOM elements have already been selected and we have more to recommended
    fixed:      "fixed"                 // When all recommended permutations have been exhausted for column    
  },

  /**
    Constructor

    Params:
      opts:Hash
        model:Column
        parent_view:SideBarView

    Returns:
      ColumnView

  **/
  initialize: function(opts) {
    var self          = this;
    self.model        = opts.model;
    self.parent_view  = opts.parent_view;
    self.render();
    _.bindAll(self, "mouseOverSelectableDom", "mouseOutSelectableDom", "clickedOnSelectableDom", "clickedRecommendedDomAdd");

    if(self.model.get("is_active")) self.activate();

  },

  render: function() {
    var self      = this;
    var data      = self.model.forTemplate();
    var template  = self.template();
    self.$el.html(template(data));
    return self;
  },

  validateColName: function(e) {
    console.log("Validating column name");
    var self = this;
    var disallowed_keycodes = Object.keys(self.disabled_keycodes).map(function(key){
      return self.disabled_keycodes[key];
    });

    if(disallowed_keycodes.indexOf(e.keyCode) != -1 ) e.preventDefault();
  },

  updateColName: function(e) {
    console.log("Saving column name");
    var self = this;
    self.model.set("col_name", self.$el.find('.col-name')[0].innerText);
    console.log("Saving : %s", self.$el.find('.col-name')[0].innerText)
    self.model.save();    
  },


  defaultColName: function() {
    var self = this;     
    return "Property " + self.model.id;
  },

  getColName: function() {
    var self = this;
    return self.$el.find(".col-name").html();
  },

  setColName: function(col_name) {
    var self = this;
    return self.$el.find(".col-name").html(col_name);
  },  

  focusColName: function(e) {
    var self = this; 
    if( self.getColName() == self.defaultColName() ) {
      self.setColName("");
    }
  },

  unfocusColName: function(e) {
    var self = this;
    if( self.getColName().trim().length == 0 ) {
      self.setColName(self.defaultColName());
    }
    self.model.save();
  },

  belongsToCurrentPage: function() {
    var self = this;
    return self.model.get("page_id") == self.parent_view.pageId();
  },

  /**
    Called when this column starts being the active column. Note: There can only be one active column per Tab
  **/
  activate: function(e) {
    var self = this;
    self.parent_view.deactivateColumnViews([self.model.id]);
    self.model.set("is_active", true);
    self.model.save();

    switch(self.getState()) {
      case self.states.no_page:
        self.redirectToParentPage();
        break;

      case self.states.fresh:
        self.spyOnMouseStart();
        break;

      case self.states.recommends:
        self.spyOnMouseStart();
        self.dressUpRecommendedDoms();
        self.dressUpSelectedDoms();
        break;

      case self.states.fixed:
        self.spyOnMouseStart();      
        self.dressUpSelectedDoms();      
        break;
    }
    
  },

  /**
    Called when this column stops being the active column for this page. Note: There can only be one active column per Tab
  **/
  deactivate: function() {
    var self = this;
    self.model.set("is_active", false);
    self.model.save();
    self.spyOnMouseStop();
    self.undressSelectedDoms();
    self.undressRecommendedDoms();
  },

  /**
    When the extension get deactivated : Removes all the selected_dom and recommended_dom overlays
  **/
  destroy: function() {
    var self = this;
    self.recommended_doms_views.forEach(function(dom) {
      dom.remove();
    });

    self.selected_doms_views.forEach(function(dom) {
      dom.remove();
    });

    self.spyOnMouseStop();
  },

  /**
    Checks the current state this view is in

    returns
  **/
  getState: function() {
    
  },

  /** 
    Redirects this window to the page this view's column model belongs to
  **/
  redirectToParentPage: function() {

  },

  /** 
    Fetches the Page this View's Column model object belong to

    Params:
      callback

    Returns:
      Promise
  **/
  fetchParentPage: function(callback) {

  },

  selectableDoms: function() {
    var self = this;
    var sds  = self.selectable_doms.join(" , ");
    return $(sds);
  },

  isUnselectable: function(dom) {
    var self = this;
    var unselectable = false;
    var $dom = $(dom);

    self.unselectable_doms.forEach(function(u_dom) {
      if($dom.hasClass(u_dom)) unselectable = true;
      if($dom.parents(u_dom).length > 0) unselectable = true;
    });

    return unselectable;
  },

  /** 
    Method is called to get 
  **/
  spyOnMouseStart: function() {
    var self  = this;
    $doms     = self.selectableDoms();
    $doms.bind("mouseenter", self.mouseOverSelectableDom);
    $doms.bind("mouseleave", self.mouseOutSelectableDom);
    $doms.bind("click",      self.clickedOnSelectableDom);    
  },

  spyOnMouseStop: function() {
    var self  = this;    
    $doms = self.selectableDoms();
    $doms.unbind("mouseenter", self.mouseOverSelectableDom);
    $doms.unbind("mouseleave", self.mouseOutSelectableDom);
    $doms.unbind("click",      self.clickedOnSelectableDom);    
  },

  /** 
    Changes the background color of the DOM element when mouses of a yet-selected selectable DOM element
  **/
  mouseOverSelectableDom: function(e) {
    var self = this;
    if(self.isUnselectable(e.currentTarget)) return;

    console.log("Mouse over selectable dom detected by Column View: ", self.model.id);
    console.log(e.currentTarget);
    console.log("\n\n");
    e.stopPropagation();
    // console.log("Mouse over element was listened by Column View: ", self.model.id);
  },

  /** 
    Reverts a temporarily modified DOM element after the mouse has left
  **/
  mouseOutSelectableDom: function(e) {
    var self = this;
    if(self.isUnselectable(e.currentTarget)) return;

    console.log("Mouse out selectable dom detected by Column View: ", self.model.id);
    console.log(e.currentTarget);
    console.log("\n\n");
    e.stopPropagation();
  },

  /**
    Converts the yet-selected selectable DOM element into a post selected state
    if Dom is already selected or recommended ignore
  **/
  clickedOnSelectableDom: function(e) {
    var self = this;
    if(self.isUnselectable(e.currentTarget)) return;
    
    console.log("CLicked on selectable dom detected by Column View: ", self.model.id);
    console.log(e.currentTarget);
    console.log("\n\n");
    e.stopPropagation();
  },

  /**
    styles selected dom when activate happens
  **/
  dressUpSelectedDoms: function() {
    
  },

  /**
    Removes the styling of selected dom when activate happens
  **/
  undressSelectedDoms: function() {

  },

  /**
    styles recommendd dom  when activate happens
  **/
  dressUpRecommendedDoms: function() {

  },

  /**
    Removes the styling of recommended dom when deactivate happens
  **/
  undressRecommendedDoms: function() {

  },

  /**
    Adds the recommended DOM element to the Column it was recommended for
  **/
  clickedRecommendedDomAdd: function(e) {

  },

  /**
    Discards the recommended DOM element from the Column prevents it from being displayed again.
  **/
  clickedRecommendedDomDiscard: function(e) {

  },  

  template: function() {
    return Application.templates['column'];
  }
});