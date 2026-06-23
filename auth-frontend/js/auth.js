// REQ-005 : Gestion du token JWT dans localStorage

const TOKEN_KEY = "auth_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function isLoggedIn() {
  return !!getToken();
}

// REQ-006 : Redirige vers login si non connecté (pour pages protégées)
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

// REQ-006 : Redirige vers dashboard si déjà connecté (pour login/register)
function requireGuest() {
  if (isLoggedIn()) {
    window.location.href = "dashboard.html";
  }
}
