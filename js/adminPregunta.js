import { showMessage } from './admin.js';

let preguntaIdToDelete = null;

export function cargarPreguntas() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/pregunta/findAll', {
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

        tableTitle.textContent = 'Preguntas';

        tableHeaders.innerHTML = `
            <th>Contenido</th>
            <th>Fecha</th>
            <th>ID Usuario</th>
            <th>ID Módulo</th>
            <th>Acciones</th>
        `;

        tableBody.innerHTML = ''; // Limpiar las filas existentes

        data.forEach(pregunta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="tdPregunta">${pregunta.contenido}</td>
                <td class="tdPregunta1">${pregunta.fecha}</td>
                <td class="tdPregunta2">${pregunta.usuario ? pregunta.usuario.iduser : 'undefined'}</td>
                <td class="tdPregunta3">${pregunta.modulo.idmodulo}</td>
                <td class="acciones">
                    <span class="view-pregunta" data-id="${pregunta.idpregunta}"><i class="fa-solid fa-magnifying-glass"></i></span>
                    <span class="edit-pregunta" data-id="${pregunta.idpregunta}"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span class="delete-pregunta" data-id="${pregunta.idpregunta}"><i class="fa-solid fa-trash-can"></i></span>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById('addPreguntaButton').style.display = 'block';

        document.querySelectorAll('.view-pregunta').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const preguntaId = event.currentTarget.dataset.id;
                mostrarDetallesPregunta(preguntaId); // Implementa esta función similar a mostrarDetallesUsuario
            });
        });
        document.querySelectorAll('.edit-pregunta').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const preguntaId = event.currentTarget.dataset.id;
                mostrarDetallesPreguntaParaEditar(preguntaId);
            });
        });

        document.querySelectorAll('.delete-pregunta').forEach(icon => {
            icon.addEventListener('click', (event) => {
                preguntaIdToDelete = event.currentTarget.dataset.id;
                document.getElementById('deletePopupMessage').textContent = "¿Estás seguro de que deseas eliminar esta pregunta?";
                document.getElementById('confirmDeletePreguntaButton').style.display = 'block';
                document.getElementById('confirmDeleteUserButton').style.display = 'none';
                document.getElementById('confirmDeleteDocenteButton').style.display = 'none';
                document.getElementById('confirmDeleteCursoButton').style.display = 'none';
                document.getElementById('confirmDeleteModuloButton').style.display = 'none';
                document.getElementById('confirmDeleteWorkshopButton').style.display = 'none';
                document.getElementById('deletePopup').style.display = 'block';

                const confirmDeletePreguntaButton = document.getElementById('confirmDeletePreguntaButton');
                confirmDeletePreguntaButton.removeEventListener('click', deletePregunta); // Asegúrate de no agregar múltiples event listeners
                confirmDeletePreguntaButton.addEventListener('click', () => {
                    deletePregunta(preguntaIdToDelete);
                });
            });
        });
    })
    .catch(error => {
        console.error('Error fetching pregunta data:', error);
    });
}


export function mostrarDetallesPregunta(preguntaId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/pregunta/findById/${preguntaId}`, {
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
                throw new Error('Error al obtener detalles de la pregunta: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(pregunta => {
        console.log('Detalles de la Pregunta:', pregunta);  // Log para verificar los datos

        const preguntaDetails = document.querySelector('.preguntaDetails');
        const preguntaDetailsBody = document.querySelector('.preguntaDetailsBody');
        const preguntaDetailsTitle = document.querySelector('.preguntaDetails h2');
        const backToPreguntasButton = document.querySelector('.backToPreguntas');

      
        preguntaDetailsTitle.textContent = 'Detalles de la Pregunta';
        backToPreguntasButton.textContent = 'Volver a la lista de preguntas';

        preguntaDetailsBody.innerHTML = `
            <tr><td>Contenido:</td><td>${pregunta.contenido}</td></tr>
            <tr><td>Fecha:</td><td>${new Date(pregunta.fecha).toLocaleDateString()}</td></tr>
            <tr><td>Usuario:</td><td>${pregunta.usuario ? pregunta.usuario.username : 'N/A'}</td></tr> 
            <tr><td>Módulo:</td><td>${pregunta.modulo ? pregunta.modulo.titulo : 'N/A'}</td></tr>
        `;

        preguntaDetails.style.display = 'block';
        document.querySelector('table.cabecera-tabla').style.display = 'none';
        document.getElementById('addPreguntaButton').style.display = 'none';
    })
    .catch(error => {
        console.error('Error fetching pregunta details:', error);
        alert(error.message);
    });
}

export function mostrarDetallesPreguntaParaEditar(preguntaId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/pregunta/findById/${preguntaId}`, {
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
                throw new Error('Error al obtener detalles de la pregunta: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(pregunta => {
        // Llenar el formulario de edición con los datos de la pregunta
        document.getElementById('preguntaContenido').value = pregunta.contenido;
        document.getElementById('preguntaFecha').value = pregunta.fecha;
        document.getElementById('preguntaIdUsuario').value = pregunta.usuario ? pregunta.usuario.iduser : 'undefined';
        document.getElementById('preguntaIdModulo').value = pregunta.modulo ? pregunta.modulo.idmodulo : 'undefined';

        // Mostrar el formulario de edición
        document.querySelector('.preguntaEdit').style.display = 'block';
        document.querySelector('table.cabecera-tabla').style.display = 'none';
        document.getElementById('addPreguntaButton').style.display = 'none';

        // Manejar la actualización de la pregunta al enviar el formulario
        const preguntaEditForm = document.getElementById('preguntaEditForm');
        preguntaEditForm.onsubmit = function (event) {
            event.preventDefault();
            updatePregunta(preguntaId);
        };
    })
    .catch(error => {
        console.error('Error fetching pregunta details:', error);
        alert(error.message);
    });
}


