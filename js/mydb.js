var idbApp = (function () {
  "use strict";

  var dbPromise = idb.open("tasks", 2, function (upgradeDB) {
  
        console.log("Creating tasks table.");
        upgradeDB.createObjectStore("tasks", { keyPath: "id" });

  });

  function addTasks(newTask) {
    return dbPromise.then(function (db) {
      var tx = db.transaction("tasks", "readwrite");
      var store = tx.objectStore("tasks");
      return store
        .add(newTask)
        .then(() => {
          console.log("Task added successfully!");
        })
        .catch((e) => {
          tx.abort();
          console.error(e);
        });
    });
  }

  function getAllTasks() {
    return dbPromise.then(function (db) {
      var tx = db.transaction("tasks", "readonly");
      var store = tx.objectStore("tasks");
      return store
        .getAll()
        .then((data) => {
          console.log("Tasks retrived successfully!");
          console.log(data);
          return data
        })
        .catch((e) => {
          tx.abort();
          console.error(e);
        });
    });
  }
  function getTask(id) {
    return dbPromise.then(function (db) {
      var tx = db.transaction("tasks", "readonly");
      var store = tx.objectStore("tasks");
      return store
        .get(id)
        .then((data) => {
          console.log("Task retrived successfully!");
          console.log(data);
          return data
        })
        .catch((e) => {
          tx.abort();
          console.error(e);
        });
    });
  }
  function deleteTask(taskId, element) {
    return dbPromise.then(function (db) {
      console.log(element.closest('.taskTodo').remove());
      var tx = db.transaction("tasks", "readwrite");
      var store = tx.objectStore("tasks");
      return store
        .delete(taskId)
        .then(() => {
          console.log(taskId);
          console.log("Task deleted successfully!");
        })
        .catch((e) => {
          tx.abort();
          console.error(e);
        });
    });
  }

  function updateTask(task) {
    getTask(task.id).then(function (task) {
      return dbPromise
        .then(function (db) {
          var tx = db.transaction("tasks", "readwrite");
          var store = tx.objectStore("tasks");
          task.notified = true;
          store.put(task);
          
        });
    })
    
  }

  return {
    dbPromise: dbPromise,
    addTasks: addTasks,
    getAllTasks: getAllTasks,
   
    deleteTask: deleteTask,
    updateTask: updateTask,
  };
})();
