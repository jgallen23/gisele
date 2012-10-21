var Thrive = require('thrive');
var model = require('./model');
var collection = require('./collection');

var Gisele = Thrive.extend(model, collection);
module.exports = Gisele;
