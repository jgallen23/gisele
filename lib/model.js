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
