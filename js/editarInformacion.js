import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth} from '../js/menuHandler.js';
import { customizeMenuColor, fetchUserData } from '../js/comun.js';

// Función para configurar la cabecera y el pie de página se llama setup
// para que se ejecute al cargar la página
function setup() {
    let body = document.querySelector("body");
    let header = document.createElement("header");
    let footer = document.createElement("footer");

    header.innerHTML = headerContent;
    footer.innerHTML = footerContent;

    body.insertBefore(header, body.firstChild);
    body.appendChild(footer);

    setTimeout(() => {
        setupMenuAndAuth();
        customizeMenuColor();
        fetchUserData().then(user => {
            if (user) displayUserInfo(user);
        });  
    }, 100);

    
     document.getElementById('editContactForm').addEventListener('submit', function(event) {
        event.preventDefault();  
        updateUserInfo();
    });

    
}

window.onload = setup;

function displayUserInfo(user) {
    console.log("Displaying user info for: ", user);
    
    // Actualizar los valores del formulario con los datos del usuario
    const emailP = document.querySelector('.dato-email');
    if (emailP) {
        emailP.textContent = user.email || 'No disponible';
    }
    document.getElementById('username').value = user.username || '';
    document.getElementById('apellidos').value = user.apellidos || '';
    document.getElementById('dni').value = user.dni || '';
    document.getElementById('genero').value = user.genero || '';
    document.getElementById('fecha_nacimiento').value = user.fecha_nacimiento || '';
    document.getElementById('localidad').value = user.localidad || '';
}


// Función para actualizar la información del usuario
document.getElementById('editContactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario para manejarlo con JavaScript

    const userId = JSON.parse(atob(sessionStorage.getItem('jwtToken').split('.')[1])).userId;

    const rawFecha = document.getElementById('fecha_nacimiento').value;
    const fechaNacimiento = new Date(rawFecha);
    const fechaFormateada = fechaNacimiento.toISOString().slice(0, 10); // Esto da formato YYYY-MM-DD
    console.log("Fecha formateada:", fechaFormateada);

    const updatedData = {
        username: document.getElementById('username').value,
        apellidos: document.getElementById('apellidos').value,
        dni: document.getElementById('dni').value,
        genero: document.getElementById('genero').value,
        fechaNacimiento: fechaFormateada, 
        localidad: document.getElementById('localidad').value
    };
    console.log("Datos a enviar:", updatedData);

    const token = sessionStorage.getItem('jwtToken');

    fetch(`http://127.0.0.1:8081/usuario/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update user data');
        }
        return response.json();
    })
    .then(data => {
        console.log("User updated successfully:", data);
        if (data.newToken) {
            sessionStorage.setItem('jwtToken', data.newToken);
        }
        document.getElementById('successMessage').innerText = 'Usuario actualizado con éxito!';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
        setTimeout(() => {
            window.location.href = 'perfilUsuario.html';  // Redirige después de 1 segundo
        }, 2000);
    })
    .catch(error => {
        console.error('Error updating user:', error);
        document.getElementById('errorMessage').innerText = 'Error al actualizar los datos. Por favor, inténtalo de nuevo.';
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    });
});







