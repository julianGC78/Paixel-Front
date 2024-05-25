import { showMessage } from './admin.js';
let workshopIdToDelete = null;
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

            addWorkshopButton.style.display = 'block';

            // Agregar event listeners a los íconos de lupa (similar a usuarios y cursos)
            document.querySelectorAll('.view-workshop').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const workshopId = event.currentTarget.dataset.id;
                    mostrarDetallesWorkshop(workshopId); // Implementa esta función similar a mostrarDetallesUsuario
                });
            });
            document.querySelectorAll('.edit-workshop').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const workshopId = event.currentTarget.dataset.id;
                    showEditWorkshopForm(workshopId);
                });
            });
            // Agregar event listeners a los íconos de eliminación de workshops
            document.querySelectorAll('.delete-workshop').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const workshopIdToDelete = event.currentTarget.dataset.id;
                    document.getElementById('deletePopupMessage').textContent = "¿Estás seguro de que deseas eliminar este workshop?";
                    document.getElementById('confirmDeleteWorkshopButton').style.display = 'block';
                    document.getElementById('confirmDeleteUserButton').style.display = 'none';
                    document.getElementById('confirmDeleteDocenteButton').style.display = 'none';
                    document.getElementById('confirmDeleteCursoButton').style.display = 'none';
                    document.getElementById('confirmDeleteModuloButton').style.display = 'none';
                    document.getElementById('deletePopup').style.display = 'block';

                    const confirmDeleteWorkshopButton = document.getElementById('confirmDeleteWorkshopButton');
                    confirmDeleteWorkshopButton.removeEventListener('click', deleteWorkshop); // Asegúrate de no agregar múltiples event listeners
                    confirmDeleteWorkshopButton.addEventListener('click', () => {
                        deleteWorkshop(workshopIdToDelete);
                    });
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
            <tr><td>ID Usuario:</td><td>${workshop.usuario ? workshop.usuario.username : 'N/A'}</td></tr> 
        `;

            workshopDetails.style.display = 'block';
            document.querySelector('table.cabecera-tabla').style.display = 'none';
            document.getElementById('addWorkshopButton').style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching workshop details:', error);
            alert(error.message);
        });
}

function showEditWorkshopForm(workshopId) {
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
            // Llenar el formulario de edición con los datos del workshop
            document.getElementById('workshopContenido').value = workshop.contenido;
            document.getElementById('workshopDescripcion').value = workshop.descripcion;
            document.getElementById('workshopFecha').value = new Date(workshop.fecha).toISOString().substr(0, 10);
            document.getElementById('workshopIdUsuario').value = workshop.usuario ? workshop.usuario.iduser : 'N/A';

            // Mostrar el formulario de edición
            document.querySelector('.workshopEdit').style.display = 'block';
            document.querySelector('table.cabecera-tabla').style.display = 'none';
            document.getElementById('addWorkshopButton').style.display = 'none';

            // Manejar la actualización del workshop al enviar el formulario
            const workshopEditForm = document.getElementById('workshopEditForm');
            workshopEditForm.onsubmit = function (event) {
                event.preventDefault();
                updateWorkshop(workshopId);
            };
        })
        .catch(error => {
            console.error('Error fetching workshop details:', error);
            alert(error.message);
        });
}


function updateWorkshop(workshopId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    const workshopUpdates = {
        contenido: document.getElementById('workshopContenido').value,
        descripcion: document.getElementById('workshopDescripcion').value,
        fecha: document.getElementById('workshopFecha').value,
        idusuario: document.getElementById('workshopIdUsuario').value
    };

    fetch(`http://127.0.0.1:8081/workshop/update/${workshopId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(workshopUpdates)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                if (response.status === 403) {
                    throw new Error('No tienes permiso para actualizar este workshop');
                } else {
                    throw new Error(`Error al actualizar el workshop: ${error.message}`);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Workshop updated successfully:", data);
        if (data.newToken) {
            sessionStorage.setItem('jwtToken', data.newToken); // Actualizar el token en el almacenamiento de sesión
        }
        showMessage('Workshop actualizado con éxito', 'success');
        document.querySelector('.workshopEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarWorkshops();
    })
    .catch(error => {
        console.error('Error updating workshop:', error);
        showMessage(`Error al actualizar el workshop: ${error.message}`, 'error');
    });
}



export function addWorkshop() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    const workshopData = {
        contenido: document.getElementById('addWorkshopContenido').value,
        descripcion: document.getElementById('addWorkshopDescripcion').value,
        fecha: document.getElementById('addWorkshopFecha').value,
        idusuario: document.getElementById('addWorkshopIdUsuario').value
    };
    console.log('Workshop data:', workshopData);

    fetch('http://127.0.0.1:8081/workshop/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(workshopData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al añadir el workshop: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            showMessage('Workshop añadido con éxito', 'success');
            document.querySelector('.workshopAdd').style.display = 'none';
            document.querySelector('table.cabecera-tabla').style.display = 'table';
            document.getElementById('addWorkshopButton').style.display = 'block';
            /*
            cargarWorkshops(); 
            */
        })
        .catch(error => {
            console.error('Error adding workshop:', error);
            showMessage(`Error al añadir el workshop: ${error.message}`, 'error');
        });
}
function deleteWorkshop(workshopId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    fetch(`http://127.0.0.1:8081/workshop/delete/${workshopId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(`Error al eliminar el workshop: ${error.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            showMessage('Workshop eliminado con éxito', 'success');
            document.getElementById('deletePopup').style.display = 'none';
            cargarWorkshops(); // Volver a cargar la lista de workshops
        })
        .catch(error => {
            console.error('Error deleting workshop:', error);
            showMessage(`Error al eliminar el workshop: ${error.message}`, 'error');
        });
}


// Handle adding a workshop
document.getElementById('workshopAddForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    addWorkshop();
});

// Event listener para el botón de volver a la lista de cursos
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.backToWorkshops').addEventListener('click', () => {
        document.querySelector('.workshopDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addWorkshopButton.style.display = 'block';
    });
});

