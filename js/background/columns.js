var ColumnFactory = {
  createColumn: function(params){
    var column = new Column(params);
    column.colorCode = colorGenerator.getColor();
    return column;
  }//eo createColumn
};

var Column = function(params){
  var self = this;
  
  self.columnId = params.columnId;
  self.columnType = params.columnType;
  self.columnName = CommonParams.text.defaultColumnTitleText ; 
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

  /* 
    // Disabled for easier demonstration purposes
    // To consider splitting into two different logical columns
    
    if(self.elementType == "a")
      self.requiredAttribute = "href";
  */
  
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
    return (self.selections[0].xpath == null) ? false : true;
    
  };

  return isComplete();
};


/*
 * @Description : Rotates through a list of color and returns a new color each time
 *    the getColor() is called
 */
var ColorGenerator = function()
{
  this.colorArray = 
  [ " k_highlight_FFCC00 ", //yellow
    " k_highlight_FF6600 ", //orange
    " k_highlight_3EA99F ", //light green
    " k_highlight_FF99FF ", //light purple
    " k_highlight_82CAFF ", //sky blue
    " k_highlight_99CCFF ",
    " k_highlight_FF00FF ",
    " k_highlight_CC33FF ",
    " k_highlight_FFCCCC ",
    " k_highlight_CCFF00 ",
    " k_highlight_0099CC ",
    " k_highlight_FFCCFF ",
    " k_highlight_33FF33 ",
    " k_highlight_FFFF99 "
  ];

};//eo ColorGenerator

/*
 *  @Description : Returns a color code from the colorArray
 *    Auto rotates the most recent color returned to the end of the array after its been returned for use
 *  @return : color:String
 */

ColorGenerator.prototype.getColor = function()
{
  var self = this;
  var color = self.colorArray.shift();
  self.colorArray.push(color);
  return color; 
}

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




