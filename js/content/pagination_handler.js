var PaginationHandler = {}

// @Description : the prompt to allow users the ability to indicate if there is a pagination on this page
PaginationHandler.showPaginationOption = function(column) {
  
  //show prompt
  NotificationManager.showOptionsYesNo({
    title: Params.NOTIFICATION_TITLE_ACTIVATE_NEXT_PAGER,
    message: Params.NOTIFICATION_MESSAGE_ACTIVATE_NEXT_PAGER,

    // @Description : event is triggered when the 'yes' button is clicked
    yesFunction : function(e) {
      NotificationManager.hideAllMessages();
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
      chrome.extension.sendMessage({ action:"add_pagination", params: params }, function(response) {
        if(response.status == 'success') {
          
        }
      });
        
    });
  }//eo if
  
}