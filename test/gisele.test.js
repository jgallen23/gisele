var assert = require('assert');
var Gisele = require('../');

suite('gisele', function() {

  var Task;
  beforeEach(function() {
    Task = Gisele.extend({
      schema: {
        name: 'Task',
        complete: false,
        created: Date.now
      }
    });
  });

  suite('schema', function() {

    test('if nothing passed it, use schema defaults', function() {
      var task = new Task();
      assert.equal(task.name, 'Task');
      assert.equal(task.complete, false);
    });

    test('if default value is function, invoke it', function() {
      var task = new Task();
      assert.equal(typeof task.created, 'number');
    });

    test('override schema values', function() {
      var task = new Task({ name: 'task2' });
      assert.equal(task.name, 'task2');
    });

    test('allow values outside of schema', function() {
      var task = new Task({ note: 'hi' });
      assert.equal(task.note, 'hi');
    });
  });
  
  suite('#save', function() {

    test('save method should exist', function() {
      var task = new Task();
      assert.equal(typeof task.save, 'function');
    });

    test('save will add an id on the model if it doesn\'t exist', function() {
      var task = new Task();
      task.save();
      assert.notEqual(typeof task.id, 'undefined');
      
    });

    test('save should trigger create event if new', function(done) {
      var task = new Task();

      task.on('create', function(task) {
        assert.equal(task.name, 'Task');
        assert.notEqual(typeof task.id, 'undefined');
        done();
      });
      task.save();
      
    });

    test('save should add to collection', function() {
      var task = new Task();
      task.save();
      assert.equal(Task.all().length, 1);
    });


    test('save should trigger update if updating a task', function(done) {

      var task = new Task();
      task.save();
      var id = task.id;

      task.on('update', function(task) {
        assert.equal(task.name, 'task2');
        assert.equal(task.id, id);
        done();
      });
      task.name = 'task2';
      task.save();
      
    });

    test('data should be unique for each model', function() {
      var Task2 = Gisele.extend({
        schema: {
          name: 'Task',
          complete: false,
          notes: []
        }
      });
      assert.notEqual(Task._data, Task2._data);
      
    });

  });
  
  
  

});
