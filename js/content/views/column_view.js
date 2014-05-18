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
    Class Names that prevents elements from being selected by our mouse click events
    The list of css queries describes either these doms, their direct parents or ancestore further up the DOM tree
  **/
  unselectable_classnames: [ "getdata-sidebar" ],

  /** List of all the DOM elements within a HTML Dom that are selectable **/
  selectable_doms: [ 
    "h1", "h2", "h3", "h4", "h5", "h6", 
    "p", "img", "a", 
    "span:not(:has(span))", 
    "div:not(:has(div))", 
    "td:not(:has(td))"
  ],


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
    var self = this;
    var disallowed_keycodes = Object.keys(self.disabled_keycodes).map(function(key){
      return self.disabled_keycodes[key];
    });

    if(disallowed_keycodes.indexOf(e.keyCode) != -1 ) e.preventDefault();
  },

  updateColName: function(e) {
    var self = this;
    if(self.$el.find('.col-name')[0].innerText.length == 0) return;
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
      self.model.set("col_name", self.defaultColName());
      self.model.save();
      self.setColName(self.defaultColName());      
    }
    self.model.save();
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
      case self.states.not_page:
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
    var self = this;
    if(!self.belongsToCurrentPage()) {
      return self.states.not_page;

    } else if(!self.hasDomsSelected()) {
      return self.states.fresh;

    } else if(self.hasDomRecommendations()) {
      return self.states.recommends;

    } else if(!self.hasDomRecommendations()) {
      return self.states.fixed;

    }
  },

  belongsToCurrentPage: function() {
    var self = this;
    return self.model.belongsToPage(self.parent_view.pageId())
  },

  hasDomsSelected: function() {
    var self = this;
    return self.model.domArrayNotEmpty();
  },

  hasDomRecommendations: function() {
    var self = this;
    return self.model.hasRecommendations();
  },

  /** 
    Redirects this window to the page this view's column model belongs to
  **/
  redirectToParentPage: function() {
    var self = this;    
    console.log("Redirecting to column_id: %s, page_id: %s", 
      self.model.id, self.model.get('page_id') );
    Env.redirect(self.model.get("page_url"));
  },

  /**
    Returns a list of DOMs that can be included for harvesting 
    on this page

    Returns:
      [dom1, dom2, dom3,...]
  **/
  selectableDoms: function() {
    var self = this;
    var sds  = self.selectable_doms.join(" , ");

    $sds = $(sds).filter(function(index, dom) {
      if(self.isUnselectable(dom)) return false;
      $(dom).attr("org-bkg-color", $(dom).css( "background-color"));
      return true;
    });

    return $sds;
  },

  /**
    Determines if a selected element cannot be selected

    Returns: Boolean
      true if dom cannot be selected
  **/
  isUnselectable: function(dom) {
    var self = this;
    var unselectable = false;
    var $dom = $(dom);

    self.unselectable_classnames.forEach(function(u_dom) {
      if($dom.hasClass(u_dom)) unselectable = true;
      if($dom.parents("." + u_dom).length > 0) unselectable = true;
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
    var dom = e.currentTarget;
    $(dom).css("background-color", self.getSelectableColor());
    $(dom).attr("getdata_color", self.getSelectableColor());
    e.stopPropagation();

  },

  /** 
    Reverts a temporarily modified DOM element after the mouse has left
  **/
  mouseOutSelectableDom: function(e) {
    var self = this;
    var dom = e.currentTarget;
    $(dom).css("background-color",$(dom).attr("org-bkg-color"));
    $(dom).removeAttr("getdata_color");
    e.stopPropagation();
  },

  /**
    Converts the yet-selected selectable DOM element into a post selected state
    if Dom is already selected or recommended ignore
  **/
  clickedOnSelectableDom: function(e) {
    var self          = this;
    self.getAndMergeNewDomArray(e.currentTarget);
    e.stopPropagation();
  },

  getAndMergeNewDomArray: function(dom) {
    var self          = this;
    var new_dom_array = self.calculateNewDomArray(dom);
    var promise       = self.model.mergeInNewSelections(new_dom_array);
    $.when(promise).then(
      function() {
        console.log("Gonna dress up the selected and recommended DOMs");
        self.dressUpSelectedDoms();
        self.dressUpRecommendedDoms();
      },
      function() {
        console.log("Gonna create a new column with the given new_dom_array");
        self.setDomArrayToNewColumn(new_dom_array);
      }
    );
  },

  /**
    Called when newly selected dom_array cannot be merged to current 
    column's dom_array

    Creates a new Column and sets the new dom_array to it and focuses on it

  **/
  setDomArrayToNewColumn: function(dom_array) {
    var self = this;
    self.parent_view.addColumn({
      dom_array: dom_array
    });
  },  

  /**
    Generates the dom array that uniquely describes this dom element given 

    Returns Array
  **/
  calculateNewDomArray: function(dom) {
    var self = this;

    var new_dom_array = [];
    var curr_dom      = dom;
    var max_depth     = 5;
    var curr_depth    = 0;

    do {
      var curr_hash       = {};
      curr_hash.el        = curr_dom.nodeName.toLowerCase();
      curr_hash.class     = curr_dom.className;
      curr_hash.id        = curr_dom.id;
      if(curr_hash.el != "body") curr_hash.position  = self.calculatePositionInLevel(curr_dom);
      curr_depth          += 1;
      new_dom_array.unshift(curr_hash);

    } while(
      (curr_dom = curr_dom.parentElement) && 
      curr_depth < max_depth &&
      curr_dom &&
      curr_dom.nodeName.toLowerCase() != "html"
    );

    return new_dom_array;

  },

  /**
    Calculating the current position of the element in relation to its siblings.
    Discounting the text nodes from this calculation

    Returns Integer
  **/
  calculatePositionInLevel: function(dom) {
    var curr_dom = dom;
    var curr_pos = 1;
    while(curr_dom = curr_dom.previousSibling) {
      if(curr_dom.nodeName != "#text") curr_pos += 1;
    };
    return curr_pos;
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

  /**
    Gets the color encoding for the selectable DOMs

    Returns String
  **/
  getSelectableColor: function() {
    var self = this;
    return self.model.getColor("selecting");
  },

  /***
    Gets the color encoding for the recommended DOMs

    Returns String
  ***/
  getRecommendedColor: function() {
    return self.model.getColor("recommending");
  },

  /***
    Gets the color encoding for the selected DOMs
    
    Returns String
  ***/
  getSelectedColor: function() {
    return self.model.getColor("selected");
  },

  template: function() {
    return Application.templates['column'];
  }
});