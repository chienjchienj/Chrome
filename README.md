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



### Data Structure

##### Browser Tabs Mapping
Each Window owns multiple Page objects

```json
{
  tab_id_1:INTEGER : {
    isActive: BOOLEAN,
    shared_krakes: {
      url1:STRING : PageMap,
      ...
    },
    history: []
  },
  ...
  tab_id_10:INTEGER : {...}
}
```

##### PageMap
Each PageMap maps to one specific URL. Each PageMap can have 0 or 1 parent
```json
{
  
  // The page this is mapped to
  "origin_url": STRING,
        
  // The page this page is a child of
  "parent_url" : STRING,
  
  // The parent this child maps to
  "parent_columnId" : INTEGER,
  
  // The css selector to utilize in the event there is a next page
  next_page : { "dom_query" : STRING },
  
  // Page title
  page_title : "arbiturary_string",
        
  // The columns of data
  "columns": [{
    id: INTEGER,
    col_name: STRING,
    // Maximum 5 levels, ordered from root to edge
    dom_array: [{ // Translates to td:nth-child(1).class1.class2#dom_id
        el: "td",
        class: ".class1.class2",
        id: "#dom_id"
      },{                
        el: "div",
        class: ".class1.class2",
        id: "#dom_id"
      },{
        el: "a",
        class: ".class1.class2",
        id: "#dom_id"
      },{
        el: "span",
        class: ".class1.class2",
        id: "#dom_id"
      },{
        el: "img",
        class: ".class1.class2",
        id: "#dom_id"
      }],
    required_attribute: STRING
  },
  ...],

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
  ...]
}

```    