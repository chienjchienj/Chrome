# Introduction 

This is the source code for the Krake browser extension in Google Chrome.

To download and test run the currently publish version go to the 
[Chrome Extension Gallery](https://chrome.google.com/webstore/detail/krakeio/ofncgcgajhgnbkbmkdhbgkoopfbemhfj "Krake Browser Extension")

To check out the online engine go to
[Krake.IO](https://getdata.io "Data Harvesting")

# Backlog
## To Do list based upon priorities
  — TODO : To implement full unit testing coverage for tool
  — TODO : Conversion of notations to use CSS selector
  — TODO : Abstraction of class files for easy re-porting to Safari and Firefox
  - TODO : To capture meta description content and use as description for Krake
  - TODO : Clean up the nested COOKIES nonsense
  - TODO : Ability to toggle bar at the bottom between visibility and non-visibility



# Documentation

### Unit test

##### Jasmine
For testing of DOM Tree independent Class behaviours
```console
jasmine-node --coffee spec_j
```

##### PhantomJS
For testing Class behaviors in the context of a DOM Tree

```console
coffee spec_p/fixtures/test_server.coffee
phantomjs spec_p/test_suit.js
```



### Meta body for storage of Krake definition
This is how this browser extension stores a single Shared Kraked data object for a page in the background.
```json
    {
      
      // The page this Krake definition is mapping to
      "origin_url": "http://sg.yahoo.com/?p=us",
            
      // some_urls_within_the_same_shared_krakes_object
      "parent_url" : "arbitrary_string",
      
      // maps_to_categoryId_in_parent_shared_krakes
      "parent_columnId" : "arbitrary_string",
      
      // The css selector to utilize in the event there is a next page
      next_page : {
        "dom_query" : "arbiturary_string"
      },
      
      // Page title
      page_title : "arbiturary_string",
            
      // The columns of data
      "columns": [
          {
              "columnId": 5452399814,
              "columnName": "category name",           
              "dom_anchor": [{
                  el: "td",
                  class: ".class1.class2"
                },{                
                  el: "div",
                  class: ".class1.class2"
                },{
                  el: "a",
                  class: ".class1.class2"
                }],
              // Maximum 5 levels, ordered from root to edge
              "dom_element": [{
                  el: "td",
                  class: ".class1.class2"
                },{                
                  el: "div",
                  class: ".class1.class2"
                },{
                  el: "a",
                  class: ".class1.class2"
                },{
                  el: "span",
                  class: ".class1.class2"
                },{
                  el: "img",
                  class: ".class1.class2"
                }],
              "requiredAttribute": null
          },
          {
              "columnId": 5554264208,
              "columnType": "list",
              "columnName": "category icon",
              "genericAncestorLinkXpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li/a[1]",              
              "genericXpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li/a[1]/span[1]/img[1]",
              "requiredAttribute": "src"
          },
          {
              "columnId": 734958031,
              "columnName": "header",
              "genericAncestorLinkXpath": "/html[1]/body[1]/div/div[4]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/ol[1]/li/a[1]",              
              "genericXpath": "/html[1]/body[1]/div/div[4]/div[3]/div[5]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[1]/div[1]/div[1]/div[1]/div[1]/div[1]/h2[1]",
              "requiredAttribute": null
          }
      ],

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
      }]

    }

```    