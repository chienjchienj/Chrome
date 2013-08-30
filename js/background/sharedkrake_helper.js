// @Description : creates a helper object that allows for easy manipulation of the sharedKrake definition object
//  that corresponds to the current URL
// @param tab_id:String
// @param url:String
var SharedKrakeHelper = function(tab_id, url) {
  var self = this;
  self.tab_id = tab_id;
  self.url = url;
    
  self.setSharedKrake(tab_id, url);
  
};



// @Description : sets the current sharedKrake for helper to the one indicated, if not exist create a new one and set it
// @param tab_id:String
// @param url:String
SharedKrakeHelper.prototype.setSharedKrake = function(tab_id, url) {
  var self = this;  
  records[tab_id] = records[tab_id] || {};
  records[tab_id].shared_krakes = records[tab_id].shared_krakes || {}
  self.SharedKrake = records[tab_id].shared_krakes[url] = records[tab_id].shared_krakes[url] || self.spawnSharedKrake(url);
}



// @Description : adds a new sharedKrake to the records corresponding to the tab
//    new sharedKrake is only added if it doesn't already exist
// @param: tab_id:String
// @param: url:String
// @param: parent_url:String
// @param: parent_columnId:String
SharedKrakeHelper.prototype.addSharedKrake = function(tab_id, url, parent_url, parent_columnId) {
  
  var self = this;  
  
  records[tab_id] = records[tab_id] || {};
  records[tab_id].shared_krakes = records[tab_id].shared_krakes || {}
  
  var curr_sk = records[tab_id].shared_krakes[url] = records[tab_id].shared_krakes[url] || self.spawnSharedKrake(url);    

  if(parent_url && parent_columnId && !curr_sk['parent_url'] && !curr_sk['parent_columnId'] ) {
    curr_sk['parent_url'] = parent_url;
    curr_sk['parent_columnId'] = parent_columnId;
    
  }  

}


// @Description : gets an instantiation of a sharedKrake object
// @param : settings:Object
//    origin_url:String
SharedKrakeHelper.prototype.spawnSharedKrake = function(origin_url) {
  var sk = new SharedKrake();
  sk.origin_url = origin_url;
  return sk;
}



// @Descriptions saves the current column to the current sharedKrake Object
// @param : column:Object
//    
SharedKrakeHelper.prototype.saveColumn = function(column) {
  
  var self = this;
  self.SharedKrake.columns.push(column);
  
  // If is a hyperlink then set a placeholder sharedKrake in the records array first
  if(column.elementType == 'a' && column.selections && column.selections.length > 0
  && column.selections[0] && column.selections[0].elementLink ) {
    
    self.addSharedKrake(
      self.tab_id, 
      column.selections[0].elementLink, 
      column.url, 
      column.columnId );
  }

}//eo addColumnToSharedKrake



/*
 * @Return:  deletedColumn:obj
 */
SharedKrakeHelper.prototype.removeColumn = function(columnId) {
  var self = this;  
  console.log("removeColumnFromSharedKrake");
  return self.removeColumnFromSharedKrake(self.SharedKrake.columns, columnId);
},//eo removeColumnFromSharedKrake



SharedKrakeHelper.prototype.removeColumnFromSharedKrake = function(columns, columnId) {
  var self = this;    
  for(var i=0; i<columns.length; i++) {
  	//console.log('column[i].columnId := ' + columns[i].columnId + ', columnId := ' + columnId);
    if(columns[i].columnId==columnId) {
    	var deletedColumn = columns[i];

    	columns.splice(i, 1);
      return deletedColumn; 
    }
  }
  return null;
};


  
/*
 * @Return: column:obj
 */
SharedKrakeHelper.prototype.findColumnByKey = function(key, value) {
  var self = this;
  return self.searchColumnByKey(self.SharedKrake.columns, key, value);
};



SharedKrakeHelper.prototype.searchColumnByKey = function(columns, key, value) {
  var self = this;    
  //console.log('key := ' + key);
  for(var i=0; i<columns.length; i++) {
    //dirty hack, address this properly later
    if(key == 'elementLink' && columns[i].selection[0] && columns[i].selection[0].elementLink == value) {
      return columns[i];
      
    }else if(columns[i][key] == value) {
      console.log('columns[i].selection[0].elementLink := ' + columns[i].selection[0].elementLink)
      return columns[i];
      
    }
  }
  return null;
};//eo searchColumn
  
  
SharedKrakeHelper.prototype.searchColumn = function(columns, columnId) {
  var self = this;    
  for(var i=0; i<columns.length; i++) {
    if(columns[i].columnId==columnId) {
      return columns[i];
    }
    /*
    else{
      var result = self.searchColumn(columns[i].options.columns, columnId);
      if(result) return result;
    }*/
  }
  return null;
};//eo searchColumn
  ///////////////////////////////////////////////



  /*
   * @Return: column object array
   */
