var Column = Backbone.Model.extend({

  forTemplate: function() {
    var self = this;
    var json_obj  = {};
    json_obj.col_name = self.get('col_name');
    json_obj.id       = self.get('id');
    return json_obj;
  }

});

var Columns = Backbone.Collection.extend({
  model: Column,
  url: "kcolumns",

  newColumn: function(callback) {
    var self = this;
    return self.fetch({
      method: 'new',
      success: function(collection, response, options) {
        var col = new Column();
        Object.keys(response).forEach(function(attribute) {
          col.set(attribute, response[attribute]);
        });
        self.models.push(col);
        console.log(self.models)
      },
      error: function(collection, response, options) {
        console.log(arguments);
      }
    });
  }

});