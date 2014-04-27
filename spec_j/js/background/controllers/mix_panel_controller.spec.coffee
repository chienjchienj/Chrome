require "../../fixtures/env_stubs"
MixPanelController = require "../../../../js/background/controllers/mix_panel_controller"

describe "MixPanelController", ->
  it "Constructor", ->
    mxpc = new MixPanelController("Something")