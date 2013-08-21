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
    jQuery('#panel-left button').tooltip();
    
    Panel.uiBtnCreateList.bind('click', Panel.uiBtnCreateListClick);
    Panel.uiBtnCreateList.bind('click', {eventNumber: 'event_4'}, MixPanelHelper.triggerMixpanelEvent);
    Panel.uiBtnSelectSingle.bind('click', Panel.uiBtnSelectSingleClick);
    Panel.uiBtnSelectSingle.bind('click', {eventNumber: 'event_5'}, MixPanelHelper.triggerMixpanelEvent);
    Panel.uiBtnEditPagination.bind('click', Panel.uiBtnEditPaginationClick);
    Panel.uiBtnDone.bind('click', Panel.uiBtnDoneClick);
    
    NotificationManager.showNotification({
      type : 'info',
      title : Params.NOTIFICATION_TITLE_IDLE,
      message : Params.NOTIFICATION_MESSAGE_IDLE
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
          Panel.uiPanelWrapper.append(UIColumnFactory.createUIColumn('list', newColumnId));
          Panel.attachEnterKeyEventToColumnTitle(newColumnId);
          Panel.addBreadCrumbToColumn(newColumnId);
          
          NotificationManager.showNotification({
            type : 'info',
            title : Params.NOTIFICATION_TITLE_PRE_SELECTION_1,
            message : Params.NOTIFICATION_MESSAGE_PRE_SELECTION_1
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
          console.log('Ignoring this command, since no DOM elements has been picked for this column yet.');
          
        }
        
        
      } else {
        transitToNewList();
        
      }//eo if-else 
    });
  },  



  // @Description : the event whereby the 'done' button was clicked
  uiBtnDoneClick : function() {
    //send mixpanel request
    MixPanelHelper.triggerMixpanelEvent(null, 'event_11');
    NotificationManager.hideAllMessages();
    $('#json-output').modal('show');

    chrome.extension.sendMessage({ action:'get_krake_json' }, function(response) {
      if(response.status == 'success') {
        $('#json-definition').text(JSON.stringify(response.krakeDefinition));
        
      }
    });


  },



  attachEnterKeyEventToColumnTitle : function(columnId) {
    var identifier = "#krake-column-title-" + columnId;
    $(identifier).keydown(function(e) {
      if(e.which == 13) {
        //update breadcrumb segment title
        var newColumnTitle = $(identifier).text();
        //self.updateBreadcrumbSegmentTitle(columnId, $.trim(newColumnTitle)); 
        var params = {
          columnName : newColumnTitle
        }
        chrome.extension.sendMessage({ action:"edit_current_column", params: { attribute:"column_name", values:params }}, function(response) {
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



  // @Description : the prompt to allow users the ability to indicate if there is a pagination on this page
  showPaginationOption : function(column) {
    
    //show prompt
    NotificationManager.showOptionsYesNo({
      title: Params.NOTIFICATION_TITLE_ACTIVATE_NEXT_PAGER,
      message: Params.NOTIFICATION_MESSAGE_ACTIVATE_NEXT_PAGER,

      // @Description : event is triggered when the 'yes' button is clicked
      yesFunction : function(e) {
        NotificationManager.hideAllMessages();
        console.log('going into selectNextPager');
        selectNextPager();
      },
      
      // @Description : event is triggered when the 'no' button is clicked
      noFunction : function(e) {
        NotificationManager.hideAllMessages();
      }
      
    });

    // @Description : Handles the event whereby user goes into the mode for selecting pagination
    var selectNextPager = function() {

      var params = {
        attribute : 'current_state',
        values : {
          state : 'pre_next_pager_selection'
        }
      }
      
      // transits into pagination mode regardless of save_column command outcome
      chrome.extension.sendMessage({ action: "save_column" }, function(response) {
        
        NotificationManager.showNotification({
          type : 'info',
          title : Params.NOTIFICATION_TITLE_SELECT_NEXT_PAGER,
          message : Params.NOTIFICATION_MESSAGE_SELECT_NEXT_PAGER
        });
        
        //remove save column button
        var columnIdentifier = "#krake-column-" + column.columnId; 
        var selector = columnIdentifier + ' .krake-control-button-save';
        $(selector).remove();
        
        // Adds the pagination declaration in the background
        console.log('Transiting to add pagination state');
        chrome.extension.sendMessage({ action:"add_pagination", params: params }, function(response) {
          console.log('Transited into add pagination state');            
          console.log(response);
          if(response.status == 'success') {
            
          }
        });
          
      });
    }//eo if
    
  },



  showLink : function(column) {
    if(column.elementType.toLowerCase() == 'a') {
      var selector = '#krake-column-control-' + column.columnId;
      
      // ensures link is only added once
      if($(selector + ' .krake-control-button-link').length > 0 ) return;

      var linkButtonImageUrl = "background-image: url(\"" + chrome.extension.getURL("images/link.png") + "\");";

      var $linkButton = $("<button>", { class: "k_panel krake-control-button krake-control-button-link",
                                        style:  linkButtonImageUrl });

      $(selector).append($linkButton);
      
      // Handles the event whereby the link icon was clicked
      $linkButton.bind('click', function() {
        
        console.log('Detailed Link Clicked')
        var params = {
          attribute : 'previous_column',
          event : 'detail_link_clicked',
          values : {
            currentUrl : document.URL,
            columnId : column.columnId,
            elementLink : column.selection[0].elementLink
          }
        }
      
        chrome.extension.sendMessage({ action:"get_session" }, function(response) { 
          console.log('==== get session response ====');
          console.log(response);
          
          // Do nothing with session obtained from the background
          if(response.session.currentColumn) {
            
            // TODO : Need to extend this part

          // Gets the HREF defined by this column and redirects the users to the nested page
          } else {
            chrome.extension.sendMessage({ action:'edit_session', params : params}, function(response) {
              if(response.status == 'success') {

                console.log('We got back the edit_session successfully');
                
                //alert('column.genericXpath := ' + column.genericXpath);
                
                // TODO : split columns into two :
                //   - first for value within this page
                //   - second for the actual href to the nested page
                var results = XpathHelper.evaluateQuery(column.genericXpath);
                console.log('Rerouting to location %s' , results.nodesToHighlight[0].href);

                window.location.href = results.nodesToHighlight[0].href;
              } 
            });
          } 
        });//eo sendMessage
      });//eo click
    }//eo if
    
  },//eo showLink



  addBreadCrumbToColumn : function(columnId) {
    console.log('addBreadCrumbToColumn');

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