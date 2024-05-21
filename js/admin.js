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
    const workshopsMenuItem = document.querySelector('.workshop'); // Selector del menú de workshops

    userMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.moduloDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarUsuarios();
    });

    docenteMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.moduloDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarDocentes();
    });

    cursosMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.moduloDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarCursos();
    });

    modulosMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.moduloDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarModulos();
    });

    workshopsMenuItem.addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('.moduloDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarWorkshops();
    });
});




