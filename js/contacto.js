import { headerContent } from "../parciales/headerContent.js";
import { footerContent } from "../parciales/footerContent.js";
import { setupMenuAndAuth } from '../js/menuHandler.js';
import { customizeMenuColor } from '../js/comun.js';



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
}

window.onload = setup;

function enviarContacto() {
    const contactoData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        asunto: document.getElementById('asunto').value,
        mensaje: document.getElementById('mensaje').value,
    };

    fetch(`http://127.0.0.1:8081/contacto/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactoData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Error al enviar el contacto: ${error.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('Mensaje enviado con éxito', 'success');
        document.getElementById('contactForm').reset();
    })
    .catch(error => {
        console.error('Error al enviar mensaje:', error);
        showMessage(`Error al enviar el contacto: ${error.message}`, 'error');
    });
}

// Añadir un event listener para el formulario
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    enviarContacto();
});

function showMessage(message, type = 'success') {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', type);
    messageContainer.innerText = message;

    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}

// Añadir estilos para los mensajes
const style = document.createElement('style');
style.innerHTML = `
.message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    border-radius: 5px;
    color: #fff;
    font-size: 2vh;
    z-index: 1000;
}
.message.success {
    background-color: var(--color-verde);
}
.message.error {
    background-color: var(--color-rojo);
}
`;
document.head.appendChild(style);


