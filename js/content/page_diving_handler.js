var PageDivingHandler = {}

// @Description : given a column object attachs the eventual link to the column object
// @param : column:Object
//    columnId:String
//    elementType:String
//    genericXpath:String
PageDivingHandler.showLink = function(column) {
  if(column.elementType.toLowerCase() == 'a') {
    var selector = '#krake-column-control-' + column.columnId;    
    
    // ensures link is only added once    
    if( $(selector + ' .krake-control-button-link').length > 0 ) return;

    $linkButton = PageDivingHandler.getLink(column);
    $(selector).append($linkButton);
        
  }//eo if    
}



// @Description : given a column object returns a link to its subpage
// @param : column:Object
//    columnId:String
//    elementType:String
//    genericXpath:String
PageDivingHandler.getLink = function(column) {

    var linkButtonImageUrl = "background-image: url(\"" + chrome.extension.getURL("images/link.png") + "\");";
    var $linkButton = $("<a>", { class: "k_panel krake-control-button krake-control-button-link",
                                      title: "get more columns within this subpage",
                                      style:  linkButtonImageUrl });
    $linkButton.tooltip();
    
    chrome.extension.sendMessage({ action:"get_session" }, function(response) {       
      var results = XpathHelper.evaluateQuery(column.genericXpath);
      $linkButton.attr('href', results.nodesToHighlight[0].href);

    });//eo sendMessage
    
    // return $linkButton;
  
}