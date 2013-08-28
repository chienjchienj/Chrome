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
  Joseph Yang <sirjosephyang@krake.io>
  Gary Teh <garyjob@krake.io>  
*/

/*
 *  This class manages the panel at the bottom of the page
 */
 
var Panel = {
  uiBtnCreateList : $("#btn-create-list"),
  uiBtnSelectSingle : $("#btn-select-single"),
  uiBtnEditPagination : $("#btn-edit-pagination"),
  uiBtnDone : $("#btn-done"),
  uiPanelWrapper : $("#inner-wrapper"),



  generateColumnId : function() {
   return Math.floor( Math.random() * 10000000000 );
  },



  init : function() {
    // jQuery('#panel-left button').tooltip();
    
    Panel.uiBtnCreateList.bind('click', Panel.uiBtnCreateListClick);
    Panel.uiBtnCreateList.bind('click', {eventNumber: 'event_4'}, MixPanelHelper.triggerMixpanelEvent);
    Panel.uiBtnSelectSingle.bind('click', Panel.uiBtnSelectSingleClick);
    Panel.uiBtnSelectSingle.bind('click', {eventNumber: 'event_5'}, MixPanelHelper.triggerMixpanelEvent);
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
          
          Panel.uiPanelWrapper.prepend( UIColumnFactory.createUIColumn( response.session.currentColumn ) );
          Panel.attachEnterKeyEventToColumnTitle(newColumnId);
          Panel.addBreadCrumbToColumn(newColumnId);

          $('#krake-column-title-' + response.session.currentColumn.columnId).focus();
          
          // Attached detach event
          UIElementSelector.setHighLightColor(response.session.currentColumn.colorHex);
          
          NotificationManager.showNotification({
            type : 'info',
            title : Params.NOTIFICATION_TITLE_ENTER_COLUMN_NAME,
            message : Params.NOTIFICATION_MESSAGE_ENTER_COLUMN_NAME,
            elements_to_highlight : [
              '#krake-column-title-' + response.session.currentColumn.columnId
            ],
            anchor_element : '#krake-column-title-' + response.session.currentColumn.columnId
          });
   
        } else {
          //show warning to user
        }//eo if-else
      });
    }
    
    chrome.extension.sendMessage({ action: "get_session"}, function(response) {
      var sessionManager = response.session;
      
      // when is in the mode for selecting new elements for inclusion into an existing column
      if(sessionManager.currentState == 'selection_addition') {
        
        // when has already selected an item for the current column
        if(sessionManager.currentColumn && sessionManager.currentColumn.selections && 
          sessionManager.currentColumn.selections.length > 0) {
            
            // saves the current column
            chrome.extension.sendMessage({ action: "save_column" }, function(response) {
              //remove save column button
              var columnIdentifier = "#krake-column-" + sessionManager.currentColumn.columnId; 
              var selector = columnIdentifier + ' .krake-control-button-save';
              $(selector).remove();
              
              // transit to new column
              transitToNewList();
              
            });
            
        } else {
          
          NotificationManager.showNotification({
            type : 'error',
            title : Params.NOTIFICATION_TITLE_SAVE_COLUMN_FAILED,
            message : Params.NOTIFICATION_MESSAGE_SAVE_COLUMN_FAILED
          });
          
        }
        
        
      } else {
        transitToNewList();
        
      }//eo if-else 
    });
  },  



  // @Description : the event whereby the 'done' button was clicked
  uiBtnDoneClick : function() {
    
    var finished = function() {
      // send mixpanel request
      MixPanelHelper.triggerMixpanelEvent(null, 'event_11');
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
            finished();
            
          });
        
        // When no selections have been made for this column yet.
        } else {
          NotificationManager.showNotification({
            type : 'error',
            title : Params.NOTIFICATION_TITLE_SAVE_COLUMN_FAILED,
            message : Params.NOTIFICATION_MESSAGE_SAVE_COLUMN_FAILED
          });
          
        }
      
      // when not columns have been defined in this Krake yet
      } else if ( sessionManager.currentColumn == null && sharedKrake.columns.length == 0 ) {
        NotificationManager.showNotification({
          type : 'error',
          title : Params.NOTIFICATION_TITLE_NO_COLUMN_FAILED,
          message : Params.NOTIFICATION_MESSAGE_NO_COLUMN_FAILED
        });

      // when is in any other mode        
      } else {
        finished();
                
      }
      
    });

  },



  attachEnterKeyEventToColumnTitle : function(columnId) {
    var identifier = "#krake-column-title-" + columnId;
    $(identifier).keydown(function(e) {

      //e.preventDefault();
      e.stopPropagation(); // Ensures in page script does not hijack the keydown event
      
      if(e.which == 13) {

        // TODO : automatically remove \n\r characters when they are entered
        $(identifier).text($(identifier).text());
        
        //update breadcrumb segment title        
        var newColumnTitle = $(identifier).text();
        
        
        // Sends notification to click on elements on page
        NotificationManager.showNotification({
          type : 'info',
          title : Params.NOTIFICATION_TITLE_ADD_SELECTIONS,
          message : Params.NOTIFICATION_MESSAGE_PRE_SELECTIONS,
        });        
        
        //self.updateBreadcrumbSegmentTitle(columnId, $.trim(newColumnTitle)); 
        var params = {
          columnName : newColumnTitle
        }
        chrome.extension.sendMessage({ action:"edit_current_column", params: { attribute:"column_name", values:params }}, 
        function(response) {
          if(response.status == 'success') {
            //update breadcrumb uri
            var selector = '#k_column-breadcrumb-' + columnId + ' a';
            var uriSelector = '#k_column-breadcrumb-' + columnId + ' a:nth-child(' + $(selector).length + ')' ;

            $(uriSelector).html( newColumnTitle );
            $(this).blur().next().focus();  return false;
          }
            
        });
        
      }
    });
    

  },



  addBreadCrumbToColumn : function(columnId) {

    chrome.extension.sendMessage({action: "get_breadcrumb", params:{columnId: columnId} }, function(response) {
      if(response.status == 'success') {
        var breadcrumbArray = response.breadcrumbArray;
        
        var selector = "#k_column-breadcrumb-" + columnId;

        for(var i=breadcrumbArray.length-1; i>=0; i--) {
          console.log("columnId:= " + breadcrumbArray[i].columnId + ", columnName:= " + breadcrumbArray[i].columnName);
          

          $link = $("<a>", { id: i,
                             class: "k_panel k_breadcrumb_link",  
                             href: breadcrumbArray[i].url,
                             text: breadcrumbArray[i].columnName }  );
      
     
          var id = breadcrumbArray[i].columnId;
          var href = breadcrumbArray[i].url;


          $link.unbind('click').bind('click', function(e) {
            e.stopPropagation();
          });

          $(selector).append($link);

          if(i != 0)
            $(selector).append(" > ");
        } 
      }//eo if
    }); 
  }//eo addBreadCrumbToColumn
};//eo Panel