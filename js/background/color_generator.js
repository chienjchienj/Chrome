// @Description : The object that assigns the colors to be used for highlighting in-page DOM elements when selected
var ColorGenerator = function(){
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

// @Description : gets the next color to use for an in page highlight
ColorGenerator.prototype.getColor = function()
{
  var self = this;
  var color = self.colorArray.shift();
  self.colorArray.push(color);
  return color; 
}