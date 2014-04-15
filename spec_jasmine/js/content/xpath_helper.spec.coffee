XpathMapper = require '../../../js/content/xpath_helper'
window = require("jsdom").jsdom().createWindow();

$ = require("jquery")(window);

describe "A suite", ()->
  it "contains spec with an expectation", ()->
    div = $("<div />").appendTo("body")
    input = $("<input />").appendTo(div)
    inp = window.document.querySelectorAll('input')
    expect(inp.tagName).toEqual('input')
    
    expect(XpathMapper.findUpTag(input, 'div')).toEqual('//body/div')



