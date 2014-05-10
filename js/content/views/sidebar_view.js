var SideBarView = Backbone.View.extend({

  className: "getdata-sidebar",

  events : {
    "click #add_columns": "addColumn"
  },

  initialize: function() {
    var self        = this;
    self.columns    = new Columns();
    $(window).on("resize", function() {
      self.onResize();
    });
  },

  setParentTab: function(tab_obj) {
    var self = this;
    self.parent_tab = tab_obj;    
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
        self.columns.models.forEach(function(col) {
          var col_view = new ColumnView(col);
          self.$el.find("#columns").append( col_view.$el );
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
    self.columns.newColumn(
      function() {
        self.renderColumns();
      }, 
      function() {
        console.log("Column adding failed");
      }
    );
    
  },

  template: function() {
    return Application.templates['sidebar'];
  }
});