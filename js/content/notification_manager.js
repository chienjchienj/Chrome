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
  
  
  
  // @Description : Shows the notifications in the notifications bar. They are only shown when in tutorial mode
  // @Param: notice_info:Array || notice_obj:obj
  //            notice_obj:obj
  //                type:string message type 'warning','error','success', 'info'
  //                title:string
  //                message:string
  //                elements_to_highlight:array
  //                    css_selector1:String, 
  //                    css_selector2:String
  //                anchor_element : css_selector:String
  //                position:object
  //                    center:boolean
  //                    top:int
  //                    left:int
  showNotification : function(notice_info) {
        
    if( NotificationManager.behavioral_mode != DEFAULT_MODE ) return;

    // resets bubble and glowing element
    NotificationManager.clearGlowingHints();
    NotificationManager.hideAllMessages();
    
    // Shows the relevant notifications bubble as well as the glowing elements
    var showAll = function(params) {
      params.title = params.title || "";      
      if(params.elements_to_highlight) NotificationManager.showHints(params.elements_to_highlight);
      
      var close_button = $("<a>" , { id : "k_message_close_button", html : "x" });
      var notification_box = $("<span>" , { class : "k_panel", html : params.title });
      var bubble = $("<div>", {  class : "k_testing k_message k_panel k_alert_boxes" });
      bubble.addClass('k_'+params.type);
      bubble.append(close_button).append(notification_box);
      $('body').append(bubble);

      var hideBubble = function(e) {
        $(bubble).fadeOut(100).remove();
      }
      $(close_button).bind('click', hideBubble);

      var top_position = 10;
      var right_position = 10;
      var left_position = "";
      
      var bubble_dimensions = NotificationManager.getRelativeAttributes(bubble);  
      var k_panel_dimensions = NotificationManager.getRelativeAttributes("#panel.k_panel");
      
      // positioning of notification box
      if(params.position && params.position.center) {
        $(bubble).hide().css({
          left : "50%" , top : "50%",
          marginLeft: -1 * bubble_dimensions.width / 2,
          marginTop: -1 * bubble_dimensions.height / 2,
          position : "fixed"
        }).fadeIn({ duration : 100 });
      
      } else if(params.position) {
        left_position = params.position.left;
        top_position = params.position.top;
        $(bubble).hide().css({ left : left_position , top : top_position, position : "fixed" }).fadeIn({ duration : 100 });
                
      } else if(params.anchor_element) {
        var anchor_item_position = NotificationManager.getRelativeAttributes(params.anchor_element);
        left_position = anchor_item_position.left;
        top_position = anchor_item_position.top - bubble_dimensions.height - 30;
        $(bubble).hide().css({ left : left_position , top : top_position, position : "fixed" }).fadeIn({ duration : 100 });
        
      } 
      
                      
    } // eo showAll

    
    // if an array of notice_objs are given
    if (Object.prototype.toString.call( notice_info ) === '[object Array]' ) {
      for( var x = 0; x < notice_info.length ; x++ ) {
        console.log(notice_info[x]);
        showAll(notice_info[x]);
      }
      
    // when is single notification object
    } else {
      showAll(notice_info);
      
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
  clearGlowingHints : function()  {
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
    NotificationManager.clearGlowingHints();    

    if(params.title)
      $('#k_option_title').html(params.title);

    if(params.message)
      $('.k_option>p').html(params.message);
    
    if (params.yesFunction && typeof(params.yesFunction) === "function") 
      $('#k_option_yes').unbind('click').bind('click', params.yesFunction);

    if (params.noFunction && typeof(params.noFunction) === "function")
      $('#k_option_no').unbind('click').bind('click', params.noFunction);

    //$('#k_message_close_button').attr("src", chrome.extension.getURL("images/close.png"));
    $('.k_option').hide().css({top:"10", right : "10", left : ""}).fadeIn();
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
    result.top = jQuery(css_selector).offset().top - $(window).scrollTop();
    result.left = jQuery(css_selector).offset().left - $(window).scrollLeft();
    result.width = 
      jQuery(css_selector).width() +
      parseInt( jQuery(css_selector).css("border-left-width"), 10) +
      parseInt( jQuery(css_selector).css("border-right-width"), 10) +
      parseInt( jQuery(css_selector).css("padding-left"), 10) +
      parseInt( jQuery(css_selector).css("padding-right"), 10) +
      parseInt( jQuery(css_selector).css("margin-left"), 10) +
      parseInt( jQuery(css_selector).css("margin-right"), 10);

    result.height = 
      jQuery(css_selector).height() +
      parseInt( jQuery(css_selector).css("border-top-width"), 10) +
      parseInt( jQuery(css_selector).css("border-bottom-width"), 10) +
      parseInt( jQuery(css_selector).css("padding-top"), 10) +
      parseInt( jQuery(css_selector).css("padding-bottom"), 10) +
      parseInt( jQuery(css_selector).css("margin-top"), 10) +
      parseInt( jQuery(css_selector).css("margin-bottom"), 10);

    
    return result
  } 
  
};//eo NotificationManager
