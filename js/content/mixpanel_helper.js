var MixPanelHelper = 
{
  
  fireEvent : function(e, eventNumber){
    var _eventNumber = e? e.data.eventNumber : eventNumber;
    chrome.extension.sendMessage({ action: "fire_mixpanel_event", 
                                   params: { eventNumber : _eventNumber } });
  }//eo mixpanel
  
};//eo XpathMapper

