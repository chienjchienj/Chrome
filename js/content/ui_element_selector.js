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
  Joseph Yang <sirjosephyang@krake.io>

*/

/*
 * This class handles the in page highlighting of elements
 */
var UIElementSelector = {
  mode : 'select_element', //'select_element', 'select_next_pager'

  init : function() {
    UIElementSelector.attachElementHighlightListeners();
    console.log("UIElementSelector.init");
  },

  mouseOut : function(e) {
    this.style.outline = '';
    return false;
  },

  mouseOver : function(e) {
    if ($(e.target).is('.k_panel') || $(e.target).parent('.k_panel').length ) return;
    
    if (this.tagName != 'body') {

      this.style.outline = '4px solid #0000A0'; 
    }
    return false; //preventDefault & stopPropogation
  },
  
  // @Description : attached events to DOM elements that are not part of the krake panel
  attachElementHighlightListeners : function() {   
    $('*:not(".k_panel")').bind('mouseover', UIElementSelector.mouseOver);
    $('*:not(".k_panel")').bind('mouseout', UIElementSelector.mouseOut);
    $('*:not(".k_panel")').bind('click', UIElementSelector.selectElement);
  },

  // @Description : detach events from DOM elements that are not part of the krake panel
  detachElementHighlightListeners : function() {
    $('*').unbind('mouseover', UIElementSelector.mouseOver);
    $('*').unbind('mouseout', UIElementSelector.mouseOut);
    $('*').unbind('click', UIElementSelector.selectElement);
  },

  restoreElementDefaultActions : function() {
    UIElementSelector.detachElementHighlightListeners();
  },

  // @Description : Gets and sets the element Xpath to session when a click event occurs
  selectElement : function(e) {

    var self = this;
    
    // do not handle any elements that are part of or child elements of the Krake panel
    if ( $(e.target).is('.k_panel') || $(e.target).parents().hasClass('k_panel') ) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();

    chrome.extension.sendMessage({ action: 'get_session'}, function(response) {
            
      var sessionManager = response.session;

      // If is in the pre_next_pager_selection state always map to a hyperlink
      if(sessionManager.currentState == 'pre_next_pager_selection') {
        selected_dom_element = XpathHelper.findUpTag(self, 'A');
        
      } else {
        selected_dom_element = self;

      }

      var elementPathResult = XpathHelper.getElementXPath(selected_dom_element);
      var elementText = XpathHelper.evaluateQuery(elementPathResult.xpath).text;

      var params = {
        xpath : elementPathResult.xpath,
        elementType : elementPathResult.nodeName,
        elementText : elementText,
        elementLink : elementPathResult.link
      };      
      
      
      switch(sessionManager.currentState) {
        case 'pre_next_pager_selection' :
          
          // sets the xpath for the next_page operator & hides the next pager notification message
          chrome.extension.sendMessage({ action:'set_pagination', params: { values:params}}, function(response) {
            UIElementSelector.mode = 'select_element';
            NotificationManager.hideAllMessages();
            
          });
          
        break;

        /************************************** Start : To refactor entire section ***********************************************/
        case 'pre_selection_1' :

          chrome.extension.sendMessage({ action:"edit_current_column", params: { attribute:"xpath_1", values:params }}, function(response) {
            if(response.status == 'success') {
              var sessionManager = response.session;
              UIElementSelector.updateColumnText(sessionManager.currentColumn.columnId, 1, elementText, elementPathResult.nodeName);
              //console.log( JSON.stringify(sessionManager) ); 

              if(sessionManager.currentColumn.columnType == 'list') {
                
                //send mixpanel request
                MixPanelHelper.triggerMixpanelEvent(null, 'event_6');
                
                //show notification 
                NotificationManager.showNotification({
                  type : 'info',
                  title : Params.NOTIFICATION_TITLE_PRE_SELECTION_2,
                  message : Params.NOTIFICATION_MESSAGE_PRE_SELECTION_2
                });
                
              } else if(sessionManager.currentColumn.columnType == 'single') {
                //send mixpanel request
                MixPanelHelper.triggerMixpanelEvent(null, 'event_8');


                chrome.extension.sendMessage({ action:"match_pattern" }, function(response) {

                  if(response.status == 'success') { 
                    
                    //highlight all elements depicted by genericXpath
                    UIElementSelector.highlightElements(response.column.url, response.column.genericXpath, response.column.colorCode);
                    
                    //show pagination option
                    Panel.showPaginationOption(response.column);
                    
                    //display 'link' icon
                    Panel.showLink(response.column);
                  
                  }
                });
                
                
              }//eo if
              
            }
          });
        break;

        case 'pre_selection_2' :
          console.log('pre_selection_2');

          chrome.extension.sendMessage({ action: "get_session" }, function(response) {
            if(response.session.currentColumn.columnType == 'list')
              editSelectionTwo();         
          });
          
          var editSelectionTwo = function() {
            console.log('checkpoint 2');
            chrome.extension.sendMessage({ action:"edit_current_column", params: { attribute:"xpath_2", values:params }}, function(response) {
              if(response.status == 'success') {
                //send mixpanel request
                MixPanelHelper.triggerMixpanelEvent(null, 'event_7');

                var sessionManager = response.session;
                UIElementSelector.updateColumnText(sessionManager.currentColumn.columnId, 2, elementText, elementPathResult.nodeName);
                

                chrome.extension.sendMessage({ action:"match_pattern" }, function(response) {

                  if(response.status == 'success') {
                    if(response.patternMatchingStatus != 'matched') {
                      NotificationManager.showNotification({
                        type : 'error',
                        title : Params.NOTIFICATION_TITLE_SELECTIONS_NOT_MATCHED,
                        message : Params.NOTIFICATION_MESSAGE_SELECTIONS_NOT_MATCHED
                      });
                      
                    } else {
                      //highlight all elements depicted by genericXpath
                      UIElementSelector.highlightElements(response.column.url, response.column.genericXpath, response.column.colorCode);
                      //show pagination option
                      Panel.showPaginationOption(response.column);
                    
                      //display 'link' icon
                      Panel.showLink(response.column);
                    }//eo if-else
                    
                  }//eo if
                });
                
              }
            });
          };//eo editSelectionTwo
        break;
        
        /************************************** End : To refactor entire section ***********************************************/        
        
      }//eo switch
    });

  },



  // @Description : removes the DOM elements highlighted given a column detail
  // @param : column:Object
  highlightElements : function(url, genericXpath, colorCode) {
    console.log("-- highlightElements");
    console.log(url + '\n' + genericXpath + '\n' + colorCode);
    if(document.URL != url) return;
    
    var result = XpathHelper.evaluateQuery(genericXpath);
    var nodes = result.nodesToHighlight;
    
    for(var i=0; i<nodes.length; i++) {
      nodes[i].className += colorCode;
    }
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

};//eo UIElementSelector
