var Column = Backbone.Model.extend({
  url: "kcolumns",
  forTemplate: function() {
    var self = this;
    var json_obj  = {};
    json_obj.id       = self.get('id');    
    json_obj.col_name = self.get('col_name');
    return json_obj;
  },

  belongsToPage: function(page_id) {
    var self = this;
    return page_id == self.get('page_id');
  },

  /**
    Checks if the dom_array has elements already selected for this Column

    Returns Boolean
  **/
  domArrayNotEmpty: function() {
    var self = this;
    return self.get("dom_array") && 
        self.get("dom_array").length > 0;

  },

  /**
    Checks if there are recommended dom additions for this Column

    Returns Boolean
  **/
  hasRecommendations: function() {
    var self = this;
    return self.get("recommended_array") && 
        self.get("recommended_array").length > 0;
  },

  mergeInNewSelections: function(new_dom_arrays) {

  },

  setRecommendationsToSelected: function() {
    
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