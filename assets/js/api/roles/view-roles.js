document.addEventListener('DOMContentLoaded', () => {
    const rolesAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/roles/',
        entityName: 'Rol',
        entityNamePlural: 'Roles',
        displayFields: {
            title: 'name',        
            subtitle: ''      
        },
        searchFields: [
            'name'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.rolesAPI = rolesAPI;
});