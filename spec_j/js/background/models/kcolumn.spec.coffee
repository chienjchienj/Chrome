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

    @def_array2 = [{
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
        el: "b"
        class: ".prop-img"
      }]

    @def_array3 = [{
        el: "td"
        class: ".row"
        id: "#clementi"
      },{                
        el: "p"
        position: 2
        class: ".contact-info"
      },{
        el: "a"
        class: ".address"
      },{
        el: "span"
        class: ".street"
      },{
        el: "b"
        class: ".prop-img"
      }]

  it "should create a new Column with an id", ->
    col = new KColumn @page_id
    expect(col.id).toEqual 1
    expect(KColumn.find().length).toEqual 1

  describe "setDomArray", ->
    it "should lowercase the element attribute", ->
      col = new KColumn @page_id
      dom_array = [{
        el: "TD"
        class: ".row"
        id: "#clementi"
      }]
      result = col.setDomArray dom_array
      expect(result).toEqual true      
      expect(col.dom_array[0].el).toEqual "td"

    it "should return false if the input is null", ->
      col = new KColumn @page_id
      result = col.setDomArray null;
      expect(result).toEqual false
      expect(col.dom_array.length).toEqual 0

    it "should return false if the input is a variable but not an array", ->
      col = new KColumn @page_id
      result = col.setDomArray "ccc";
      expect(result).toEqual false
      expect(col.dom_array.length).toEqual 0

  describe "copyDomArray", ->
    it "should return an array if input was valid", ->
      copied_array = KColumn.copyDomArray @def_array
      expect(KColumn.isArray(copied_array)).toBe true
      expect(copied_array.length).toEqual 5

    it "should return an empty array if input is a variable but not an array", ->
      copied_array = KColumn.copyDomArray "c"
      expect(KColumn.isArray(copied_array)).toBe true
      expect(copied_array.length).toEqual 0

    it "should return an empty array if input is null", ->
      copied_array = KColumn.copyDomArray null
      expect(KColumn.isArray(copied_array)).toBe true
      expect(copied_array.length).toEqual 0

  describe "isIdentical", ->
    it "should return true", ->
      copied_array = KColumn.copyDomArray @def_array
      expect(KColumn.isIdentical copied_array, @def_array).toBe true

    it "should return false", ->
      expect(KColumn.isIdentical @def_array2, @def_array).toBe false

  describe "domQuery", ->
    it "should return a well-formed query string", ->
      col = new KColumn @page_id
      col.setDomArray @def_array

      expect(col.domQuery()).toEqual "td.row#clementi > div:nth-child(2).contact-info > a.address > span.street > img.prop-img"

  describe "hasAnchor", ->

    it "should be true", ->
      col = new KColumn @page_id
      col.setDomArray @def_array      
      expect(col.hasAnchor()).toBe true

    it "should be false", ->
      col = new KColumn @page_id
      dom_array = [{
        el: "td"
        class: ".row"
        id: "#clementi"        
      },{                
        el: "div"
        position: 2
        class: ".contact-info"
      }]
      col.setDomArray dom_array
      expect(col.hasAnchor()).toBe false

  describe "clone", ->
    it "should return a twin brother", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      col_clone = col.clone()
      expect(col_clone.id == col.id).toBe false
      expect(col_clone.page_id).toEqual col.page_id
      expect(col_clone.dom_array.length).toEqual col.dom_array.length
      expect(col_clone.dom_array[0].el).toEqual "td"
      expect(KColumn.instances.length).toEqual 2

    it "should not update dom_array of col if twin brother's was updated", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      col_clone = col.clone();  
      col_clone.dom_array.push 
        el: "span"
        class: ".row"
        id: "#clementi"

      expect(col_clone.dom_array.length).toEqual col.dom_array.length + 1

    it "should not update object in dom_array of col if twin brother's was updated", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      col_clone = col.clone()
      col_clone.dom_array[0].el = 'body'
      expect(col_clone.dom_array[0].el == col.dom_array[0].el).toBe false
      expect(col.dom_array[0].el).toEqual "td"
        
  describe "pruneToAnchor", ->

    it "should be true", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      expect(col.pruneToAnchor()).toBe true
      expect(col.tailElement().el).toEqual "a"

    it "should be false", ->
      col = new KColumn @page_id
      dom_array = [{
        el: "td"
        class: ".row"
        id: "#clementi"        
      },{                
        el: "div"
        position: 2
        class: ".contact-info"
      }]
      col.setDomArray dom_array
      expect(col.pruneToAnchor()).toBe false
      expect(col.tailElement().el).toEqual "div"

  describe "isEmpty", ->
    it "should be false", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      expect(col.isEmpty()).toBe false

    it "should be true", ->
      col = new KColumn @page_id
      dom_array = []
      col.setDomArray dom_array
      expect(col.isEmpty()).toBe true
  
  describe "hasSameLineage", ->
    it "should be true if lineage and type are the same", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      expect(col.hasSameLineage(@def_array)).toEqual true

    it "should be true if lineage is the same but the type is different ", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      expect(col.hasSameLineage(@def_array2)).toEqual true

    it "should be false if lineage length is different", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      new_array = @def_array.slice 1
      expect(col.hasSameLineage(new_array)).toEqual false

    it "should be false if lineage length similar but lineage links are different", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      expect(col.hasSameLineage(@def_array3)).toEqual false

  describe "hasSameTailType", ->
    it "should be true if lineage and type are the same", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      expect(col.hasSameTailType(@def_array)).toEqual true

    it "should be true if lineage is differnt but type is the same", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      new_dom_array = [{ el: "img" }]
      expect(col.hasSameTailType(new_dom_array)).toEqual true

    it "should be false when the tail types are differents", ->
      col = new KColumn @page_id
      col.setDomArray @def_array
      expect(col.hasSameTailType(@def_array2)).toEqual false

  describe "fullLineageMerge", ->

    describe "same tail", ->
      it "should return full merged array with generic position", ->
        def_array1 = [{
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

        def_array2 = [{
            el: "td"
            class: ".row"
            id: "#clementi"
          },{                
            el: "div"
            position: 3
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

        def_array3 = [{
            el: "td"
            class: ".row"
            id: "#clementi"
          },{                
            el: "div"
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

        merged_array = KColumn.fullLineageMerge def_array1, def_array2
        expect(KColumn.isIdentical merged_array, def_array3).toBe true

    describe "different tail", ->
      it "should return full merged array with generic position", ->
        def_array1 = [{
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

        def_array2 = [{
            el: "td"
            class: ".row"
            id: "#clementi"
          },{                
            el: "div"
            position: 3
            class: ".contact-info"
          },{
            el: "a"
            class: ".address"
          },{
            el: "span"
            class: ".street"
          },{
            el: "span"
            class: ".prop-img"
          }]

        def_array3 = [{
            el: "td"
            class: ".row"
            id: "#clementi"
          },{                
            el: "div"
            class: ".contact-info"
          },{
            el: "a"
            class: ".address"
          },{
            el: "span"
            class: ".street"
          },{
            el: "*"
            class: ".prop-img"
          }]

        merged_array = KColumn.fullLineageMerge def_array1, def_array2
        expect(KColumn.isIdentical merged_array, def_array3).toBe true


    describe "broken lineage", ->
      it "should return full merged array with generic position", ->
        def_array1 = [{
            el: "td"
            class: ".row"
            id: "#clementi"
          },{                
            el: "div"
            position: 3
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

        def_array2 = [{
            el: "td"
            class: ".row"
            id: "#clementi"
          },{                
            el: "p"
            position: 3
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

        merged_array = KColumn.fullLineageMerge def_array1, def_array2
        expect(merged_array).toBe false

  describe "partialLineageMerge", ->
    describe "broken lineage", ->
      it "should return full merged array with generic position", ->
        def_array1 = [{
            el: "td"
            class: ".row"
            id: "#clementi"
          },{                
            el: "div"
            position: 3
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

        def_array2 = [{
            el: "td"
            class: ".row"
            id: "#clementi"
          },{                
            el: "p"
            position: 3
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

        def_array3 = [{
            el: "a"
            class: ".address"
          },{
            el: "span"
            class: ".street"
          },{
            el: "img"
            class: ".prop-img"
          }]

        merged_array = KColumn.partialLineageMerge def_array1, def_array2
        expect(KColumn.isIdentical merged_array, def_array3).toBe true    

    describe "uneven lineage", ->
      it "should return full merged array with generic position", ->
        def_array1 = [{
            el: "td"
            class: ".row"
            id: "#clementi"
          },{                
            el: "div"
            position: 3
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

        def_array2 = [{         
            el: "div"
            position: 3
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

        def_array3 = [{
            el: "div"
            position: 3
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

        merged_array = KColumn.partialLineageMerge def_array1, def_array2
        expect(KColumn.isIdentical merged_array, def_array3).toBe true
  
  describe "merge", ->
    it "should merge successfully with full lineage and same tail", ->
      def_array1 = [{
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

      def_array2 = [{
          el: "td"
          class: ".row"
          id: "#clementi"
        },{                
          el: "div"
          position: 3
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

      def_array3 = [{
          el: "td"
          class: ".row"
          id: "#clementi"
        },{                
          el: "div"
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

      col = new KColumn @page_id
      col.setDomArray def_array1
      expect(col.merge def_array2).toBe true
      expect(KColumn.isIdentical col.dom_array, def_array3).toBe true

    it "merge successfully with full lineage merge and differing tail", ->
      def_array1 = [{
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

      def_array2 = [{
          el: "td"
          class: ".row"
          id: "#clementi"
        },{                
          el: "div"
          position: 3
          class: ".contact-info"
        },{
          el: "a"
          class: ".address"
        },{
          el: "span"
          class: ".street"
        },{
          el: "span"
          class: ".prop-img"
        }]

      def_array3 = [{
          el: "td"
          class: ".row"
          id: "#clementi"
        },{                
          el: "div"
          class: ".contact-info"
        },{
          el: "a"
          class: ".address"
        },{
          el: "span"
          class: ".street"
        },{
          el: "*"
          class: ".prop-img"
        }]
      col = new KColumn @page_id
      col.setDomArray def_array1
      expect(col.merge def_array2).toBe true
      expect(KColumn.isIdentical col.dom_array, def_array3).toBe true   

    it "should merge successfully with partial lineage merge", ->
      def_array1 = [{
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
          el: "span"
          class: ".prop-img"
        }]

      def_array2 = [{
          el: "td"
          class: ".row"
          id: "#clementi"
        },{                
          el: "td"
          position: 3
          class: ".contact-info"
        },{
          el: "a"
          class: ".address"
        },{
          el: "span"
          class: ".street"
        },{
          el: "span"
          class: ".prop-img"
        }]

      def_array3 = [{
          el: "a"
          class: ".address"
        },{
          el: "span"
          class: ".street"
        },{
          el: "span"
          class: ".prop-img"
        }]
      col = new KColumn @page_id
      col.setDomArray def_array1
      expect(col.merge def_array2).toBe true
      expect(KColumn.isIdentical col.dom_array, def_array3).toBe true   

    it "should not merge successfully with non-matching lineage and differing tail", ->
      def_array1 = [{
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
          el: "span"
          class: ".prop-img"
        }]

      def_array2 = [{
          el: "td"
          class: ".row"
          id: "#clementi"
        },{                
          el: "td"
          position: 3
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

      col = new KColumn @page_id
      col.setDomArray def_array1
      expect(col.merge def_array2).toBe false

  describe "toParams", ->
    it "should return valid params", ->
      col = new KColumn @page_id
      def_array1 = [{
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
          el: "span"
          class: ".prop-img"
        }]    
      col.setDomArray def_array1
      expect(col.toParams()).toEqual 
        col_name: "Property 1"
        dom_query: 'td.row#clementi > div:nth-child(2).contact-info > a.address > span.street > span.prop-img'
      
    it "should return valid params with required_attribute param", ->
      col = new KColumn @page_id
      def_array1 = [{
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
          el: "span"
          class: ".prop-img"
        }]    
      col.setDomArray def_array1
      col.required_attribute = "data"
      expect(col.toParams()).toEqual 
        col_name: "Property 1"
        dom_query: 'td.row#clementi > div:nth-child(2).contact-info > a.address > span.street > span.prop-img'
        required_attribute: "data"