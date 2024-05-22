export function cargarDocentes() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/docente/findAll', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('No tienes permiso para ver esta información');
            } else {
                throw new Error('Respuesta del servidor: ' + response.status);
            }
        }
        return response.json();
    })
    .then(data => {
        const tableHeaders = document.querySelector('.cabecera-tabla thead .tableHeaders');
        const tableBody = document.querySelector('.cabecera-tabla tbody.cuerpo-tabla');
        const tableTitle = document.querySelector('h1');

        tableTitle.textContent = 'Docentes';

        // Definir las cabeceras
        tableHeaders.innerHTML = `
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Descripción</th>
            <th>Acciones</th>
        `;

        tableBody.innerHTML = ''; // Limpiar las filas existentes

        data.forEach(docente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${docente.recurso}" alt="${docente.username}" width="70"></td>
                <td>${docente.username}</td>
                <td>${docente.especialidad}</td>
                <td>${docente.descripcion}</td>
                <td class="acciones">
                    <span class="view-docente" data-id="${docente.iddocente}"><i class="fa-solid fa-magnifying-glass"></i></span>
                    <span class="edit-docente" data-id="${docente.iddocente}"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span class="delete-docente" data-id="${docente.iddocente}"><i class="fa-solid fa-trash-can"></i></span>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Agregar event listeners a los íconos de lupa (similar a usuarios)
        document.querySelectorAll('.view-docente').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const docenteId = event.currentTarget.dataset.id;
                mostrarDetallesDocente(docenteId);
            });
        });
    })
    .catch(error => {
        console.error('Error fetching docente data:', error);
    });
}

function mostrarDetallesDocente(docenteId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/docente/findById/${docenteId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('No tienes permiso para ver esta información');
            } else {
                throw new Error('Error al obtener detalles del docente: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(docente => {
        const docenteDetails = document.querySelector('.docenteDetails');
        const docenteDetailsBody = document.querySelector('.docenteDetailsBody');
        const docenteDetailsTitle = document.querySelector('.docenteDetails h2');
        const backToDocentesButton = document.querySelector('.backToDocentes');

        // Verificar que todos los elementos existen
        console.log({
            docenteDetails,
            docenteDetailsBody,
            docenteDetailsTitle,
            backToDocentesButton
        });

        if (!docenteDetails || !docenteDetailsBody || !docenteDetailsTitle || !backToDocentesButton) {
            throw new Error('No se encontraron algunos de los elementos del DOM necesarios para mostrar los detalles del docente.');
        }

        docenteDetailsTitle.textContent = 'Detalles del Docente';
        backToDocentesButton.textContent = 'Volver a la lista de docentes';

        docenteDetailsBody.innerHTML = `
            <tr><td>Imagen:</td><td><img src="${docente.recurso}" alt="${docente.username}" width="70"></td></tr>
            <tr><td>Nombre:</td><td>${docente.username}</td></tr>
            <tr><td>Especialidad:</td><td>${docente.especialidad}</td></tr>
            <tr><td>Descripción:</td><td>${docente.descripcion}</td></tr>
        `;

        docenteDetails.style.display = 'block';
        document.querySelector('.cabecera-tabla').style.display = 'none';
    })
    .catch(error => {
        console.error('Error fetching docente details:', error);
        alert(error.message);
    });
}

// Event listener para el botón de volver a la lista de docentes
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.backToDocentes').addEventListener('click', () => {
        document.querySelector('.docenteDetails').style.display = 'none';
        document.querySelector('.cabecera-tabla').style.display = 'table';
    });
});
