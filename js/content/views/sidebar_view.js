var SideBarView = Backbone.View.extend({

  className: "getdata-sidebar",

  events : {
    "click #add_columns": "addColumn"
  },

  initialize: function(tab) {
    var self        = this;
    self.parent_tab = tab;
    self.columns    = new Columns();    
    $(window).on("resize", function() {
      self.resize();
    });
  },

  render: function() {
    var self = this;
    self.$el.html(self.template());
    self.resize();
    self.renderColumns();

  },

  resize: function() {
    console.log("Resizing");
    var self = this;
    self.$el.width(CONFIG["sidebar_width"]);
    self.$el.height(window.innerHeight);    
    
    var raw_cols_height = self.$el.height() - 103;
    var computed_col_height = raw_cols_height - (raw_cols_height % 30) + 2;
    self.$el.find("#columns").height(computed_col_height);
  },

  renderColumns: function() {
    var self = this;
    self.$el.find("#columns").html("");
    self.columns.fetch({
      success: function() {
        self.columns.models.forEach(function(col) {
          var col_html = Application.templates['column']( col.forTemplate() );
          self.$el.find("#columns").append( col_html);
        })
      }
    });
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