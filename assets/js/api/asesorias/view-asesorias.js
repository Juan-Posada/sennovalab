document.addEventListener('DOMContentLoaded', () => {
    const asesoriaAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/consultancies/',
        entityName: 'Asesoría',
        entityNamePlural: 'Asesorías',
        displayFields: {
            title: 'state',        
            subtitle: 'user.name'      
        },
        searchFields: [
            'state', 
            'description',
            'user.name'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.asesoriaAPI = asesoriaAPI;
});