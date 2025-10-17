document.addEventListener('DOMContentLoaded', () => {
    const encuestasAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/satisfactionSurveys/',
        entityName: 'Encuesta',
        entityNamePlural: 'Encuestas',
        displayFields: {
            title: 'typeForm.description',        
            subtitle: 'id'      
        },
        searchFields: [
            'id',
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.encuestasAPI = encuestasAPI;
});