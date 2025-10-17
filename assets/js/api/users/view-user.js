document.addEventListener('DOMContentLoaded', () => {
    const usersAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/users/',
        entityName: 'Usuario',
        entityNamePlural: 'Usuarios',
        displayFields: {
            title: 'userName',        
            subtitle: 'role.name'      
        },
        searchFields: [
            'userName',
            'name',
            'lastName',
            'email',
            'role.name'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.usersAPI = usersAPI;
});