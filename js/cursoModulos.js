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
            fetchModulosByCurso(cursoId);
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


function fetchModulosByCurso(idcurso) {
    const token = sessionStorage.getItem('jwtToken');
    console.log("JWT Token:", token);
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    fetch(`http://127.0.0.1:8081/modulo/byCurso/${idcurso}`, {
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load modules, status: ' + response.status);
        }
        return response.json();
    })
    .then(modulos => {
        console.log("Modulos:", modulos);
        if (modulos.length > 0) {
            updateAccessButton(modulos[0]);  // Aquí se actualiza el botón con el primer módulo
        }
        displayModulos(modulos);
    })
    .catch(error => {
        console.error('Error fetching modules:', error);
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



function displayModulos(modulos) {
    const moduleLinksElement = document.querySelector('.module-links');

    if (moduleLinksElement) {
        modulos.forEach(modulo => {
            const moduleLink = document.createElement('a');
            moduleLink.className = 'module-link';
            // Actualizar el href para pasar parámetros en la URL
            moduleLink.href = `modulo.html?id=${modulo.idmodulo}&titulo=${encodeURIComponent(modulo.titulo)}`;
            moduleLink.textContent = modulo.titulo;

            const durationSpan = document.createElement('span');
            durationSpan.textContent = modulo.tiempo;
            moduleLink.appendChild(durationSpan);
            moduleLinksElement.appendChild(moduleLink);
        });
    } else {
        console.error("Elemento del DOM para los módulos no está disponible.");
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

function updateAccessButton(modulo) {
    const accessButton = document.querySelector('.contenido-overlay button');
    if (accessButton && modulo) {
        accessButton.onclick = () => {
            window.location.href = `modulo.html?id=${modulo.idmodulo}&titulo=${encodeURIComponent(modulo.titulo)}`;
        };
    } else {
        console.error("El botón de acceso o el módulo no está disponible.");
    }
}


window.onload = setup;