export function updatePregunta(preguntaId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    const preguntaUpdates = {
        contenido: document.getElementById('preguntaContenido').value,
        fecha: document.getElementById('preguntaFecha').value,
        idusuario: document.getElementById('preguntaIdUsuario').value,
        idmodulo: document.getElementById('preguntaIdModulo').value
    };

    fetch(`http://127.0.0.1:8081/pregunta/update/${preguntaId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(preguntaUpdates)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                if (response.status === 403) {
                    throw new Error('No tienes permiso para actualizar esta pregunta');
                } else {
                    throw new Error(`Error al actualizar la pregunta: ${error.message}`);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Pregunta updated successfully:", data);
        if (data.newToken) {
            sessionStorage.setItem('jwtToken', data.newToken); // Actualizar el token en el almacenamiento de sesión
        }
        showMessage('Pregunta actualizada con éxito', 'success');
        document.querySelector('.preguntaEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarPreguntas();
    })
    .catch(error => {
        console.error('Error updating pregunta:', error);
        showMessage(`Error al actualizar la pregunta: ${error.message}`, 'error');
    });
}




function addPregunta() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    const preguntaData = {
        contenido: document.getElementById('addPreguntaContenido').value.trim(),
        fecha: document.getElementById('addPreguntaFecha').value,
        idusuario: parseInt(document.getElementById('addPreguntaIdUsuario').value, 10),
        idmodulo: parseInt(document.getElementById('addPreguntaIdModulo').value, 10)
    };

    if (!preguntaData.contenido || isNaN(preguntaData.idusuario) || isNaN(preguntaData.idmodulo)) {
        console.error('Campos requeridos faltantes o incorrectos');
        showMessage('Campos requeridos faltantes o incorrectos', 'error');
        return;
    }

    console.log('Pregunta data:', preguntaData);

    fetch('http://127.0.0.1:8081/pregunta/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(preguntaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al añadir la pregunta: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        showMessage('Pregunta añadida con éxito', 'success');
        document.querySelector('.preguntaAdd').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        document.getElementById('addPreguntaButton').style.display = 'block';
        cargarPreguntas(); // Volver a cargar la lista de preguntas
    })
    .catch(error => {
        console.error('Error adding pregunta:', error);
        showMessage(`Error al añadir la pregunta: ${error.message}`, 'error');
    });
}



// Event listener para el formulario de añadir pregunta
document.getElementById('preguntaAddForm').addEventListener('submit', (event) => {
    event.preventDefault();
    addPregunta();
});


function deletePregunta(preguntaId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    fetch(`http://127.0.0.1:8081/pregunta/delete/${preguntaId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Error al eliminar la pregunta: ${error.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('Pregunta eliminada con éxito', 'success');
        document.getElementById('deletePopup').style.display = 'none';
        cargarPreguntas(); // Volver a cargar la lista de preguntas
    })
    .catch(error => {
        console.error('Error deleting pregunta:', error);
        showMessage(`Error al eliminar la pregunta: ${error.message}`, 'error');
    });
}


  // Aquí puedes agregar la lógica para mostrar y editar la pregunta
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.backToPreguntas').addEventListener('click', () => {
        document.querySelector('.preguntaDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'block';
        addPreguntaButton.style.display = 'block';
    });
});




