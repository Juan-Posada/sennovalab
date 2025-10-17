document.addEventListener('DOMContentLoaded', () => {
    const userCrudManager = new APICrudManager({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/users/',
        entityName: 'Usuario',
        entityNamePlural: 'Usuarios',
        viewUrl: 'view.html',
        fields: [
            { name: 'userName', label: 'Usuario', icon: 'fa-user', type: 'text' },
            { name: 'email', label: 'Correo', icon: 'fa-envelope', type: 'email' },
            { name: 'name', label: 'Nombre', icon: 'fa-id-card', type: 'text' },
            { name: 'lastName', label: 'Apellido', icon: 'fa-id-card', type: 'text' },
            { name: 'phone', label: 'Teléfono', icon: 'fa-phone', type: 'number' },
            { name: 'photo', label: 'Foto (URL)', icon: 'fa-image', type: 'text' },
            { name: 'fkIdRoles', label: 'Rol', icon: 'fa-user-shield', type: 'select' }
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