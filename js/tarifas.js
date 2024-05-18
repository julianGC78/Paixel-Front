import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth } from '../js/menuHandler.js';
import { customizeMenuColor } from '../js/comun.js';

// Función para configurar la cabecera y el pie de página
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
        setupPaymentButtons();
        setupCourseButtons();
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    setup();

    document.querySelector('.cancelPayment').addEventListener('click', function() {
        document.getElementById('paymentPopup').style.display = 'none';  // Oculta el popup
    });

    document.querySelector('#confirmPayment').addEventListener('click', function() {
        handlePayment();
    });
});

function setupPaymentButtons() {
    const paymentButtons = document.querySelectorAll('.btn:not(.trial)');
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const token = sessionStorage.getItem('jwtToken');
            if (token) {
                document.getElementById('paymentPopup').style.display = 'flex';  // Muestra el popup
            } else {
                window.location.href = 'login.html';  // Redirige a la página de login si no está autenticado
            }
        });
    });
}

function setupCourseButtons() {
    const courseButtons = document.querySelectorAll('.btn.trial');
    courseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cursoId = getCursoId();
            redirectBasedOnAuth(cursoId);
        });
    });
}

function handlePayment() {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).userId;
        if (userId) {
            updatePaymentStatus(userId);
        } else {
            console.error('UserID es null, verificar el contenido del token JWT.');
        }
    } else {
        console.log('No se encontró token de autenticación, redireccionando a login.');
        window.location.href = 'login.html';
    }
}

function updatePaymentStatus(userId) {
    const token = sessionStorage.getItem('jwtToken');
    fetch(`http://localhost:8081/matricula/pagar/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Pago actualizado correctamente');
            window.location.href = 'allCursos.html';
        } else {
            console.log('Fallo al actualizar el pago, respuesta del servidor:', response.status);
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
}

function redirectBasedOnAuth(cursoId) {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId;
        checkPaymentStatus(userId, cursoId);
    } else {
        window.location.href = 'login.html';
    }
}

function checkPaymentStatus(userId, cursoId) {
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
            window.location.href = `allCursos.html`; // Redirige a la página de cursos si el pago es true
        } else {
            window.location.href = 'tarifas.html'; // Redirige a la página de precios si el pago es false
        }
    })
    .catch(error => {
        console.error('Error al verificar el estado de pago', error);
        alert('Error al verificar el estado de matrícula. Por favor, intente nuevamente.');
    });
}

function getCursoId() {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    console.log("Curso ID:", id);  // Esto mostrará el ID en la consola
    return id;
}



