import { cargarUsuarios } from './adminUser.js';
import { cargarDocentes } from './adminDocente.js';
import { cargarCursos } from './adminCurso.js';
import { cargarModulos } from './adminModulo.js';
import { cargarWorkshops } from './adminWorkshop.js'; // Importar la función cargarWorkshops

document.addEventListener('DOMContentLoaded', () => {
    const userMenuItem = document.querySelector('.user');
    const docenteMenuItem = document.querySelector('.docente');
    const cursosMenuItem = document.querySelector('.curso');
    const modulosMenuItem = document.querySelector('.modulo');
    const workshopsMenuItem = document.querySelector('.workshop');
    const addUserButton = document.getElementById('addUserButton');
    const addDocenteButton = document.getElementById('addDocenteButton');
    const addCursoButton = document.getElementById('addCursoButton')
    const addModuloButton = document.getElementById('addModuloButton')
    const addWorkshopButton = document.getElementById('addWorkshopButton');


    // Configurar eventos de menú
    userMenuItem.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarUsuarios();
        addUserButton.style.display = 'block';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'none';
        addWorkshopButton.style.display = 'none';
    });

    docenteMenuItem.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarDocentes();
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'block';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'none';
        addWorkshopButton.style.display = 'none';
    });


    cursosMenuItem.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarCursos();
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'block';
        addModuloButton.style.display = 'none';
        addWorkshopButton.style.display = 'none';
    });

    modulosMenuItem.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarModulos();
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'block';
        addWorkshopButton.style.display = 'none';
    });

    workshopsMenuItem.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarWorkshops();
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'none';
        addWorkshopButton.style.display = 'block';
    });


    //**********************************User********************************************/
    // Evento para cancelar el añadido de usuario y volver a la lista
    document.querySelector('.userAdd .backToList').addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addUserButton.style.display = 'block';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'none';
        addWorkshopButton.style.display = 'none';
    });

    // Evento para cancelar el formulario de edición de usuario y volver a la lista
    document.querySelector('.userEdit .backToList').addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addUserButton.style.display = 'block';

    });
    // Manejar la edición de un usuario
    document.getElementById('userEditForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario
        const userId = document.querySelector('.edit-user').dataset.id; // Obtén el ID del usuario que estás editando
        updateUser(userId);
    });
    //*********************************Docente*********************************************/
    // Evento para cancelar el añadido de usuario y volver a la lista
    document.querySelector('.docenteAdd .backToList').addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addUserButton.style.display = 'block';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'none';
        addWorkshopButton.style.display = 'none';
    });

    // Evento para cancelar el formulario de edición de usuario y volver a la lista
    document.querySelector('.docenteEdit .backToList').addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addUserButton.style.display = 'block';

    });
    // Handle editing a docente
    document.getElementById('docenteEditForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        const docenteId = document.querySelector('.edit-docente').dataset.id; // Get the ID of the docente being edited
        updateDocente(docenteId);
    });

    //*********************************Curso*********************************************/
    document.querySelector('.cursoAdd .backToList').addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'block';
        addModuloButton.style.display = 'none';
        addWorkshopButton.style.display = 'none';
    });
    document.querySelector('.cursoEdit .backToList').addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addCursoButton.style.display = 'block';
    });
    document.getElementById('cursoEditForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        const cursoId = document.querySelector('.edit-curso').dataset.id; // Get the ID of the curso being edited
        updateCurso(cursoId);
    });

    //*********************************Modulo*********************************************/
    document.querySelector('.moduloAdd .backToList').addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'block';
        addWorkshopButton.style.display = 'none';
    });
    document.querySelector('.moduloEdit .backToList').addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addModuloButton.style.display = 'block';
    });
    document.getElementById('moduloEditForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        const moduloId = document.querySelector('.edit-modulo').dataset.id; // Get the ID of the modulo being edited
        updateModulo(moduloId);
    });

    //*********************************workshop*********************************************/
    document.querySelector('.workshopAdd .backToList').addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'none';
        addWorkshopButton.style.display = 'block';
    });
    document.querySelector('.workshopEdit .backToList').addEventListener('click', () => {   
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addWorkshopButton.style.display = 'block';
    });
    document.getElementById('workshopEditForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        const workshopId = document.querySelector('.edit-workshop').dataset.id; // Get the ID of the workshop being edited
        updateWorkshop(workshopId);
    });

    //*********************************EVENTOS CLICK ADDBUTTON PARA OCULTAR BOTONES*********************************************/

    addUserButton.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('.userAdd').style.display = 'block';
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'none';
        addWorkshopButton.style.display = 'none';

    });

    addDocenteButton.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('.docenteAdd').style.display = 'block';
        addDocenteButton.style.display = 'none';
        addUserButton.style.display = 'none';
    });

    addCursoButton.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('.cursoAdd').style.display = 'block';
        addCursoButton.style.display = 'none';
        addUserButton.style.display = 'none';
    });

    addModuloButton.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('.moduloAdd').style.display = 'block';
        addModuloButton.style.display = 'none';
        addUserButton.style.display = 'none';
    });

    addWorkshopButton.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('.workshopAdd').style.display = 'block';
        addWorkshopButton.style.display = 'none';
        addUserButton.style.display = 'none';
    });


