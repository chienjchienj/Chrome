// @Description : MixPanel events
var executeMixpanelEvent = function(eventNumber, callback) {
  switch(eventNumber) {
    case 'event_4':
      MixpanelEvents.event_4();
    break;

    case 'event_5':
      MixpanelEvents.event_5();
    break;

    case 'event_6':
      MixpanelEvents.event_6();
    break;

    case 'event_7':
      MixpanelEvents.event_7();
    break;

    case 'event_8':
      MixpanelEvents.event_8();
    break;

    case 'event_9':
      MixpanelEvents.event_9();
    break;

    case 'event_10':
      MixpanelEvents.event_10();
    break;

    case 'event_11':
      MixpanelEvents.event_11();
    break;

    default:
      console.log('** invalid mixpanel event type **');
  }//eo switch
};