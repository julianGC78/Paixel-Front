import { showMessage } from './admin.js';
let moduloIdToDelete = null;
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

        addModuloButton.style.display = 'block';

        // Agregar event listeners a los íconos de lupa (similar a usuarios y cursos)
        document.querySelectorAll('.view-modulo').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const moduloId = event.currentTarget.dataset.id;
                mostrarDetallesModulo(moduloId); // Implementa esta función similar a mostrarDetallesUsuario
            });
        });
        document.querySelectorAll('.edit-modulo').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const moduloId = event.currentTarget.dataset.id;
                showEditModuloForm(moduloId);
            });
        });

       // Agregar event listeners a los íconos de eliminación de módulos
document.querySelectorAll('.delete-modulo').forEach(icon => {
    icon.addEventListener('click', (event) => {
        const moduloIdToDelete = event.currentTarget.dataset.id;
        document.getElementById('deletePopupMessage').textContent = "¿Estás seguro de que deseas eliminar este módulo?";
        document.getElementById('confirmDeleteModuloButton').style.display = 'block';
        document.getElementById('confirmDeleteUserButton').style.display = 'none';
        document.getElementById('confirmDeleteDocenteButton').style.display = 'none';
        document.getElementById('confirmDeleteCursoButton').style.display = 'none';
        document.getElementById('confirmDeleteWorkshopButton').style.display = 'none';
        document.getElementById('confirmDeletePreguntaButton').style.display = 'none';
        document.getElementById('deletePopup').style.display = 'block';

        const confirmDeleteModuloButton = document.getElementById('confirmDeleteModuloButton');
        confirmDeleteModuloButton.removeEventListener('click', deleteModulo); // Asegúrate de no agregar múltiples event listeners
        confirmDeleteModuloButton.addEventListener('click', () => {
            deleteModulo(moduloIdToDelete);
        });
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
            <tr><td>Id curso</td><td>${modulo.curso ? modulo.curso.idcurso : 'undefined'}</td></tr>
        `;

        moduloDetails.style.display = 'block';
        document.querySelector('table.cabecera-tabla').style.display = 'none';
        document.getElementById('addModuloButton').style.display = 'none';
    })
    .catch(error => {
        console.error('Error fetching modulo details:', error);
        alert(error.message);
    });
}

function showEditModuloForm(moduloId) {
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
        // Llenar el formulario de edición con los datos del módulo
        document.getElementById('moduloDescripcion').value = modulo.descripcion;
        document.getElementById('moduloOrden').value = modulo.orden;
        document.getElementById('moduloRecurso').value = modulo.recurso;
        document.getElementById('moduloTiempo').value = modulo.tiempo;
        document.getElementById('moduloTitulo').value = modulo.titulo;
        document.getElementById('moduloIdCurso').value=modulo.curso ? modulo.curso.idcurso : 'N/A';

        // Mostrar el formulario de edición
        document.querySelector('.moduloEdit').style.display = 'block';
        document.querySelector('table.cabecera-tabla').style.display = 'none';
        document.getElementById('addModuloButton').style.display = 'none';

        // Manejar la actualización del módulo al enviar el formulario
        const moduloEditForm = document.getElementById('moduloEditForm');
        moduloEditForm.onsubmit = function(event) {
            event.preventDefault();
            updateModulo(moduloId);
        };
    })
    .catch(error => {
        console.error('Error fetching módulo details:', error);
        alert(error.message);
    });
}


function updateModulo(moduloId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    const moduloUpdates = {
        descripcion: document.getElementById('moduloDescripcion').value,
        orden: document.getElementById('moduloOrden').value,
        recurso: document.getElementById('moduloRecurso').value,
        tiempo: document.getElementById('moduloTiempo').value,
        titulo: document.getElementById('moduloTitulo').value,
        idcurso: document.getElementById('moduloIdCurso').value
    };

    fetch(`http://127.0.0.1:8081/modulo/update/${moduloId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(moduloUpdates)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                if (response.status === 403) {
                    throw new Error('No tienes permiso para actualizar este módulo');
                } else {
                    throw new Error(`Error al actualizar el módulo: ${error.message}`);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Modulo updated successfully:", data);
        if (data.newToken) {
            sessionStorage.setItem('jwtToken', data.newToken); // Actualizar el token en el almacenamiento de sesión
        }
        showMessage('Módulo actualizado con éxito', 'success');
        document.querySelector('.moduloEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarModulos(); 
    })
    .catch(error => {
        console.error('Error updating módulo:', error);
        showMessage(`Error al actualizar el módulo: ${error.message}`, 'error');
    });
}





export function addModulo() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    const moduloData = {
        descripcion: document.getElementById('addModuloDescripcion').value,
        orden: document.getElementById('addModuloOrden').value,
        recurso: document.getElementById('addModuloRecurso').value,
        tiempo: document.getElementById('addModuloTiempo').value,
        titulo: document.getElementById('addModuloTitulo').value,
        idcurso: document.getElementById('addModuloIdCurso').value
    };
    console.log('Adding modulo:', moduloData);
    fetch('http://127.0.0.1:8081/modulo/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(moduloData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Error al añadir el módulo: ${error.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('Módulo añadido con éxito', 'success');
        document.querySelector('.moduloAdd').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        document.getElementById('addModuloButton').style.display = 'block';
        cargarModulos(); // Volver a cargar la lista de módulos
    })
    .catch(error => {
        console.error('Error adding modulo:', error);
        showMessage(`Error al añadir el módulo: ${error.message}`, 'error');
    });
}

function deleteModulo(moduloId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    fetch(`http://127.0.0.1:8081/modulo/delete/${moduloId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Error al eliminar el módulo: ${error.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('Módulo eliminado con éxito', 'success');
        document.getElementById('deletePopup').style.display = 'none';
        cargarModulos(); // Volver a cargar la lista de módulos
    })
    .catch(error => {
        console.error('Error deleting modulo:', error);
        showMessage(`Error al eliminar el módulo: ${error.message}`, 'error');
    });
}



// Handle adding a modulo
document.getElementById('moduloAddForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    addModulo();
});


// Event listener para el botón de volver a la lista de módulos
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.backToModulos').addEventListener('click', () => {
        document.querySelector('.moduloDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addModuloButton.style.display = 'block';
    });
});
