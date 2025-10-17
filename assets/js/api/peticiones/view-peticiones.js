document.addEventListener('DOMContentLoaded', () => {
    const peticionesAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/applicationForms/',
        entityName: 'Petición',
        entityNamePlural: 'Peticiones',
        displayFields: {
            title: 'companyName',        
            subtitle: 'name'      
        },
        searchFields: [
            'name',
            'description',
            'companyName'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.peticionesAPI = peticionesAPI;
});