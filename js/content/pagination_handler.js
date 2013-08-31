var PaginationHandler = {}

// @Description : the prompt to allow users the ability to indicate if there is a pagination on this page
PaginationHandler.showPaginationOption = function() {
  
  var self = this;
  
  //show prompt
  NotificationManager.showOptionsYesNo({
    title: Params.NOTIFICATION_TITLE_ACTIVATE_NEXT_PAGER,
    message: Params.NOTIFICATION_MESSAGE_ACTIVATE_NEXT_PAGER,

    // @Description : event is triggered when the 'yes' button is clicked
    yesFunction : function(e) {
      self.selectNextPager();
    },
    
    // @Description : event is triggered when the 'no' button is clicked
    noFunction : function(e) {
      NotificationManager.showNotification({
        type : 'info',
        title : Params.NOTIFICATION_TITLE_SAVED_SELECTIONS,
        message : Params.NOTIFICATION_MESSAGE_SAVED_SELECTIONS,
        elements_to_highlight : [
          '#panel-left button#btn-create-list, #panel-left button#btn-done'
        ],
        anchor_element : '#panel-left button#btn-create-list, #panel-left button#btn-done'
      });      
    }
    
  });
   
}

// @Description : Handles the event whereby user goes into the mode for selecting pagination
PaginationHandler.selectNextPager = function() {

  var params = {
    attribute : 'current_state',
    values : {
      state : 'pre_next_pager_selection'
    }
  }
      
  NotificationManager.showNotification({
    type : 'info',
    title : Params.NOTIFICATION_TITLE_SELECT_NEXT_PAGER,
    message : Params.NOTIFICATION_MESSAGE_SELECT_NEXT_PAGER,
    position : {
      center : true
    }
  });
  
  // Adds the pagination declaration in the background
  chrome.extension.sendMessage({ action:"add_pagination", params: params }, function(response) {
    if(response.status == 'success') {
      
    }
  });
      
}//eo if
