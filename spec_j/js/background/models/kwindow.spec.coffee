require "../../fixtures/env_stubs"
KWindow    = require "../../../../js/background/models/kwindow"

describe "KWindow", ->
  beforeEach ->
    @window_id = 10
    KWindow.reset()

  describe "Constructor", ->
    it "should create only one instance", ->
      kwin1 = new KWindow @window_id
      kwin2 = new KWindow @window_id
      expect(KWindow.instances.length).toEqual 1

  describe "isActive", ->
    it "should be active if set once", ->
      kwin1 = new KWindow @window_id
      kwin1.activate()
      kwin2 = new KWindow @window_id
      expect(kwin2.isActive()).toBe true

  describe "find", ->
    it "should return kwindow", ->
      kwin1 = new KWindow @window_id
      kwin1.activate()
      kwins = KWindow.find({ id: @window_id });
      expect(kwins.length).toEqual 1
      expect(kwins[0].isActive()).toBe true

  describe "activate", ->
    it "should be emit activate event", ->
      spyOn(Env, "sendMessage")
      kwin1 = new KWindow @window_id
      kwin1.activate()
      expect(Env.sendMessage).toHaveBeenCalled()

  describe "deactivate", ->
    it "should be emit activate event", ->
      spyOn(Env, "sendMessage")
      kwin1 = new KWindow @window_id
      kwin1.deactivate()
      expect(Env.sendMessage).toHaveBeenCalled()