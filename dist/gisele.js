//built with clientside 0.2.0 https://github.com/jgallen23/clientside
if (typeof __cs == 'undefined') {
  var __cs = { 
    map: {}, 
    libs: {},
    r: function(p) {
      var mod = __cs.libs[__cs.map[p]];
      if (!mod) {
        throw new Error(mod + ' not found');
      }
      return mod;
    }
  };
  window.require = __cs.r;
}
__cs.map['./lib/gisele'] = 'cs888915'
__cs.map['./lib/remote'] = 'cs353732'
__cs.map['thrive'] = 'cs757352'
__cs.map['./model'] = 'cs514724'
__cs.map['./collection'] = 'cs370030'
__cs.map['./gisele'] = 'cs888915'
__cs.map['data-diff'] = 'cs302063'
__cs.map['aug'] = 'cs633806'
__cs.map['currie'] = 'cs793632'
__cs.map['subs'] = 'cs541017'
__cs.map['simple-guid'] = 'cs487050'
__cs.map['./obj-diff'] = 'cs674888'

//aug.js
__cs.libs.cs633806 = (function(require, module, exports) {
var aug = function __aug() {
  var options, name, src, copy, clone, c,
      deep = false,
      args = Array.prototype.slice.call(arguments),
      target = args.shift(),
      i = 0;
  if (typeof target === 'boolean') {
    deep = true;
    target = args.shift();
  }
  for (c = args.length; i < c; i++) {
    if ((options = args[i]) === null)
      continue;
    for (name in options) {
      src = target[name];
      copy = options[name];
      if (target === copy)
        continue;
      if (deep && copy && typeof copy === 'object') {
        if (copy instanceof Array) {
          clone = src && src instanceof Array ? src : [];
        } else {
          clone = src && typeof src === 'object' ? src : {};
        }
        target[name] = aug(deep, clone, copy);
      } else {
        target[name] = copy;
      }
    }
  }
  return target;
};
if (typeof module !== 'undefined') module.exports = aug;
return module.exports || exports;
})(__cs.r, {}, {});

//currie.js
__cs.libs.cs793632 = (function(require, module, exports) {
var currie = function(fn, scope) {
  var args = [];
  for (var i=2, len = arguments.length; i < len; ++i) {
    args.push(arguments[i]);
  };
  return function() {
    for (var i = 0, c = arguments.length; i < c; i++) {
      args.push(arguments[i]);
    }
    fn.apply(scope, args);
  };
}
module.exports = currie;
return module.exports || exports;
})(__cs.r, {}, {});

//index.js
__cs.libs.cs541017 = (function(require, module, exports) {
var currie = require('currie');
var Subs = function(obj) {
  if (obj) {
    obj._handlers = {};
    for (var key in Subs.prototype) {
      obj[key] = Subs.prototype[key];
    }
    return obj;
  }
  this._handlers = {};
}
Subs.prototype.on = function(event, fn, context) {
  if (!this._handlers[event]) {
    this._handlers[event] = [];
  }
  fn = (context) ? currie(fn, context) : fn;
  this._handlers[event].push(fn);
  return fn;
}
Subs.prototype.emit = function() {
  var args = Array.prototype.slice.call(arguments);
  var event = args.shift();
  if (!this.hasHandlers(event)) {
    return;
  }
  for (var i = 0, c = this._handlers[event].length; i < c; i++) {
    var fn = this._handlers[event][i];
    fn.apply(this, args);
  }
}
Subs.prototype.off = function(event, handler) {
  if (arguments.length == 0) {
    this._handlers = {};
    return;
  }
  if (!this.hasHandlers(event)) {
    return;
  }
  if (arguments.length == 1) {
    delete this._handlers[event];
    return;
  }
  var index = this._handlers[event].indexOf(handler);
  if (~index) {
    this._handlers[event].splice(index, 1);
  }
}
Subs.prototype.once = function(event, handler) {
  var self = this;
  var onceHandler = this.on(event, function(data) {
    handler(data);
    self.off(event, onceHandler);
  });
}
Subs.prototype.hasHandlers = function(event) {
  return !! this._handlers[event];
}
if (typeof module === "object") {
  module.exports = Subs;
}
return module.exports || exports;
})(__cs.r, {}, {});

