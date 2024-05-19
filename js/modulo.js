
import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth } from '../js/menuHandler.js';
import { customizeMenuColor, redirectBasedOnAuth, checkPaymentStatus } from '../js/comun.js';

let globalModules = [];

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
    }, 100);

    // Cargar los detalles del módulo y del curso al cargar la página
    loadModuleAndCourseDetails();
}

// Obtener ID del módulo desde la URL
function getModuleId() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('id');
}

// Función para cargar detalles del módulo y del curso
function loadModuleAndCourseDetails() {
    const moduleId = getModuleId();

    if (moduleId) {
        fetchModuleDetails(moduleId);
        fetchCourseByModule(moduleId);
    } else {
        console.error('No module ID found in URL');
    }
}

// Función para obtener detalles del módulo
function fetchModuleDetails(idmodulo) {
    const token = sessionStorage.getItem('jwtToken');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    fetch(`http://127.0.0.1:8081/modulo/findById/${idmodulo}`, {
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load module details, status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        displayModuleDetails(data);
    })
    .catch(error => {
        console.error('Error fetching module details:', error);
    });
}

// Función para obtener el curso asociado a un módulo
function fetchCourseByModule(idmodulo) {
    const token = sessionStorage.getItem('jwtToken');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    fetch(`http://127.0.0.1:8081/modulo/cursoByModulo/${idmodulo}`, {
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load course details, status: ' + response.status);
        }
        return response.json();
    })
    .then(curso => {
        displayCourseDetails(curso);
        fetchModulesByCourse(curso.idcurso); // Cargar los módulos del curso
        setupCourseTitleClick(curso.idcurso); // Configurar el clic del título del curso
    })
    .catch(error => {
        console.error('Error fetching course details:', error);
    });
}

// Función para mostrar los detalles del módulo
function displayModuleDetails(modulo) {
    const videoSource = document.getElementById('videoSource');
    const tituloModulo = document.querySelector('.titulo-modulo');

    if (videoSource) {
        videoSource.src = modulo.recurso;
        document.getElementById('videoFrame').load();
        tituloModulo.textContent = decodeURIComponent(modulo.titulo);
        setupNextButton(modulo.idmodulo); // Configurar el botón 'SIGUIENTE' con el módulo actual
    } else {
        console.error("Uno o más elementos del DOM no están disponibles.");
    }
}

// Función para mostrar los detalles del curso
function displayCourseDetails(curso) {
    const tituloCurso = document.querySelector('.titulo-curso');
    const cursoNombre = tituloCurso.querySelector('.curso-nombre');

    if (tituloCurso && cursoNombre) {
        cursoNombre.textContent = decodeURIComponent(curso.titulo);
        tituloCurso.href = `cursoModulos.html?id=${curso.idcurso}`; // Asegurarse de que el enlace apunte a la página correcta
    } else {
        console.error("Elemento del DOM para el título del curso no está disponible.");
    }
}


// Función para obtener y mostrar los módulos de un curso
function fetchModulesByCourse(idcurso) {
    const token = sessionStorage.getItem('jwtToken');
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
        globalModules = modulos; // Guardar módulos globalmente
        displayModulos(modulos);
        const moduleId = getModuleId();
        setupNextButton(moduleId); // Configurar el botón 'SIGUIENTE' con el módulo actual
    })
    .catch(error => {
        console.error('Error fetching modules:', error);
    });
}

// Función para mostrar los módulos del curso
function displayModulos(modulos) {
    const moduleLinksElement = document.querySelector('.module-links');

    if (moduleLinksElement) {
        modulos.forEach(modulo => {
            const moduleLink = document.createElement('a');
            moduleLink.className = 'module-link';
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

function setupCourseTitleClick(cursoId) {
    const cursoTitleElement = document.querySelector('.titulo-curso');
    if (cursoTitleElement) {
        cursoTitleElement.addEventListener('click', function (event) {
            event.preventDefault();
            redirectBasedOnAuth(cursoId);
        });
    } else {
        console.error("Elemento del DOM para el título del curso no está disponible.");
    }
}

function setupNextButton(currentModuleId) {
    const nextButton = document.querySelector('.siguiente');
    if (!nextButton) {
        console.error("Elemento del DOM para el botón 'SIGUIENTE' no está disponible.");
        return;
    }

    const currentIndex = globalModules.findIndex(modulo => modulo.idmodulo == currentModuleId);
    if (currentIndex === -1) {
        console.error('No se encontró el módulo actual en la lista de módulos.');
        nextButton.href = '#';
        nextButton.style.display = 'none';
        return;
    }

    if (currentIndex === globalModules.length - 1) {
        // Si es el último módulo, ocultar el botón "SIGUIENTE"
        nextButton.href = '#';
        nextButton.style.display = 'none';
    } else {
        // Si no es el último módulo, configurar el enlace al siguiente módulo
        const nextModule = globalModules[currentIndex + 1];
        nextButton.href = `modulo.html?id=${nextModule.idmodulo}&titulo=${encodeURIComponent(nextModule.titulo)}`;
        nextButton.style.display = 'block'; // Asegurarse de que el botón esté visible
    }
}

document.addEventListener('DOMContentLoaded', setup);




