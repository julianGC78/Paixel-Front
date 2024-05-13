import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth } from '../js/menuHandler.js';
import { customizeMenuColor } from '../js/comun.js';

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
        checkAuthentication();
    }, 100);
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:8081/curso/findAll')
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos:", data);
            const container = document.querySelector('.cursos-container'); // Asegúrate de tener este contenedor en tu HTML
            data.forEach(curso => {
                // Crear el div 'celda'
                const celdaDiv = document.createElement('div');
                celdaDiv.className = 'celda';
                
                // Aquí adjuntas el manejador de eventos de clic
                celdaDiv.addEventListener('click', () => handleCourseClick(curso.idcurso));
                 

                // Crear el div 'celda-content'
                const cursoDiv = document.createElement('div');
                cursoDiv.className = 'celda-content';

                // Crear y configurar la imagen
                const image = document.createElement('img');
                image.src = curso.recurso; // URL de la imagen del curso
                image.alt = 'Curso Image';
                cursoDiv.appendChild(image);
                
                // Título del curso
                const title = document.createElement('h4');
                title.textContent = curso.titulo; // Título del curso
                cursoDiv.appendChild(title);

                // Div de overlay (opcional, si necesitas efectos visuales adicionales)
                const overlayDiv = document.createElement('div');
                overlayDiv.className = 'overlay';
                cursoDiv.appendChild(overlayDiv);

                // Añadir 'celda-content' a 'celda'
                celdaDiv.appendChild(cursoDiv);

                // Añadir la 'celda' completa al contenedor
                container.appendChild(celdaDiv);
            });
        })
        .catch(error => console.error('Error fetching courses:', error));
});

/*
function handleCourseClick(cursoId) {
    if (sessionStorage.getItem('jwtToken')) {

        window.location.href = `curso.html?id=${cursoId}`;
    } else {
        window.location.href = 'login.html';
    }
}
*/

function handleCourseClick(cursoId) {
    // Redirige directamente a la página de detalles del curso sin comprobar si el usuario está autenticado
    window.location.href = `curso.html?id=${cursoId}`;
}





window.addEventListener('load', setup);
