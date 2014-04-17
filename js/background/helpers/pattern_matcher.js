var PatternMatcher = {
  
  // @Description : Given two xpath returned generic xpath
  //    in the event whereby one xpath is shorter than the other, use the shorter one as the default
  // @param : xpath1:String
  // @param : xpath2:String
  // @return : result:Object
  //    status:String
  //    genericXpath:String
  findGenericXpath: function(xpath1, xpath2){
    var xpath1Array = xpath1.split("/");
    var xpath2Array = xpath2.split("/");

    // swap the arrays in case array1 is longer
    if(xpath1Array.length > xpath2Array.length ) {
      var tempArray = xpath1Array;
      xpath1Array = xpath2Array;
      xpath2Array = tempArray;
    }
    
    var genericXpathArray = [];

    for(var i = 0; i < xpath1Array.length; i++ ) {
      //also check if the node names are the same
      if((xpath1Array[i].split("["))[0] != (xpath2Array[i].split("["))[0])
        return { status : 'unmatched' };

      var element = xpath1Array[i] == xpath2Array[i]? xpath1Array[i] : (xpath1Array[i].split("["))[0];
      
      //add to array if, and only if the node names are the same
      genericXpathArray.push(element);
    }
    
    var genericXpath = genericXpathArray.join("/");
    return { status: 'matched', genericXpath: genericXpath };
  }//eo findGenericXpath
  
}//eo brain