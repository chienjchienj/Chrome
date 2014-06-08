var Tab = Backbone.Model.extend({
  url: "ktab",

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
    });
  },

  dispatch : function(page_id) {
    var self = this;
    return self.fetch({
      method: 'dispatch',
      data: {
        page_id: page_id
      },
      success: function(collection, response, options) {
        debugger
      },
      error: function(collection, response, options) {}
    });
  },

  compile : function(page_id) {
    var self = this;

    return self.fetch({
      method: 'compile',
      data: {
        page_id: page_id
      },
      success: function(collection, response, options) {
        debugger
      },
      error: function(collection, response, options) {}
    });    

  }

});