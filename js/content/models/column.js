var Column = Backbone.Model.extend({ 

  initialize: function(id) {
    var self = this;
    self.id = id;
    if(self.id) {
      Env.sendMessage({ controller: "kcolumns", method: "show" }, function(res) {
        console.log(res);
      });

    } else {
      Env.sendMessage({ controller: "kcolumns", method: "new"}, function(res) {
        console.log(res);
      });

    }
  }
});

var Columns = Backbone.Collection.extend({
  url: "KColumnsController",
  model: Column
});