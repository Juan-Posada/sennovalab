document.addEventListener('DOMContentLoaded', () => {
    const informacionAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/informationSennova/',
        entityName: 'Información',
        entityNamePlural: 'Información',
        displayFields: {
            title: 'staff',        
            subtitle: 'id'      
        },
        searchFields: [
            'name',
            'staff',
            'mision', 
            'vision'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.informacionAPI = informacionAPI;
});