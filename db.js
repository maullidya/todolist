let db;
const request = indexedDB.open("ToDoDB", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const store = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
    store.createIndex("status", "completed", { unique: false });
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadTasks();
};

function addTaskToDB(task) {
    const tx = db.transaction("tasks", "readwrite");
    tx.objectStore("tasks").add(task);
    tx.oncomplete = () => loadTasks();
}

function getTasks(callback) {
    const tx = db.transaction("tasks", "readonly");
    const store = tx.objectStore("tasks");
    store.getAll().onsuccess = (event) => callback(event.target.result);
}

function updateTask(id, completed) {
    const tx = db.transaction("tasks", "readwrite");
    const store = tx.objectStore("tasks");
    store.get(id).onsuccess = (event) => {
        let task = event.target.result;
        task.completed = completed;
        store.put(task);
        loadTasks();
    };
}

function deleteTask(id) {
    const tx = db.transaction("tasks", "readwrite");
    tx.objectStore("tasks").delete(id);
    tx.oncomplete = () => loadTasks();
}
