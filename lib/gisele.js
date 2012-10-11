var Thrive = require('thrive');
var aug = require('aug');
var guid = require('simple-guid');

var Gisele = Thrive.extend({
  construct: function(params) {
    aug(this, this.schema, params);
    for (var key in this.schema) {
      if (typeof this[key] == 'function') {
        this[key] = this[key]();
      }
    }
    if (this.init) {
      this.init();
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
}, {
  init: function() {
    this._data = {};
    this._count = 0;
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
  load: function(data) {
    for (var i = 0, c = data.length; i < c; i++) {
      var item = data[i];
      var model = new this(item);
      model.save();
    }
  },
  remove: function(task) {
    var id = task.id;
    delete this._data[id];
    this._count--;
    this.emit('remove', task);
  }
});


module.exports = Gisele;
