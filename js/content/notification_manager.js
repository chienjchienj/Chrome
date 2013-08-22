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
      $(this).animate({top: -$(this).outerHeight()}, 500);
    });

  },


  hideAllMessages : function() {
    var messagesHeights = new Array(); // this array will store height for each
   
    for (i=0; i<NotificationManager.myMessages.length; i++) {
      messagesHeights[i] = $('.k_' + NotificationManager.myMessages[i]).outerHeight(); // fill array
      $('.k_' + NotificationManager.myMessages[i]).css('top', -messagesHeights[i]); //move element outside viewport   
    }//eo for

  },
  
  
  
  /*
   * @Description : Shows the notifications in the notifications bar. They are only shown when in tutorial mode
   * @Param: params:obj
   *                type:string message type 'warning','error','success', 'info'
   *                title:string
   *                message:string
   */
  showNotification : function(params) {
    if( NotificationManager.behavioral_mode == DEFAULT_MODE ) {
      console.log('Showing notifications');
      //return;
      
    } else {
      console.log('Not notifications');
      return;      
    }
    
    NotificationManager.hideAllMessages();

    var notification = "";


    notification = notification +
                   "<a id=\"k_message_close_button\">x</a>";
    
    /*
    notification = notification +
                   "<img id=\"k_message_close_button\" class=\"k_panel\" src=\"" + 
                   chrome.extension.getURL("images/close.png") + 
                   "\" alt=\"Smiley face\">";
    */

    if(params.title)
      notification = notification + "<span class=\"k_panel\">" + params.title + "</span>";

    /*
    if(params.message)
      notification = notification + "<p class=\"k_panel\">" + params.message + "</p>";
    */
 


    $('.k_'+params.type).html(notification);

    $('#k_message_close_button').bind('click', function(e) {
      //trigger parent <div> click action
      $('.k_message').animate({top: -$('.k_message').outerHeight()}, 500);
      
    });

    $('.k_'+params.type).animate({top:"10"}, 500);
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
  }
  
};//eo NotificationManager
