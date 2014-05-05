var SideBarView = Backbone.View.extend({

  className: "getdata-sidebar",

  events : {
    "click #add_columns": "addColumn"
  },

  initialize: function(tab) {
    var self = this;
  },

  render: function() {
    var self = this;
    self.$el.width(CONFIG["sidebar_width"]);
    self.$el.height($(window).height());
    self.$el.html(self.template());    
    self.renderColumns();

  },

  renderColumns: function() {
    var self = this;
    console.log("Rendering columns");
    console.log(self.tab.columns.models);
    self.tab.columns.models.forEach(function(col) {
      console.log("Rendering column")
      var col_html = Application.templates['column']( col.forTemplate() );
      console.log(col_html)
      self.$el.find("#columns").append( col_html);
    })

  },

  addColumn: function() {
    var self = this;
    self.tab.columns.newColumn(function() {

    })
    
  },

  template: function() {
    return Application.templates['sidebar'];
  }
});