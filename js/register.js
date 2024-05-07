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

   
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
  
        const username = document.getElementById('username').value;
        const apellidos = document.getElementById('apellidos').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        const email = document.getElementById('email').value;
        const genero = document.getElementById('genero').value;
        
        if (password !== confirmPassword) {
            document.getElementById('passwordError').style.display = 'block'; // Mostrar mensaje de error
            return;
        } else {
            document.getElementById('passwordError').style.display = 'none'; // Ocultar mensaje si corrigen el error
        }
       
        const formData = {
            username: username,
            apellidos: apellidos,
            password: password,
            email: email,
            genero: genero
        };
    
        fetch('http://127.0.0.1:8081/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server responded with status: ' + response.status);
            }
        })
        .then(data => {
            console.log('Success:', data);
            document.getElementById('successMessage').innerText = 'Usuario registrado con éxito!';
            document.getElementById('successMessage').style.display = 'block';
            setTimeout(() => {
                window.location.href = 'home.html';  // Redirige después de 1 segundo
            }, 2000);
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('emailError').innerText = 'Este correo electronico ya exsite';
            document.getElementById('emailError').style.display = 'block'; 
        });
    });
    
}