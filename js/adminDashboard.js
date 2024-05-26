function fetchUserCount() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/usuario/count', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Error al obtener el conteo de usuarios: ${error.message}`);
            }).catch(() => {
                throw new Error(`Error al obtener el conteo de usuarios: ${response.statusText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        displayUserCount(data.userCount);
    })
    .catch(error => {
        console.error('Error fetching user count:', error);
    });
}

function fetchMatriculatedUserCount() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/users/countMatriculated', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Error al obtener el conteo de usuarios matriculados: ${error.message}`);
            }).catch(() => {
                throw new Error(`Error al obtener el conteo de usuarios matriculados: ${response.statusText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        displayMatriculatedUserCount(data.matriculatedUserCount);
    })
    .catch(error => {
        console.error('Error fetching matriculated user count:', error);
    });
}

function displayUserCount(count) {
    const userCountSpan = document.getElementById('userCount');
    userCountSpan.textContent = count;
}
function displayMatriculatedUserCount(count) {
    const matriculatedUserCountSpan = document.getElementById('matriculatedUserCount');
    matriculatedUserCountSpan.textContent = count;
}

// Llamar a fetchUserCount cada 10 segundos para actualizar el conteo de usuarios
setInterval(fetchUserCount, 10000);
setInterval(fetchMatriculatedUserCount, 10000);

// Llamar a fetchUserCount al cargar la página por primera vez
window.onload = fetchUserCount;
