var PaginationView = Backbone.View.extend({
  id: "add_pagination",

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
      "clickedOnSelectableDom"
      );

    self.parent_view  = opts.parent_view;
    self.model        = new Pagination();
    var promise = self.model.load();
    $.when(promise).then( self.render , self.errorHandler );    

  },

  render: function() {
    var self = this;
    console.log("Rendering pagination button");
    if(self.model.isSet()) {
      self.displayPaginationSelected();
      self.setState(self.states.SELECTED);

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
        self.setState(self.states.SELECTING)
        self.displayPaginationSelecting();
        self.startPaginationListener();
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
        break;
    }
  },  

  destroy: function() {
    var self = this;
    self.stopPaginationListener();
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
  },

  /**

  **/
  setPagination: function(dom) {
    var self = this;
  },

  unsetPagination: function() {

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
  }

});