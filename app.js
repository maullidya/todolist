document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
});

// Tambah Tugas
function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    
    if (taskText === "") return;
    
    let task = { text: taskText, completed: false };
    addTaskToDB(task);

    taskInput.value = "";
    sendNotification("Tugas Ditambahkan", taskText);
}

// Load Tugas dari Database
function loadTasks(filter = "all") {
    getTasks((tasks) => {
        let taskList = document.getElementById("taskList");
        taskList.innerHTML = ""; // Clear task list

        tasks.filter(task => {
            return filter === "all" || (filter === "completed" && task.completed) || (filter === "pending" && !task.completed);
        }).forEach(task => {
            let li = document.createElement("li");
            li.textContent = task.text;
            if (task.completed) li.classList.add("completed");  // Hanya elemen li yang tercoret

            li.onclick = () => updateTask(task.id, !task.completed);
            
            // Membuat tombol hapus (DEL)
            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("del-btn"); // Menambahkan kelas untuk tombol hapus
            deleteBtn.textContent = "DEL"; // Menambahkan teks DEL ke tombol

            deleteBtn.onclick = (e) => { 
                e.stopPropagation(); 
                deleteTask(task.id); // Menghapus tugas
            };

            li.appendChild(deleteBtn); // Menambahkan tombol hapus ke list item
            taskList.appendChild(li); // Menambahkan list item ke task list
        });
    });
}

// Filter Tugas
function filterTasks(status) {
    loadTasks(status);
}

// Kirim Notifikasi
function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
}

// 🌙 Dark Mode & ☀️ Light Mode
function loadTheme() {
    let theme = localStorage.getItem("theme");
    let toggleThemeBtn = document.getElementById("toggle-theme");
    
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        toggleThemeBtn.textContent = "☀️";
    } else {
        document.body.classList.remove("dark-mode");
        toggleThemeBtn.textContent = "🌙";
    }
}

document.addEventListener("DOMContentLoaded", loadTheme);

document.getElementById("toggle-theme").onclick = () => {
    let toggleThemeBtn = document.getElementById("toggle-theme");
    document.body.classList.toggle("dark-mode");
    
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleThemeBtn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        toggleThemeBtn.textContent = "🌙";
    }
};

window.addEventListener('load', function () {
    let installButton = document.getElementById('installBtn'); // Ganti dengan ID tombol Anda

    // Periksa apakah aplikasi sudah terinstal
    if (window.matchMedia('(display-mode: standalone)').matches) {
        installButton.style.display = 'none';
    }

    // Simpan event sebelum prompt instalasi
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Tampilkan tombol instalasi
        installButton.style.display = 'block';

        installButton.addEventListener('click', () => {
            // Sembunyikan tombol instalasi
            installButton.style.display = 'none';
            // Tampilkan prompt instalasi
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Pengguna menerima prompt instalasi');
                } else {
                    console.log('Pengguna menolak prompt instalasi');
                }
                deferredPrompt = null;
            });
        });
    });

    // Event yang terpicu saat aplikasi terinstal
    window.addEventListener('appinstalled', () => {
        console.log('Aplikasi telah terinstal');
        // Sembunyikan tombol instalasi
        installButton.style.display = 'none';
    });
});



if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch((error) => console.log("Service Worker registration failed:", error));
}

window.onload = function () {
    if (window.history && window.history.pushState) {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, null, window.location.href);
            // Opsional: Tambahkan konfirmasi sebelum keluar
            if (confirm("Apakah Anda ingin keluar dari aplikasi?")) {
                window.close(); // Mencoba menutup jendela (tidak semua browser mendukung)
            }
        };
    }
};

