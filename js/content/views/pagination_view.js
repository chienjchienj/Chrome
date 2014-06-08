var PaginationView = Backbone.View.extend({

  events : {
    "click": "clickedPaginationButton"
  },

  states: {
    DORMANT:    "dormant", 
    SELECTING:  "selecting", 
    SELECTED:   "selected"
  },


  /** 
    Class Names that prevents elements from being selected by our mouse click events
    The list of css queries describes either these doms, their direct parents or ancestore further up the DOM tree
  **/
  unselectable_classnames: [ "getdata-sidebar", "getdata-selected_dom" ],

  /** List of all the DOM elements within a HTML Dom that are selectable **/
  selectable_doms: [ 
    "a"
  ],  

  initialize: function(opts) {
    var self = this;

    _.bindAll(self, 
      "render", 
      "mouseOverSelectableDom", 
      "mouseOutSelectableDom", 
      "clickedOnSelectableDom",
      "dressUpSelectedDoms"
      );

    self.parent_view        = opts.parent_view;
    self.$el                = self.parent_view.$el.find("#add_pagination");
    self.model              = new Pagination();
    self.selected_dom_view  = false;
    var promise = self.model.load();
    $.when(promise).then( self.render , self.errorHandler );    

  },

  render: function() {
    var self = this;
    console.log("Rendering pagination button");
    if(self.model.isSet()) {
      self.displayPaginationSelected();
      self.setState(self.states.SELECTED);
      self.dressUpSelectedDoms();

    } else {
      self.displayPaginationDormant();
      self.setState(self.states.DORMANT);

    }
  },

  clickedPaginationButton: function(e) {
    var self = this;
    self.parent_view.deactivateSubViews([], true);

    switch(self.getState()) {
      case self.states.DORMANT:
        if(self.hasSelectableDoms()) {
          self.setState(self.states.SELECTING)
          self.displayPaginationSelecting();
          self.startPaginationListener();

        } else {
          alert("Warning: Page does not seem to contain any hyperlink elements.");
        }

        break;

      case self.states.SELECTING: 
        self.setState(self.states.DORMANT);
        self.displayPaginationDormant();
        self.stopPaginationListener();
        break;

      case self.states.SELECTED: 
        self.setState(self.states.DORMANT);
        self.displayPaginationDormant();
        self.unsetPagination();
        self.undressSelectedDoms();
        break;
    }
  },  

  destroy: function() {
    var self = this;
    self.stopPaginationListener();
    self.undressSelectedDoms();
    self.remove();
  },

  deactivate: function() {
    var self = this;
    self.stopPaginationListener();

    if(self.model.isSet()) {
      self.setState(self.states.SELECTED);
      self.displayPaginationSelected();

    } else {
      self.setState(self.states.DORMANT);
      self.displayPaginationDormant();
    }

  },

  /**
    Updates the state of this current view
    Params:
      state:String

    Returns Boolean
  **/
  setState: function(state) {
    var self = this;
    var states = _.map(Object.keys(self.states), function(state_key) {
      return self.states[state_key];
    });
    if(_.contains(self.states, state)) {
      self.state = state;
      return true;
    }
    return false;
  },

  getState: function() {
    var self = this;
    return self.state;
  },

  getSelectableColor: function() {
    var self = this;
    return "rgb(25, 25, 25, 0.5)";
  },

  getSelectedColor: function() {
    var self = this;
    return "rgb(25, 25, 25, 0.5)";
  },  

  errorHandler: function() {
    console.log("loading pagination button view failed")
  },

  hidePaginationButton: function() {
    var self = this;
    self.$el.find("#add_pagination").hide();
  },

  displayPaginationDormant: function() {
    var self = this;
    self.$el.show();
    self.$el.removeClass("selected");
    self.$el.removeClass("selecting");
    self.$el.addClass("dormant");
    self.$el.html("Add Pagination");
  },

  displayPaginationSelecting: function() {
    var self = this;
    self.$el.show();
    self.$el.removeClass("selected");
    self.$el.removeClass("dormant");
    self.$el.addClass("selecting");
    self.$el.html("Select Pagination");
  },

  displayPaginationSelected: function() {
    var self = this;
    self.$el.show();
    self.$el.addClass("selected");
    self.$el.removeClass("dormant");
    self.$el.removeClass("selecting");    
    self.$el.html("Remove Pagination");
  },

  /**
    Returns true if there are Doms elements on the page that can be selected
  **/
  hasSelectableDoms: function() {
    var self = this;
    return self.selectableDoms().length > 0
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
    var dom  = e.currentTarget;

    self.clearMouseOverDom(dom);
    self.setState(self.states.SELECTED);
    self.displayPaginationSelected();
    self.stopPaginationListener();
    self.setPagination(dom);
  },

  startPaginationListener: function() {
    var self  = this;
    $doms     = self.selectableDoms();    
    $doms.bind("mouseover", self.mouseOverSelectableDom);
    $doms.bind("mouseout",  self.mouseOutSelectableDom);
    $doms.bind("click",     self.clickedOnSelectableDom);
  },

  stopPaginationListener: function() {
    var self  = this;    
    $doms = self.selectableDoms();
    $doms.unbind("mouseover", self.mouseOverSelectableDom);
    $doms.unbind("mouseout",  self.mouseOutSelectableDom);
    $doms.unbind("click",     self.clickedOnSelectableDom);    
  },

  unsetPagination: function() {
    var self = this;
    self.model.set("dom_array", []);
    self.model.save();
  },

  /**
    Saves the DOM array
  **/
  setPagination: function(dom) {
    var self = this;
    var dom_array = self.calculateNewDomArray(dom);
    self.model.set("dom_array", dom_array);
    var promise = self.model.save();
    $.when(promise).then( self.dressUpSelectedDoms, self.errorHandler );
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
      self.selected_dom_view = sdv;
    });
  },

  /**
    Checks if dom is already selected and has a corresponding selected_dom_view
  **/
  selectedDomAlreadyDressedUp: function(dom) {
    var self = this;
    return self.selected_dom_view && self.selected_dom_view.isSameDom(dom);
  },  

  /**
    Removes the styling of selected dom when activate happens
  **/
  undressSelectedDoms: function() {
    var self = this;
    self.selected_dom_view && self.selected_dom_view.destroy();
    self.selected_dom_view = false;
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
      var contains        = self.calculateContains(curr_dom);
      if(contains) curr_hash.contains = contains;

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
  calculateContains: function(dom) {
    if(dom.nodeName == 'A') return dom.innerText.trim()
    return false;
  }  


});