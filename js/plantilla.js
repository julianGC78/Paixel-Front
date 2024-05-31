import { headerContet } from "../parciales/headerContent.js";

import{footerContent} from "../parciales/footerContent.js";

window.onload = function () {
    // Cremos cabecera dinamicamente
    let body = document.querySelector("body");
    let header = document.createElement("header");
    let footer = document.createElement("footer");
    header.innerHTML = headerContet;
    footer.innerHTML = footerContent;
    body.before(header);
    body.after(footer);
    
    // Mostramos y ocultamos el submenu
    document.querySelector('.m1 .linea').addEventListener('click', function() {
        var submenu = document.querySelector('.m1 .submenu');
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });
}