SharedKrakeHelper.prototype.getBreadcrumbArray = function(columnId) {
  var self = this;    
  var breadcrumbArray = [];
  var result;

  if(sessionManager.currentColumn) {
    result = self.getBreadcrumbColumnArray(self.SharedKrake.columns, 
  	                                                  sessionManager.currentColumn.parentColumnId, 
  	                                                  breadcrumbArray, 
  	                                                  SharedKrake.columns);
  }else{
    result = self.getBreadcrumbColumnArray(self.SharedKrake.columns, 
  	                                                  columnId, 
  	                                                  breadcrumbArray, 
  	                                                  SharedKrake.columns);
  }
  
  if(result && sessionManager.currentColumn) 
    result.unshift(sessionManager.currentColumn);

  return result? result : [sessionManager.currentColumn];
};



SharedKrakeHelper.prototype.getBreadcrumbColumnArray = function(columns, columnId, breadcrumbColumnArray, originalColumns) {
  var self = this;  
	for(var i=0; i<columns.length; i++) {
	  //console.log('column[' + i + '] := ' + columns[i].columnId + ', columnId := ' + columnId);

    if(columns[i].columnId==columnId) {
      breadcrumbColumnArray.push(columns[i]);
      
      //console.log("hello getBreadcrumbColumnArray");

      if(columns[i].parentColumnId) {
        var parentColumnId = columns[i].parentColumnId;
        columns = originalColumns;
        var parentColumn = self.getBreadcrumbColumnArray(columns, parentColumnId, breadcrumbColumnArray, originalColumns); 
          
        if(!parentColumn)
          return breadcrumbColumnArray;
      }//eo if
        
      return breadcrumbColumnArray;
    }
    /*
    else{
      var result = self.getBreadcrumbColumnArray(columns[i].options.columns, columnId, breadcrumbColumnArray, originalColumns);
      if(result) return result;
    }*/
  }//eo for
  return null;
};//eo getBreadcrumbColumnArray



// @Description : Given an Xpath String sets it as the xpath attribute in the next_page attribute for this current Shared_Krake
// @param : xpath:String
SharedKrakeHelper.prototype.setNextPager = function(xpath) { 
  var self = this;    
  console.log('setNextPager.xpath := ' + xpath);
  sharedKrake.next_page = sharedKrake.next_page || {};
  sharedKrake.next_page.xpath = xpath;

};//eo setNextPager



// @Description : Creates the actual scrape definition from the current sharedKrake object 
//    at current level only
// @param : callback:function
//    status : String — 'success' || 'error'
//    krake_json : Object
SharedKrakeHelper.prototype.createScrapeDefinitionJSON = function(callback) {
  var self = this;
  
  if(!self.SharedKrake.columns || self.SharedKrake.columns.length == 0) {
    callback && callback( 'empty', false); 
    return;
   
  }
  
  var krake_json = {};

  for(var key in self.SharedKrake) {
    var mappedColumnName = self.getMappedColumnName(key);

    switch(key) {
      case "origin_url":
        krake_json[mappedColumnName] = self.SharedKrake[key];
      break;

      case "columns":
        var result = self.createColumnsJson( self.SharedKrake.columns );
        if(result)
          krake_json["columns"] = result;
      break;

      case "next_page":
        krake_json[key] = self.SharedKrake[key];
      break;

    }//eo switch

  }//eo for

  // sets the cookie object to the Krake definition
  ch = new CookieHelper();
  ch.setCookie(self.SharedKrake, function( status, sharedKrake ) {
    self.SharedKrake = sharedKrake;
    krake_json.cookies = self.SharedKrake.cookies;
    callback && callback( 'success', krake_json);
  });
  
};//eo createScrapeDefinitionJSON



