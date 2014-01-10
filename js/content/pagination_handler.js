var PaginationHandler = {}

// @Description : handles the event when the pagination button in the Wrapper panel is clicked 
PaginationHandler.processEvent = function() {
  
  // checks the status first
  chrome.extension.sendMessage({ action: "get_session"}, function(response) {
    
    var sessionManager = response.session;
    var sharedKrake = response.sharedKrake;

    // When the next page is already set
    if(sharedKrake.next_page) {
      PaginationHandler.unsetNextPager();

    // when is in selection mode
    } else if(sessionManager.currentState == 'selection_addition') {
      
      // When there is at least 1 selection for current column suffice
      if (sessionManager.currentColumn.selections.length > 0) {
        
        chrome.extension.sendMessage({ action: "save_column" }, function(response) {
          var columnIdentifier = "#krake-column-" + sessionManager.currentColumn.columnId;
          var selector = columnIdentifier + ' .krake-control-button-save';
          $(selector).remove();   // removes the save button
          $('.tooltip').remove(); // remove visible tool tip just in case
          
          // shows the page link if current selected set of elements are hyperlink
          var $detailPageLink = PageDivingHandler.showLink(sessionManager.currentColumn);
          PaginationHandler.startPaginationSelection();
          
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
    
    // when is currently idle
    } else {
      PaginationHandler.startPaginationSelection();
              
    }
    
  });  

}

// @Description : the prompt to allow users the ability to indicate if there is a pagination on this page
PaginationHandler.showPaginationOption = function() {
  
  var self = this;
  
  //show prompt
  NotificationManager.showOptionsYesNo({
    title: Params.NOTIFICATION_TITLE_ACTIVATE_NEXT_PAGER,
    message: Params.NOTIFICATION_MESSAGE_ACTIVATE_NEXT_PAGER,

    // @Description : event is triggered when the 'yes' button is clicked
    yesFunction : function(e) {
      self.startPaginationSelection();
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
PaginationHandler.startPaginationSelection = function() {

  // Temporary hard coding of pagination color 
  ColumnElementSelector.setHighLightColor("#666666");

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


// @Description : Highlights the next page element within the page as well as change the pagination button status
PaginationHandler.setNextPager = function(xpath) {
  ColumnElementSelector.highlightElements(document.URL, xpath, " k_highlight_next_page");
  ColumnElementSelector.setHighLightColor(false);
  $("#btn-add-pagination").html(Params.NEXT_PAGE_BUTTON_SET_DESC);
}

// @Description : Unhighlights the next page element within the page as well as change the pagination button status
PaginationHandler.unsetNextPager = function(xpath) {
  $(".k_highlight_next_page").removeClass("k_highlight_next_page");
  $("#btn-add-pagination").html(Params.NEXT_PAGE_BUTTON_NOT_SET_DESC);
  chrome.extension.sendMessage({ action: "remove_pagination"});
}