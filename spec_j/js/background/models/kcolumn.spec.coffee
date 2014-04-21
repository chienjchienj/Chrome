KColumn = require "../../../../js/background/models/kcolumn"

describe "KColumn", ->
  beforeEach ->
    @page_id = 1
    KColumn.reset()
    @def_array = [{
        el: "td"
        class: ".row"
        id: "#clementi"
      },{                
        el: "div"
        position: 2
        class: ".contact-info"
      },{
        el: "a"
        class: ".address"
      },{
        el: "span"
        class: ".street"
      },{
        el: "img"
        class: ".prop-img"
      }]

  it "should create a new Column with an id", ->
    col = new KColumn @page_id
    expect(col.id).toEqual 1
    expect(KColumn.find().length).toEqual 1

  describe "dom_query", ->
    it "should return a well-formed query string", ->
      col = new KColumn @page_id
      col.dom_array = @def_array

      expect(col.dom_query()).toEqual "td.row#clementi > div:nth-child(2).contact-info > a.address > span.street > img.prop-img"

  describe "has anchor", ->

    it "should true", ->
      col = new KColumn @page_id
      col.dom_array = @def_array
      expect(col.has_anchor()).toBe true

    it "should true", ->
      col = new KColumn @page_id
      col.dom_array = [{
        el: "td"
        class: ".row"
        id: "#clementi"        
      },{                
        el: "div"
        position: 2
        class: ".contact-info"
      }]
      expect(col.has_anchor()).toBe false

  describe "clone", ->
    it "should return a twin brother", ->
      col = new KColumn @page_id
      col.dom_array = @def_array
      col_clone = col.clone();  
      expect(col_clone.id == col.id).toBe false
      expect(col_clone.page_id).toEqual col.page_id
      expect(col_clone.dom_array.length).toEqual col.dom_array.length

    it "should not update dom_array of col if twin brother's was updated", ->
      col = new KColumn @page_id
      col.dom_array = @def_array
      col_clone = col.clone();  
      col_clone.dom_array.push 
        el: "span"
        class: ".row"
        id: "#clementi"

      expect(col_clone.dom_array.length).toEqual col.dom_array.length + 1

    it "should not update object in dom_array of col if twin brother's was updated", ->
      col = new KColumn @page_id
      col.dom_array = @def_array
      col_clone = col.clone();  
      col_clone.dom_array[0].el = 'body'
      expect(col_clone.dom_array[0].el == col.dom_array[0].el).toBe false
      expect(col.dom_array[0].el).toEqual "td"
        