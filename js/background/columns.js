var ColumnFactory = {
  createColumn: function(params){
    var column = new Column(params);
    var color_obj = colorGenerator.getColor();
    column.colorCode = color_obj.css_class;
    column.colorHex = color_obj.hex;
    return column;
  }//eo createColumn
};

var Column = function(params){
  var self = this;
  
  self.columnId = params.columnId;
  self.columnType = params.columnType;
  self.columnName = CommonParams.text.defaultColumnTitleText;
  self.colorCode = null;
  
  //the url in which the column is defined
  self.url = params.url;
  
  /*
  selections = [
    { elementType: xxx, 
      xpath: xxx,
      elementText: xxx, 
      elementLink: xxx //href for "a", img for "img"
    },
    { elementType: xxx, 
      xpath: xxx,
      elementText: xxx, 
      elementLink: xxx //href for "a", img for "img"
    }  
  ]
  */
  self.selections = [];
  self.elementType = null;
  self.genericXpath = null;
  self.requiredAttribute = null;

};



// @Description : Sets the DOM attribute to the current column
Column.prototype.setAttribute = function(key, value){
  var self = this;
  self[key] = value;
};



// @Description : Adds a new sample Xpath to a column
Column.prototype.addSelection = function(params){
  var self = this;
  self.selections.push(params);
  self.elementType = params.elementType.toLowerCase();
  
  if(self.elementType == "img")
    self.requiredAttribute = "src";
  
};



// @Description : computes a generic xpath from self.selections[]
// @return : result:Object
//    generic_xpath:String
//    elementType:String
Column.prototype.computeGenericXpath = function() {
  var self = this;  
  self.genericXpath = self.genericXpath || self.selections[0].xpath;
  
  for( var x = 0; x < self.selections.length ; x++ ) {
    computedXpathObj = PatternMatcher.findGenericXpath(self.genericXpath,
      self.selections[x].xpath);          
    self.genericXpath = computedXpathObj.genericXpath;
  }

  return self.genericXpath;
}



// @Description : computes a generic xpath from self.selections[]
// @return : result:Object
//    generic_xpath:String
//    elementType:String
Column.prototype.computeGenericAncestorLinkXpath = function() {
  var self = this;  
  self.genericAncestorLinkXpath = self.genericAncestorLinkXpath || self.selections[0].ancestorLinkXpath || null;
  
  for( var x = 0; x < self.selections.length ; x++ ) {
    
    // when the genric ancestor link xpath is not set yet
    if(!self.genericAncestorLinkXpath && self.selections[x].ancestorLinkXpath) {
      self.genericAncestorLinkXpath = self.selections[x].ancestorLinkXpath;
      
    // when the generic ancestor link xpath is already set
    } else if(self.genericAncestorLinkXpath && self.selections[x].ancestorLinkXpath) {
      computedXpathObj = PatternMatcher.findGenericXpath(self.genericAncestorLinkXpath,
        self.selections[x].ancestorLinkXpath);          
      self.genericAncestorLinkXpath = computedXpathObj.genericXpath;      
      
    }
  }

  return self.genericAncestorLinkXpath;
}



// @Description: validate column before saving into sharedKrake
// @param : generic_xpath:String
Column.prototype.setGenericXpath = function(generic_xpath){
  var self = this;
  self.genericXpath = generic_xpath;
};



/*
 * @Description: validate column before saving into sharedKrake
 * @Return: true => validataion passed, false => validation failed
 */
Column.prototype.validate = function(){
  var self = this;
  
  var isComplete = function(){
    
    // TODO : Refactor this crap
    return ( self.selections.length == 0 || self.selections[0].xpath == null) ? false : true;
    
  };

  return isComplete();
};

/*
module.exports = Column;
module.exports = ColumnFactory;

//  The sequence below is called when command is called directly from the terminal
//    node tsp_test.js
if(!module.parent) {
  var column = ColumnFactory.createColumn({
    columnId: 1,
    columnType: 'list',
    url: "http://localhost"
  });

  column.setAttribute('parentColumnId', '1234');
  console.log( JSON.stringify(column));
  
  console.log('outside : ' + column.validate());
};
*/




