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
    }, 100);

    // Cargar los detalles del módulo al cargar la página
    loadModuleDetails();
}

// Obtener ID del módulo desde la URL
function getModuleId() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('id');
}

// Función para cargar detalles del módulo
function loadModuleDetails() {
    const moduleId = getModuleId();
    if (moduleId) {
        fetchModuleDetails(moduleId);
    } else {
        console.error('No module ID found in URL');
    }
}

// Función para obtener detalles del módulo
function fetchModuleDetails(idmodulo) {
    const token = sessionStorage.getItem('jwtToken');
    console.log("JWT Token:", token);
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
        console.log("Module Details:", data);
        displayModuleDetails(data);
    })
    .catch(error => {
        console.error('Error fetching module details:', error);
    });
}

// Función para mostrar los detalles del módulo
function displayModuleDetails(modulo) {
    const videoSource = document.getElementById('videoSource');
    const tituloCurso = document.querySelector('.titulo-curso');

    if (videoSource && tituloCurso) {
        videoSource.src = modulo.recurso;
        tituloCurso.textContent = decodeURIComponent(modulo.titulo);
        document.getElementById('videoFrame').load(); // Recargar el video con la nueva fuente
    } else {
        console.error("Uno o más elementos del DOM no están disponibles.");
    }
}

document.addEventListener('DOMContentLoaded', setup);





