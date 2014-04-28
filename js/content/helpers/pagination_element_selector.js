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
 * This class handles the in page highlighting of pagination elements
 */
var PaginationElementSelector = Object.create(ElementSelector);

// @Description : Gets and sets the element Xpath to session when a click event occurs
PaginationElementSelector.selectElement = function(e) {
  var self = this;

  // do not handle any elements that are part of or child elements of the Krake panel
  if ( $(e.target).is('.k_panel') || $(e.target).parents().hasClass('k_panel') ) { return; }
  
  e.preventDefault();
  e.stopPropagation();

  chrome.extension.sendMessage({ action: 'get_session'}, function(response) {
    var pagination_ele = PaginationMapper.getElementSignature(e.target);

    if(pagination_ele && (pagination_ele.xpath || pagination_ele.dom_query) ) {      

      chrome.extension.sendMessage({ action:'set_pagination', params: { values:pagination_ele }}, function(response) {

        NotificationManager.showNotification({
          type : 'info',
          title : Params.NOTIFICATION_TITLE_SAVED_SELECTIONS,
          message : Params.NOTIFICATION_MESSAGE_SAVED_SELECTIONS,
          elements_to_highlight : [
            '#panel-left button#btn-create-list, #panel-left button#btn-done'
          ],
          anchor_element : '#panel-left button#btn-create-list, #panel-left button#btn-done'
        });// eo showNotification

        console.log(response.sharedKrake);
        PaginationHandler.setNextPager(response.sharedKrake.next_page);
        e.currentTarget.style.outline = '';
        
      });

    } else {

        NotificationManager.showNotification({
          type : 'error',
          title : Params.NOTIFICATION_TITLE_NEXT_PAGER_ERROR,
          message : Params.NOTIFICATION_MESSAGE_NEXT_PAGER_ERROR,
          position : {
            center : true
          }
        });        
    }
    
  });

}