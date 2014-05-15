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

  /** Gets the ID of this Tab **/
  tabId: function() {
    var self = this;
    return self.tab.id;
  },

  /** Gets the ID of this Page - Each URL within this Tab has a unique Page ID **/
  pageId: function() {
    var self = this;
    return self.page.id;
  },

  render: function() {
    var self = this;
    self.$el.css({ paddingLeft: CONFIG["sidebar_width"] });
    self.sidebar_view = new SideBarView();
    self.sidebar_view.setParentTab(self);
    self.$el.append(self.sidebar_view.render().el);
    return self;
  },

  /** Activates the DataGet **/
  activate: function() {
    var self = this;
    self.render();
  },

  /** Deactivates the DataGet **/
  deactivate: function() {
    var self = this;    
    self.$el.css({ paddingLeft: "0px" });
    self.$el.find(".getdata-sidebar").remove();
  }

});