document.addEventListener('DOMContentLoaded', () => {
    const proyectosAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/projectSennovas/',
        entityName: 'Proyecto',
        entityNamePlural: 'Proyectos',
        displayFields: {
            title: 'name',        
            subtitle: 'consultancy.state'      
        },
        searchFields: [
            'name',
            'consultancy.state',
            'lineSennova.description'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.proyectosAPI = proyectosAPI;
});