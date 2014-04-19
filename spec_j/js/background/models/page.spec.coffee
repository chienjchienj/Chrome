Page = require "../../../../js/background/models/page"

describe "Page", ->

  beforeEach ->
    Page.reset()
    @page_url       = "http://google.com"
    @window_id      = 10
    @parent_url     = "http://google.com"
    @parent_col_id  = 11111
    @page_title     = "what to do"

  describe "Constructor", ->

    it "should only create page instance once for each url loaded in a window", ->
      page = new Page @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      expect(Page.instances.length).toEqual 1
      expect(Page.instances[0].window_id).toEqual @window_id
      expect(Page.instances[0].origin_url).toEqual @page_url      

    it "should only create page instance once for each url loaded in a window", ->
      page1 = new Page @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      page2 = new Page @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      expect(Page.instances.length).toEqual 1  

  describe "hasParent", ->

    it "should have parent", ->
      page = new Page @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      expect(page.hasParent()).toEqual true

    it "should not have parent when parent url is null", ->
      page = new Page @page_url, @window_id, null, null, @page_title
      expect(page.hasParent()).toEqual false

    it "should not have parent when parent url is undefined", ->
      page = new Page @page_url, @window_id, undefined, undefined, @page_title
      expect(page.hasParent()).toEqual false

    it "should not have parent when parent url is false", ->
      page = new Page @page_url, @window_id, false, false, @page_title
      expect(page.hasParent()).toEqual false

  describe "parent", ->
    it "should return its parent", ->
      page1 = new Page @page_url, @window_id, null, null, @page_title
      page2 = new Page "Somewhere over the rainbow", @window_id, @page_url, @parent_col_id, @page_title      
      expect(page2.parent()).toEqual page1

  describe "root", ->
    it "should return earliest ancestor", ->
      page1 = new Page @page_url, @window_id, null, null, @page_title
      page2 = new Page "sub1", @window_id, @page_url, @parent_col_id, @page_title
      page3 = new Page "sub2", @window_id, "sub1", @parent_col_id, @page_title
      page4 = new Page "sub3", @window_id, "sub2", @parent_col_id, @page_title
      expect(page4.root()).toEqual page1

  describe "children", ->
    it "should return its direct children", ->
      page1 = new Page @page_url, @window_id, null, null, @page_title
      page2 = new Page "sub1", @window_id, @page_url, @parent_col_id, @page_title
      page3 = new Page "sub2", @window_id, @page_url, @parent_col_id, @page_title
      page4 = new Page "sub3", @window_id, @page_url, @parent_col_id, @page_title
      expect(page1.children().length).toEqual 3

  describe "columns", ->