document.addEventListener('DOMContentLoaded', () => {
    const userCrudManager = new APICrudManager({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/users/',
        entityName: 'Usuario',
        entityNamePlural: 'Usuarios',
        viewUrl: 'view.html',
        fields: []
    });

    window.userCrudManager = userCrudManager;
});