switch(request.action) {
    
  case "load_script":
    loadScript(request.params.filename, sender);
  break;

  case "insert_css":
    insertCss(request.params.filename, sender);
  break;

  case "get_session":
    sendResponse({ 
      session: sessionManager,
      sharedKrake : sharedKrake
    });
  break;
  
  case "get_ancestry":
    sendResponse({ 
      ancestry: curr_SKH.getAncestry()
    });        
  break;

  case 'load_session':
    loadSession(request.params, sendResponse);
  break;

  // gets all the shared_krakes belonging to current tab
  case 'get_all_shared_krakes':
    sendResponse({ sharedKrakes: records[curr_tab_id].shared_krakes  });
  break;

  case 'get_breadcrumb':
    getBreadcrumb(request.params, sendResponse);
  break;

  case "add_column":
    newColumn(request.params, sendResponse);
  break;
  
  case "has_columns":
    hasColumns(request.params, sendResponse);
  break;      

  case "set_wait_time":
    setWaitTime(request.wait, sendResponse);
  break;
  
  // transits into state for handling pagination selection event
  case "start_pagination":
    sessionManager.goToNextState(request.params.values.state);
    sendResponse({status: 'success', session: sessionManager, sharedKrake: sharedKrake});
  break;
  
  case "set_pagination":
    setPagination(request.params, sendResponse);
  break;
  
  case "remove_pagination":
    curr_SKH.unsetNextPager();
  break;

  case "add_nested_krake":
    // TODO : To Extend      
  break;

  case 'edit_column_title':
    editColumnTitle(request.params, sendResponse);
  break;

  case 'edit_column_xpath':
    editCurrentColumnXpath(request.params, sendResponse);
  break;      

  case 'delete_column':
    deleteColumn(request.params, sendResponse);
  break;

  case 'save_column':
    saveColumn(request.params, sendResponse);
  break;

  case 'stage_column':
    stageColumn(request.params, sendResponse);
  break;

  // method is to be called only at the end of the items selection exercise for columns;
  case 'match_pattern':
    matchPattern(sendResponse);
  break;

  // Action gets triggered when the done button is clicked
  case 'complete':
    compileKrakeJson(function() {
      sendKrakeToApp();          
    });
  break;
  
  // Injects the complete Krake Definition into the Edit Tab of the page
  case 'inject_krake':
    getKrakeJson(sendResponse); 
  break;

  case 'fire_mixpanel_event':
    executeMixpanelEvent(request.params.eventNumber);
  break;
  
}//eo switch