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