// @Description : get the fully compiled Krake definition that this sharedKrake belongs to
// @param : callback:function
//    status:String
//    krake_definition:Object 
SharedKrakeHelper.prototype.getFullKrakeDefinition = function(callback) {
  var self = this;  
  // get root ancestor helper
  var root_SKH = self.getRootAncestorHelper();
  
  // getKrakedefinition
  root_SKH.getKrakeDefinition(function(status, krake_definition) {
    if(status == 'success') {
      callback('success', krake_definition);
      
    } else {
      callback('empty', krake_definition);
      
    }
    
  });
}



// @Description : gets the sharedKrakeHelper for the top most page
SharedKrakeHelper.prototype.getRootAncestorHelper = function() {
  var self = this;  
    
  // get the root ancestor sharedKrake object
  var curr_SK = self.SharedKrake;
  while(curr_SK.parent_url) {
    curr_SK = records[self.tab_id].shared_krakes[curr_SK.parent_url];
    
  }
  
  // converts it into a sharedKrakeHelper
  var root_SKH = new SharedKrakeHelper(self.tab_id, curr_SK.origin_url);
  return root_SKH;
}



// @Description : get the compiled Krake definition of it and its children
// @param : callback:function
//    status:String
//    krake_definition:Object
SharedKrakeHelper.prototype.getKrakeDefinition = function(callback) {
  var self = this;

  // createScrapeDefinitionJSON
  self.createScrapeDefinitionJSON(function(status, krake_json, parent_column_id) {
    
    if(status == 'success') {
      // attaching new legs to the current krake to link to sub krakes
      var attachTentacles = function(status, krake_definition_holders) {
           
        if(status == 'success' && krake_definition_holders && krake_definition_holders.length > 0) {
          
          // foreach column tentable
          for( var x = 0; x < krake_definition_holders.length; x++ ) {
              //append nested krake to current krake definition
              var new_krake_column = self.getTentacle(krake_definition_holders[x]);
              krake_json.columns.push(new_krake_column);
          }
        }
        // return fully formed Krake Definition
        callback && callback( 'success', krake_json, self.getParentColumnId() );   
      }    
      // get nested krakes
      self.getNestedKrakes(attachTentacles)
      
    } else {
        callback && callback( 'empty', krake_json, self.getParentColumnId() );         
    }

  });
  
}



// @Description : returns the parent column id if it exist
SharedKrakeHelper.prototype.getParentColumnId = function() {
  var self = this;    
  return self.SharedKrake.parent_columnId;
}



// @Description : gets the sharedKrake for the top most page
// @return : sharedKrake:Object
SharedKrakeHelper.prototype.getRootAncestor = function() {
  var self = this;
  
  // When sharedKrake of this helper has no parent
  if(!self.SharedKrake.parent_url) {
    return self.SharedKrake;
  
  // When sharedKrake of this helper has parent
  } else {
    var parent_SKH = new SharedKrake(self.tab_id, self.SharedKrake.parent_url);
    return parent_SKH.getRootAncestor();
    
  }
  
}


// @Description : Given a krake_definition_holder returns tha valid Krake_definition_column object
// @param : nested_definition_holder:Object
//    column_id:String
//    krake:Object
// @return : krake_column_object:Object
SharedKrakeHelper.prototype.getTentacle = function(nested_definition_holder) {
  var self = this;
    
  var current_tentacle = {};
    
  for( var x = 0; x < self.SharedKrake.columns.length; x++ ) {
    if(self.SharedKrake.columns[x].columnId == nested_definition_holder.parent_column_id) {
      
      current_tentacle.xpath = self.SharedKrake.columns[x].genericXpath;
      current_tentacle.col_name = self.SharedKrake.columns[x].columnName + '_link';
      current_tentacle.required_attribute = 'href';
      current_tentacle.options = JSON.parse(JSON.stringify(nested_definition_holder.krake));
      delete current_tentacle.options.origin_url;
    }
  }
  
  return current_tentacle;
  
}



// @Description : get compiled Krake definition of all children
// @param : callback:function
//        status:String
//        krake_definition_holders:Array
//            krake_definition_holder:Object
//                column_id:String
//                krake:Object
SharedKrakeHelper.prototype.getNestedKrakes = function(callback) {

  // getChildrenHelpers
  var self = this;
  var children_helpers = self.getChildrenHelpers();
  var krake_definition_holders = [];
  
  var compile_each_child = function(child_helper, next) {
    
    child_helper.getKrakeDefinition( function(status, krake_definition, parent_columnId) {
      if(status == 'success') {
        var krake_definition_holder = {}
        krake_definition_holder.krake = krake_definition;
        krake_definition_holder.parent_column_id = parent_columnId
        krake_definition_holders.push(krake_definition_holder);
      }
      
      next();
    } );
    
  }
  
  var compilation_completed = function(err) {
    callback && callback('success', krake_definition_holders);
  }
  
  async.each(children_helpers, compile_each_child, compilation_completed);

}



