function $(id) { return document.getElementById(id); }

// Mostrar error debajo de un campo o grupo
function mostrarErrorCampo(campo, mensaje) {
    if (!campo) return;

    // si es un grupo de radios, mostrar en el contenedor padre <p>
    if (campo.length && campo[0].name === "sexo") {
        campo = campo[0].closest("p.sexo");
    }

    campo.classList.add('campo-error');

    // eliminar error anterior
    let eliminar = campo.nextElementSibling;
    if (eliminar && eliminar.classList.contains('error-campo')) {
        eliminar.remove();
    }

    const span = document.createElement('span');
    span.className = 'error-campo';
    span.textContent = mensaje;
    campo.insertAdjacentElement('afterend', span);
}

function validarFormulario(event) {
    event.preventDefault();
    let ok = true;

    // limpiar errores previos
    const campos = document.querySelectorAll("input, select");
    campos.forEach(campo => {
        campo.classList.remove("campo-error");
        let eliminar = campo.nextElementSibling;
        if (eliminar && eliminar.classList.contains('error-campo')) {
            eliminar.remove();
        }
    });

    // Usuario
    const usuario = $("usuario").value.trim();
    if (usuario.length < 3 || usuario.length > 15) {
        mostrarErrorCampo($("usuario"), "El nombre de usuario debe tener entre 3 y 15 caracteres.");
        ok = false;
    }
    if (/^[0-9]/.test(usuario)) {
        mostrarErrorCampo($("usuario"), "El usuario no puede comenzar con un número.");
        ok = false;
    }

    // Contraseña
    const password = $("password").value;
    const password2 = $("password2").value;
    if (password.length < 6 || password.length > 15) {
        mostrarErrorCampo($("password"), "La contraseña debe tener entre 6 y 15 caracteres.");
        ok = false;
    }
    if(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        mostrarErrorCampo($("password"), "La contraseña debe contener al menos una mayúscula, una minúscula y un número.");
        ok = false;
    }
    if (password !== password2) {
        mostrarErrorCampo($("password2"), "Las contraseñas no coinciden.");
        ok = false;
    }

    // Email
    const email = $("email").value.trim();
    if(email === "" || email.indexOf("@") === -1) {
        mostrarErrorCampo($("email"), "El correo electrónico no es válido.");
        ok = false;
    }

    // Sexo
    const sexos = document.getElementsByName("sexo");
    if (!Array.from(sexos).some(s => s.checked)) {
        mostrarErrorCampo(sexos, "Debes seleccionar un sexo.");
        ok = false;
    }

    // Fecha de nacimiento
    const fechaIni = $("nacimiento").value;
    if (fechaIni) {
        let fechaNacimiento = new Date(fechaIni);
        let fechaActual = new Date();
        let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
        let mes = fechaActual.getMonth() - fechaNacimiento.getMonth();
        if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }
        if (edad < 18) {
            mostrarErrorCampo($("nacimiento"), "Debes ser mayor de edad para registrarte.");
            ok = false;
        }
    } else {
        mostrarErrorCampo($("nacimiento"), "Debes ingresar una fecha de nacimiento válida.");
        ok = false;
    }

    // Ciudad y país
    const ciudad = $("ciudad").value.trim();
    const pais = $("pais").value.trim();
    if(ciudad !== "" && pais === "") {
        mostrarErrorCampo($("pais"), "Si ingresas una ciudad, debes ingresar también un país.");
        ok = false;
    }

    // Foto de perfil
    const perfil = $("foto");
    const hayFoto = perfil && ((perfil.files && perfil.files.length > 0) || (perfil.value && perfil.value.trim() !== ""));
    if (!hayFoto) {
        mostrarErrorCampo(perfil, "Debes subir una foto de perfil.");
        ok = false;
    }

    if(ok) {
        $("formRegistro").submit();
    }
}

function load() {
    const formRegistro = $("formRegistro");
    if (formRegistro) {
        formRegistro.addEventListener("submit", validarFormulario);
    }

    // eliminar error al escribir
    const campos = document.querySelectorAll("input, select");
    campos.forEach(campo => {
        campo.addEventListener("input", () => {
            campo.classList.remove("campo-error");
            let eliminar = campo.nextElementSibling;
            if (eliminar && eliminar.classList.contains('error-campo')) {
                eliminar.remove();
            }
        });
    });

    // limpiar error al enfocar nacimiento
    const nacimiento = $("nacimiento");
    if (nacimiento) {
        nacimiento.addEventListener('focus', () => nacimiento.classList.remove('campo-error'));
    }

    //Foto de perfil
    const perfil = $("foto");
    if (perfil) {
        try {
            perfil.setAttribute('type', 'file');
        } catch(e) {
            console.warn('No se pudo establecer type=file dinámicamente:', e);
        }

        perfil.addEventListener('change', () => {
            perfil.classList.remove('campo-error');
            let eliminar = perfil.nextElementSibling;
            if (eliminar && eliminar.classList.contains('error-campo')) {
                eliminar.remove();
            }

            //
            const previewId = 'fotoPreview';
            let prev = document.getElementById(previewId);
            if (!prev) {
                prev = document.createElement('img');
                prev.id = previewId;
                prev.style.maxWidth = '150px';
                prev.style.display = 'block';
                prev.style.marginTop = '0.5rem';
                perfil.parentNode.appendChild(prev);
            }
            const file = perfil.files && perfil.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => { prev.src = e.target.result; };
                reader.readAsDataURL(file);
            } else if (prev) {
                prev.remove();
            }
        });
    }

    //Opcion radio
    const contenedorSexo = document.querySelector("p.sexo");
    if (contenedorSexo) {
        const opcionesSexo = [
            { valor: "H", texto: "Hombre" },
            { valor: "M", texto: "Mujer" },
            { valor: "O", texto: "Otro" }
        ];

        opcionesSexo.forEach(op => {
            const input = document.createElement("input");
            input.name = "sexo";
            input.value = op.valor;
            input.setAttribute("type", "radio"); // asignado dinámicamente

            const label = document.createElement("label");
            label.textContent = " " + op.texto;
            label.prepend(input);

            contenedorSexo.appendChild(label);
            contenedorSexo.appendChild(document.createTextNode(" "));
        });
    }

    //Opcion option pais
    const selectPais = $("pais");
    if (selectPais) {
        const opcionesPais = [
            { valor: "", texto: "Seleccione un país" },
            { valor: "de", texto: "Alemania" },
            { valor: "es", texto: "España" },
            { valor: "fr", texto: "Francia" },
            { valor: "it", texto: "Italia" },
            { valor: "pt", texto: "Portugal" }
        ];

        opcionesPais.forEach(op => {
            const option = document.createElement("option");
            option.value = op.valor;
            option.textContent = op.texto;
            selectPais.appendChild(option);
        });
    }

    //Opcion calendario
    const nacimientoInput = $("nacimiento");
    if (nacimientoInput) {
        try {
            nacimientoInput.setAttribute("type", "date"); // activa el calendario nativo
        } catch (e) {
            console.warn("No se pudo establecer type=date dinámicamente:", e);
        }

        // Estilo visual y formato de placeholder
        nacimientoInput.placeholder = "Selecciona tu fecha de nacimiento";

        // Limpiar error visual al seleccionar fecha
        nacimientoInput.addEventListener("change", () => {
            nacimientoInput.classList.remove("campo-error");
            let eliminar = nacimientoInput.nextElementSibling;
            if (eliminar && eliminar.classList.contains("error-campo")) {
                eliminar.remove();
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", load);
