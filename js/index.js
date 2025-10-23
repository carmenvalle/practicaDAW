// Validación y manejo para index.html (login y búsqueda rápida)

function $(id) { return document.getElementById(id); }

function validarLogin(e) {
  e.preventDefault();
  const form = e.target;
  const user = form.querySelector('#usuario');
  const pass = form.querySelector('#password');
  let ok = true;
  // limpiar
  [user, pass].forEach(el => { if (el) { el.classList.remove('campo-error'); } });

  let mensajes = [];
  if (!user || !user.value.trim()) {
    mensajes.push('Introduce tu nombre de usuario.');
    if (user) {
      user.classList.add('campo-error');
    }
    ok = false;
  }
  if (!pass || !pass.value) {
    mensajes.push('Introduce tu contraseña.');
    if (pass) {
      pass.classList.add('campo-error');
    }
    ok = false;
  }

  if (!ok) {
    mostrarMensajesLogin(mensajes);
    return;
  }

  // Si quieres enviar por AJAX puedes hacerlo aquí; por ahora dejamos el submit normal
  form.submit();
}

function mostrarMensajesLogin(msgs) {
  let cont = document.querySelector('#textoLoginIndex');
  if (!cont) {
    cont = document.createElement('div');
    cont.id = 'textoLoginIndex';
    const form = document.querySelector('main section form');
    if (form) {
      form.insertBefore(cont, form.firstChild);
    }
  }
  cont.innerHTML = '<ul>' + msgs.map(m => '<li>' + m + '</li>').join('') + '</ul>';
}

function validarBusqueda(e) {
  // formulario de búsqueda (action resultados.html)
  // prevenir si vacio o < 3 caracteres
  const input = document.querySelector('#consulta');
  if (!input) {
    return; // nada que hacer
  }
  if (!input.value.trim() || input.value.trim().length < 3) {
    e.preventDefault();
    let cont = document.querySelector('#textoBusqueda');
    if (!cont) {
      cont = document.createElement('div');
      cont.id = 'textoBusqueda';
      input.parentNode.insertBefore(cont, input.nextSibling);
    }
    cont.innerHTML = '<p class="campo-error">Escribe al menos 3 caracteres para buscar.</p>';
    input.classList.add('campo-error');
    input.focus();
  }
}

function initIndex() {
  // enlazar login
  const formLogin = document.querySelector('main section form[action="index_logueado.html"]');
  if (formLogin) {
    formLogin.addEventListener('submit', validarLogin);
  }

  // enlazar busqueda
  const formSearch = document.querySelector('main section form[action="resultados.html"]');
  if (formSearch) {
    formSearch.addEventListener('submit', validarBusqueda);
  }

  // limpieza de errores al escribir
  document.querySelectorAll('input').forEach(i => i.addEventListener('input', () => i.classList.remove('campo-error')));
}

document.addEventListener('DOMContentLoaded', initIndex);
