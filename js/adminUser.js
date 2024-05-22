
export function cargarUsuarios() {
    fetch('http://127.0.0.1:8081/usuario/findAll')
        .then(response => response.json())
        .then(data => {
            const tableHeaders = document.querySelector('.cabecera-tabla thead .tableHeaders');
            const tableBody = document.querySelector('.cabecera-tabla tbody.cuerpo-tabla');
            const tableTitle = document.querySelector('h1');
           

            tableTitle.textContent = 'Usuarios';

            // Definir las cabeceras
            tableHeaders.innerHTML = `
                <th>Email</th>
                <th>Nombre de Usuario</th>
                <th>Apellidos</th>
                <th>Localidad</th>
                <th>Matrícula</th>
                <th>Fecha de Nacimiento</th>
                <th>Acciones</th>
            `;

            tableBody.innerHTML = ''; // Limpiar las filas existentes

            data.forEach(user => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${user.email}</td>
                    <td>${user.username}</td>
                    <td>${user.apellidos}</td>
                    <td>${user.localidad || 'Null'}</td>
                    <td>${user.matricula ? 'Yes' : 'No'}</td>
                    <td>${new Date(user.fechaNacimiento).toLocaleDateString()}</td>
                    <td>
                        <span class="view-user" data-id="${user.iduser}"><i class="fa-solid fa-magnifying-glass"></i></span>
                        <span class="edit-user" data-id="${user.iduser}"><i class="fa-solid fa-pen-to-square"></i></span>
                        <span class="delete-user" data-id="${user.iduser}"><i class="fa-solid fa-trash-can"></i></span>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            // Mostrar el botón de añadir usuario
            addUserButton.style.display = 'block';

            // Agregar event listeners a los íconos de lupa y edición
            document.querySelectorAll('.view-user').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const userId = event.currentTarget.dataset.id;
                    mostrarDetallesUsuario(userId);
                });
            });

            document.querySelectorAll('.edit-user').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const userId = event.currentTarget.dataset.id;
                    showEditUserForm(userId);
                });
            });

            // Agregar event listeners a los íconos de eliminación
            document.querySelectorAll('.delete-user').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    userIdToDelete = event.currentTarget.dataset.id;
                    document.getElementById('deletePopup').style.display = 'block';
                });
            });
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}


function mostrarDetallesUsuario(userId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/usuario/findById/${userId}`, {
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
                throw new Error('Error al obtener detalles del usuario: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(user => {
        const userDetails = document.querySelector('.userDetails');
        const userDetailsBody = document.querySelector('.userDetailsBody');
        const userDetailsTitle = document.querySelector('.userDetails h2');
        const backToUsersButton = document.querySelector('.backToUsers');

        userDetailsTitle.textContent = 'Detalles del Usuario';
        backToUsersButton.textContent = 'Volver a la lista de usuarios';

        userDetailsBody.innerHTML = `
            <tr><td>Email:</td><td>${user.email}</td></tr>
            <tr><td>Nombre de Usuario:</td><td>${user.username}</td></tr>
            <tr><td>Apellidos:</td><td>${user.apellidos}</td></tr>
            <tr><td>Localidad:</td><td>${user.localidad || 'Null'}</td></tr>
            <tr><td>Matrícula:</td><td>${user.matricula ? 'Yes' : 'No'}</td></tr>
            <tr><td>Fecha de Nacimiento:</td><td>${new Date(user.fechaNacimiento).toLocaleDateString()}</td></tr>
            <tr><td>Género:</td><td>${user.genero || 'Null'}</td></tr>
            <tr><td>Role:</td><td>${user.role}</td></tr>
        `;

        userDetails.style.display = 'block';
        document.querySelector('table.cabecera-tabla').style.display = 'none';
        document.getElementById('addUserButton').style.display = 'none'; 
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
        alert(error.message);
    });
}



function showEditUserForm(userId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/usuario/findById/${userId}`, {
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
                throw new Error('Error al obtener detalles del usuario: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(user => {
        // Llenar el formulario de edición con los datos del usuario
        document.getElementById('email').value = user.email;
        document.getElementById('username').value = user.username;
        document.getElementById('apellidos').value = user.apellidos;
        document.getElementById('localidad').value = user.localidad || '';
        document.getElementById('matricula').checked = user.matricula;
        document.getElementById('fechaNacimiento').value = new Date(user.fechaNacimiento).toISOString().substr(0, 10);
        document.getElementById('genero').value = user.genero || '';
        document.getElementById('role').value = user.role;

        // Mostrar el formulario de edición
        document.querySelector('.userEdit').style.display = 'block';
        document.querySelector('table.cabecera-tabla').style.display = 'none';
        document.getElementById('addUserButton').style.display = 'none';

      
        // Manejar la actualización del usuario al enviar el formulario
        const userEditForm = document.getElementById('userEditForm');
        userEditForm.onsubmit = function(event) {
            event.preventDefault();
            updateUser(userId);
        };
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
        alert(error.message);
    });
}






function updateUser(userId) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    const userUpdates = {
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        apellidos: document.getElementById('apellidos').value,
        localidad: document.getElementById('localidad').value,
        matricula: document.getElementById('matricula').checked,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        genero: document.getElementById('genero').value,
        role: document.getElementById('role').value
    };

    fetch(`http://127.0.0.1:8081/usuario/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userUpdates)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('No tienes permiso para actualizar este usuario');
            } else {
                throw new Error('Error al actualizar el usuario: ' + response.statusText);
            }
        }
        return response.json();
    })
    .then(data => {
        console.log("User updated successfully:", data);
        if (data.newToken) {
            sessionStorage.setItem('jwtToken', data.newToken); // Actualizar el token en el almacenamiento de sesión
        }
        alert('Usuario actualizado con éxito');
        document.querySelector('.userEdit').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        cargarUsuarios(); 
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert(error.message);
    });
}




export function addUser() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    const userData = {
        email: document.getElementById('addEmail').value,
        username: document.getElementById('addUsername').value,
        apellidos: document.getElementById('addApellidos').value,
        localidad: document.getElementById('addLocalidad').value,
        matricula: document.getElementById('addMatricula').checked,
        fechaNacimiento: document.getElementById('addFechaNacimiento').value,
        genero: document.getElementById('addGenero').value,
        role: document.getElementById('addRole').value
    };

    fetch('http://127.0.0.1:8081/usuario/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al añadir el usuario: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert('Usuario añadido con éxito');
        document.querySelector('.userAdd').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
        document.getElementById('addUserButton').style.display = 'block';
        cargarUsuarios(); // Volver a cargar la lista de usuarios
    })
    .catch(error => {
        console.error('Error adding user:', error);
        alert(error.message);
    });
}

function deleteUser() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch(`http://127.0.0.1:8081/usuario/delete/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el usuario: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {     
        document.getElementById('deletePopup').style.display = 'none';
        showMessage(data.message, true);
        cargarUsuarios(); // Volver a cargar la lista de usuarios
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        alert(error.message);
    });
}

// Event listener para el botón de volver a la lista de usuarios
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.backToUsers').addEventListener('click', () => {
        document.querySelector('.userDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
    });
});
// Inicializar el popup de eliminación
document.getElementById('confirmDeleteButton').addEventListener('click', deleteUser);
document.getElementById('cancelDeleteButton').addEventListener('click', () => {
    document.getElementById('deletePopup').style.display = 'none';
});