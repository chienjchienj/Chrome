var ColumnView = Backbone.View.extend({

  className: "column",

  events: {
    "keypress .col-name"  : "validateColName",
    "keyup .col-name"     : "updateColName",
    "focus .col-name"     : "focusColName",
    "focusout .col-name"  : "focusOutColName"
  },

  disabled_keycodes : {
    break_line: 13,
    single_quote: 39,
    double_quote: 34,
    back_slash: 92
  },

  initialize: function(model) {
    var self = this;
    self.model = model;
    self.render();
  },

  validateColName: function(e) {
    console.log("Validating column name");
    var self = this;
    var disallowed_keycodes = Object.keys(self.disabled_keycodes).map(function(key){
      return self.disabled_keycodes[key];
    });

    if(disallowed_keycodes.indexOf(e.keyCode) != -1 ) e.preventDefault();

  },

  updateColName: function(e) {
    console.log("Saving column name");
    var self = this;
    self.model.set("col_name", self.$el.find('.col-name')[0].innerText);
    console.log("Saving : %s", self.$el.find('.col-name')[0].innerText)
    self.model.save();    
  },


  defaultColName: function() {
    var self = this;     
    return "Property " + self.model.id;
  },

  getColName: function() {
    var self = this;
    return self.$el.find(".col-name").html();
  },

  setColName: function(col_name) {
    var self = this;
    return self.$el.find(".col-name").html(col_name);
  },  

  focusColName: function(e) {
    var self = this; 
    if( self.getColName() == self.defaultColName() ) {
      self.setColName("");
    }
  },

  focusOutColName: function(e) {
    var self = this; 
    if( self.getColName().trim().length == 0 ) {
      self.setColName(self.defaultColName());
    }
    self.model.save();
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