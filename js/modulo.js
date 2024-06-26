
import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth } from '../js/menuHandler.js';
import { customizeMenuColor, redirectBasedOnAuth, checkPaymentStatus } from '../js/comun.js';
import { setupVideo } from '../js/progreso.js';

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

    // Asignar el evento de clic al botón para enviar la pregunta
     // Asignar eventos a los botones de enviar y cancelar
     const sendButton = document.querySelector('.btn-enviar');
     const cancelButton = document.querySelector('.btn-cance');
 
     if (sendButton) {
         sendButton.addEventListener('click', () => {
             sendPregunta();
             clearTextarea();  // Limpiar el textarea después de enviar
         });
     } else {
         console.error('No se encontró el botón con clase "btn-enviar"');
     }
 
     if (cancelButton) {
         cancelButton.addEventListener('click', clearTextarea);
     } else {
         console.error('No se encontró el botón con clase "btn-cance"');
     }
      // Obtener y mostrar las preguntas del módulo al cargar la página
    const moduleId = getModuleId();
    if (moduleId) {
        fetchPreguntasByModulo(moduleId);
    } else {
        console.error('No module ID found in URL');
    }
}

function getModuleId() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('id');
}

// Obtener ID del usuario desde el token JWT
function getUserId() {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
        const decodedToken = jwt_decode(token);
        return decodedToken.id || decodedToken.userId || decodedToken.sub; // Ajusta según cómo se almacene el ID del usuario en tu token
    } else {
        console.error('No JWT token found in sessionStorage');
        return null;
    }
}

// Función para cargar detalles del módulo y del curso
function loadModuleAndCourseDetails() {
    const moduleId = getModuleId();
    const userId = getUserId();

    console.log('Module ID:', moduleId);
    console.log('User ID:', userId);

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

function sendPregunta() {
    const textarea = document.getElementById('textarea-id');
    
    if (!textarea) {
        console.error('No se encontró el textarea con id "textarea-id"');
        return;
    }

    const textoPregunta = textarea.value;
    const userId = getUserId();
    const moduleId = getModuleId();
    const fecha = new Date().toISOString().split('.')[0];  // Usar la fecha actual en formato ISO sin la parte de los milisegundos (yyyy-MM-ddTHH:mm:ss)

    if (!userId || !moduleId || !textoPregunta) {
        console.error('User ID, Module ID, or question text is missing');
        return;
    }

    const token = sessionStorage.getItem('jwtToken');
    const headers = token ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json'
    };

    const pregunta = {
        contenido: textoPregunta,
        idusuario: parseInt(userId, 10),  // Asegurarse de que sea un entero
        idmodulo: parseInt(moduleId, 10), // Asegurarse de que sea un entero
        fecha: fecha // Añadir la fecha actual en formato ISO
    };

    console.log('Datos enviados:', pregunta);

    fetch('http://localhost:8081/pregunta/add', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(pregunta)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error('Failed to add question, status: ' + response.status + ', error: ' + JSON.stringify(error));
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        fetchPreguntasByModulo(moduleId); 
        clearTextarea();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function clearTextarea() {
    const textarea = document.getElementById('textarea-id');
    if (textarea) {
        textarea.value = '';
    }
}




function fetchPreguntasByModulo(idmodulo) {
    const token = sessionStorage.getItem('jwtToken');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    console.log('Fetching questions for module:', idmodulo);

    fetch(`http://localhost:8081/pregunta/byModulo/${idmodulo}`, {
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch questions, status: ' + response.status);
        }
        return response.json();
    })
    .then(preguntas => {
        // Ordenar las preguntas por fecha (más reciente primero)
        preguntas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        displayPreguntas(preguntas);
    })
    .catch(error => {
        console.error('Error fetching questions:', error);
    });
}

function timeSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    // Convertir la fecha a la zona horaria local
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    const seconds = Math.floor((now - localDate) / 1000);
    const intervals = [
        { label: 'años', seconds: 31536000 },
        { label: 'meses', seconds: 2592000 },
        { label: 'días', seconds: 86400 },
        { label: 'horas', seconds: 3600 },
        { label: 'minutos', seconds: 60 },
        { label: 'segundos', seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}`;
        }
    }
    return 'justo ahora';
}


function displayPreguntas(preguntas) {
    const preguntasLista = document.getElementById('preguntas-lista');
    preguntasLista.innerHTML = ''; 

    preguntas.forEach(pregunta => {
        const preguntaItem = document.createElement('div');
        preguntaItem.className = 'div-respuesta';

        const preguntaContainer = document.createElement('div');
        preguntaContainer.className = 'd-flex align-items-start';

        const userIcon = document.createElement('i');
        userIcon.className = 'fa-solid fa-circle-user res ';

        const contenidoContainer = document.createElement('div');
        
        const usuarioNombre = document.createElement('span');
        usuarioNombre.className = 'usuario-nombre font-weight-bold d-block';
        usuarioNombre.textContent = pregunta.usuario.username || 'Nombre no disponible';

        const fechaPregunta = document.createElement('span');
        fechaPregunta.className = 'fecha-pregunta';
        fechaPregunta.textContent = `Hace ${timeSince(pregunta.fecha)}`;

        const contenidoPreguntaContainer = document.createElement('div');
        contenidoPreguntaContainer.className = 'd-flexa align-items-start mt-2';

        const contenidoPregunta = document.createElement('p');
        contenidoPregunta.className = 'contenido-pregunta mb-0';
        contenidoPregunta.textContent = pregunta.contenido;

        contenidoPreguntaContainer.appendChild(contenidoPregunta);
        contenidoContainer.appendChild(usuarioNombre);
        contenidoContainer.appendChild(fechaPregunta); 
        contenidoContainer.appendChild(contenidoPreguntaContainer);
        preguntaContainer.appendChild(userIcon);
        preguntaContainer.appendChild(contenidoContainer);
        preguntaItem.appendChild(preguntaContainer);
        preguntasLista.appendChild(preguntaItem);

        console.log('Usuario:', pregunta.usuario.nombre);
        console.log('Pregunta:', pregunta.contenido);
    });
}





document.addEventListener('DOMContentLoaded', setup);





