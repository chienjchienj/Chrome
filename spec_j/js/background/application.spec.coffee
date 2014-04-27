require "../fixtures/env_stubs"
ApplicationVar  = require "../../../js/background/application"
Application     = ApplicationVar.Application
KWindow         = ApplicationVar.KWindow
BrowserIconView = ApplicationVar.BrowserIconView


describe "Application", ->
  beforeEach ->
    KWindow.reset()
    spyOn(BrowserIconView, "activate")
    spyOn(BrowserIconView, "deactivate")
    @window_id = 10    

  describe "msgEvent", ->
    it "should call mixpanel controller", (done)->
      spyOn(Application.msg_controllers["mixpanel"], "getId").andReturn("STUBBING")
      Application.msgEvent {
        controller: "mixpanel", 
        method: "getId",
        args_array: ["arg1", "arg2", "arg3"]
      }, {}, (res)=>
        expect(res.response).toEqual "STUBBING"
        expect(Application.msg_controllers["mixpanel"].getId).toHaveBeenCalledWith("arg1", "arg2", "arg3")
        done()

  describe "iconEvent", ->

    it "should deactivate ", ->
      kwin = new KWindow @window_id
      kwin.activate()
      Application.iconEvent { id: @window_id }
      kwin = new KWindow @window_id  
      expect(BrowserIconView.deactivate).toHaveBeenCalled()
      expect(kwin.isActive()).toBe false

    it "should activate ", ->
      Application.iconEvent { id: @window_id }
      kwin = new KWindow @window_id
      expect(BrowserIconView.activate).toHaveBeenCalled()
      expect(kwin.isActive()).toBe true

  describe "tabEvent", ->

    it "should deactivate", ->
      kwin = new KWindow @window_id  
      kwin.activate()
      Application.tabEvent { tabId: @window_id }
      expect(BrowserIconView.activate).toHaveBeenCalled()

    it "should activate", ->
      Application.tabEvent { tabId: @window_id }
      expect(BrowserIconView.deactivate).toHaveBeenCalled()

  describe "refreshEvent", ->

    it "should deactivate", ->
      kwin = new KWindow @window_id  
      kwin.activate()
      Application.refreshEvent {}, {}, { id: @window_id }
      expect(BrowserIconView.activate).toHaveBeenCalled()

    it "should activate", ->
      Application.refreshEvent {}, {}, { id: @window_id }
      expect(BrowserIconView.deactivate).toHaveBeenCalled()    