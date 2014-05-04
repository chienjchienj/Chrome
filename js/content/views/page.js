var Page = Backbone.View.extend({

  el: "body",

  initialize: function() {
    
  },

  render: function() {
    var self = this;
    self.sidebar = new SideBar();    
    self.sidebar.render();
  },

  activate: function() {
    var self = this;
    self.render();
    $("body").css({ paddingLeft: CONFIG["sidebar_width"] });    
    $("body").append(self.sidebar.el);
  },

  deactivate: function() {
    var self = this;    
    $("body").css({ paddingLeft: "0px" });
    $("body .getdata-sidebar").remove();
  }

});