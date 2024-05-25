import { showMessage } from './admin.js';
let cursoIdToDelete = null;
export function cargarCursos() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/curso/findAll', {
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
            const userDetails = document.querySelector('.userDetails');

            tableTitle.textContent = 'Cursos';

            // Definir las cabeceras
            tableHeaders.innerHTML = `
            <th>Imagen</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>ID Usuario</th>
            <th>ID Docente</th>
            <th>Acciones</th>
        `;

            tableBody.innerHTML = ''; // Limpiar las filas existentes

            data.forEach(curso => {
                console.log('Curso:', curso.titulo, 'ID Usuario:', curso.user ? curso.user.iduser : 'undefined', 'ID Docente:', curso.docente ? curso.docente.iddocente : 'undefined'); // Debugging line

                const row = document.createElement('tr');
                row.innerHTML = `
                <td><img src="${curso.recurso}" alt="${curso.titulo}" width="70"></td>
                <td>${curso.titulo}</td>
                <td>${curso.descripcion}</td>
                <td>${curso.user ? curso.user.iduser : 'undefined'}</td>
                <td>${curso.docente ? curso.docente.iddocente : 'undefined'}</td>
                <td class="acciones">
                    <span class="view-curso" data-id="${curso.idcurso}"><i class="fa-solid fa-magnifying-glass"></i></span>
                    <span class="edit-curso" data-id="${curso.idcurso}"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span class="delete-curso" data-id="${curso.idcurso}"><i class="fa-solid fa-trash-can"></i></span>
                </td>
            `;
                tableBody.appendChild(row);
            });

            addCursoButton.style.display = 'block'; // Mostrar el botón de añadir curso

            // Agregar event listeners a los íconos de lupa (similar a usuarios y docentes)
            document.querySelectorAll('.view-curso').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const cursoId = event.currentTarget.dataset.id;
                    mostrarDetallesCurso(cursoId); // Implementa esta función similar a mostrarDetallesUsuario
                });
            });
            document.querySelectorAll('.edit-curso').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const cursoId = event.currentTarget.dataset.id;
                    showEditCursoForm(cursoId);
                });
            });
            // Agregar event listeners a los íconos de eliminación de cursos
document.querySelectorAll('.delete-curso').forEach(icon => {
    icon.addEventListener('click', (event) => {
        const cursoIdToDelete = event.currentTarget.dataset.id;
        document.getElementById('deletePopupMessage').textContent = "¿Estás seguro de que deseas eliminar este curso?";
        document.getElementById('confirmDeleteCursoButton').style.display = 'block';
        document.getElementById('confirmDeleteUserButton').style.display = 'none';
        document.getElementById('confirmDeleteDocenteButton').style.display = 'none';
        document.getElementById('confirmDeleteModuloButton').style.display = 'none';
        document.getElementById('confirmDeleteWorkshopButton').style.display = 'none';
        document.getElementById('deletePopup').style.display = 'block';

        const confirmDeleteCursoButton = document.getElementById('confirmDeleteCursoButton');
        confirmDeleteCursoButton.removeEventListener('click', deleteCurso); // Asegúrate de no agregar múltiples event listeners
        confirmDeleteCursoButton.addEventListener('click', () => {
            deleteCurso(cursoIdToDelete);
        });
    });
})
        })
        .catch(error => {
            console.error('Error fetching curso data:', error);
        });
}


