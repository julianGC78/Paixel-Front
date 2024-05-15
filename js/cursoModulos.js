import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth } from './menuHandler.js';
import { customizeMenuColor } from './comun.js';

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
        const cursoId = getCursoId();
        if (cursoId) {
            fetchCursoDetails(cursoId);
        } else {
            console.error('No course ID found in URL');
        }
    }, 100);
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
        console.log("Curso Details:", data);
        displayCursoDetails(data);
        if (data.docente) {
            displayDocenteDetails(data.docente);
        }
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

function displayDocenteDetails(docente) {
    const docenteImageElement = document.querySelector('.docenteImage');
    const docenteNameElement = document.querySelector('.docenteName');
    const docenteSpecialtyElement = document.querySelector('.docenteSpecialty');
    const docenteDescriptionElement = document.querySelector('.docenteDescription');

    if (docenteImageElement && docenteNameElement && docenteSpecialtyElement && docenteDescriptionElement) {
        docenteImageElement.src = docente.recurso;
      
        docenteNameElement.textContent = docente.username;
        docenteSpecialtyElement.textContent = docente.especialidad;
        docenteDescriptionElement.textContent = docente.descripcion;
    } else {
        console.error("Uno o más elementos del DOM del docente no están disponibles.");
    }
}



window.onload = setup;

