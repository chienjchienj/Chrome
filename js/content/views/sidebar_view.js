var SideBarView = Backbone.View.extend({

  className: "getdata-sidebar",

  events : {
    "click #add_columns": "addColumnEvent",
    "click #save_holder": "dispatchTabEvent",
  },

  column_views: [],

  initialize: function() {
    var self            = this;
    self.columns        = new Columns();

    _.bindAll(self, "newColumnCreated", "newColumnSaved", "onResize", "renderColumnViews");
    $(window).on("resize", self.onResize);    
  },

  /**
    Removes this view and all its sub elements
    Called when the extension get deactivated    
  **/
  destroy: function() {
    var self = this;
    self.destroySubViews();
    self.remove();
  },

  /**
    Removing all the column views belonging to this view
  **/
  destroySubViews: function() {
    var self = this;
    self.column_views.forEach(function(col_view) {
      col_view.destroy();
    });
    self.paginationView.destroy();    
  },

  /**
    Event listener that handles new column adding events
  **/
  addColumnEvent: function(e) {
    var self = this;
    self.addColumn();
  },

  /**
    Event listener that handles saving of what has already been defined
  **/
  dispatchTabEvent: function(e) {
    var self = this;
    self.parent_tab.dispatch();
  },

  /**
    Deactivates all column views

    Params:
      exempted_model_ids:Array[Integer]
      exempt_pagination:Boolean
  **/
  deactivateSubViews: function(exempted_model_ids, exempt_pagination) {
    var self = this;
    self.column_views.forEach(function(col_view) {
      if( !self.columnViewIsExempted(exempted_model_ids, col_view) ) {
        col_view.deactivate(); 
      }
    });

    if(!exempt_pagination) {
      self.paginationView.deactivate();
    }
  },

  columnViewIsExempted: function(exempted_model_ids, view_obj) {
    var self = this;
    exempted_model_ids = exempted_model_ids || [];
    return exempted_model_ids.indexOf(view_obj.model.id) != -1
  },

  setParentTab: function(tab_obj) {
    var self = this;
    self.parent_tab = tab_obj;    
  },

  getPage: function() {
    var self = this;
    return self.parent_tab.page;
  },

  /** Gets the ID of current Tab Model **/
  tabId: function() {
    var self = this;
    return self.parent_tab.tabId();
  },

  /** Gets the ID this current Page Model - Each URL within this Tab has a unique Page ID **/
  pageId: function() {
    var self = this;
    return self.parent_tab.pageId();
  },  

  onResize: function() {
    var self = this;
    self.$el.width(CONFIG["sidebar_width"]);
    self.$el.height(window.innerHeight);    
    
    var dimension           = {
      buffer              : 33,
      header              : 45,
      bottom_butt_holder  : 20,
      pagination_button   : 25,
      done_button         : 25,
      top_butt_holder     : 20,
      add_button          : 25
    };

    var raw_cols_height     = self.$el.height();
    for(var key in dimension) {
      raw_cols_height -= dimension[key];
    }

    // var computed_col_height = raw_cols_height - (raw_cols_height % 30) + 2;
    self.$el.find("#columns").height(raw_cols_height);
  },

  render: function() {
    var self = this;
    self.$el.html(self.template());
    self.loadColumns();
    self.renderPaginationSection();
    self.onResize();    
    return self;
  },

  renderPaginationSection: function() {
    var self = this;    
    self.paginationView = new PaginationView({
      parent_view: self
    });
    // self.$el.find("#pagination_holder").append(self.paginationView.$el);
  },  

  /**
    Renders the Column Views
  **/ 
  renderColumnViews: function() {
    var self = this;
    self.column_views = [];
    self.columns.models.forEach(function(col) {
      var col_view = new ColumnView({
        model: col,
        parent_view: self
      });
      self.$el.find("#columns").append( col_view.$el );
      self.column_views.push(col_view);
    });
    self.addFirstColumn();    
  },

  /**
    Loads the Column records from the background repository
  **/
  loadColumns: function() {
    var self = this;
    self.$el.find("#columns").html("");
    self.columns.fetch({
      data: {
        tab_id: self.parent_tab.tabId(),
        page_id: self.parent_tab.pageId()
      },
      success: self.renderColumnViews
    });
  },

  addFirstColumn: function() {
    var self = this;
    if(!self.currentPageHasColumns()) {
      self.addColumn(); 
    }
  },

  currentPageHasColumns: function() {
    var self = this;
    return self.columns.forPage(self.parent_tab.pageId()).length > 0;
  },

  addColumn: function(preset_attributes) {
    var self = this;
    self.deactivateSubViews();

    // When adding a brand new column
    if(!preset_attributes) {
      self.columns.newColumn( self.newColumnCreated, self.errorHandler ); 

    // When adding a new column that has some attributes already preset
    } else {
      self.columns.newColumn( function(new_col) {
        self.newColumnCreated(new_col, preset_attributes);

      } , self.errorHandler ); 
    }
  },  

  newColumnCreated: function(new_col, preset_attributes) {
    var self = this;
    new_col.set("is_active", true);
    if(preset_attributes) {
      Object.keys(preset_attributes).forEach(function(attribute) {
        new_col.set(attribute, preset_attributes[attribute]);
      });
    }
    $.when(new_col.save()).then( function() {
      self.newColumnSaved(new_col);
      
    } , self.errorHandler );
  },

  newColumnSaved: function(saved_col) {
    var self = this;
    var col_view = new ColumnView({
      model: saved_col,
      parent_view: self
    });
    self.$el.find("#columns").append( col_view.$el );
    self.column_views.push(col_view);    
  },

  errorHandler:  function(err_msg) {
    console.log("An error has occurred: %s", err_msg);
  },

  template: function() {
    return Application.templates['sidebar'];
  }
});