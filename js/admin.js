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
    const addCursoButton =document.getElementById('addCursoButton') 
    const addModuloButton=document.getElementById('addModuloButton')
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
        addModuloButton.style.display = 'none';
    });

    docenteMenuItem.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarDocentes();
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'block';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'none';
        addModuloButton.style.display = 'none';
    });

    
    cursosMenuItem.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarCursos();
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'block';
        addModuloButton.style.display = 'none';
        addModuloButton.style.display = 'none';
    });

    modulosMenuItem.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarModulos();
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'block';
        addModuloButton.style.display = 'none';
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

    // Evento para mostrar el formulario de añadir usuario
    addUserButton.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('.userAdd').style.display = 'block';
        addUserButton.style.display = 'none';
        addDocenteButton.style.display = 'none';
        addCursoButton.style.display = 'none';
        addModuloButton.style.display = 'none';
        addModuloButton.style.display = 'none';

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
        addModuloButton.style.display = 'none';
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
        addModuloButton.style.display = 'none';
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


    // Evento para mostrar el formulario de añadir docente
    addDocenteButton.addEventListener('click', () => {
        ocultarTodasLasSecciones();
        document.querySelector('.docenteAdd').style.display = 'block';
        addDocenteButton.style.display = 'none';
        addUserButton.style.display = 'none';
    });


    // Función para ocultar todas las secciones
    function ocultarTodasLasSecciones() {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.docenteDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.userEdit').style.display = 'none';
        document.querySelector('.docenteEdit').style.display = 'none';
        document.querySelector('.userAdd').style.display = 'none';
        document.querySelector('.docenteAdd').style.display = 'none';
    }
});




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

export function showMessage(message, isSuccess) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${isSuccess ? 'success' : 'error'}`;
    messageContainer.innerText = message;

    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}

