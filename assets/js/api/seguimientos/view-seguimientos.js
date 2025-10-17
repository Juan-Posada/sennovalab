document.addEventListener('DOMContentLoaded', () => {
    const seguimientosAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/projectsMonitoring/',
        entityName: 'Seguimiento',
        entityNamePlural: 'Seguimientos',
        displayFields: {
            title: 'phase',        
            subtitle: 'user.name'      
        },
        searchFields: [
            'phase',
            'user.name',
            'state'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.seguimientosAPI = seguimientosAPI;
});