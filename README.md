Introduction 
===
This is the source code for the Krake browser extension in Google Chrome.

To download and test run the currently publish version go to the 
[Chrome Extension Gallery](https://chrome.google.com/webstore/detail/krakeio/ofncgcgajhgnbkbmkdhbgkoopfbemhfj "Krake Browser Extension")

To check out the online engine go to the site
[Krake.IO](https://krake.io "Data Harvesting")


Usability Testing Results
===

23th August 2013
---
- Subjects
  - Darius Cheung
    - Had difficulties knowing he needs to highlight elements in page
    - Thought to click on the notification box instead since its highlighted
    - Force users to watch video before doing shit
    
  - MIT friend of Darius Cheung
    - Hint Bar is too far away from location of required action
    - Tried to highlight the item in the page
    
  - Fred 
    - Did not know to highlight items in page
    - Hint Bar is too far away from location of required action    

  - Thomas
    - Always give visual clue on what's next
    - OK save button
    - Grey off the existing green button and then change the save to green
    - When Run button then ask for parameters if its declared
    - When run krake 
        - route https://krake.io/krakes/7-itunes-app-store/run?param1=x&param2=x
    - /show?
    - /run?
    - Google Compute Engine
    
  - Stephanie
    - watching video before use is really helpful
    - Did not know to press Enter after typing in the field name
    - Feels that any instruction video above 1 min 30 secs is too long to watch
    - was surprised the Krake name was not the same as the field name she typed in
    - tried to drag and drop the item from the page to the field in the browser extension
    - http://www.zotero.org/
    - tried to press done after creating a new field without having added any items to the field
      - subsequent message to add more items was never read
    - When creating list only wanted specific items on the page not all of them.
    - Saw it to be potentially useful to help her do price comparison
      - experienced pain from prior experience of having to press multiple tab 
      - experience pain from prior experience of having to write down everything on a piece of paper
    - Was expecting to see results when done button is clicked
    - used the term Bookmark
      - http://list.qoo10.sg/item/UAG-CASES-SAMSUNG-GALAXY-MEGA-S4/407258995?sid=1411
    - Expresses difficulty undoing previous action if wrongly added an item to bookmark

Backlog
===
- TODO : Ability to toggle bar at the bottom between visibility and non-visibility
- TODO : Column Name focused when [enter] is do nothing
- TODO : Ensure not records are created for pages with no URLs
- TODO : Ensure when sub link is clicked
    create a sharedKrake with the following
      parentColumnId
      parentURL

- TODO : have the array of separate Krake definitions compiled for a specific Tab on the fly when the done button is clicked



Documentation
===
This is how a single Shared Kraked data object for a page will look like

    {
      
      // The page this Krake definition is mapping to
      "origin_url": "http://sg.yahoo.com/?p=us",
            
      // some_urls_within_the_same_shared_krakes_object
      "parent_url" : "arbitrary_string",
      
      // maps_to_categoryId_in_parent_shared_krakes
      "parent_columnId" : "arbitrary_string",
      
      // The xpath to utilize in the event there is a next page
      next_page : {
        "xpath" : "arbiturary_string"
      },
      
      // cookies
      "cookies" : [{
          "domain": ".imdb.com",
          "expirationDate": 1535023661.151548,
          "hostOnly": false,
          "httpOnly": false,
          "name": "session-id",
          "path": "/",
          "secure": false,
          "session": false,
          "storeId": "0",
          "value": "448-7368846-1611791"
      },
      {
          "domain": ".imdb.com",
          "expirationDate": 1535023661.15161,
          "hostOnly": false,
          "httpOnly": false,
          "name": "session-id-time",
          "path": "/",
          "secure": false,
          "session": false,
          "storeId": "0",
          "value": "1535048846"
      }],
      
      // The columns of data
      "columns": [
          {
              "columnId": 5452399814,
              "columnName": "category name",
              "colorCode": " k_highlight_FFCC00 ",
              "url": "http://sg.yahoo.com/?p=us",
              "selections" : [{
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[2]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "Messenger",
                  "elementLink": null
              },{
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[3]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "News",
                  "elementLink": null
              },{
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[3]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "News",
                  "elementLink": null
              }],              
              "genericXpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li/a[1]/span[2]",
              "requiredAttribute": null
          },
          {
              "columnId": 5554264208,
              "columnType": "list",
              "columnName": "category icon",
              "colorCode": " k_highlight_FF6600 ",
              "url": "http://sg.yahoo.com/?p=us",
              "selections" : [{
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[2]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "Messenger",
                  "elementLink": null
              },{
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[3]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "News",
                  "elementLink": null
              },{
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[3]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "News",
                  "elementLink": null
              }],              
              "genericXpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li/a[1]/span[1]/img[1]",
              "requiredAttribute": "src"
          },
          {
              "columnId": 734958031,
              "columnType": "single",
              "columnName": "header",
              "colorCode": " k_highlight_3EA99F ",
              "url": "http://sg.yahoo.com/?p=us",
              "selections" : [{
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[2]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "Messenger",
                  "elementLink": null
              },{
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[3]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "News",
                  "elementLink": null
              },{
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[3]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "News",
                  "elementLink": null
              }],
              "genericXpath": "/html[1]/body[1]/div/div[4]/div[3]/div[5]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[1]/div[1]/div[1]/div[1]/div[1]/div[1]/h2[1]",
              "requiredAttribute": null
          }
      ]
    }