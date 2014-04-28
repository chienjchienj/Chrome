var PaginationMapper = Object.create(XpathMapper);

// Stickiness level beyond which the algorithm gives up and returns computed jQuery selector
PaginationMapper.stickiness_threshold = 4;

PaginationMapper.getElementSignature = function(element){
  var self = this;
  try {

    element = self.findUpTag(element, 'A');
    var response = {};
    response.dom_query = self.uniqueSignature(element);
    !response.dom_query && (response.xpath = self.getElementTreeXPath(element));
    return response;

  } catch(error) {
    console.log("Error occured while obtaining Xpath for the selected element.\nReason: " + error);
    return false;
    
  }
}

// @Description: gets the signature that accurately identifies this dom element from other elements in the DOM tree
// @param: element:DOM_element
// @param: child_signature:String - E.g. div/div[@contains(text(), 'something')]
// @param: child_uniqueness:int - E.g. how many times the child occurrence has happened
// @param: stickiness:int - E.g. how many levels the computed signature has had the same uniqueness
// @return: xpath_element:String
PaginationMapper.uniqueSignature = function(element, child_signature, child_uniqueness, stickiness) {
  console.log(element);
  var self = this;

  var current_signature = element.nodeName.toLowerCase();
  var element_id = element.id;
  var element_class = element.className;
  var element_text = element.innerText;

  element_id && element_id.length > 0 && (current_signature += '#' + element_id );
  element_class && element_class.length > 0 && (current_signature += self.compoundClassNames(element_class));

  if(child_signature && child_signature.length > 0) {
    current_signature += ' ' + child_signature;

  } else if(element_text && element_text.length > 0) {
    current_signature += ':contains("' + element_text.replace(/"/g, '\\"') + '")';
  }

  console.log(current_signature);
  num_matches = $(current_signature).length

  // found a unique xpath signature expression
  if(num_matches == 1){
    return current_signature;

  // give up and return xpath signature as it is
  } else if (stickiness + 1 >= self.stickiness_threshold && child_uniqueness == num_matches){
    return current_signature;

  // uniqueness has changed
  } else if (element.parentElement && num_matches != child_uniqueness) {
    return self.uniqueSignature(element.parentElement, current_signature, num_matches, 0);

  // return signature that includes description of parent 
  } else if(element.parentElement && num_matches == child_uniqueness) {
    return self.uniqueSignature(element.parentElement, current_signature, num_matches, stickiness + 1);
    
  // has no parent
  } else {
    console.log("Opps. Unique signature could not be found ");
  }

}

// @Description : takes in a space separated list of class names and return a well formated css selector
// @param class_names:String
// @return formated_class_names:String
PaginationMapper.compoundClassNames = function(class_names) {
  var class_names = class_names.trim();
  if(class_names.length > 0) {

    return class_names.split(/\s+/).map(function(current) {
      return "." + current;
    }).join("");

  } else {
    return "";

  }

}

