var Column = Backbone.Model.extend({
  url: "kcolumns",
  forTemplate: function() {
    var self = this;
    var json_obj  = {};
    json_obj.id       = self.get('id');    
    json_obj.col_name = self.get('col_name');
    return json_obj;
  }

});

var Columns = Backbone.Collection.extend({
  model: Column,
  url: "kcolumns",

  newColumn: function(success_cb, failure_cb) {
    var self = this;
    return self.fetch({
      method: 'create',
      success: function(collection, response, options) {
        var col = new Column();
        Object.keys(response).forEach(function(attribute) {
          col.set(attribute, response[attribute]);
        });
        self.models.push(col);
        success_cb && success_cb(col);
      },
      error: function(collection, response, options) {
        console.log(arguments);
        failure_cb && failure_cb(arguments)
      }
    });
  },

  forPage: function(page_id) {
    var self = this;
    return self.where({ page_id: page_id });
  }

});