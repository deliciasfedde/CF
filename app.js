// ===============================
// APP SPA BÁSICA
// ===============================

function renderLogin() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <h2>Login</h2>
    <p>Bienvenido a Control de Mis Finanzas</p>
    <button id="btnEntrar">Entrar</button>
  `;

  document.getElementById('btnEntrar').addEventListener('click', () => {
    renderHome();
  });
}

function renderHome() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <h2>Inicio</h2>
    <p>Esta es tu aplicación funcionando como SPA 🎉</p>
  `;
}

// Vista inicial
window.addEventListener('DOMContentLoaded', () => {
  renderLogin();
});
