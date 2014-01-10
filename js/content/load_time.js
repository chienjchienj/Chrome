// Adds the pagination declaration in the background
var timerStart = Date.now();

window.onload = function() {
  chrome.extension.sendMessage({ action:"set_wait_time", wait : Date.now() - timerStart + 200 }, function(response) {
    if(response.status == 'success') {} 
  });  
}
