var SelectedDomView = Backbone.View.extend({
  className: "getdata-selected_dom",

  initialize: function(opts) {
    var self      = this;
    _.bindAll(self, "domChanged");
    self.dom      = opts.dom;
    self.color     = opts.color;
    self.observer = Env.getMutationObserver(self.dom, self.domChanged);
    self.render();
  },

  destroy: function() {
    console.log("Destroy sdv was called");
    var self = this;
    self.observer.disconnect();
    self.remove();
  },

  domChanged: function(mutation_event) {
    console.log("Dom change event detected");
    console.log(mutation_event);
    var self = this;
    self.adjustDisplay();
  },

  adjustDisplay: function() {
    var self = this;
    self.$el.css("height",  self.dom.offsetHeight);
    self.$el.css("width",   self.dom.offsetWidth);
    self.$el.css("left",    $(self.dom).position().left);
    self.$el.css("top",     $(self.dom).position().top);   
  },

  render: function() {
    var self = this;
    self.adjustDisplay();
    self.$el.css("background-color",  self.color);
    $("body").append(self.el);
  }

});