function $(id) {
    return document.getElementById(id);
}


function validarFormulario(event) {
    let ok = true;
    let msg = "Errores en el formulario:\n";

    const campos = document.querySelectorAll("input, select");
    campos.forEach(campo => {
        campo.classList.remove("campo-error");
    });

    // Validar el nombre de usuarioq

    let usuario = $("usuario").value.trim();
    if (usuario.length < 3 || usuario.length > 15) {
        msg += "- El nombre de usuario debe tener entre 3 y 15 caracteres.\n";
        ok = false;
        $("usuario").classList.add("campo-error");
    }

    // no debe comenzar con número
    if (/^[0-9]/.test(usuario)) {
        msg += "- El usuario no puede comenzar con un número.\n";
        ok = false;
        $("usuario").classList.add("campo-error");
    }

    // Validar la contraseña

    let password = $("password").value;
    let password2 = $("password2").value;

    if (password.length < 6 || password.length > 15) {
        msg += "- La contraseña debe tener entre 6 y 15 caracteres.\n";
        ok = false;
        $("password").classList.add("campo-error");
    }

    if(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        msg += "- La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.\n";
        ok = false;
        $("password").classList.add("campo-error");
    }

    if (password !== password2) {
        msg += "- Las contraseñas no coinciden.\n";
        ok = false;
        $("password2").classList.add("campo-error");
    }

    let email = $("email").value.trim();
    if(email === "" || email.indexOf("@") === -1) {
        msg += "- El correo electrónico no es válido.\n";
        ok = false;
        $("email").classList.add("campo-error");
    }

    // Validar que se ha seleccionado un sexo

    let sexos = document.getElementsByName("sexo");
    let seleccionado = false;
    for(let i = 0; i < sexos.length; i++) {
        if(sexos[i].checked) {
            seleccionado = true;
            break;
        }
    }

    if(!seleccionado) {
        msg += "- Debe seleccionar un sexo.\n";
        ok = false;
    }

    // Validar la fecha de nacimiento (mayor de edad)

    let fechaIni = $("nacimiento").value;
    
    if (fechaIni) {
        let fechaNacimiento = new Date(fechaIni);
        let fechaActual = new Date();
        let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
        let mes = fechaActual.getMonth() - fechaNacimiento.getMonth();

        if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        if(edad < 18) {
            msg += "- Debes ser mayor de edad para registrarte.\n";
            ok = false;
            $("nacimiento").classList.add("campo-error");
        }
    } else {
        msg += "- Debes ingresar una fecha de nacimiento válida.\n";
        ok = false;
        $("nacimiento").classList.add("campo-error");
    }

    // Validar ciudad y país

    let ciudad = $("ciudad").value.trim();
    let pais = $("pais").value.trim();

    if(ciudad !== "" && pais === "") {
        msg += "- Si ingresas una ciudad, debes ingresar también un país.\n";
        ok = false;
        $("pais").classList.add("campo-error");
    }

    // Validar foto de perfil

    const perfil = $("foto");
    let hay = false;
    if (perfil) {
        // si es input type=file, files será útil
        if (perfil.files && perfil.files.length > 0) hay = true;
        else if (perfil.value && perfil.value.trim() !== "") hay = true; // fallback
    }

    if (!hay) {
        msg += "- Debes subir una foto de perfil.\n";
        ok = false;
        if (perfil) fotoEl.classList.add("campo-error");
    }

    //Mostrar los errores si los hay

    if(!ok) {
        alert(msg);
        event.preventDefault();
    } else {
        alert("Registro completado con éxito.");
    }


}

function load() {
    $("formRegistro").addEventListener("submit", validarFormulario);

    const campos = document.querySelectorAll("input, select");
    campos.forEach(campo => {
        campo.addEventListener("input", () => {
            campo.classList.remove("campo-error");
        });
    });

    // focus para nacimiento: limpiar error cuando el usuario enfoque
    const nacimientoEl = $("nacimiento");
    if (nacimientoEl) {
        nacimientoEl.addEventListener('focus', () => nacimientoEl.classList.remove('campo-error'));
    }

    // configurar input foto como file dinámicamente (si no quieres modificar HTML)
    const perfil = $("foto");
    if (perfil) {
        try {
            perfil.setAttribute('type', 'file');
        } catch (e) {
            console.warn('No se pudo establecer type=file dinámicamente:', e);
        }

        perfil.addEventListener('change', () => {
            perfil.classList.remove('campo-error');
            // preview
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
}
document.addEventListener("DOMContentLoaded", load);