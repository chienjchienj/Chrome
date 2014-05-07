var ColumnView = Backbone.View.extend({

  className: "column",

  events: {
    "keypress .col-name": "updateColName"
  },

  initialize: function(model) {
    var self = this;
    self.model = model;
    self.render();
  },

  updateColName: function(e) {
    var self = this;
    var breakline_code = 13;
    var disallowed_keycodes = [breakline_code, 39, 34, 92];
    if(disallowed_keycodes.indexOf(e.keyCode) != -1 ) {
      console.log("Stopping propogation")
      e.preventDefault();
    }
    
    if(e.keyCode == breakline_code) {
      self.model.set("col_name", self.$el.find('.col-name').html());
      self.model.save();
      console.log(self.model);
      console.log("saved model");
    }

    console.log("Name updating");
    console.log(e);
  },

  render: function() {
    var self = this;
    data = self.model.forTemplate();
    template = self.template();
    self.$el.html(template(data));
    return self;
  },

  template: function() {
    return Application.templates['column'];
  }

});