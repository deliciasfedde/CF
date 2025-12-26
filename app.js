const app = document.getElementById('app');
const btn = document.getElementById('guardar');

// Mostrar estado
app.innerHTML = `
  <p>Estado: <b>${navigator.onLine ? 'Online' : 'Offline'}</b></p>
`;

// IndexedDB
let db;

const request = indexedDB.open('finanzasDB', 1);

request.onupgradeneeded = e => {
  db = e.target.result;
  db.createObjectStore('gastos', { autoIncrement: true });
};

request.onsuccess = e => {
  db = e.target.result;
};

btn.onclick = () => {
  const tx = db.transaction('gastos', 'readwrite');
  const store = tx.objectStore('gastos');

  store.add({
    monto: 1000,
    fecha: new Date().toISOString()
  });

  alert('Gasto guardado OFFLINE');
};

