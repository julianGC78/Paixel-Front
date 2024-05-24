/*
// Importar funciones desde el módulo común
import { toggleSubMenu, checkAuthentication } from '../js/comun.js';

window.onload = function () {
    // Añadir interactividad a los menús
    document.querySelector('.m1 .linea').addEventListener('click', function (event) {
        event.preventDefault();
        toggleSubMenu('.m1 .submenu');
    });

    document.querySelector('.m5 > a').addEventListener('click', function (event) {
        event.preventDefault();
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            toggleSubMenu('.submenu-m5');
        } else {
            window.location.href = 'login.html';
        }
    });

    // Configuración del logout
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();
            sessionStorage.removeItem('jwtToken');
            window.location.href = 'login.html';
        });
    }

    // Verificar la autenticación al cargar la página
    checkAuthentication();
};
*/

import { setupMenuAndAuth  } from '../js/menuHandler.js';


window.onload = function () {
    setupMenuAndAuth();
  
};










