import { toggleSubMenu, checkAuthentication } from '../js/comun.js';
// Funciones para configurar el menú y la autenticación, 
// se muestaran los menus tras comprobar la autenticación con el import checkAuthentication
// y creamos el logoutLink para cerrar la sesión
export function setupMenuAndAuth() {
    // Añadir interactividad a los menús de cursos y usuario
    document.querySelector('.m1 .linea')?.addEventListener('click', function (event) {
        event.preventDefault();
        toggleSubMenu('.m1 .submenu');
    });

    document.querySelector('.m5 > a')?.addEventListener('click', function (event) {
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
    logoutLink?.addEventListener('click', function (event) {
        event.preventDefault();
        sessionStorage.removeItem('jwtToken');
        window.location.href = 'login.html';
    });

    function checkAuthentication() {
        const adminButton = document.getElementById('adminButton');
        const userRole = sessionStorage.getItem('userRole');
    
        if (userRole === 'ADMIN') {
            adminButton.style.display = 'block';
        }
    }
    // Verificar la autenticación al cargar la página
    checkAuthentication();
     }
    

   

