var Page = Backbone.Model.extend({
  url: "kpage",

  load : function() {
    var self = this;
    return self.fetch({
      method: 'create',
      success: function(collection, response, options) {
        Object.keys(response).forEach(function(attribute) {
          self.set(attribute, response[attribute]);
        });
      },
      error: function(collection, response, options) {}
    })
  }
});