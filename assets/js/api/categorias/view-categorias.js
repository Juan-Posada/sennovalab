document.addEventListener('DOMContentLoaded', () => {
    const categoriasAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/categoriesNews/',
        entityName: 'Categoría',
        entityNamePlural: 'Categorías',
        displayFields: {
            title: 'name',        
            subtitle: 'id'      
        },
        searchFields: [
            'name'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    window.categoriasAPI = categoriasAPI;
});