//thrive.js
__cs.libs.cs757352 = (function(require, module, exports) {
var aug = require('aug');
var currie = require('currie');
var Subs = require('subs');
var init = false;
var Thrive = function() {}
Thrive.extend = function thriveExtend(obj, statics) {
  init = true;
  var proto = new this();
  init = false;
  aug(proto, obj);
  var Thrive = function() {
    this.Class = Thrive;
    Subs.call(this);
    this.construct.apply(this, arguments);
  }
  Thrive.prototype = proto;
  Thrive.prototype.constructor = Thrive;
  var ext = this;
  if (this._root) {
    var staticSafe = ['extend', 'mixin', 'on', 'once', 'off', 'emit', 'hasHandlers'];
    ext = {};
    for (var prop in this) {
      if (staticSafe.indexOf(prop) != -1) {
        ext[prop] = this[prop];
      }
    }
  }
  aug(Thrive, ext, statics);
  Subs.call(Thrive);
  if (Thrive.init) {
    Thrive.init();
  }
 
  return Thrive;
}
Thrive.prototype.construct = function(params) {
  aug(this, params);
  if (this.init) {
    this.init();
  }
}
Thrive.prototype.proxy = function(fn, arg1, arg2, arg3) {
  var args = [fn, this];
  for (var i = 1, c = arguments.length; i < c; i++) {
    args.push(arguments[i]);
  }
  return currie.apply(currie, args);
}
Thrive.mixin = function(obj) {
  aug(this.prototype, obj)
}
Thrive._root = true;
Subs(Thrive);
Subs(Thrive.prototype);
module.exports = Thrive;
return module.exports || exports;
})(__cs.r, {}, {});

//guid.js
__cs.libs.cs487050 = (function(require, module, exports) {
var guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  }).toUpperCase();
}
module.exports = guid;
return module.exports || exports;
})(__cs.r, {}, {});

//model.js
__cs.libs.cs514724 = (function(require, module, exports) {
var guid = require('simple-guid');
var aug = require('aug');
var model = {
  construct: function(params) {
    this.populate(params, true);
    if (this.init) {
      this.init();
    }
  },
  populate: function(data, init) {
    aug(this, this.schema, data);
    for (var key in this.schema) {
      if (typeof this[key] == 'function') {
        this[key] = this[key]();
      }
    }
    this.populated = false;
    for (var key in data) {
      if (key != 'id') {
        this.populated = true;
        break;
      }
    }
  },
  save: function() {
    var isNew = false;
    if (!this.id) {
      this.id = guid();
      isNew = true;
    }
    this.Class.save(this);
    this.emit((isNew) ? 'create' : 'update', this);
  }
}
module.exports = model;
return module.exports || exports;
})(__cs.r, {}, {});

//collection.js
__cs.libs.cs370030 = (function(require, module, exports) {
var collection = {
  init: function() {
    this.clear();
  },
  find: function(id) {
    return this._data[id];
  },
  save: function(item) {
    //save
    var exists = this._data[item.id];
    this._data[item.id] = item;
    if (exists) {
      this.emit('update', item);
    } else {
      this._count++;
      this.emit('create', item);
    }
  },
  all: function() {
    var results = [];
    for (var key in this._data) {
      results.push(this._data[key]);
    }
    return results;
  },
  count: function() {
    return this._count;
  },
  each: function(cb) {
    for (var key in this._data) {
      cb(this._data[key]);
    }
  },
  filter: function(cb) {
    var results = [];
    for (var key in this._data) {
      if (cb(this._data[key])) {
        results.push(this._data[key]);
      }
    }
    return results;
  },
  clear: function() {
    this._data = {};
    this._count = 0;
  },
  populate: function(data, options) {
    options = options || {};
    var update = (options.update);
    if (!update) {
      this.clear();
    }
    for (var i = 0, c = data.length; i < c; i++) {
      var item = data[i];
      var model;
      if (update && item.id && this._data[item.id]) {
        model = this._data[item.id];
        model.populate(item);
      } else {
        model = new this(item);
      }
      model.save();
    }
    this.populated = true;
  },
  remove: function(task) {
    var id = task.id;
    delete this._data[id];
    this._count--;
    this.emit('remove', task);
  },
  sort: function(fn) {
    var items = this.all();
    return items.sort(function(a, b) {
      a = fn(a);
      b = fn(b);
      if (a == b) {
        return 0;
      }
      return (a < b) ? -1 : 1;
    });
  }
}
module.exports = collection;

return module.exports || exports;
})(__cs.r, {}, {});

