var KColumn = function(page_id, tab_id) {
  var self = this;
  self.id                 = KColumn.getId();
  self.page_id            = page_id;
  self.tab_id             = tab_id;
  self.col_name           = "Property " + self.id
  self.dom_array          = [];
  self.required_attribute = null;  
  self.is_active          = false;
  KColumn.instances.push(self);
  return self;
};

KColumn.instances = [];

KColumn.getId = function() {
  return KColumn.instances.length + 1;
};

KColumn.reset = function() {
  KColumn.instances = [];
};

/**
  Returns an array of KColumn instances with match parameters

  param:
    id
    page_id
**/ 
KColumn.find = function(param) {
  param = param || {};
  return KColumn.instances.filter(function(obj) {
    to_return = true;
    Object.keys(param).forEach(function(attr) {
      to_return &= param[attr] == obj[attr];
    });
    return to_return;
  });
};

KColumn.isArray = function(dom_array) {
  if( Object.prototype.toString.call( dom_array ) === '[object Array]' ) {
    return true;
  };
  return false;
}

/**
  Makes a replicate of the given array. Returns an empty array if the dom_array is not a valid array
**/
KColumn.copyDomArray = function(dom_array) {
  if( !KColumn.isArray(dom_array) ) { return []; };

  return dom_array.slice(0).map(function(el_obj) {
    var new_el_obj = {};
    Object.keys(el_obj).forEach(function(el_obj_attr){
      new_el_obj[el_obj_attr] = el_obj[el_obj_attr];
    });
    return new_el_obj;
  });  
}

/**
  Takes in two dom_arrays and compares them.

  Returns true if all the attributes and order are the same
  Returns false otherwise
**/
KColumn.isIdentical = function(old_dom_array, new_dom_array) {
  if(old_dom_array.length != new_dom_array.length) return false;
  da_1 = KColumn.copyDomArray(old_dom_array);
  da_2 = KColumn.copyDomArray(new_dom_array);  

  while((e1 = da_1.pop()) && (e2 = da_2.pop())){
    if(e1.el != e2.el) return false;
    if(e1.position != e2.position) return false;
    if(e1.class != e2.class) return false;
    if(e1.id != e2.id) return false;
  }
  return true;

}


/**
  Returns a dom_array when the lineage is the same but the tail element might or might not be different
**/
KColumn.fullLineageMerge = function(old_dom_array, new_dom_array) {
  var self = this;

  if(old_dom_array.length != new_dom_array.length) return false;

  var common_lineage = [];

  da_1 = KColumn.copyDomArray(old_dom_array);
  da_2 = KColumn.copyDomArray(new_dom_array);

  var is_first = true;

  while((e1 = da_1.pop()) && (e2 = da_2.pop())){
    var new_e = {};

    if(is_first) { // Make allowance for differing tail element
      is_first = false;
      if(e1.el && e2.el && e1.el != e2.el) new_e.el = "*";
      else if(e1.el && e2.el && e1.el == e2.el)  new_e.el = e2.el;

    } else { // No more allowance for differing non-tail elements
      if(e1.el && e1.el == e2.el) new_e.el = e2.el;
      else return false;

    }

    if(e1.position && e1.position == e2.position) new_e.position = e2.position;
    if(e1.class && e1.class == e2.class) new_e.class = e2.class;
    if(e1.id && e1.id == e2.id) new_e.id = e2.id;  

    common_lineage.push(new_e);
  }

  return common_lineage.reverse();

}

/**
  Returns a dom_array when is not the same lineage but the tail element is the same
  returns false otherwise
**/
KColumn.partialLineageMerge = function(old_dom_array, new_dom_array) {

  var common_lineage = [];
  da_1 = KColumn.copyDomArray(old_dom_array);
  da_2 = KColumn.copyDomArray(new_dom_array);

  while((e1 = da_1.pop()) && (e2 = da_2.pop())){
    var new_e = {};

    if(e1.el && e1.el == e2.el) new_e.el = e2.el;
    else break;

    if(e1.position && e1.position == e2.position) new_e.position = e2.position;
    if(e1.class && e1.class == e2.class) new_e.class = e2.class;
    if(e1.id && e1.id == e2.id) new_e.id = e2.id;  

    common_lineage.push(new_e);
  }
  common_lineage = common_lineage.reverse();
  return common_lineage;

}

KColumn.prototype.parentPageUrl = function() {
  var self = this;
  var kpage = new KPage.find({ id: self.page_id })[0];
  
  if(kpage) return kpage.origin_url;
  return false;
}


/** 
  Sets the dom array for this column
  returns false if the input is invalid
**/
KColumn.prototype.set = function(dom_array) {
  var self = this;  

  if( !KColumn.isArray(dom_array) ) { return false; };

  self.dom_array = dom_array.map(function(item) {
    item.el = item.el.toLowerCase();
    return item;
  });

  return true;
}

/** Return true if dom_array is empty **/
KColumn.prototype.isSet = function() {
  var self = this;    
  return self.dom_array.length > 0;
}

/** Return true if dom_array is empty **/
KColumn.prototype.isEmpty = function() {
  var self = this;    
  return self.dom_array.length == 0;
}

KColumn.prototype.domArray = function() {
  var self = this;
  return self.dom_array;
}

