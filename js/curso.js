import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth } from '../js/menuHandler.js';
import { customizeMenuColor } from '../js/comun.js';

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
        setupCourseButtonClick();
    }, 100);


}

// Configuración del evento click para la imagen del curso.
function setupCourseButtonClick() {
    document.querySelector('.cursoButton').addEventListener('click', function (event) {
        event.preventDefault();
        // Llamamos a checkAuthentication para decidir a qué página dirigir al usuario.
        redirectBasedOnAuth();
    });
}

function redirectBasedOnAuth() {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId;
        checkPaymentStatus(userId); 
    } else {
        window.location.href = 'login.html'; 
    }
}

function checkPaymentStatus(userId) {
    const token = sessionStorage.getItem('jwtToken');
    fetch(`http://127.0.0.1:8081/matricula/estadoPago/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Fallo al verificar el estado de pago');
        }
        return response.json();
    })
    .then(pagado => {
        if (pagado) {
            // tengo que redirigir a la página de curso
            window.location.href = 'cursoModulos.html'; // Redirige a la página de cursos si el pago es true
        } else {
            window.location.href = 'tarifas.html'; // Redirige a la página de precios si el pago es false
        }
    })
    .catch(error => {
        console.error('Error al verificar el estado de pago', error);
        alert('Error al verificar el estado de matrícula. Por favor, intente nuevamente.');
    });
}


/*******************************************************************/
document.addEventListener('DOMContentLoaded', function () {
    const cursoId = getCursoId();

    if (cursoId) {
        fetchCursoDetails(cursoId);
    } else {
        console.error('No course ID found in URL');
    }

    const button = document.querySelector('.cursoButton');

    if (button) {
        button.addEventListener('click', function () {
            if (cursoId) {
                window.location.href = `cursoModulos.html?id=${cursoId}`;
            } else {
                console.error('No course ID found in URL');
            }
        });
    }

    function getCursoId() {
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get('id');
        console.log("Curso ID:", id);  // Esto mostrará el ID en la consola
        return id;
    }

    function fetchCursoDetails(idcurso) {
        const token = sessionStorage.getItem('jwtToken');
        console.log("JWT Token:", token);
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        fetch(`http://127.0.0.1:8081/curso/findById/${idcurso}`, {
            headers: headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load course details, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                displayCursoDetails(data);
            })
            .catch(error => {
                console.error('Error fetching course details:', error);
            });
    }

    function displayCursoDetails(curso) {
        const titleElement = document.querySelector('.cursoTitle');
        const descriptionElement = document.querySelector('.cursoDescription');
        const imageElement = document.querySelector('.cursoImage');

        if (titleElement && descriptionElement && imageElement) {
            titleElement.textContent = curso.titulo;
            descriptionElement.textContent = curso.descripcion;
            imageElement.src = curso.recurso;
            imageElement.alt = `Imagen de ${curso.titulo}`;
        } else {
            console.error("Uno o más elementos del DOM no están disponibles.");
        }
    }
});


window.addEventListener('load', setup);

