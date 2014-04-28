/*
  Copyright 2013 Krake Pte Ltd.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Author:
  Gary Teh <garyjob@krake.io>   

*/

/*
 * This class handles the in page highlighting of elements
 */
var ElementSelector = {
  mode : 'select_element', //'select_element', 'select_next_pager'
  highLightColor : false,

  start : function(highlight_color) {
    var self = this;
    self.stop();
    self.attachElementHighlightListeners();
    self.highLightColor = highlight_color;
  },

  stop : function() {
    var self = this;
    self.highLightColor = false;
    self.detachElementHighlightListeners();
  },
  
  mouseOut : function(e) {
    e.currentTarget.style.outline = '';
  },

  // To apply color change based on
  mouseOver : function(e) {
    var self = this;
    if ($(e.target).is('.k_panel') || $(e.target).parent('.k_panel').length ) return;
    if (e.target.tagName != 'body') {
      e.target.style.outline = '4px solid ' + self.highLightColor; 
    }
    e.preventDefault();
    e.stopPropagation();    
  },
  
  // @Description : attached events to DOM elements that are not part of the krake panel
  attachElementHighlightListeners : function() { 
    var self = this;   
    $('*:not(".k_panel")').bind('mouseover', jQuery.proxy( self, "mouseOver" ));
    $('*:not(".k_panel")').bind('mouseout', jQuery.proxy( self, "mouseOut" ));

    $('*:not(".k_panel")').removeAttr("onclick");
    $('*:not(".k_panel")').unbind("click");
    $('*:not(".k_panel")').bind('click', jQuery.proxy( self, "selectElement" ));
  },

  // @Description : detach events from DOM elements that are not part of the krake panel
  detachElementHighlightListeners : function() {
    var self = this;
    $('*').unbind('mouseover', self.mouseOver);
    $('*').unbind('mouseout', self.mouseOut);
    $('*').unbind('click', self.selectElement);
  },
  
  // @Description : Sets the color to use during mouse over events
  setHighLightColor : function(hex_value) {
    var self = this;
    self.highLightColor = hex_value;
  },

  // @Description : Gets and sets the element Xpath to session when a click event occurs
  selectElement : function(e) {
    var self = this;

    // do not handle any elements that are part of or child elements of the Krake panel
    if ( $(e.target).is('.k_panel') || $(e.target).parents().hasClass('k_panel') ) { return; }
    
    e.preventDefault();
    e.stopPropagation();
    console.log("To overwrite this method with your own");
  },



  // @Description : removes the DOM elements highlighted given a column detail
  // @param : column:Object
  highlightXpathElements : function(url, genericXpath, colorCode) {
    if(document.URL != url) return;
    
    var result = XpathMapper.evaluateQuery(genericXpath);
    var nodes = result.nodesToHighlight;
    
    for(var i=0; i<nodes.length; i++) {
      nodes[i].className += colorCode;
    }
  },

  // @Description : removes the DOM elements highlighted given a column detail
  // @param : column:Object
  highlightCssElements : function(url, css, colorCode) {
    document.URL == url && $(css).addClass(colorCode);
  },


  // @Description : removes the DOM elements highlighted given a column detail
  // @param : column:Object
  unHighLightElements : function(column) {
    
    if(document.URL != column.url) return;
       
    var selector = '.' + $.trim(column.colorCode);
    $(selector).removeClass(column.colorCode);
  },

  /*
   * @Description: Update the row content text upon successful element selection
   * @Param: columnId, column id
   * @Param: rowIndex, 1, 2
   */
  updateColumnText : function(columnId, rowIndex, text, elementType) {
    var selector = rowIndex == 1? 
                   '#krake-first-selection-' + columnId: 
                   '#krake-second-selection-' + columnId;

    switch(elementType.toLowerCase()) {
      case 'img':
        $(selector).html(Params.IMAGE_TEXT); 
      break;

      default:
        $(selector).html(text); 
      break;
    }//eo switch
    
  },

};
