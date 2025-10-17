document.addEventListener('DOMContentLoaded', async () => {
    const noticiasAPI = new APIConsumer({
        apiUrl: 'https://flutter-project-formative.onrender.com/api/v1/news/',
        entityName: 'Noticia',
        entityNamePlural: 'Noticias',
        displayFields: {
            title: 'date',
            subtitle: 'category.name'
        },
        searchFields: [
            'date',
            'title',
            'category.name'
        ],
        editUrl: 'edit.html',
        viewUrl: 'view-one.html',
        deleteUrl: 'delete.html'
    });

    try {
        const response = await fetch(noticiasAPI.apiUrl);
        const result = await response.json();

        // 🔹 Detectamos si la API devuelve un objeto con "data"
        const data = Array.isArray(result) ? result : result.data;

        if (!Array.isArray(data)) {
            console.error('La API no devolvió un arreglo de noticias:', result);
            return;
        }

        // 🔹 Formateamos las fechas
        const noticiasFormateadas = data.map(item => {
            if (item.date) {
                const fecha = new Date(item.date);
                item.date = fecha.toISOString().split('T')[0]; // "2025-10-16"
            }
            return item;
        });

        // 🔹 Renderizamos con tu APIConsumer
        if (typeof noticiasAPI.renderItems === 'function') {
            noticiasAPI.renderItems(noticiasFormateadas);
        } else if (typeof noticiasAPI.renderList === 'function') {
            noticiasAPI.renderList(noticiasFormateadas);
        } else {
            console.log('Noticias formateadas:', noticiasFormateadas);
        }

        window.noticiasAPI = noticiasAPI;

    } catch (error) {
        console.error('Error al obtener o procesar datos:', error);
    }
});