export function mostrarDetallesCurso(cursoId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/curso/findById/${cursoId}`, {
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
                    throw new Error('Error al obtener detalles del curso: ' + response.statusText);
                }
            }
            return response.json();
        })
        .then(curso => {
            const cursoDetails = document.querySelector('.cursoDetails');
            const cursoDetailsBody = document.querySelector('.cursoDetailsBody');
            const cursoDetailsTitle = document.querySelector('.cursoDetails h2');
            const backToCursosButton = document.querySelector('.backToCursos');

            cursoDetailsTitle.textContent = 'Detalles del Curso';
            backToCursosButton.textContent = 'Volver a la lista de cursos';

            cursoDetailsBody.innerHTML = `
            <tr><td>Imagen:</td><td><img src="${curso.recurso}" alt="${curso.titulo}" width="100"></td></tr>
            <tr><td>Título:</td><td>${curso.titulo}</td></tr>
            <tr><td>Descripción:</td><td>${curso.descripcion}</td></tr>
            <tr><td>ID Usuario:</td><td>${curso.user ? curso.user.iduser : 'undefined'}</td></tr>
            <tr><td>ID Docente:</td><td>${curso.docente ? curso.docente.iddocente : 'undefined'}</td></tr>
        `;

            cursoDetails.style.display = 'block';
            document.querySelector('table.cabecera-tabla').style.display = 'none';
            document.getElementById('addCursoButton').style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching curso details:', error);
            alert(error.message);
        });
}


function showEditCursoForm(cursoId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/curso/findById/${cursoId}`, {
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
                    throw new Error('Error al obtener detalles del curso: ' + response.statusText);
                }
            }
            return response.json();
        })
        .then(curso => {
            // Llenar el formulario de edición con los datos del curso
            document.getElementById('cursoDescripcion').value = curso.descripcion;
            document.getElementById('cursoRecurso').value = curso.recurso;
            document.getElementById('cursoTitulo').value = curso.titulo;
            document.getElementById('cursoIdUsuario').value = curso.user ? curso.user.iduser : 'undefined';
            document.getElementById('cursoIdDocente').value = curso.docente ? curso.docente.iddocente : 'undefined';

            // Mostrar el formulario de edición
            document.querySelector('.cursoEdit').style.display = 'block';
            document.querySelector('table.cabecera-tabla').style.display = 'none';
            document.getElementById('addCursoButton').style.display = 'none';

            // Manejar la actualización del curso al enviar el formulario
            const cursoEditForm = document.getElementById('cursoEditForm');
            cursoEditForm.onsubmit = function (event) {
                event.preventDefault();
                updateCurso(cursoId);
            };
        })
        .catch(error => {
            console.error('Error fetching curso details:', error);
            alert(error.message);
        });
}

function updateCurso(cursoId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    const cursoUpdates = {
        descripcion: document.getElementById('cursoDescripcion').value,
        recurso: document.getElementById('cursoRecurso').value,
        titulo: document.getElementById('cursoTitulo').value,
        idusuario: document.getElementById('cursoIdUsuario').value,
        iddocente: document.getElementById('cursoIdDocente').value
    };

    fetch(`http://127.0.0.1:8081/curso/update/${cursoId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cursoUpdates)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                if (response.status === 403) {
                    throw new Error('No tienes permiso para actualizar este curso');
                } else {
                    throw new Error(`Error al actualizar el curso: ${error.message}`);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Curso updated successfully:", data);
        if (data.newToken) {
            sessionStorage.setItem('jwtToken', data.newToken); // Actualizar el token en el almacenamiento de sesión
        }
        showMessage('Curso actualizado con éxito', 'success');
        document.querySelector('.cursoEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarCursos();
    })
    .catch(error => {
        console.error('Error updating curso:', error);
        showMessage(`Error al actualizar el curso: ${error.message}`, 'error');
    });
}



export function addCurso() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    const cursoData = {
        descripcion: document.getElementById('addCursoDescripcion').value,
        recurso: document.getElementById('addCursoRecurso').value,
        titulo: document.getElementById('addCursoTitulo').value,
        idusuario: document.getElementById('addCursoIdUsuario').value,
        iddocente: document.getElementById('addCursoIdDocente').value
    };

    fetch('http://127.0.0.1:8081/curso/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cursoData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Error al añadir el curso: ${error.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('Curso añadido con éxito', 'success');
        document.querySelector('.cursoAdd').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        document.getElementById('addCursoButton').style.display = 'block';
        cargarCursos(); // Volver a cargar la lista de cursos
    })
    .catch(error => {
        console.error('Error adding curso:', error);
        showMessage(`Error al añadir el curso: ${error.message}`, 'error');
    });
}

// Handle adding a curso
document.getElementById('cursoAddForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    addCurso();
});


// Función para eliminar curso
function deleteCurso(cursoId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        showMessage('No se encontró el token de autenticación', 'error');
        return;
    }

    fetch(`http://127.0.0.1:8081/curso/delete/${cursoId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Error al eliminar el curso: ${error.message}`);
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('Curso eliminado con éxito', 'success');
        document.getElementById('deletePopup').style.display = 'none';
        cargarCursos(); // Volver a cargar la lista de cursos
    })
    .catch(error => {
        console.error('Error deleting curso:', error);
        showMessage(`Error al eliminar el curso: ${error.message}`, 'error');
    });
}


// Event listener para el botón de volver a la lista de cursos
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.backToCursos').addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        addCursoButton.style.display = 'block';
    });
});
