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
var ColumnElementSelector = Object.create(ElementSelector);

// @Description : Gets and sets the element Xpath to session when a click event occurs
ColumnElementSelector.selectElement = function(e) {

  var self = this;
  // do not handle any elements that are part of or child elements of the Krake panel
  if ( $(e.target).is('.k_panel') || $(e.target).parents().hasClass('k_panel') ) { return; }
  
  e.preventDefault();
  e.stopPropagation();

  chrome.extension.sendMessage({ action: 'get_session'}, function(response) {
    
    var sessionManager = response.session;

    // If is in the pre_next_pager_selection state always map to a hyperlink
    selected_dom_element = e.currentTarget;
    var elementPathResult = XpathMapper.getElementXPath(selected_dom_element);
    var elementText = XpathMapper.evaluateQuery(elementPathResult.xpath).text;

    var params = {
      xpath : elementPathResult.xpath,
      elementType : elementPathResult.nodeName,
      elementText : elementText,
      ancestorLinkXpath : elementPathResult.hyperlink_xpath,
      elementLink : elementPathResult.link
    };
    
    chrome.extension.sendMessage({ action:"edit_column_xpath", params: { values:params }}, function(response) {
      if(response.status == 'success') {

        self.updateColumnText(response.session.currentColumn.columnId, 1, elementText, elementPathResult.nodeName);
        MixPanelHelper.fireEvent(null, 'event_8');
        chrome.extension.sendMessage({ action:"match_pattern" }, function(response) {

          if(response.status == 'success') { 
            
            NotificationManager.showNotification([{
                type : 'info',
                title : Params.NOTIFICATION_TITLE_SAVE_SELECTIONS,
                message : Params.NOTIFICATION_MESSAGE_ADD_MORE_SELECTIONS,
                elements_to_highlight : [
                  '#krake-column-control-' + response.column.columnId + ' .krake-control-button-save'
                ],
                anchor_element : '#krake-column-control-' + response.column.columnId + ' .krake-control-button-save'
                
              },{
                type : 'info',
                title : Params.NOTIFICATION_TITLE_ADD_MORE_SELECTIONS,
                message : Params.NOTIFICATION_MESSAGE_PRE_SELECTIONS,
                position : {
                  center : true
                }
                                                      
            }]);

            //highlight all elements depicted by genericXpath
            self.highlightElements(response.column.url, response.column.genericXpath, response.column.colorCode);                  
          
          }
        });
        
      }
    });
  });
}