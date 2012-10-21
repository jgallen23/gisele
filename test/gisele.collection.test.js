var assert = require('assert');
var Gisele = require('../');

suite('collection', function() {

  var Task;
  beforeEach(function() {
    
    Task = Gisele.extend({
      schema: {
        name: 'task',
        complete: false
      }
    });

  });

  suite('#save', function() {

    test('save is a function', function() {
      assert.equal(typeof Task.save, 'function');
    });

    test('save adds to data', function() {
      var task = new Task();
      Task.save(task);
      assert.notEqual(typeof Task._data[task.id], 'undefined');
    });

    test('save should trigger on the collection', function(done) {
      var task = new Task();

      Task.on('create', function(task) {
        assert.notEqual(typeof task.id, 'undefined');
        done();
      });
      task.save();
      
    });

    test('saving an existing task should trigger update', function(done) {
      var task = new Task();
      task.save();

      Task.on('update', function(task) {
        assert.equal(task.name, 'task2');
        assert.notEqual(typeof task.id, 'undefined');
        done();
      });
      task.name = 'task2';
      task.save();
      
    });

    
  });
  

  suite('#all', function() {

    test('all is function', function() {
      assert.equal(typeof Task.all, 'function');
    });
    
  });

  suite('#find', function() {
    test('find is a function', function() {
      assert.equal(typeof Task.find, 'function');
    });
    test('returns task instance by id', function() {
      var task = new Task();
      task.save();
      assert.equal(Task.find(task.id), task);
    });
  });

  suite('#count', function() {
    test('count is a function', function() {
      assert.equal(typeof Task.count, 'function');
    });
    test('returns number of tasks in collection', function() {
      var task = new Task();
      task.save();
      assert.equal(Task.count(), 1);
      
    });
  });

  suite('#each', function() {
    test('call callback for each item', function() {
      var task1 = new Task({ name: 'test' });
      task1.save();

      var count = 0;
      Task.each(function(task) {
        assert.equal(task.name, 'test');
        count++;
      });
      
      assert.equal(count, 1);
    });
  });
  

  suite('#filter', function() {

    test('should return tasks when fn returns true', function() {

      var task1 = new Task();
      task1.save();
      var task2 = new Task({ complete: true });
      task2.save();

      var completedTasks = Task.filter(function(task) {
        return task.complete;
      });

      assert.equal(completedTasks.length, 1);

      
    });

  });

  suite('#populate', function() {
    test('takes a JSON array and creates new model instances', function() {

      var data = [
        { task: 'task1' },
        { task: 'task2' },
        { task: 'task3' }
      ];
      Task.populate(data);

      assert.equal(Task.count(), 3);
      assert.equal(Task.populated, true);
      
    });

    test('resets data', function() {

      var data = [
        { task: 'task1' },
        { task: 'task2' },
        { task: 'task3' }
      ];
      Task.populate(data);
      var data2 = [
        { task: 'task1' },
        { task: 'task2' }
      ];
      Task.populate(data2);
      assert.equal(Task.count(), 2);
      
    });

    test('option to update existing vs clearing', function() {
      var data = [
        { task: 'task1' },
        { task: 'task2' },
        { task: 'task3' }
      ];
      Task.populate(data);
      var data2 = [
        { id: Task.all()[0].id, task: 'task1 changed' },
        { task: 'task4' }
      ];
      Task.populate(data2, { update: true });
      assert.equal(Task.all()[0].task, 'task1 changed');
      assert.equal(Task.count(), 4);
    });
  });

  suite('#remove', function() {
    test('removes from collection', function() {
      var task = new Task();
      task.save();

      Task.remove(task);

      assert.equal(Task.count(), 0);
      assert.deepEqual(Task._data, {});
      
    });
    test('emits remove event', function(done) {
      var task = new Task();
      task.save();
      var id = task.id;

      Task.on('remove', function(task) {
        assert.equal(task.id, id);
        done();
      });

      Task.remove(task);

      
    });
  });

  suite('#clear', function() {

    test('should clear data and counts', function() {
      var data = [
        { task: 'task1' },
        { task: 'task2' },
        { task: 'task3' }
      ];
      Task.populate(data);
      assert.equal(Task.count(), 3);
      Task.clear();
      assert.equal(Task.count(), 0);
      assert.deepEqual(Task._data, {});
      
    });
    
  });
  
  suite('#sort', function() {

    test('should sort data based on function', function() {
      var data = [
        { task: 'task1', priority: 3 },
        { task: 'task2', priority: 1 },
        { task: 'task3', priority: 2 }
      ]
      Task.populate(data);
      var tasks = Task.sort(function(task) {
        return task.priority; 
      });

      assert.equal(tasks.length, 3);
      assert.equal(tasks[0].task, 'task2');
      assert.equal(tasks[1].task, 'task3');
      assert.equal(tasks[2].task, 'task1');
      
    });

    test('should sort by name', function() {
      var data = [
        { name: 'task2', priority: 3 },
        { name: 'task1', priority: 1 },
        { name: 'task3', priority: 2 }
      ]
      
      Task.populate(data);
      var tasks = Task.sort(function(task) {
        return task.name; 
      });

      assert.equal(tasks.length, 3);
      assert.equal(tasks[0].name, 'task1');
      assert.equal(tasks[1].name, 'task2');
      assert.equal(tasks[2].name, 'task3');
      
    });
    
  });
  
  
  
  
});

