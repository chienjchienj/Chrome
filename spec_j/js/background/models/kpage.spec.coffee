KPageVar = require "../../../../js/background/models/kpage"
KPage = KPageVar.KPage
KColumn = KPageVar.KColumn

describe "KPage", ->

  beforeEach ->
    KPage.reset()
    KColumn.reset()
    @page_url       = "http://google.com"
    @window_id      = 10
    @parent_url     = "http://google.com"
    @parent_col_id  = 11111
    @page_title     = "what to do"

  describe "Constructor", ->

    it "should only create page instance once for each url loaded in a window", ->
      page = new KPage @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      expect(KPage.instances.length).toEqual 1
      expect(KPage.instances[0].window_id).toEqual @window_id
      expect(KPage.instances[0].origin_url).toEqual @page_url      

    it "should only create page instance once for each url loaded in a window", ->
      page1 = new KPage @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      page2 = new KPage @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      expect(KPage.instances.length).toEqual 1

  describe "find", ->
    it "should find page instance by parent_url", ->
      page1 = new KPage @page_url + "page1", @window_id, @parent_url, @parent_col_id, @page_title
      page2 = new KPage @page_url + "page2", @window_id, @parent_url, @parent_col_id + 1, @page_title
      expect(KPage.find({ parent_url: @parent_url}).length).toEqual 2

    it "should find page instance by parent_col_id", ->
      page1 = new KPage @page_url + "page1", @window_id, @parent_url, @parent_col_id, @page_title
      page2 = new KPage @page_url + "page2", @window_id, @parent_url, @parent_col_id + 1, @page_title
      expect(KPage.find({ parent_column_id: @parent_col_id}).length).toEqual 1
      expect(KPage.find({ parent_column_id: @parent_col_id})[0].origin_url).toEqual @page_url + "page1"

    it "should find page instance by parent_col_id and parent_url", ->
      page1 = new KPage @page_url + "page1", @window_id, @parent_url, @parent_col_id, @page_title
      page2 = new KPage @page_url + "page2", @window_id, @parent_url, @parent_col_id + 1, @page_title
      expect(KPage.find({ parent_column_id: @parent_col_id, parent_url: @parent_url }).length).toEqual 1
      expect(KPage.find({ parent_column_id: @parent_col_id})[0].origin_url).toEqual @page_url + "page1"

    it "should find page instance by parent_col_id, parent_url and window_id", ->
      page1 = new KPage @page_url + "page1", @window_id, @parent_url, @parent_col_id, @page_title
      page2 = new KPage @page_url + "page2", @window_id, @parent_url, @parent_col_id + 1, @page_title
      page3 = new KPage @page_url + "page3", @window_id, @parent_url, @parent_col_id + 2, @page_title
      expect(KPage.find({ parent_column_id: @parent_col_id, parent_url: @parent_url, window_id: @window_id }).length).toEqual 1
      expect(KPage.find({ parent_column_id: @parent_col_id})[0].origin_url).toEqual @page_url + "page1"

  describe "hasParent", ->

    it "should have parent", ->
      page = new KPage @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      expect(page.hasParent()).toEqual true

    it "should not have parent when parent url is null", ->
      page = new KPage @page_url, @window_id, null, null, @page_title
      expect(page.hasParent()).toEqual false

    it "should not have parent when parent url is undefined", ->
      page = new KPage @page_url, @window_id, undefined, undefined, @page_title
      expect(page.hasParent()).toEqual false

    it "should not have parent when parent url is false", ->
      page = new KPage @page_url, @window_id, false, false, @page_title
      expect(page.hasParent()).toEqual false

  describe "parent", ->
    it "should return its parent", ->
      page1 = new KPage @page_url, @window_id, null, null, @page_title
      page2 = new KPage "Somewhere over the rainbow", @window_id, @page_url, @parent_col_id, @page_title      
      expect(page2.parent()).toEqual page1

  describe "root", ->
    it "should return earliest ancestor", ->
      page1 = new KPage @page_url, @window_id, null, null, @page_title
      page2 = new KPage "sub1", @window_id, @page_url, @parent_col_id, @page_title
      page3 = new KPage "sub2", @window_id, "sub1", @parent_col_id, @page_title
      page4 = new KPage "sub3", @window_id, "sub2", @parent_col_id, @page_title
      expect(page4.root()).toEqual page1

  describe "children", ->
    it "should return its direct children", ->
      page1 = new KPage @page_url, @window_id, null, null, @page_title
      page2 = new KPage "sub1", @window_id, @page_url, @parent_col_id, @page_title
      page3 = new KPage "sub2", @window_id, @page_url, @parent_col_id, @page_title
      page4 = new KPage "sub3", @window_id, @page_url, @parent_col_id, @page_title
      expect(page1.children().length).toEqual 3

  describe "newKColumn", ->
    it "should create a column with a generated id", ->
      page1 = new KPage @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      page2 = new KPage @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      col = page2.newKColumn()
      expect(col.page_id).toEqual page2.id
      expect(col.id).toEqual 1

      col2 = page2.newKColumn()
      expect(col2.page_id).toEqual page2.id
      expect(col2.id).toEqual 2

      col3 = page1.newKColumn()
      expect(col3.page_id).toEqual page1.id
      expect(col3.id).toEqual 3

  describe "columns", ->
    it "should return kcolumns belonging to page only", ->
      page1 = new KPage @page_url, @window_id, @parent_url, @parent_col_id, @page_title
      col = page1.newKColumn()
      col2 = page1.newKColumn()
      expect(page1.kcolumns().length).toEqual 2
      expect(
        page1
          .kcolumns()
          .map( (column)=>
            column.id;
          ).sort()
      ).toEqual [col.id, col2.id];

      page2 = new KPage "Second page", @window_id, @parent_url, @parent_col_id, @page_title
      col3 = page2.newKColumn()
      expect(page2.kcolumns().length).toEqual 1
      expect(page2.kcolumns()[0].id).toEqual col3.id

  describe "toParams", ->
    it "should return well formed partial for columns with no nesting", ->
    it "should return well formed partial for columns with 1 level nesting", ->
    it "should return well formed partial for columns with 2 level nesting", ->