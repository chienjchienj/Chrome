var TabView = Backbone.View.extend({

  el: "body",

  initialize: function() {
    var self      = this;
    self.tab      = new Tab();
    self.page     = new Page();
    self.columns   = new Columns();

    promise_tab   = self.tab.load();
    promise_page  = self.page.load();
    promise_cols  = self.columns.fetch();

    $.when(promise_tab, promise_page, promise_cols).then(
      function() {
        if(self.tab.get('active')) self.activate();
      }, 
      function(){
        console.log("Combine failed");
        console.log(arguments);
      }
    )
  },

  render: function() {
    var self = this;
    self.sidebar_view = new SideBarView();
    self.sidebar_view.tab = self;
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