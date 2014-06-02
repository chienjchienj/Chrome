var ColumnView = Backbone.View.extend({

  className: "column",

  events: {
    "keypress .col-name"  : "validateColName",
    "keyup .col-name"     : "updateColName",
    "focus .col-name"     : "focusColName",
    "focusout .col-name"  : "unfocusColName",
    "click"               : "clickedColumn"
  },

  /** 
    Class Names that prevents elements from being selected by our mouse click events
    The list of css queries describes either these doms, their direct parents or ancestore further up the DOM tree
  **/
  unselectable_classnames: [ "getdata-sidebar", "getdata-selected_dom" ],

  /** List of all the DOM elements within a HTML Dom that are selectable **/
  selectable_doms: [ 
    "h1", "h2", "h3", "h4", "h5", "h6", 
    "p", "img", "a", 
    "span:not(:has(span))",
    "div:not(:has(div))", 
    "td:not(:has(td))"
  ],

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
    var self                    = this;
    self.model                  = opts.model;
    self.parent_view            = opts.parent_view;
    self.recommended_dom_views  = [];
    self.selected_dom_views     = [];

    self.render();
    _.bindAll(self, 
      "mouseOverSelectableDom", 
      "mouseOutSelectableDom", 
      "clickedOnSelectableDom", 
      "clickedRecommendedDomAdd"
    );

    if(self.model.get("is_active")) {
      self.activate(); 
    }
    if(self.belongsToCurrentPage()) {
      self.$el.addClass('curr_page');
      // self.dressUpSelectedDoms();
    }
      

  },

  render: function() {
    var self      = this;
    var data      = self.model.forTemplate();
    var template  = self.template();
    self.$el.html(template(data));
    self.renderColorSticks();
    self.renderCounter();
    return self;
  },

  renderCounter: function() {
    var self = this;
    var countables = $(self.model.get("dom_query")).filter(function(index, dom) {
      return !self.isUnselectable(dom);
    });

    if(countables.length) {
      var self = this;
      self.$el.find(".counter").html(countables.length);
      self.$el.find(".counter").show();

    } else {
      self.$el.find(".counter").hide();

    }
  },

  renderColorSticks: function() {
    var self = this;
    self.$el.find(".stick-holder").html("");
    _.each (self.model.get("color_sticks"), function(color) {
      var stick = self.renderPaginatedStick(color);
      self.$el
        .find(".stick-holder")
        .append(stick);
      
    });
  },

  renderPaginatedStick: function(color) {
    $stick = $("<div>");
    $stick.addClass("stick-paginated");
    $stick.css("borderLeft", "4px solid " + color.selected);
    return $stick;
  },

  renderNonPaginatedStick: function(color) {
    $stick2 = $("<div>");
    $stick2.addClass("stick-non-paginated");
    $stick.css("background-color", color.selected);
    return $stick;
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
      self.setColName(self.defaultColName());      
    }
    self.model.save();
  },

  clickedColumn: function(e) {
    var self = this;
    if(self.$el.hasClass('active')) return;
    self.activate();
  },

  /**
    Called when this column starts being the active column. Note: There can only be one active column per Tab
  **/
  activate: function() {
    var self = this;

    self.parent_view.deactivateColumnViews([self.model.id]);
    self.model.set("is_active", true);
    self.model.save();
    self.$el.addClass('active');

    switch(self.getState()) {
      case self.states.not_page:
        self.redirectToParentPage();
        break;

      case self.states.fresh:
        self.spyOnMouseStart();
        break;

      case self.states.recommends:
        self.spyOnMouseStart();
        self.dressUpSelectedDoms();
        self.dressUpRecommendedDoms();
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
    self.$el.removeClass('active');
    self.model.save();
    self.spyOnMouseStop();
    self.undressSelectedDoms();
    self.undressRecommendedDoms();
  },

  /**
    Removes this view and all its sub elements
    Called when the extension get deactivated    
  **/
  destroy: function() {
    var self = this;
    self.undressRecommendedDoms();
    self.undressSelectedDoms();
    self.spyOnMouseStop();
    self.remove();  
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
      $(dom).attr("org-outline", $(dom).css( "outline"));
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
    $doms.bind("mouseover", self.mouseOverSelectableDom);
    $doms.bind("mouseout",  self.mouseOutSelectableDom);
    $doms.bind("click",     self.clickedOnSelectableDom);
  },

  spyOnMouseStop: function() {
    var self  = this;    
    $doms = self.selectableDoms();
    $doms.unbind("mouseover", self.mouseOverSelectableDom);
    $doms.unbind("mouseout",  self.mouseOutSelectableDom);
    $doms.unbind("click",     self.clickedOnSelectableDom);    
  },

  /** 
    Changes the background color of the DOM element when mouses of a yet-selected selectable DOM element
  **/
  mouseOverSelectableDom: function(e) {
    e.stopPropagation();

    var self = this;
    var dom = e.currentTarget;
    $(dom).css("background-color", self.getSelectableColor());
    $(dom).css("outline", "solid 2px " + self.getSelectableColor());
    $(dom).attr("getdata_color",   self.getSelectableColor());
  },

  /** 
    Reverts a temporarily modified DOM element after the mouse has left
  **/
  mouseOutSelectableDom: function(e) {
    e.stopPropagation();

    var self = this;
    var dom = e.currentTarget;
    self.clearMouseOverDom(dom);
  },

  /**
    Removes the styling modifications to the DOM element when it is mouseover in selecting mode
  **/
  clearMouseOverDom: function(dom) {
    $(dom).css("background-color",$(dom).attr("org-bkg-color"));
    $(dom).css("outline",$(dom).attr("org-outline"));
    $(dom).removeAttr("getdata_color");
  },

  /**
    Converts the yet-selected selectable DOM element into a post selected state
    if Dom is already selected or recommended ignore
  **/
  clickedOnSelectableDom: function(e) {
    e.preventDefault();    
    e.stopPropagation();

    var self = this;
    var dom  = e.currentTarget
    self.getAndMergeNewDomArray(dom);
    self.clearMouseOverDom(dom);
  },

  getAndMergeNewDomArray: function(dom) {
    var self          = this;
    var new_dom_array = self.calculateNewDomArray(dom);
    var promise       = self.model.mergeInNewSelections(new_dom_array);

    $.when(promise).then(
      function() {
        self.dressUpSelectedDoms();
        self.dressUpRecommendedDoms();
        self.updateDomCountRecord();
        self.renderCounter();
      },
      function() {
        self.deactivate();
        self.setDomArrayToNewColumn(new_dom_array);
      }
    );
  },

  updateDomCountRecord: function() {
    var self = this;
    
    var countables = $(self.model.get("dom_query")).filter(function(index, dom) {
      return self.isUnselectable(dom);
    });

    self.model.set("counter", countables.length);
    self.model.save();
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
      curr_hash.class     = self.calculateClassName(curr_dom);
      curr_hash.id        = self.calculateId(curr_dom);
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
    Computes the well formated class name given a DOM object

    Returns String
  **/
  calculateClassName: function(dom) {
    if(!dom.className || dom.className.length == 0 ) return "";
    
    return dom.className
      .split(" ")
      .map( function(class_name) {
        var class_name = class_name.trim();
        if(class_name.length > 0) return "." + class_name;
        return "";
      })
      .join("");

  },

  /**
    Computes the well formated class name given a DOM object

    Returns String
  **/
  calculateId: function(dom) {
    if(dom.id && dom.id.length > 0) {
      return "#" + dom.id;
    }
    return "";
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
    var self = this;
    var doms = $(self.model.attributes.dom_query);
    _.each(doms, function(dom) {
      if(self.isUnselectable(dom) || self.selectedDomAlreadyDressedUp(dom)) return;

      var sdv = new SelectedDomView({
        dom:    dom,
        color:  self.getSelectedColor()
      });
      self.selected_dom_views.push(sdv);
    });
  },

  /**
    Checks if dom is already selected and has a corresponding selected_dom_view
  **/
  selectedDomAlreadyDressedUp: function(dom) {
    var self = this;
    return self.selected_dom_views.filter(function(curr_sdv){
      return curr_sdv.isSameDom(dom);
    }).length > 0

  },

  /**
    Removes the styling of selected dom when activate happens
  **/
  undressSelectedDoms: function() {
    var self = this;
    _.each(self.selected_dom_views, function(sdv) {
      sdv.destroy();
    });
    self.selected_dom_views = [];
  },

  /**
    styles recommendd dom  when activate happens
  **/
  dressUpRecommendedDoms: function() {
    var self = this;
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
    var self = this;
    return self.model.getColor("recommending");
  },

  /***
    Gets the color encoding for the selected DOMs
    
    Returns String
  ***/
  getSelectedColor: function() {
    var self = this;
    return self.model.getColor("selected");
  },

  template: function() {
    return Application.templates['column'];
  }
});