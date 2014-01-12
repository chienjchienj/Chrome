var PaginationXpathMapper = Object.create(XpathMapper);

PaginationXpathMapper.getElementXPath = function(element){
  var self = this;
  try {
    element = self.findUpTag(element, 'A');

    self.siblingSignature(element);

    var xpath = self.getElementTreeXPath(element);
    return { xpath : xpath };

  } catch(error) {
    console.log("Error occured while obtaining Xpath for the selected element.\nReason: " + error);
  }
}

// @Description: gets the signature that accurately identifies this dom element from its siblings
// @param: element:DOM_element
// @return: xpath_element:String
PaginationXpathMapper.siblingSignature = function(element) {
  var element_type = element.nodeName;
  var element_class = element.className;
  var element_id = element.id;
  var element_text = element.innerText;

  /** //a[@class='class_name'] **/

  /** //a[@class='class_name'] **/
}

// @Description: gets the signature that accurately identifies this dom element's parent from the parent's siblings
// @param: element:DOM_element
// @return: xpath_element:String
PaginationXpathMapper.parentSignature = function(element) {

}

// @Description: checks if the given signature is unique on the DOM tree
// @param: signature:String 
//    e.g. //a[@class='className']
// @return: is_unique:boolean
PaginationXpathMapper.isUnique = function(signature) {

}