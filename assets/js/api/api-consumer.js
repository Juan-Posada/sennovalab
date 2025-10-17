/**
 * Sistema General para Consumo de APIs
 * Reutilizable para cualquier entidad (usuarios, roles, noticias, etc.)
 */

class APIConsumer {
    constructor(config) {
        this.apiUrl = config.apiUrl;
        this.entityName = config.entityName || 'Elemento';
        this.entityNamePlural = config.entityNamePlural || 'Elementos';
        this.displayFields = config.displayFields; // { title: 'fieldName', subtitle: 'fieldName' }
        this.searchFields = config.searchFields || []; // Array de campos para buscar
        this.editUrl = config.editUrl || 'edit.html';
        this.viewUrl = config.viewUrl || 'view-one.html';
        this.deleteUrl = config.deleteUrl || 'delete.html';
        
        this.data = [];
        this.filteredData = [];
        
        this.section = document.querySelector('.section');
        this.searchInput = document.querySelector('.input-text input');
        
        this.init();
    }
    
    init() {
        if (!this.section) {
            console.warn('No se encontró la sección para mostrar datos');
            return;
        }
        
        this.setupSearchListener();
        this.fetchData();
    }
    
    async fetchData() {
        try {
            this.showLoading();
            
            const response = await fetch(this.apiUrl);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            this.data = result.data || result || [];
            this.filteredData = [...this.data];
            
            this.hideLoading();
            this.renderItems(this.filteredData);
            
        } catch (error) {
            console.error('Error al obtener datos:', error);
            this.hideLoading();
            this.showError(`Error al cargar ${this.entityNamePlural.toLowerCase()}. Por favor, intenta nuevamente.`);
        }
    }
    
    renderItems(items) {
        this.clearSection();
        
        if (items.length === 0) {
            this.showNoResults();
            return;
        }
        
        items.forEach((item, index) => {
            const container = this.createItemContainer(item, index);
            this.section.appendChild(container);
        });
    }
    
    createItemContainer(item, index) {
        const container = document.createElement('div');
        container.className = 'data-container';
        container.setAttribute('data-item-id', item.id);
        container.style.animationDelay = `${index * 0.1}s`;
        
        const titleValue = this.getNestedValue(item, this.displayFields.title);
        const subtitleValue = this.getNestedValue(item, this.displayFields.subtitle);
        
        container.innerHTML = `
            <div class="info-card">
                <div class="title-card-wrapper">
                    <h3 class="title-card">
                        ${titleValue || 'Sin información'}
                    </h3>
                </div>
                <h4 class="subtitle-card">
                    ${subtitleValue || ''}
                </h4>
            </div>
            <div class="buttons">
                <a class="button-action" id="edit" href="${this.editUrl}?id=${item.id}">
                    <img src="../../../assets/images/app/edit.png" alt="edit">
                </a>
                <a class="button-action" id="view" href="${this.viewUrl}?id=${item.id}">
                    <img src="../../../assets/images/app/view.png" alt="view">
                </a>
                <a class="button-action" id="delete" href="${this.deleteUrl}?id=${item.id}">
                    <img src="../../../assets/images/app/delete.png" alt="delete">
                </a>
            </div>
        `;
        
        return container;
    }
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    
    setupSearchListener() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.search(e.target.value);
            });
        }
    }
    
    search(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term === '') {
            this.filteredData = [...this.data];
        } else {
            this.filteredData = this.data.filter(item => {
                return this.searchFields.some(field => {
                    const value = this.getNestedValue(item, field);
                    return value && value.toString().toLowerCase().includes(term);
                });
            });
        }
        
        this.renderItems(this.filteredData);
    }
    
    showLoading() {
        this.clearSection();
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'api-loading-container';
        loadingDiv.innerHTML = `
            <div class="api-loading-content">
                <p>Cargando ${this.entityNamePlural.toLowerCase()}...</p>
                <div class="api-spinner"></div>
            </div>
        `;
        this.section.appendChild(loadingDiv);
    }
    
    hideLoading() {
        const loadingContainer = this.section.querySelector('.api-loading-container');
        if (loadingContainer) {
            loadingContainer.remove();
        }
    }
    
    showError(message) {
        this.clearSection();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'api-message error';
        errorDiv.innerHTML = `<p>${message}</p>`;
        this.section.appendChild(errorDiv);
    }
    
    showNoResults() {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'api-message no-results';
        noResultsDiv.innerHTML = `<p>No se encontraron ${this.entityNamePlural.toLowerCase()}</p>`;
        this.section.appendChild(noResultsDiv);
    }
    
    clearSection() {
        const containers = this.section.querySelectorAll('.data-container');
        containers.forEach(container => container.remove());
        
        const messages = this.section.querySelectorAll('.api-message, .api-loading-container');
        messages.forEach(message => message.remove());
    }
    
    refresh() {
        this.fetchData();
    }
}

// Exponer la clase globalmente
window.APIConsumer = APIConsumer;