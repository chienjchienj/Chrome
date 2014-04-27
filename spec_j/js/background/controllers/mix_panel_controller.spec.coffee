require "../../fixtures/env_stubs"
MixPanelController = require "../../../../js/background/controllers/mix_panel_controller"

describe "MixPanelController", ->
  it "Constructor", ->
    mxpc = new MixPanelController("SOME_MX_KEY", "SOME_CHROME_VERSION")