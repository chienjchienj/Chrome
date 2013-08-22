// @Description : The object that assigns the colors to be used for highlighting in-page DOM elements when selected
var ColorGenerator = function(){
  this.colorArray = 
  [ { css_class : " k_highlight_FFCC00 " , hex : "#ffcc00" },
    { css_class : " k_highlight_FF6600 " , hex : "#ff6600" },
    { css_class : " k_highlight_3EA99F " , hex : "#3ea99f" },
    { css_class : " k_highlight_FF99FF " , hex : "#ff99ff" },
    { css_class : " k_highlight_82CAFF " , hex : "#82caff" },
    { css_class : " k_highlight_99CCFF " , hex : "#99ccff" },
    { css_class : " k_highlight_FF00FF " , hex : "#ff00ff" },
    { css_class : " k_highlight_CC33FF " , hex : "#cc33ff" },
    { css_class : " k_highlight_FFCCCC " , hex : "#ffcccc" },
    { css_class : " k_highlight_CCFF00 " , hex : "#ccff00" },
    { css_class : " k_highlight_0099CC " , hex : "#0099cc" },
    { css_class : " k_highlight_FFCCFF " , hex : "#ffccff" },
    { css_class : " k_highlight_33FF33 " , hex : "#33ff33" },
    { css_class : " k_highlight_FFFF99 " , hex : "#ffff99" }
  ];

};//eo ColorGenerator

// @Description : gets the next color to use for an in page highlight
ColorGenerator.prototype.getColor = function()
{
  var self = this;
  var color = self.colorArray.shift();
  console.log('==== color object ====');
  console.log(color);
  self.colorArray.push(color);
  return color; 
}