export function cargarModulos() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/modulo/findAll', {
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

        tableTitle.textContent = 'Módulos';

        // Definir las cabeceras
        tableHeaders.innerHTML = `
            <th>Video</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Orden</th>
            <th>Tiempo</th>
            <th>ID Curso</th>
            <th>Acciones</th>
        `;

        tableBody.innerHTML = ''; // Limpiar las filas existentes

        data.forEach(modulo => {
            console.log('Módulo:', modulo.titulo, 'ID Curso:', modulo.idcurso); // Verificar cada módulo

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <video width="170" controls>
                        <source src="${modulo.recurso}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </td>
                <td>${modulo.titulo}</td>
                <td>${modulo.descripcion}</td>
                <td>${modulo.orden}</td>
                <td>${modulo.tiempo}</td>
                <td>${modulo.curso ? modulo.curso.idcurso : 'undefined'}</td>
                <td class="acciones">
                    <span class="view-modulo" data-id="${modulo.idmodulo}"><i class="fa-solid fa-magnifying-glass"></i></span>
                    <span class="edit-modulo" data-id="${modulo.idmodulo}"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span class="delete-modulo" data-id="${modulo.idmodulo}"><i class="fa-solid fa-trash-can"></i></span>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Agregar event listeners a los íconos de lupa (similar a usuarios y cursos)
        document.querySelectorAll('.view-modulo').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const moduloId = event.currentTarget.dataset.id;
                mostrarDetallesModulo(moduloId); // Implementa esta función similar a mostrarDetallesUsuario
            });
        });
    })
    .catch(error => {
        console.error('Error fetching modulo data:', error);
    });
}


export function mostrarDetallesModulo(moduloId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/modulo/findById/${moduloId}`, {
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
                throw new Error('Error al obtener detalles del módulo: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(modulo => {
        const moduloDetails = document.querySelector('.moduloDetails');
        const moduloDetailsBody = document.querySelector('.moduloDetailsBody');
        const moduloDetailsTitle = document.querySelector('.moduloDetails h2');
        const backToModulosButton = document.querySelector('.backToModulos');

        moduloDetailsTitle.textContent = 'Detalles del Módulo';
        backToModulosButton.textContent = 'Volver a la lista de módulos';

        moduloDetailsBody.innerHTML = `
            <tr><td>video:</td>
            <td> <video width="170" controls>
            <source src="${modulo.recurso}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
            </tr>
            <tr><td>Título:</td><td>${modulo.titulo}</td></tr>
            <tr><td>Descripción:</td><td>${modulo.descripcion}</td></tr>
            <tr><td>Orden:</td><td>${modulo.orden}</td></tr>
            <tr><td>Tiempo:</td><td>${modulo.tiempo}</td></tr>
            <td>${modulo.curso ? modulo.curso.idcurso : 'undefined'}</td>
        `;

        moduloDetails.style.display = 'block';
        document.querySelector('table.cabecera-tabla').style.display = 'none';
    })
    .catch(error => {
        console.error('Error fetching modulo details:', error);
        alert(error.message);
    });
}

// Event listener para el botón de volver a la lista de módulos
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.backToModulos').addEventListener('click', () => {
        document.querySelector('.moduloDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
    });
});
