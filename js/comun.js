
// Funcion para mostrar/ocultar el menú de usuario
export function toggleSubMenu(selector) {
    const submenu = document.querySelector(selector);
    const isVisible = submenu.style.display === 'block';

    // Cierra todos los submenús
    document.querySelectorAll('.submenu, .submenu-m5').forEach(sub => {
        sub.style.display = 'none';
    });

    // Muestra el submenu actual si antes estaba oculto
    submenu.style.display = isVisible ? 'none' : 'block';
}


// Función para verificar si el usuario está autenticado
export function checkAuthentication() {
    const token = sessionStorage.getItem('jwtToken');
    const submenu = document.querySelector('.submenu-m5');
    const loginLink = document.querySelector('.loginLink');

    if (submenu && loginLink) {
        if (token) {
            submenu.style.display = 'block'; // Muestra el menú
            loginLink.style.display = 'none'; // Oculta el enlace de login
        } else {
            submenu.style.display = 'none'; // Oculta el menú
            loginLink.style.display = 'block'; // Muestra el enlace de login
        }
    } else {
        console.log('Elementos del DOM no disponibles.');
    }
}

// Función para personalizar el color del menú según la página
export function customizeMenuColor() {
    const currentPage = window.location.pathname.split('/').pop().replace(".html", "");
    const menuLinks = document.querySelectorAll('.menu a');

    menuLinks.forEach(link => {
        // Asegúrate de que el enlace tiene un atributo 'href' antes de intentar usar 'split' en él
        const href = link.getAttribute('href');
        if (href) {
            const linkPage = href.split('/').pop().replace(".html", "");
            if (linkPage === currentPage) {
                link.style.color = "#565656"; // Cambia el color del enlace activo
                link.classList.add('active'); // Añade una clase 'active' para estilos adicionales
            } else {
                link.style.color = "";
                link.classList.remove('active'); // Elimina la clase 'active' si no es la página actual
            }
        }
    });
}


export async function fetchUserData() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No token available');
        //return Promise.reject('No token available'); // Devuelve una promesa rechazada
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId;

    if (!userId) {
        console.error('User ID not found in token');
        //return Promise.reject('User ID not found in token'); // Devuelve una promesa rechazada
    }

    // Devuelve directamente la promesa de fetch
    return fetch(`http://127.0.0.1:8081/usuario/findById/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        throw error; // Re-lanza el error para ser capturado más adelante
    });
}


export function redirectBasedOnAuth(cursoId) {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId;
        checkPaymentStatus(userId, cursoId);
    } else {
        window.location.href = 'login.html';
    }
}

export function checkPaymentStatus(userId, cursoId) {
    const token = sessionStorage.getItem('jwtToken');
    fetch(`http://127.0.0.1:8081/matricula/estadoPago/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Fallo al verificar el estado de pago');
        }
        return response.json();
    })
    .then(pagado => {
        if (pagado) {
            window.location.href = `cursoModulos.html?id=${cursoId}`; // Redirige a la página de cursos si el pago es true
        } else {
            window.location.href = 'tarifas.html'; // Redirige a la página de precios si el pago es false
        }
    })
    .catch(error => {
        console.error('Error al verificar el estado de pago', error);
        alert('Error al verificar el estado de matrícula. Por favor, intente nuevamente.');
    });
}









