var assert = require('assert');

var Gisele = require('../');


var makeRequest = Gisele.Remote.makeRequest;
Gisele.Remote.makeRequest = function(options) {
  if (!options.url) {
    makeRequest(options);
  }
  setTimeout(function() {
    var json = require('./fixtures/'+options.url+'.json');
    options.success(json);
  }, 100);
}

suite('Gisele.Remote', function() {

  suite('collection', function() {

    suite('#fetch', function() {

      test('throw error if url not defined', function() {
        var Task = Gisele.Remote.extend({});

        assert.throws(function() {
          Task.fetch();
        });
        
      });
      test('emit refresh event and populate', function(done) {
        var Task = Gisele.Remote.extend({
        }, {
          url: 'tasks1'
        });

        Task.on('populate', function() {
          assert.equal(Task.count(), 2);

          assert.equal(Task.populated, true);
          done();
        });

        Task.fetch();
        
      });
      test('url can be a function', function(done) {
        var Task = Gisele.Remote.extend({
        }, {
          url: function() {
            return 'tasks1';
          }
        });

        Task.on('populate', function() {
          assert.equal(Task.count(), 2);
          assert.equal(Task.populated, true);
          done();
        });

        Task.fetch();
        
      });

      test('don\'t fetch twice', function(done) {
        var count = 0;
        var Task = Gisele.Remote.extend({
        }, {
          url: 'tasks1'
        });

        Task.on('populate', function() {
          count++;
        });

        Task.fetch();
        Task.fetch();
        setTimeout(function() {
          assert.equal(count, 1);
          done();
        }, 500);
        
      });

      test('call parse to manipulate data before populate', function(done) {
        var Task = Gisele.Remote.extend({
        }, {
          url: 'tasks-parse',
          parse: function(item) {
            item.notes = item.notes.split(',');
            return item;
          }
        });

        Task.on('populate', function() {

          var tasks = Task.all();
          assert.equal(tasks[0].notes.length, 2);
          assert.equal(tasks[1].notes.length, 1);

          done();
        });

        Task.fetch();
      });
      
    });

  });

  suite('instance', function() {

    suite('#fetch', function() {
      test('emit populate event and populate instance', function(done) {
        
        var Task = Gisele.Remote.extend({
          url: 'task1'
        });
        var task = new Task({ id: 1 });

        task.on('populate', function(task) {
          assert.equal(task.id, 1);
          assert.equal(task.name, 'task1')
          assert.equal(task.complete, false);

          assert.equal(task.populated, true);
          done();

        });
        task.fetch();
      });

      test('url can be function', function(done) {
        
        var Task = Gisele.Remote.extend({
          url: function() {
            return 'task1';
          }
        });
        var task = new Task({ id: 1 });

        task.on('populate', function(task) {
          assert.equal(task.id, 1);
          assert.equal(task.name, 'task1')
          assert.equal(task.complete, false);

          assert.equal(task.populated, true);
          done();

        });
        task.fetch();
      });

      test('if url not defined, append id to static ', function(done) {
        
        var Task = Gisele.Remote.extend({
        }, {
          url: 'task'
        });
        var task = new Task({ id: 1 });

        task.on('populate', function(task) {
          assert.equal(task.id, 1);
          assert.equal(task.name, 'task1')
          assert.equal(task.complete, false);

          assert.equal(task.populated, true);
          done();

        });
        task.fetch();
      });
    });
    
    
  });
  
  
});


