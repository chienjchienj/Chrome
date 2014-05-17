var SideBarView = Backbone.View.extend({

  className: "getdata-sidebar",

  events : {
    "click #add_columns": "addColumn"
  },

  column_views: [],

  initialize: function() {
    var self      = this;
    self.columns  = new Columns();
    _.bindAll(self, "newColumnCreated", "newColumnSaved", "onResize");

    $(window).on("resize", self.onResize);    
  },

  deactivateColumnViews: function(exempted_model_ids) {
    var self = this;
  
    self.column_views.forEach(function(col_view) {
      if( !self.columnViewIsExempted(exempted_model_ids, col_view) ) {
        col_view.deactivate(); 
      }
    });
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
    
    var raw_cols_height = self.$el.height() - 103;
    var computed_col_height = raw_cols_height - (raw_cols_height % 30) + 2;
    self.$el.find("#columns").height(computed_col_height);
  },

  render: function() {
    var self = this;
    self.$el.html(self.template());
    self.onResize();
    self.renderColumns();
    return self;
  },

  renderColumns: function() {
    var self = this;
    self.$el.find("#columns").html("");
    self.columns.fetch({
      data: {
        tab_id: self.parent_tab.tabId()
      },
      success: function() {
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
      }
    });
  },

  addFirstColumn: function() {
    var self = this;
    if(!self.currentPageHasColumns()) self.addColumn();
  },

  currentPageHasColumns: function() {
    var self = this;
    return self.columns.forPage(self.parent_tab.pageId()).length > 0;
  },

  addColumn: function() {
    var self = this;
    self.columns.newColumn( self.newColumnCreated, self.errorHandler );
    
  },

  newColumnCreated: function(new_col) {
    var self = this;
    self.deactivateColumnViews();
    new_col.set("is_active", true);
    $.when(new_col.save()).then( self.newColumnSaved , self.errorHandler );
  },

  newColumnSaved: function(saved_col) {
    var self = this;
    self.renderColumns();
  },

  errorHandler:  function(err_msg) {
    console.log("An error has occurred: %s", err_msg);
  },

  template: function() {
    return Application.templates['sidebar'];
  }
});