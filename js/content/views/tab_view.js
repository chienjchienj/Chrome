var TabView = Backbone.View.extend({

  el: "body",

  initialize: function() {
    var self      = this;
    self.tab      = new Tab();
    self.page     = new Page();

    promise_tab   = self.tab.load();
    promise_page  = self.page.load();

    $.when(promise_tab, promise_page).then(
      function() {
        if(self.tab.get('active')) self.activate();
      }, 
      function(){
        console.log("Combine failed");
        console.log(arguments);
      }
    );
  },

  render: function() {
    var self = this;
    self.$el.css({ paddingLeft: CONFIG["sidebar_width"] });
    self.sidebar_view = new SideBarView();
    self.sidebar_view.tab = self;
    self.sidebar_view.render();
    self.$el.append(self.sidebar_view.el);    
  },

  activate: function() {
    var self = this;
    self.render();
  },

  deactivate: function() {
    var self = this;    
    self.$el.css({ paddingLeft: "0px" });
    self.$el.find(".getdata-sidebar").remove();
  }

});