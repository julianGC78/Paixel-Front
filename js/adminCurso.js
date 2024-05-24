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
                    <span><i class="fa-solid fa-pen-to-square"></i></span>
                    <span><i class="fa-solid fa-trash-can"></i></span>
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
    })
    .catch(error => {
        console.error('Error fetching curso details:', error);
        alert(error.message);
    });
}

// Event listener para el botón de volver a la lista de cursos
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.backToCursos').addEventListener('click', () => {
        document.querySelector('.cursoDetails').style.display = 'none';
        document.querySelector('table.cabecera-tabla').style.display = 'table';
    });
});