// @Description : gets the SharedKrakeHelpers of direct children
// @return : shared_krake_helpers:Array
//    sharedKrakeHelper
SharedKrakeHelper.prototype.getChildrenHelpers = function() {
  
  var self = this;
  var children_helper = [];
  var children_url = Object.keys(records[self.tab_id].shared_krakes);
  var curr_tab_records = records[self.tab_id];
  
  for( var x = 0; x < children_url.length ; x++ ) {
    
    var curr_child_SK = curr_tab_records.shared_krakes[ children_url[x] ];
    if(curr_child_SK.parent_url 
       && curr_child_SK.parent_url == self.url) {
         var curr_child_SKH = new SharedKrakeHelper(self.tab_id, children_url[x]);
         children_helper.push(curr_child_SKH);
      }
      
  }
  
  return children_helper;  
  
}



// @Description : gets the SharedKrake of direct children
// @return : shared_krake:Array
//    sharedKrake
SharedKrakeHelper.prototype.getChildren = function() {
  
  var self = this;
  var children = [];
  var children_url = Object.keys(records[self.tab_id].shared_krakes);
  var curr_tab_records = records[self.tab_id];
  
  for( var x = 0; x < children_url.length ; x++ ) {
    
    var curr_child_SK = curr_tab_records.shared_krakes[ children_url[x] ];
    if(curr_child_SK.parent_url 
       && curr_child_SK.parent_url == self.url) {
        children.push(curr_child_SK);
      }
      
  }
  
  return children;
  
}



SharedKrakeHelper.prototype.createColumnsJson = function(columns) {   
  var self = this;    
  var columnArrayJson = [];

  for(var i=0; i<columns.length; i++) {
    var columnJson = {};

    for(var key in columns[i]) {
      var mappedColumnName = self.getMappedColumnName(key);
      // console.log('key := ' + key + ', mappedColumnName := ' + mappedColumnName);
      switch(key) {
        case "columnName":
        case "genericXpath":
        case "requiredAttribute":
            if((columns[i])[key])
              columnJson[mappedColumnName] = (columns[i])[key];
        break;
        
        /*
        case "options":
          if(columns[i].options.columns.length>0) {
            var result = self.createOptionsJson( columns[i].options ); 
            if(result)
              columnJson["options"] = result;
          }
        break;
        */
        
      }//eo switch

    }//eo for

    columnArrayJson.push( columnJson );
  }//eo for  

  return  columnArrayJson;

};



SharedKrakeHelper.prototype.createOptionsJson = function(options) {
  var self = this;    
  if(options.columns.length == 0 || options.columns == null)  return null;
  
  var optionJson = {};
  var columnArrayJson = [];

  if(options.nextPager)
    optionJson.next_page = options.nextPager;

  for(var i=0; i<options.columns.length; i++) {
    var columnJson = {};

    for(var key in options.columns[i]) {
      var mappedColumnName = self.getMappedColumnName(key);
      
      switch(key) {
        case "columnName":
        case "genericXpath":
        case "requiredAttribute":
            if((options.columns[i])[key])
              columnJson[mappedColumnName] = (options.columns[i])[key];
        break;

        case "options":
          if(options.columns[i].options.columns.length>0) {
            var result = self.createOptionsJson( options.columns[i].options ); 
            if(result)
              columnJson["options"] = result;
          }
        break;
      }//eo switch

    }//eo for
    
    columnArrayJson.push( columnJson );

  }//eo for

  optionJson["columns"] = columnArrayJson;

  return optionJson;
};



/*
 * @Param: key:string, attributes of sharedKrake object
 * @Return: Corresponding column name to be appeared in krake definition (JSON), or
 *          false: no column name found
 */
SharedKrakeHelper.prototype.getMappedColumnName = function(key) {
  var self = this;  
  for(var columnKey in CommonParams.columnNameMapper) {
    if( columnKey == key ) {
      return CommonParams.columnNameMapper[columnKey];
    }
  }
  return false;
}//eo getMappedColumnName
