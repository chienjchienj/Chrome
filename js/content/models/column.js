var Column = Backbone.Model.extend({});

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