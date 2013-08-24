/*
  Copyright 2013 Krake Pte Ltd.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Author:
  Joseph Yang <sirjosephyang@krake.io>
  Gary Teh <garyjob@krake.io>  
*/

/*
 *  This class manages the notifications that show up at the top of the pages to prompt the users to the next action                 
 */
var NotificationManager = {
  myMessages : new Array('warning','error','success', 'info', 'option'),

  init : function(behavioral_mode) {
    NotificationManager.behavioral_mode = behavioral_mode;
    // When message is clicked, hide it
    $('.k_message').click(function() {
      $('.k_message').fadeOut(100)
        .css({
          top: -$('.k_message').outerHeight()
        });      
    });

  },


  hideAllMessages : function() {
    var messagesHeights = new Array(); // this array will store height for each
   
    for (i=0; i<NotificationManager.myMessages.length; i++) {
      messagesHeights[i] = $('.k_' + NotificationManager.myMessages[i]).outerHeight(); // fill array
      $('.k_' + NotificationManager.myMessages[i]).fadeOut(100)
        .css({
          top : -messagesHeights[i]
        });      
      
      
    }//eo for

  },
  
  
  
  /*
   * @Description : Shows the notifications in the notifications bar. They are only shown when in tutorial mode
   * @Param: params:obj
   *                type:string message type 'warning','error','success', 'info'
   *                title:string
   *                message:string
   *                elements_to_highlight : [
   *                    css_selector1:String, 
   *                    css_selector2:String
   *                ],
   *                anchor_element : css_selector:String
   */
  showNotification : function(params) {
    
    // set the elements to highlight
    NotificationManager.clearHints();    
    if(params.elements_to_highlight) NotificationManager.showHints(params.elements_to_highlight);
    
    if( NotificationManager.behavioral_mode == DEFAULT_MODE ) {
      console.log('Showing notifications');
      //return;
      
    } else {
      console.log('Not notifications');
      return;      
    }
    
    NotificationManager.hideAllMessages();

    var notification = "";


    notification = notification + "<a id=\"k_message_close_button\">x</a>";
    
    if(params.title)
      notification = notification + "<span class=\"k_panel\">" + params.title + "</span>";

    $('.k_'+params.type).html(notification);

    $('#k_message_close_button').bind('click', function(e) {
      //trigger parent <div> click action
      $('.k_message').fadeOut(100)
        .css({
          top: -$('.k_message').outerHeight()
        });
      
    });


    if(params.anchor_element) {
      var anchor_item_position = NotificationManager.getRelativeAttributes(params.anchor_element);
      
      $('.k_'+params.type).hide()
        .css({
          left : anchor_item_position.left ,
          top : anchor_item_position.top - 75
        }).fadeIn({
          duration : 100
        });
        
    } else {
      $('.k_'+params.type).css({ top : '10px', left : "", right : '10px' }).fadeIn(100);
      
    }

  },
  
  
  
  // @Description : given an array of css_selector strings make them glow
  // @param : array_of_selectors:array[ css_selector:String, css_selector:String... ] 
  showHints : function(array_of_selectors) {
    for(var x = 0; x < array_of_selectors.length ; x++ ) {
      $(array_of_selectors[x]).addClass('k_tutorial_hint');
      $(array_of_selectors[x]).addClass('k_focus');      
    }
    
  },
  
  
  
  // @Description : clear hints
  clearHints : function()  {
    $('.k_tutorial_hint').removeClass('k_tutorial_hint');
    $('.k_focus').removeClass('k_focus');
    
  },
  
  
  
  /*
   * @Param: params:obj
   *                title:string message type 'warning','error','success', 'info'
   *                message:string
   *                yesFunction:function
   *                noFunction:function
   */
  showOptionsYesNo : function(params) {
    NotificationManager.hideAllMessages();

    if(params.title)
      $('#k_option_title').html(params.title);

    if(params.message)
      $('.k_option>p').html(params.message);
    
    if (params.yesFunction && typeof(params.yesFunction) === "function") 
      $('#k_option_yes').unbind('click').bind('click', params.yesFunction);

    if (params.noFunction && typeof(params.noFunction) === "function")
      $('#k_option_no').unbind('click').bind('click', params.noFunction);

    //$('#k_message_close_button').attr("src", chrome.extension.getURL("images/close.png"));
    
    $('.k_option').animate({top:"10"}, 500);
  },
  
  
  
  // @Description : Get relative position of the first element, height and width
  // @param : css_selector:String
  // @return : result:Object 
  //    relative top
  //    relative left
  //    width
  //    height
  getRelativeAttributes : function(css_selector) {
    var result = {}
    console.log(jQuery(css_selector));
    result.top = jQuery(css_selector).offset().top - $(window).scrollTop();
    result.left = jQuery(css_selector).offset().left - $(window).scrollLeft();
    result.width = 
      jQuery(css_selector).width() +
      parseInt( jQuery(css_selector).css("borderLeftWidth"), 10) +
      parseInt( jQuery(css_selector).css("borderRightWidth"), 10) +
      parseInt( jQuery(css_selector).css("padding-left"), 10) +
      parseInt( jQuery(css_selector).css("padding-right"), 10) +
      parseInt( jQuery(css_selector).css("margin-left"), 10) +
      parseInt( jQuery(css_selector).css("margin-right"), 10);

    result.height = 
      jQuery(css_selector).width() +
      parseInt( jQuery(css_selector).css("borderTopWidth"), 10) +
      parseInt( jQuery(css_selector).css("borderBottomWidth"), 10) +
      parseInt( jQuery(css_selector).css("padding-top"), 10) +
      parseInt( jQuery(css_selector).css("padding-bottom"), 10) +
      parseInt( jQuery(css_selector).css("margin-top"), 10) +
      parseInt( jQuery(css_selector).css("margin-bottom"), 10);

    
    return result
  } 
  
};//eo NotificationManager
