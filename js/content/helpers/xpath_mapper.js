var XpathMapper = 
{
  fireEvent : function(e, eventNumber){
    var _eventNumber = e? e.data.eventNumber : eventNumber;
    chrome.extension.sendMessage({ action: "fire_mixpanel_event", 
                                   params: { eventNumber : _eventNumber } });
  },//eo mixpanel
  
  /*
   * @Return: { text:string, nodeCount:string, nodesToHighlight:array }
   */
  evaluateQuery: function(query)
  {
    var xpathResult = null;
    var str = '';
    var nodeCount = 0;
    var nodesToHighlight = [];

    try {
      xpathResult = document.evaluate(query, document.body, null,
                                      XPathResult.ANY_TYPE, null);
    } catch (e) {
      str = '[INVALID XPATH EXPRESSION]';
      nodeCount = 0;
    }

    if (!xpathResult) {
      return [str, nodeCount];
    }

    if (xpathResult.resultType === XPathResult.BOOLEAN_TYPE) {
      str = xpathResult.booleanValue ? '1' : '0';
      nodeCount = 1;
    } else if (xpathResult.resultType === XPathResult.NUMBER_TYPE) {
      str = xpathResult.numberValue.toString();
      nodeCount = 1;
    } else if (xpathResult.resultType === XPathResult.STRING_TYPE) {
      str = xpathResult.stringValue;
      nodeCount = 1;
    } else if (xpathResult.resultType ===
               XPathResult.UNORDERED_NODE_ITERATOR_TYPE) {
      for (var it = xpathResult.iterateNext(); it;
           it = xpathResult.iterateNext()) {
        nodesToHighlight.push(it);
        if (str) {
          str += '\n';
        }
        str += it.textContent;
        nodeCount++;
      }
      if (nodeCount === 0) {
        str = '[NULL]';
      }
    } else {
      str = '[INTERNAL ERROR]';
      nodeCount = 0;
    }
    
    return { 
             text: str,
             nodeCount: nodeCount,
             nodesToHighlight: nodesToHighlight
           };

  },//eo evaluateQuery

  clearElementHighlights: function()
  {
  	$('.k_highlight').removeClass('k_highlight');
  },//eo clearElementHighlights
   
  addElementHighlights: function(nodeList, colorCode)
  {
    for (var i = 0, l = nodeList.length; i < l; i++)
    {
      nodeList[i].className += colorCode;
    }
  },//eo addElementHighlights

  getElementXPath: function(element){
    try
    {
      var nodename = element.nodeName.toLowerCase();
      
      var link = nodename=="a"? element.href : nodename=="img"? element.src : null;
      var xpath = XpathMapper.getElementTreeXPath(element);
      
      // In case its ancestor is a hyperlink
      if(!link) {
        var ancestor_link_ele = XpathMapper.findUpTag(element, 'A');
        if(ancestor_link_ele) {
          var hyperlink_xpath = XpathMapper.getElementTreeXPath(ancestor_link_ele);
          link = ancestor_link_ele.href
        }
      
      // In case it itself is a hyperlink
      } else if(link && nodename == "a") {
        var hyperlink_xpath = xpath;
        
      } else {
        var hyperlink_xpath = null;
      }
      
      return {
               nodeName : element.nodeName,
               xpath : xpath,
               hyperlink_xpath : hyperlink_xpath,
               link : link
             }
    }
    catch(error)
    {
      console.log("Error occured while obtaining Xpath for the selected element.\nReason: " + error);
    }
  },//eo getElementXPath

  getElementTreeXPath: function(element)
  {
    var paths = [];

      for (; element && element.nodeType == 1; element = element.parentNode)
      {
          var index = 0;
          var nodeName = element.nodeName;
          
          for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
          {
              if (sibling.nodeType != 1) continue;
              
              if (sibling.nodeName == nodeName)
                  ++index;
          }
          
          var tagName = element.nodeName.toLowerCase();
          //var pathIndex = (index ? "[" + (index+1) + "]" : "");
          
          // adds iterator for normal nodes
          if(element.parentNode.tagName != 'BODY') {
            
            var pathIndex = "[" + (index+1) + "]";
            paths.splice(0, 0, tagName + pathIndex);            

          // Remove iterator for direct child of Body Node — causes some hiccups in the engine            
          } else {
            
            paths.splice(0, 0, tagName);
            
          }

      }

      return paths.length ? "/" + paths.join("/") : null;
  },
  
  // @Description : given an element gets its first ancestor that has the occuring tag match
  // @param : dom_element:Object
  // @param : tag:String
  //    — Example : A, DIV, TR, TD
  // @return : parent_element:Object
  findUpTag : function(dom_element, tag) {
    
    if (dom_element.tagName === tag)
        return dom_element;
        
    while (dom_element.parentNode) {
        dom_element = dom_element.parentNode;
        if (dom_element.tagName === tag)
            return dom_element;
    }
    
    return null;
    
  }
  

};//eo XpathMapper

// Export XpathMapper object of Jasmine testing
try { module && (module.exports = XpathMapper); } catch(e){}
