// Obtener ID del módulo desde la URL
export function getModuleId() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('id');
}

// Obtener ID del usuario desde el token JWT
export function getUserId() {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
        const decodedToken = jwt_decode(token);
        console.log('Decoded token:', decodedToken);
        return decodedToken.id || decodedToken.userId || decodedToken.sub;
    } else {
        console.error('No JWT token found in sessionStorage');
        return null;
    }
}

export function notifyVideoStarted(userId, moduleId) {
    const token = sessionStorage.getItem('jwtToken');
    console.log('Token:', token); // Verifica el token

    const headers = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

    const body = {
        idUsuario: userId,
        idModulo: moduleId
    };

    console.log('Sending request with body:', body);

    fetch(`http://127.0.0.1:8081/progreso/iniciar-video`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to start video, status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Video started notification sent successfully:', data);
    })
    .catch(error => {
        console.error('Error notifying video start:', error);
    });
}



// Inicializar y configurar el video
export function setupVideo() {
    const moduleId = getModuleId();
    const userId = getUserId();

    console.log('Setup video with userId:', userId, 'moduleId:', moduleId);

    const videoElement = document.getElementById('videoFrame');
    if (videoElement && userId && moduleId) {
        videoElement.addEventListener('play', () => {
            console.log('Video play event triggered');
            notifyVideoStarted(userId, moduleId);
        });
    } else {
        console.error('Video element, user ID, or module ID not found');
    }
}

document.addEventListener('DOMContentLoaded', setupVideo);

