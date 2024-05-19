import { headerContent } from "../parciales/headerContent.js";

import{footerContent} from "../parciales/footerContent.js";

window.onload = function () {
    // Cremos cabecera dinamicamente
    let body = document.querySelector("body");
    let header = document.createElement("header");
    let footer = document.createElement("footer");
    header.innerHTML = headerContent;
    footer.innerHTML = footerContent;
    body.before(header);
    body.after(footer);
    
    // Mostramos y ocultamos el submenu
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
            
            // Verificar si las credenciales son del administrador
            if (loginData.username === 'admin' && loginData.password === 'admin123') {
                window.location.href = '../admin.html';
            } else {
                window.location.href = 'home.html';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}