document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8081/usuario/findAll')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#userTable tbody');
            tableBody.innerHTML = ''; // Clear existing rows

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
                        <a href="#">🔗</a>
                        <span class="icon">🔍</span>
                        <span class="icon">✏️</span>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
});