//*******************************FUNCION PARA OCULTAR TODAS LAS SECIONES ********************/
    function ocultarTodasLasSecciones() {
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.docenteDetails').style.display = 'none';
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.moduloDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.userEdit').style.display = 'none';
        document.querySelector('.docenteEdit').style.display = 'none';
        document.querySelector('.cursoEdit').style.display = 'none';
        document.querySelector('.moduloEdit').style.display = 'none';
        document.querySelector('.workshopEdit').style.display = 'none';
        document.querySelector('.userAdd').style.display = 'none';
        document.querySelector('.docenteAdd').style.display = 'none';
        document.querySelector('.cursoAdd').style.display = 'none';
        document.querySelector('.moduloAdd').style.display = 'none';
        document.querySelector('.workshopAdd').style.display = 'none';
    }
});



//*********************************EVENTOS CLICK ADDBUTTON PARA MOSTAR SOLO EL FROMULARIO*********************************************/

addUserButton.addEventListener('click', () => {
    document.querySelector('.userAdd').style.display = 'block';
    document.querySelector('table.cabecera-tabla').style.display = 'none';
    addUserButton.style.display = 'none';
    addDocenteButton.style.display = 'none';// Ocultar el botón mientras se muestra el formulario
});

addDocenteButton.addEventListener('click', () => {
    document.querySelector('.docenteAdd').style.display = 'block';
    document.querySelector('table.cabecera-tabla').style.display = 'none';
    addUserButton.style.display = 'none';
    addDocenteButton.style.display = 'none';// Ocultar el botón mientras se muestra el formulario
});

addCursoButton.addEventListener('click', () => {
    document.querySelector('.cursoAdd').style.display = 'block';
    document.querySelector('table.cabecera-tabla').style.display = 'none';
    addUserButton.style.display = 'none';
    addDocenteButton.style.display = 'none';// Ocultar el botón mientras se muestra el formulario
});

addModuloButton.addEventListener('click', () => {
    document.querySelector('.moduloAdd').style.display = 'block';
    document.querySelector('table.cabecera-tabla').style.display = 'none';
    addUserButton.style.display = 'none';
    addDocenteButton.style.display = 'none';// Ocultar el botón mientras se muestra el formulario
});
addWorkshopButton.addEventListener('click', () => {
    document.querySelector('.workshopAdd').style.display = 'block';
    document.querySelector('table.cabecera-tabla').style.display = 'none';
    addUserButton.style.display = 'none';
    addDocenteButton.style.display = 'none';// Ocultar el botón mientras se muestra el formulario
});

//******************************************************************************/
export function showMessage(message, type = 'success') {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', type);
    messageContainer.innerText = message;

    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}

