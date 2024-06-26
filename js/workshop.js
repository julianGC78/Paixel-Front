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
    }, 100);
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:8081/workshop/findAll')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('#workshops-container');
            data.forEach(workshop => {
                // Crear el div 'celda'
                const celdaDiv = document.createElement('div');
                celdaDiv.className = 'celda';
                
                // Crear el div 'celda-content'
                const workshopDiv = document.createElement('div');
                workshopDiv.className = 'celda-content';
                
                // Crear y configurar la imagen
                const image = document.createElement('img');
                image.src = workshop.contenido; // Asegúrate de que 'contenido' es la URL de la imagen
                image.alt = 'Workshop Image';
                workshopDiv.appendChild(image);
                
                // Icono (opcional, dependiendo de los datos de workshop)
                const iconSpan = document.createElement('span');
                iconSpan.className = 'material-symbols-outlined';
                iconSpan.textContent = 'mystery';
                workshopDiv.appendChild(iconSpan);
                
                // Div de overlay
                const overlayDiv = document.createElement('div');
                overlayDiv.className = 'overlay';
                workshopDiv.appendChild(overlayDiv);
                
                // Texto informativo
                const infoText = document.createElement('p');
                infoText.className = 'info-text';
                infoText.textContent = `${workshop.usuario.username} ${workshop.usuario.apellidos}`;
                workshopDiv.appendChild(infoText);
                
                // Añadir 'celda-content' a 'celda'
                celdaDiv.appendChild(workshopDiv);
                
                // Añadir la 'celda' completa al contenedor
                container.appendChild(celdaDiv);
                
                // Añadir evento de clic para abrir el modal
                workshopDiv.addEventListener('click', function () {
                    const modal = document.querySelector("#myModal");
                    const modalImg = document.querySelector("#img01");
                    const captionText = document.querySelector("#caption");
                    modal.style.display = "block";
                    modalImg.src = this.querySelector("img").src;
                    captionText.textContent = this.querySelector(".info-text").textContent;
                });
            });

            // Cerrar el modal
            const span = document.getElementsByClassName("close")[0];
            span.onclick = function () {
                const modal = document.querySelector("#myModal");
                modal.style.display = "none";
            };
        })
        
        .catch(error => console.error('Error loading workshops:', error));
    });
    
    window.onload = setup;


