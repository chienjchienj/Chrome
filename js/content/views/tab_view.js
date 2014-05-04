var TabView = Backbone.View.extend({

  el: "body",

  initialize: function() {
    var self  = this;
    self.tab  = new Tab();
    self.page = new Page();
    promise1 = self.tab.load();
    promise2 = self.page.load();
    promise2.fail(function(err_msg) {
      console.log("Promised Failed");
    });

    promise2.done(function(data){
      console.log("Promised Done");
    });
  },

  render: function() {
    var self = this;
    self.sidebar_view = new SideBarView();    
    self.sidebar_view.render();
  },

  activate: function() {
    var self = this;
    self.render();
    $("body").css({ paddingLeft: CONFIG["sidebar_width"] });    
    $("body").append(self.sidebar_view.el);
  },

  deactivate: function() {
    var self = this;    
    $("body").css({ paddingLeft: "0px" });
    $("body .getdata-sidebar").remove();
  }

});