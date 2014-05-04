var SideBarView = Backbone.View.extend({

  className: "getdata-sidebar",

  events : {
    "click #add_columns": "addColumn"
  },

  initialize: function() {
    var self     = this;
    self.columns = new Columns();
    self.columns.fetch({
      success: function(results) {}, 
      error: function(error) {}
    });

  },

  render: function() {
    var self = this;
    self.$el.width(CONFIG["sidebar_width"]);
    self.$el.height($(window).height());
    self.$el.html(self.template());
  },

  addColumn: function() {
    var self = this;
    self.columns.newColumn(function() {

    })
    
  },

  template: function() {
    return Application.templates['sidebar'];
  }
});