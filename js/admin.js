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
    const addUserButton = document.getElementById('addUserButton'); // Botón de añadir usuario

    userMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.docenteDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.userEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarUsuarios();
        addUserButton.style.display = 'block'; // Mostrar botón de añadir usuario
    });

    docenteMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.docenteDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.userEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarDocentes();
        addUserButton.style.display = 'none'; // Ocultar botón de añadir usuario
    });

    cursosMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.docenteDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.userEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarCursos();
        addUserButton.style.display = 'none'; // Ocultar botón de añadir usuario
    });

    modulosMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.docenteDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.userEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarModulos();
        addUserButton.style.display = 'none'; // Ocultar botón de añadir usuario
    });

    workshopsMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.docenteDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.userEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarWorkshops();
        addUserButton.style.display = 'none'; // Ocultar botón de añadir usuario
    });

    // Evento para mostrar el formulario de añadir usuario
    addUserButton.addEventListener('click', () => {
        document.querySelector('.userAdd').style.display = 'block';
        document.querySelector('table.cabecera-tabla').style.display = 'none';
        addUserButton.style.display = 'none'; // Ocultar el botón mientras se muestra el formulario
    });

    // Evento para cancelar el añadido de usuario y volver a la lista
    document.querySelector('.userAdd .backToUsers').addEventListener('click', () => {
        document.querySelector('.userAdd').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addUserButton.style.display = 'block'; // Mostrar el botón de nuevo
    });
});

