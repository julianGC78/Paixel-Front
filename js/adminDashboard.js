export function fetchUserCount(displayUserCount) {
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

export function fetchMatriculatedUserCount(displayMatriculatedUserCount) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/matricula/countMatriculated', {  // Verifica que este endpoint coincida con el definido en tu controlador
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

export function fetchPreguntasPorCurso() {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/curso/preguntas-por-curso', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al obtener el conteo de preguntas por curso: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const ctx = document.getElementById('preguntasPorCursoChart').getContext('2d');
        
        
        const colors = [
            'rgba(255, 99, 132, 0.4)',
            'rgba(54, 162, 235, 0.4)',
            'rgba(255, 206, 86, 0.4)',
            'rgba(75, 192, 192, 0.4)',
            'rgba(153, 102, 255, 0.4)',
            'rgba(255, 159, 64, 0.4)',
            'rgba(199, 199, 199, 0.4)',
            'rgba(83, 102, 255, 0.4)',
            'rgba(255, 205, 86, 0.4)'
        ];

        const borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(255, 205, 86, 1)'
        ];

        // Crea los colores de fondo y de borde basados en la longitud de los datos
        const backgroundColors = colors.slice(0, data.length);
        const borderColorsSliced = borderColors.slice(0, data.length);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.curso),
                datasets: [{
                    label: 'Número de Preguntas por curso',
                    data: data.map(item => item.num_preguntas),
                    backgroundColor: backgroundColors,
                    borderColor: borderColorsSliced,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching preguntas por curso:', error);
    });
}

export function fetchTotalPreguntas(displayTotalPreguntas) {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
    }

    fetch('http://127.0.0.1:8081/pregunta/total-preguntas', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al obtener el conteo de preguntas totales: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        displayTotalPreguntas(data);
    })
    .catch(error => {
        console.error('Error fetching total preguntas:', error);
    });
}
