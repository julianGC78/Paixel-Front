import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth } from '../js/menuHandler.js';
import { customizeMenuColor } from '../js/comun.js';

// Función para configurar la cabecera y el pie de página se llama setup
// para que se ejecute al cargar la página
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
    }, 100);
}
/*
function setupPaymentButtons() {
    const paymentButtons = document.querySelectorAll('.btn');
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const token = sessionStorage.getItem('jwtToken');
            if (token) {
                const userId = JSON.parse(atob(token.split('.')[1])).userId;
                console.log('UserID:', userId);
                if (userId) {
                    updatePaymentStatus(userId);
                } else {
                    console.error('UserID es null, verificar el contenido del token JWT.');                 
                }
            } else {
                console.log('No se encontró token de autenticación, redireccionando a login.');
                window.location.href = 'login.html';
            }
        });
    });
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
*/
document.addEventListener('DOMContentLoaded', function() {
    setupPaymentButtons();

    document.querySelector('.cancelPayment').addEventListener('click', function() {
        document.getElementById('paymentPopup').style.display = 'none';  // Oculta el popup
    });

    document.querySelector('#confirmPayment').addEventListener('click', function() {
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
    });
});

function setupPaymentButtons() {
    const paymentButtons = document.querySelectorAll('.btn');
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('paymentPopup').style.display = 'flex';  // Muestra el popup
        });
    });
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



window.onload = setup;