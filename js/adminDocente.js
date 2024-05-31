import { showMessage } from './admin.js';

let docenteIdToDelete=null;

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

         // Mostrar el botón de añadir usuario
         addDocenteButton.style.display = 'block';


        // Agregar event listeners a los íconos de lupa (similar a usuarios)
        document.querySelectorAll('.view-docente').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const docenteId = event.currentTarget.dataset.id;
                mostrarDetallesDocente(docenteId);
            });
        });
        document.querySelectorAll('.edit-docente').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const docenteId = event.currentTarget.dataset.id;
                showEditDocenteForm(docenteId);
            });
        });
        // Agregar event listeners a los íconos de eliminación
        document.querySelectorAll('.delete-docente').forEach(icon => {
            icon.addEventListener('click', (event) => {
                docenteIdToDelete = event.currentTarget.dataset.id;
                document.getElementById('deletePopupMessage').textContent = "¿Estás seguro de que deseas eliminar este docente?";
                document.getElementById('confirmDeleteDocenteButton').style.display = 'block';
                document.getElementById('confirmDeleteUserButton').style.display = 'none';
                document.getElementById('confirmDeletePreguntaButton').style.display = 'none';
                document.getElementById('confirmDeleteCursoButton').style.display = 'none';
                document.getElementById('confirmDeleteModuloButton').style.display = 'none';
                document.getElementById('confirmDeleteWorkshopButton').style.display = 'none';
                document.getElementById('deletePopup').style.display = 'block';
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
        document.getElementById('addDocenteButton').style.display = 'none'; 

        // Añadir event listener para volver a la lista de docentes
        backToDocentesButton.addEventListener('click', () => {
            docenteDetails.style.display = 'none';
            document.querySelector('table.cabecera-tabla').style.display = 'table';
            document.getElementById('addDocenteButton').style.display = 'block'; // Mostrar el botón de añadir docente
        });

    })
    .catch(error => {
        console.error('Error fetching docente details:', error);
        alert(error.message);
    });
}


function showEditDocenteForm(docenteId) {
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
        // Llenar el formulario de edición con los datos del docente
        const docenteUsername = document.getElementById('docenteUsername');
        const docenteEspecialidad = document.getElementById('docenteEspecialidad');
        const docenteDescripcion = document.getElementById('docenteDescripcion');
        const docenteRecurso = document.getElementById('docenteRecurso');

        if (docenteUsername) docenteUsername.value = docente.username;
        if (docenteEspecialidad) docenteEspecialidad.value = docente.especialidad;
        if (docenteDescripcion) docenteDescripcion.value = docente.descripcion;
        if (docenteRecurso) docenteRecurso.value = docente.recurso;

        // Mostrar el formulario de edición
        const docenteEdit = document.querySelector('.docenteEdit');
        const tableCabecera = document.querySelector('table.cabecera-tabla');
        const addDocenteButton = document.getElementById('addDocenteButton');

        if (docenteEdit) docenteEdit.style.display = 'block';
        if (tableCabecera) tableCabecera.style.display = 'none';
        if (addDocenteButton) addDocenteButton.style.display = 'none';

        document.getElementById('addDocenteButton').style.display = 'none'; 

        // Manejar la actualización del docente al enviar el formulario
        const docenteEditForm = document.getElementById('docenteEditForm');
        if (docenteEditForm) {
            docenteEditForm.onsubmit = function(event) {
                event.preventDefault();
                updateDocente(docenteId);
            };
        }
    })
    .catch(error => {
        console.error('Error fetching docente details:', error);
        alert(error.message);
    });
}


function updateDocente(docenteId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    const docenteUpdates = {
        username: document.getElementById('docenteUsername').value,
        especialidad: document.getElementById('docenteEspecialidad').value,
        descripcion: document.getElementById('docenteDescripcion').value,
        recurso: document.getElementById('docenteRecurso').value
    };

    fetch(`http://127.0.0.1:8081/docente/update/${docenteId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(docenteUpdates)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('No tienes permiso para actualizar este docente');
            } else {
                throw new Error('Error al actualizar el docente: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(data => {
        console.log("Docente updated successfully:", data);
        if (data.newToken) {
            sessionStorage.setItem('jwtToken', data.newToken); // Actualizar el token en el almacenamiento de sesión
        }
        alert('Docente actualizado con éxito');
        document.querySelector('.docenteEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarDocentes(); 
    })
    .catch(error => {
        console.error('Error updating docente:', error);
        alert(error.message);
    });
}

function addDocente() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    const usernameElement = document.getElementById('addDocenteUsername');
    const especialidadElement = document.getElementById('addDocenteEspecialidad');
    const descripcionElement = document.getElementById('addDocenteDescripcion');
    const recursoElement = document.getElementById('addDocenteRecurso');

    // Verificar si los elementos existen
    if (!usernameElement || !especialidadElement || !descripcionElement || !recursoElement) {
        console.error('Uno o más elementos del formulario no se encontraron');
        showMessage('Uno o más elementos del formulario no se encontraron', 'error');
        return;
    }

    const docenteData = {
        username: usernameElement.value,
        especialidad: especialidadElement.value,
        descripcion: descripcionElement.value,
        recurso: recursoElement.value
    };

    fetch('http://127.0.0.1:8081/docente/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(docenteData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al añadir el docente: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        showMessage('Docente añadido con éxito', 'success');
        document.querySelector('.docenteAdd').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        document.getElementById('addDocenteButton').style.display = 'block';
        cargarDocentes(); // Volver a cargar la lista de docentes
    })
    .catch(error => {
        console.error('Error adding docente:', error);
        showMessage('Error al añadir el docente: ' + error.message, 'error');
    });
}


// Handle adding a docente
document.getElementById('docenteAddForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    addDocente();
});



// Función para eliminar docente

function deleteDocente() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    fetch(`http://127.0.0.1:8081/docente/delete/${docenteIdToDelete}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el docente: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('deletePopup').style.display = 'none';
        showMessage('Docente eliminado con éxito', 'success');
        cargarDocentes(); // Volver a cargar la lista de docentes
    })
    .catch(error => {
        console.error('Error deleting docente:', error);
        showMessage('Error al eliminar el docente: ' + error.message, 'error');
    });
}

// Inicializar el popup de eliminación
document.getElementById('confirmDeleteDocenteButton').addEventListener('click', deleteDocente);
document.getElementById('cancelDeleteButton').addEventListener('click', () => {
    document.getElementById('deletePopup').style.display = 'none';
});


// Event listener para el botón de volver a la lista de docentes
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.backToDocentes').addEventListener('click', () => {
        document.querySelector('.docenteDetails').style.display = 'none';
        document.querySelector('.cabecera-tabla').style.display = 'table';
       
    });
});
