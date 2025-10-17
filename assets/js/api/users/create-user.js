document.addEventListener('DOMContentLoaded', () => {
    const userCrudManager = new APICrudManager({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/users/',
        entityName: 'Usuario',
        entityNamePlural: 'Usuarios',
        viewUrl: 'view.html',
        fields: [
            { name: 'userName', label: 'Usuario', icon: 'fa-user', type: 'text', required: true },
            { name: 'email', label: 'Correo', icon: 'fa-envelope', type: 'email', required: true },
            { name: 'password', label: 'Contraseña', icon: 'fa-lock', type: 'password', required: true },
            { name: 'name', label: 'Nombre', icon: 'fa-id-card', type: 'text', required: true },
            { name: 'lastName', label: 'Apellido', icon: 'fa-id-card', type: 'text', required: true },
            { name: 'phone', label: 'Teléfono', icon: 'fa-phone', type: 'number', required: true },
            { name: 'photo', label: 'Foto (URL)', icon: 'fa-image', type: 'text', required: false },
            { name: 'fkIdRoles', label: 'Rol', icon: 'fa-user-shield', type: 'select', required: true }
        ],
        foreignKeyFields: {
            fkIdRoles: {
                apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/roles/',
                displayField: 'name'
            }
        }
    });

    window.userCrudManager = userCrudManager;
});