KColumn.prototype.domQuery = function() {
  var self = this;
  return self.dom_array.map(function(dom){
    query = "";
    dom.el        && (query += dom.el);
    dom.position  && (query += ":nth-child(" + dom.position + ")");
    dom.class     && (query += dom.class);
    dom.id        && (query += dom.id);
    return query;

  }).join(" > ");
};

/**
  CSS query of the next set of dom arrays to recommends

  Returns Array || null

**/
KColumn.prototype.recommendedArray = function() {
  var self = this;
  var recommended_array = [];
  var has_morphed = false;

  for(var x = self.dom_array.length - 1; x >= 0; x--) {
    var curr_dom = self.dom_array[x];
    var new_dom = {};

    Object.keys(curr_dom).forEach(function(attr) {

      if(attr == "position" && !has_morphed) {
        has_morphed = true;

      } else {
        new_dom[attr] = curr_dom[attr];
      }
    });

    recommended_array.unshift(new_dom);

  }

  if(has_morphed) return recommended_array;
  else return null;
}

/**
  CSS query of the next set of dom arrays to recommend

  Returns String || null
**/
KColumn.prototype.recommendedQuery = function() {
  var self = this;
  var recommend_array = self.recommendedArray();

  if(!recommend_array) return recommend_array;

  return recommend_array.map(function(dom){
    query = "";
    dom.el        && (query += dom.el);
    dom.position  && (query += ":nth-child(" + dom.position + ")");
    dom.class     && (query += dom.class);
    dom.id        && (query += dom.id);
    return query;

  }).join(" > ");  
}

KColumn.prototype.hasAnchor = function() {
  var self = this;
  return self.dom_array.filter(function(dom) {
    return dom.el == 'a';
  }).length > 0;
};

/** 
  prunes the dom_array to the anchor 

  returns 
    True: if anchor does exist and dom_array was successfully pruned
    False: if anchor does not exist and dom_array was not pruned

**/
KColumn.prototype.pruneToAnchor = function() {
  var self = this;
  anchor_index = self.dom_array.map(function(dom) {
    return dom.el;
  }).indexOf("a");

  if(anchor_index < 0 ) return false;

  self.dom_array = self.dom_array.slice(0, anchor_index + 1)
  return true;

};


/**
  returns the last tail most element object of the dom_array
  return false if dom_array is empty
**/
KColumn.prototype.tailElement = function() {
  var self = this;
  if(!self.dom_array || self.dom_array.length == 0) 
    return false;
  else
    return self.dom_array[self.dom_array.length - 1];
}

/** Makes a copy of this KColumn object **/
KColumn.prototype.clone = function() {
  var self = this;
  dom_array = KColumn.copyDomArray(self.dom_array);

  var twin_bro = new KColumn(self.page_id);  
  twin_bro.required_attribute = self.required_attribute;
  twin_bro.set(dom_array);  
  return twin_bro;
};

/** 
  Given a new dom_array merges it to the existing dom_array to create a generic dom_array
  Returns 
    True: if merged and was able to generate a generic dom_array expression that describes both dom arrays
    False: if was unable to generate a generic dom_array expression that describes both dom arrays

**/
KColumn.prototype.merge = function(new_dom_array) {
  var self = this;
  if(self.hasSameLineage(new_dom_array)) {
    merged_array = KColumn.fullLineageMerge(self.dom_array, new_dom_array);
    self.set(merged_array);
    return true;

  } else if(self.hasSameTailType(new_dom_array)) {
    merged_array = KColumn.partialLineageMerge(self.dom_array, new_dom_array);
    self.set(merged_array);
    return true;

  }
  return false;
}

/**
  Given two dom_arrays check if their lineage are the same
**/
KColumn.prototype.hasSameLineage = function(new_dom_array) {
  var self = this;
  if(self.dom_array.length != new_dom_array.length) return false;

  var mismatch = true;
  self.dom_array.forEach(function(dom, index) {
    if(dom.el != new_dom_array[index].el && index < self.dom_array.length - 1) {
      mismatch = false;
    }
  });
  return mismatch;

}

/**
  Given two dom_arrays check if tail Elements are of the same type
**/
KColumn.prototype.hasSameTailType = function(new_dom_array) {
  var self = this;
  if(new_dom_array.length == 0 || self.dom_array.length == 0) return false;
  if(new_dom_array[new_dom_array.length - 1].el != self.dom_array[self.dom_array.length - 1].el) return false;
  return true;

}

/**
  Returns the JSON partial for the data definition schema
  
  Returns:
    column_object: https://getdata.io/docs/define-data#column_object
**/
KColumn.prototype.toParams = function() {
  var self = this;
  var partial = {};
  partial.col_name = self.col_name;
  partial.dom_query = self.domQuery();
  if(self.required_attribute) partial.required_attribute = self.required_attribute;
  return partial;
}

/**
  Returns the JSON for content.js display
**/
KColumn.prototype.toJson = function() {
  var self    = this;
  var partial = {};
  partial.id                = self.id;
  partial.page_id           = self.page_id;
  partial.page_url          = self.parentPageUrl();
  partial.col_name          = self.col_name;
  partial.dom_array         = self.domArray();  
  partial.dom_query         = self.domQuery();
  partial.recommended_array = self.recommendedArray();  
  partial.recommended_query = self.recommendedQuery();
  partial.is_active         = self.is_active;

  if(self.required_attribute) partial.required_attribute = self.required_attribute;
  return partial;
}

/** Node environmental dependencies **/
try { module && (module.exports = KColumn); } catch(e){}