export function cargarWorkshops() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/workshop/findAll', {
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
        console.log(data);  // Log de la respuesta para verificar campos

        const tableHeaders = document.querySelector('.cabecera-tabla thead .tableHeaders');
        const tableBody = document.querySelector('.cabecera-tabla tbody.cuerpo-tabla');
        const tableTitle = document.querySelector('h1');

        tableTitle.textContent = 'Workshops';

        // Definir las cabeceras
        tableHeaders.innerHTML = `
            <th>Imagen</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>ID Usuario</th>
            <th>Acciones</th>
        `;

        tableBody.innerHTML = ''; // Limpiar las filas existentes

        data.forEach(workshop => {
            console.log('Workshop:', workshop.contenido, 'ID Usuario:', workshop.usuario ? workshop.usuario.iduser : 'undefined'); // Verificar cada workshop

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${workshop.contenido}" alt="${workshop.descripcion}" width="70"></td>
                <td>${workshop.descripcion}</td>
                <td>${new Date(workshop.fecha).toLocaleDateString()}</td>
                <td>${workshop.usuario ? workshop.usuario.iduser : 'undefined'}</td>
                <td class="acciones">
                    <span class="view-workshop" data-id="${workshop.idworkshop}"><i class="fa-solid fa-magnifying-glass"></i></span>
                    <span class="edit-workshop" data-id="${workshop.idworkshop}"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span class="delete-workshop" data-id="${workshop.idworkshop}"><i class="fa-solid fa-trash-can"></i></span>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Agregar event listeners a los íconos de lupa (similar a usuarios y cursos)
        document.querySelectorAll('.view-workshop').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const workshopId = event.currentTarget.dataset.id;
                mostrarDetallesWorkshop(workshopId); // Implementa esta función similar a mostrarDetallesUsuario
            });
        });
    })
    .catch(error => {
        console.error('Error fetching workshop data:', error);
    });
}


export function mostrarDetallesWorkshop(workshopId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/workshop/findById/${workshopId}`, {
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
                throw new Error('Error al obtener detalles del workshop: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(workshop => {
        console.log('Detalles del Workshop:', workshop);  // Log para verificar los datos

        const workshopDetails = document.querySelector('.workshopDetails');
        const workshopDetailsBody = document.querySelector('.workshopDetailsBody');
        const workshopDetailsTitle = document.querySelector('.workshopDetails h2');
        const backToWorkshopsButton = document.querySelector('.backToWorkshops');

        workshopDetailsTitle.textContent = 'Detalles del Workshop';
        backToWorkshopsButton.textContent = 'Volver a la lista de workshops';

        workshopDetailsBody.innerHTML = `
            <tr><td>Imagen:</td><td><img src="${workshop.contenido}" alt="${workshop.descripcion}" width="100"></td></tr>
            <tr><td>Descripción:</td><td>${workshop.descripcion}</td></tr>
            <tr><td>Fecha:</td><td>${new Date(workshop.fecha).toLocaleDateString()}</td></tr>
            <tr><td>ID Usuario:</td><td>${workshop.usuario ? workshop.usuario.username : 'N/A'}</td></tr> <!-- Asegúrate de que el idusuario esté definido -->
        `;

        workshopDetails.style.display = 'block';
        document.querySelector('table.cabecera-tabla').style.display = 'none';
    })
    .catch(error => {
        console.error('Error fetching workshop details:', error);
        alert(error.message);
    });
}


