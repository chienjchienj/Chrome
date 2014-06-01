var SelectedDomView = Backbone.View.extend({
  className: "getdata-selected_dom",

  stylesToEmulate: [
    "fontStyle", 
    "fontVariant",
    "fontWeight",
    "fontSize",
    "lineHeight",
    "textTransform",
    "textAlign"
  ],

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

  isSameDom: function(dom) {
    var self = this;
    return self.dom == dom;
  },

  domChanged: function(mutation_event) {
    console.log("Dom change event detected");
    console.log(mutation_event);
    var self = this;
    self.adjustDisplay();
  },

  adjustDisplay: function() {
    var self  = this;
    var comp_styles = window.getComputedStyle(self.dom);
    self.left  = $(self.dom).position().left + parseInt(comp_styles.marginLeft.replace(/px/,'') - 6);
    self.top   = $(self.dom).position().top  + parseInt(comp_styles.marginTop.replace(/px/,'')  - 2);

    self.$el.css("height",     self.dom.offsetHeight);
    self.$el.css("maxWidth",   self.dom.offsetWidth);
    self.$el.css("left",       self.left);
    self.$el.css("top",        self.top);

    _.each(self.stylesToEmulate, function(style) {
      self.$el.css(style,   comp_styles[style]);
    });
    self.$el.html($(self.dom).html());
  },

  render: function() {
    var self = this;
    self.adjustDisplay();
    self.$el.css("background-color",  self.color);
    $("body").append(self.$el);
    self.animate();
  },

  animate: function() {
    var self = this;
    self.$el
      .animate({
        padding: "4px 8px",
        top:  self.top  - 2,
        left: self.left - 2
      }, 100)
      .animate({
        padding: "2px 6px",
        top:  self.top,
        left: self.left
      }, 150)
  }

});