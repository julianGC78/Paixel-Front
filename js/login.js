import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { checkAuthentication } from "./comun.js";

// Verificar si jwt_decode está disponible globalmente
const jwt_decode = window.jwt_decode || require('jwt-decode');

window.onload = function () {
    // Crear cabecera y pie de página dinámicamente
    let body = document.querySelector("body");
    let header = document.createElement("header");
    let footer = document.createElement("footer");
    header.innerHTML = headerContent;
    footer.innerHTML = footerContent;
    body.before(header);
    body.after(footer);

    // Mostrar y ocultar el submenu
    document.querySelector('.m1 .linea').addEventListener('click', function() {
        var submenu = document.querySelector('.m1 .submenu');
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });

    // Agregar el evento submit al formulario de login
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const loginData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        fetch('http://127.0.0.1:8081/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                document.getElementById('loginError').style.display = 'block';
                throw new Error('Respuesta del servidor: ' + response.status);
            }
        })
        .then(data => {
            console.log('Éxito:', data);
            sessionStorage.setItem('jwtToken', data.token);

            // Decodificar el token para obtener el rol del usuario
            try {
                const decodedToken = jwt_decode(data.token);
                sessionStorage.setItem('userRole', decodedToken.role); // Guardar el rol del usuario

                // Imprimir el token en la consola
                console.log('Token JWT:', data.token);
                console.log('Rol del usuario:', decodedToken.role);

                

                if (decodedToken.role === 'ADMIN') {
                    window.location.href = 'admin.html';
                    adminButton.style.display = 'block';
                } else {
                    window.location.href = 'home.html';
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    // Chequear autenticación para mostrar el botón si es admin
    checkAuthentication();
}


 

