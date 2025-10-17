document.addEventListener('DOMContentLoaded', () => {
    const tipoAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/typeForms/',
        entityName: 'Tipo de Formularios',
        entityNamePlural: 'Tipo de Formularios',
        displayFields: {
            title: 'description',        
            subtitle: 'lineSennova.name'      
        },
        searchFields: [
            'description',
            'lineSennova.name'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.tipoAPI = tipoAPI;
});