//gisele.js
__cs.libs.cs888915 = (function(require, module, exports) {
var Thrive = require('thrive');
var model = require('./model');
var collection = require('./collection');
var Gisele = Thrive.extend(model, collection);
module.exports = Gisele;
return module.exports || exports;
})(__cs.r, {}, {});

//obj-diff.js
__cs.libs.cs674888 = (function(require, module, exports) {
var diff = function(obj1, obj2) {
  var out = {};
  var same = true;
  for (var key in obj2) {
    if (obj1[key] == obj2[key]) {
      continue;
    }
    if (!obj1[key]) {
      out[key] = obj2[key];
      same = false;
    } else {
      if (typeof obj2[key] == 'object') {
        var o = diff(obj1[key], obj2[key]);
        if (typeof o == 'object') {
          out[key] = o;
          same = false;
        }
      } else {
        same = false;
        out[key] = obj2[key];
      }
    }
  }
  return same || out;
}
module.exports = diff;
return module.exports || exports;
})(__cs.r, {}, {});

//data-diff.js
__cs.libs.cs302063 = (function(require, module, exports) {
var diff = require('./obj-diff');
var getObj = function(arr, key) {
  var obj = {};
  for (var i = 0, c = arr.length; i < c; i++) {
    var item = arr[i];
    obj[item[key]] = item;
  }
  return obj;
}
var dataDiff = function(data1, data2, key) {
  data1 = getObj(data1, key);
  data2 = getObj(data2, key);
  var out = [];
  for (var id in data2) {
    if (data1[id]) {
      var o = diff(data1[id], data2[id]);
      if (typeof o == 'object') {
        o.id = id;
        out.push(o);
      }
    } else {
      out.push(data2[id]);
    }
  }
  return out;
}
module.exports = dataDiff;
return module.exports || exports;
})(__cs.r, {}, {});

//remote.js
__cs.libs.cs353732 = (function(require, module, exports) {
var Gisele = require('./gisele');
var dataDiff = require('data-diff');
var instance = {
  getUrl: function() {
    var url = (typeof this.url == 'function') ? this.url() : this.url;
    if (url) {
      return url;
    }
    if (this.Class.url) {
      return this.Class.url + this.id;
    }
    return false;
  },
  fetch: function() {
    var self = this;
    var url = this.getUrl(); 
    if (!url) {
      throw new Error('url must be set');
    }
    if (this.fetching) {
      return;
    }
    this.fetching = true;
    this.Class.makeRequest({
      url: url,
      success: function(data) {
        if (self.parse) {
          data = self.parse(data);
        }
        self.populate(data);
        self.populated = true;
        self.fetching = false;
        self.emit('populate', self);
      }
    });
  }
}
var static = {
  makeRequest: function(options) {
    $.ajax(options);
  },
  populated: false,
  parseEach: function(data) {
    for (var i = 0, c = data.length; i < c; i++) {
      data[i] = this.parse(data[i]);
    }
    return data;
  },
  fetch: function() {
    var self = this;
    var url = (typeof this.url == 'function') ? this.url() : this.url;
    if (!url) {
      throw new Error('url must be set');
    }
    if (this.fetching) {
      return;
    }
    this.fetching = true;
    this.makeRequest({
      url: url,
      success: function(data) {
        if (self.parse) {
          data = self.parseEach(data);
        }
        if (self.lastData) {
          data = dataDiff(self.lastData, data, 'id');
        } else {
          self.lastData = data;
        }
        self.populate(data, { update: true });
        self.fetching = false;
        self.populated = true;
        self.emit('populate', self);
      }
    });
  }
}
var Remote = Gisele.extend(instance, static);
module.exports = Remote;
return module.exports || exports;
})(__cs.r, {}, {});

//index.js
var Gisele = __cs.libs.main = (function(require, module, exports) {
var Gisele = require('./lib/gisele');
Gisele.Remote = require('./lib/remote');
module.exports = Gisele;
return module.exports || exports;
})(__cs.r, {}, {});


