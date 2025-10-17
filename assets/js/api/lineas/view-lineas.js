document.addEventListener('DOMContentLoaded', () => {
    const lineasAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/lineSennova/',
        entityName: 'Línea',
        entityNamePlural: 'Líneas',
        displayFields: {
            title: 'name',        
            subtitle: 'user.name'      
        },
        searchFields: [
            'name',
            'user.name',
            'description'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.lineasAPI = lineasAPI;
});