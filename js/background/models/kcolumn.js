var KColumn = function(page_id) {
  var self = this;
  self.id                 = KColumn.getId();
  self.page_id            = page_id;
  self.dom_array          = [];
  self.required_attribute = null;  
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

KColumn.prototype.dom_query = function() {
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

KColumn.prototype.has_anchor = function() {
  var self = this;
  return self.dom_array.filter(function(dom) {
    return dom.el == 'a';
  }).length > 0;
};

/** Makes a copy of this KColumn object **/
KColumn.prototype.clone = function() {
  var self = this;
  var twin_bro = new KColumn(self.page_id);
  KColumn.instances.push(twin_bro);
  twin_bro.dom_array = self.dom_array.slice(0);
  twin_bro.dom_array = twin_bro.dom_array.map(function(el_obj) {
    new_el_obj = Object.keys(el_obj).map(function(el_obj_attr){
      return el_obj[el_obj_attr];
    });
    return new_el_obj;
  });
  return twin_bro;
};

/** Node environmental dependencies **/
try { module && (module.exports = KColumn); } catch(e){}