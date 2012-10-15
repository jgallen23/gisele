var Gisele = require('./gisele');

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
        self.populate(data);
        self.fetching = false;
        self.populated = true;
        self.emit('populate', self);
      }
    });
  }
}
var Remote = Gisele.extend(instance, static);

module.exports = Remote;
