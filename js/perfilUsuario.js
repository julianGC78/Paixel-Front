import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth } from '../js/menuHandler.js';
import { fetchUserData } from '../js/comun.js';

// Función para configurar la cabecera y el pie de página se llama setup
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
        fetchUserData().then(user => {
            if (user) {
                displayUserInfo(user);               
            }
        });  
    }, 100);

    //document.getElementById('deleteUserLink').addEventListener('click', deleteUser);
    document.getElementById('deleteUserLink').addEventListener('click', function(event) {
        event.preventDefault();  // Previene la navegación del enlace
        document.getElementById('deletePopup').style.display = 'flex';  // Muestra el popup
    });
    
    document.getElementById('cancelDelete').addEventListener('click', function() {
        document.getElementById('deletePopup').style.display = 'none';  // Oculta el popup
    });
    
    document.getElementById('confirmDelete').addEventListener('click', function() {
        deleteUser();  // Llama a la función que realmente elimina la cuenta
    });
    
}

    
function displayUserInfo(user) {
    console.log("Displaying user info for: ", user);
    const userInfoContainer = document.querySelector(".user-data");
    if (userInfoContainer) {
        // Añadir los nuevos datos al final del contenedor
        userInfoContainer.insertAdjacentHTML('afterbegin', `
            <div class="additional-info">
                <p>${user.username} ${user.apellidos}</p><br>
                <p>${user.email}</p>
            </div>
        `);
        console.log("User information displayed");
    } else {
        console.log("No se encontró el contenedor de información del usuario");
    }
}

window.onload = setup;

// Función para eliminar la cuenta del usuario
async function deleteUser() {
    const userId = JSON.parse(atob(sessionStorage.getItem('jwtToken').split('.')[1])).userId;
    const token = sessionStorage.getItem('jwtToken');
    console.log("Delete button clicked");

    document.getElementById('deleteMessage').textContent = ''; // Limpia mensajes anteriores

    return fetch(`http://127.0.0.1:8081/usuario/delete/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete user account');
        }
        return response.json();
    })
    .then(data => {
        console.log("User deleted successfully:", data);
        document.getElementById('deleteMessage').textContent = 'Cuenta eliminada con éxito.';
        document.getElementById('deleteMessage').style.color = '#0d6efd';
        sessionStorage.removeItem('jwtToken'); // Limpia el token almacenado
        setTimeout(() => {
            window.location = '../view/login.html'; // Redirige al usuario a la página de inicio de sesión
        }, 1500); // Espera un poco antes de redirigir para que el usuario pueda leer el mensaje
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        document.getElementById('deleteMessage').textContent = 'Error al eliminar la cuenta.';
        document.getElementById('deleteMessage').style.color = 'red';
    });

}


document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.lista a'); // Selecciona todos los enlaces dentro de '.lista'
    const defaultActive = document.getElementById('linkDatosCuenta'); // El enlace por defecto

    // Establece el enlace por defecto como activo inicialmente
    defaultActive.classList.add('active-link');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir la acción por defecto si es necesario

            // Remueve la clase activa de todos los enlaces
            links.forEach(el => el.classList.remove('active-link'));

            // Añade la clase activa solo al enlace clickeado
            this.classList.add('active-link');

            // Aquí puedes agregar lo que necesites hacer cuando un enlace es clickeado
            // Por ejemplo, cargar contenido dinámicamente
        });
    });
});


