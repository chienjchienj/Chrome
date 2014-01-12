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
 *  This class manages the panel at the bottom of the page
 */
 
var Panel = {
  uiBtnCreateList : $("#btn-create-list"),
  uiBtnEditPagination : $("#btn-add-pagination"),
  uiBtnDone : $("#btn-done"),
  uiPanelWrapper : $("#inner-wrapper"),



  generateColumnId : function() {
   return Math.floor( Math.random() * 10000000000 );
  },



  init : function() {
    // jQuery('#panel-left button').tooltip();
    
    Panel.uiBtnCreateList.bind('click', Panel.uiBtnCreateListClick);
    Panel.uiBtnCreateList.bind('click', {eventNumber: 'event_4'}, MixPanelHelper.fireEvent);    
    Panel.uiBtnEditPagination.bind('click', Panel.uiBtnEditPaginationClick);
    Panel.uiBtnDone.bind('click', Panel.uiBtnDoneClick);
    
    NotificationManager.showNotification({
      type : 'info',
      title : Params.NOTIFICATION_TITLE_IDLE,
      message : Params.NOTIFICATION_MESSAGE_IDLE,
      elements_to_highlight : [
        '#btn-create-list'
      ],
      anchor_element : '#btn-create-list'
    });
  },
  
  
  
  // @Description : the event whereby the 'list' button was clicked
  uiBtnCreateListClick : function() {
    
    // Sequence to generate new list on the interface
    var transitToNewList = function() {
      var newColumnId = Panel.generateColumnId();

      var params = {
        columnId : newColumnId,
        columnType : 'list',
        url : document.URL
      };
      
      chrome.extension.sendMessage({ action: "add_column", params: params}, function(response) {
        //only add UIColumn to panel once a logical column object is created in sessionManager
        if(response.status == 'success') {
          
          Panel.uiPanelWrapper.prepend( ColumnDisplayFactory.createUIColumn( response.session.currentColumn ) );
          Panel.attachEnterKeyEventToColumnTitle(newColumnId);
          Panel.addBreadCrumbToColumn( { columnId : newColumnId } );

          $('#krake-column-title-' + response.session.currentColumn.columnId).focus();
          ColumnElementSelector.start(response.session.currentColumn.colorHex);

          NotificationManager.showNotification({
            type : 'info',
            title : Params.NOTIFICATION_TITLE_ENTER_COLUMN_NAME,
            message : Params.NOTIFICATION_MESSAGE_ENTER_COLUMN_NAME,
            elements_to_highlight : [
              '#krake-column-title-' + response.session.currentColumn.columnId
            ],
            anchor_element : '#krake-column-title-' + response.session.currentColumn.columnId
          });
   
        }
      });
    }
    
    chrome.extension.sendMessage({ action: "get_session"}, function(response) {
      var sessionManager = response.session;
      
      // when is in the mode for selecting new elements for inclusion into an existing column
      switch(sessionManager.currentState) {
        case "selection_addition" : 
          // when has already selected an item for the current column
          if(sessionManager.currentColumn && sessionManager.currentColumn.selections && 
            sessionManager.currentColumn.selections.length > 0) {
              
              chrome.extension.sendMessage({ action: "save_column" }, function(response) {
                var columnIdentifier = "#krake-column-" + sessionManager.currentColumn.columnId; 
                var selector = columnIdentifier + ' .krake-control-button-save';
                $(selector).remove();
                transitToNewList();
              });
              
          } else {
            
            NotificationManager.showNotification({
              type : 'error',
              title : Params.NOTIFICATION_TITLE_SAVE_COLUMN_FAILED,
              message : Params.NOTIFICATION_MESSAGE_SAVE_COLUMN_FAILED,
              anchor_element : "#krake-column-" + sessionManager.currentColumn.columnId
            });
            
          }        
          break;

        case "pre_next_pager_selection" : 
          PaginationElementSelector.stop();
          transitToNewList();
          break;

        case "idle" : 
          transitToNewList();
          break;

        default:
          console.log("In unknown state : " + sessionManager.currentState);
      }
    });
  },  



  // @Description : the event whereby the 'done' button was clicked
  uiBtnDoneClick : function() {
    
    var finished = function() {
      // send mixpanel request
      MixPanelHelper.fireEvent(null, 'event_11');
      NotificationManager.hideAllMessages();
      chrome.extension.sendMessage({ action:'complete' }, function(response) {});
    }

    // checks the status first
    chrome.extension.sendMessage({ action: "get_session"}, function(response) {
      
      var sessionManager = response.session;
      var sharedKrake = response.sharedKrake;
      
      // when is in selection mode
      if(sessionManager.currentState == 'selection_addition') {
        
        // When there is at least 1 selection for current column suffice
        if (sessionManager.currentColumn.selections.length > 0) {
          chrome.extension.sendMessage({ action: "save_column" }, function(response) {
            var columnIdentifier = "#krake-column-" + sessionManager.currentColumn.columnId;
            var selector = columnIdentifier + ' .krake-control-button-save';
            $(selector).remove();   // removes the save button
            $('.tooltip').remove(); // remove visible tool tip just in case
            
            // shows the page link if current selected set of elements are hyperlink
            var $detailPageLink = PageDivingHandler.showLink(sessionManager.currentColumn);
            finished();
            
          });
        
        // When no selections have been made for this column yet.
        } else {
          NotificationManager.showNotification({
            type : 'error',
            title : Params.NOTIFICATION_TITLE_SAVE_COLUMN_FAILED,
            message : Params.NOTIFICATION_MESSAGE_SAVE_COLUMN_FAILED,
            anchor_element : "#krake-column-" + sessionManager.currentColumn.columnId
          });
          
        }
      
      // when not columns have been defined in this Krake yet
      } else if ( sessionManager.currentColumn == null && sharedKrake.columns.length == 0 ) {
        
        chrome.extension.sendMessage({ action: "has_columns"}, function(response) {        
          if(response.has_columns) {
            finished();
            
          } else {
            NotificationManager.showNotification({
              type : 'error',
              title : Params.NOTIFICATION_TITLE_NO_COLUMN_FAILED,
              message : Params.NOTIFICATION_MESSAGE_NO_COLUMN_FAILED
            });
                        
          }
          
        });

      // when is in any other mode        
      } else {
        finished();
                
      }
      
    });

  },
  


  // @Description : Handles pagination button clicked event
  uiBtnEditPaginationClick : function() {
    PaginationHandler.trigger();
    
  },



  attachEnterKeyEventToColumnTitle : function(columnId) {
    var identifier = "#krake-column-title-" + columnId;

    var saveTitle = function(element, callback) {    
      $(identifier).unbind('blur');
      $(identifier).text($(identifier).text());
      var newColumnTitle = $(identifier).text();
      chrome.extension.sendMessage({ 
          action:"edit_column_title", 
          params: { 
            column_name: newColumnTitle,
            column_id: $(identifier).attr("column_id")
          }
        },
        function(response) {
          if(response.status == 'success') {
            var selector = '#k_column-breadcrumb-' + columnId + ' a';
            var uriSelector = '#k_column-breadcrumb-' + columnId + ' a:nth-child(' + $(selector).length + ')' ;
            $(uriSelector).html( newColumnTitle );
            $(element).blur().next().focus();  return false;          
          }
          callback && callback(response.isCurrentColumn);
        }
      );
      
    }
    
    var whenFocused = function() {
      // If user click on items on page without first having pressed enter
      $(identifier).blur(function(e) {
        var self = this;
        // when title has been already added to column title bar yet
        if( $(identifier).text().length > 0 ) {
          saveTitle( self, function() {

          } );

        // To think about how best to handle this situation
        } else {

        }

      });      
    }
    
    $(identifier).focus(whenFocused);    
    
    $(identifier).keydown(function(e) {
      var self = this;
      e.stopPropagation(); // Ensures in page script does not hijack the keydown event
      
      // when the ENTER key was pressed
      if(e.which == 13) {
        e.preventDefault();
        saveTitle(self, function(toShow) {

          // Sends notification to click on elements on page
          toShow && NotificationManager.showNotification({
            type : 'info',
            title : Params.NOTIFICATION_TITLE_ADD_SELECTIONS,
            message : Params.NOTIFICATION_MESSAGE_PRE_SELECTIONS,
            position : { center : true }
          });         

        });   
      }
      
    }); //eo keydown
    

  },



  // View page link
  addBreadCrumbToColumn : function(column) {

    var selector = "#k_column-breadcrumb-" + column.columnId; 
    var column_url = column.url || document.location.href;
    var column_columnName = column.columnName || Params.DEFAULT_BREADCRUMB_NAME;
        
    $link = $("<a>", { class: "k_panel k_breadcrumb_link",  
                       href: column_url,
                       text: column_columnName }  );
                       
    $link.unbind('click').bind('click', function(e) {
      e.stopPropagation();
    });

    $(selector).append($link);
    
  }//eo addBreadCrumbToColumn
  
};//eo Panel