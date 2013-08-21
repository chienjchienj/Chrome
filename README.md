Introduction 
===
This is the source code for the Krake browser extension in Google Chrome



Backlog
===
— TODO : Make notifications bar small and petite with close button
— TODO : Ability to toggle bar at the bottom between visibility and non-visibility
— TODO : Column Name focused when [enter] is do nothing 
    
— TODO : Ensure not records are created for pages with no URLs
— TODO : Ensure when sub link is clicked
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
      
      "columns": [
          {
              "columnId": 5452399814,
              "columnName": "category name",
              "colorCode": " k_highlight_FFCC00 ",
              "url": "http://sg.yahoo.com/?p=us",
              
              
              
              // Start : New data structure
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
              // End : New data structure
              
              // Start : Existing data structure
              "columnType": "list",              
              "selection1": {
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[2]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "Messenger",
                  "elementLink": null
              },
              "selection2": {
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[3]/a[1]/span[2]",
                  "elementType": "SPAN",
                  "elementText": "News",
                  "elementLink": null
              },
              // End : Existing data structure
              
              
              
              "genericXpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li/a[1]/span[2]",
              "requiredAttribute": null
          },
          {
              "columnId": 5554264208,
              "columnType": "list",
              "columnName": "category icon",
              "colorCode": " k_highlight_FF6600 ",
              "url": "http://sg.yahoo.com/?p=us",
              "selection1": {
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[7]/a[1]/span[1]/img[1]",
                  "elementType": "IMG",
                  "elementText": "",
                  "elementLink": "http://d.yimg.com/a//i/ww/met/pa_icons_18/qype_20100602.gif"
              },
              "selection2": {
                  "xpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li[6]/a[1]/span[1]/img[1]",
                  "elementType": "IMG",
                  "elementText": "",
                  "elementLink": "http://l.yimg.com/dh/ap/sea_news/fantasy-sea.png"
              },
              "genericXpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li/a[1]/span[1]/img[1]",
              "requiredAttribute": "src"
          },
          {
              "columnId": 734958031,
              "columnType": "single",
              "columnName": "header",
              "colorCode": " k_highlight_3EA99F ",
              "url": "http://sg.yahoo.com/?p=us",
              "selection1": {
                  "xpath": "/html[1]/body[1]/div/div[4]/div[3]/div[5]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[1]/div[1]/div[1]/div[1]/div[1]/div[1]/h2[1]",
                  "elementType": "H2",
                  "elementText": "Hot Deals on Gumtree",
                  "elementLink": null
              },
              "selection2": {},
              "genericXpath": "/html[1]/body[1]/div/div[4]/div[3]/div[5]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[1]/div[1]/div[1]/div[1]/div[1]/div[1]/h2[1]",
              "requiredAttribute": null
          },
          {
              "columnId": 9008563112,
              "columnType": "single",
              "columnName": "*New Column*",
              "colorCode": " k_highlight_FF99FF ",
              "url": "http://sg.yahoo.com/?p=us",
              "selection1": {
                  "xpath": "/html[1]/body[1]/div/div[4]/div[3]/div[5]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[1]/div[1]/div[1]/div[1]/div[2]/ul[1]/li[1]/span[1]/a[1]",
                  "elementType": "A",
                  "elementText": "Hot Phones/ Tablets",
                  "elementLink": "http://sg.yahoo.com/_ylt=As_Cvf_a5L.K1PYqjyd1vhOCG7J_;_ylu=X3oDMTI5dm43c2Uz…bmVzJnV0bV9jYW1wYWlnbj1ZYWhvb18wMjEz/RS=%5EADASy9LTtnXxHTjifm5fVCmnGyWa3I-"
              },
              "selection2": {},
              "genericXpath": "/html[1]/body[1]/div/div[4]/div[3]/div[5]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[1]/div[1]/div[1]/div[1]/div[2]/ul[1]/li[1]/span[1]/a[1]",
              "requiredAttribute": null
          }
      ]
    }