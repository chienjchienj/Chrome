var SideBar = Backbone.View.extend({

  className: "getdata-sidebar",

  events : {
    "click #add_columns": "addColumn"
  },

  render: function() {
    var self = this;
    self.$el.width(CONFIG["sidebar_width"]);
    self.$el.height($(window).height());
    self.$el.html(self.template());
  },

  addColumn: function() {
    var someThing = new Column();
    
  },

  renderColumns: function() {
    var self = this;
    Columns.fetch().success(function(results) {
      self.$el.find("#columns").html(self.template(results));
    })
  },

  template: function() {
    console.log(Application);
    return Application.templates['sidebar'];
  }
});