/**
 * Sistema General para CRUD de APIs
 * Reutilizable para cualquier entidad (usuarios, roles, noticias, etc.)
 * Con soporte para iconos Font Awesome
 */

// Agregar estilos CSS personalizados para SweetAlert2
const crudStyle = document.createElement('style');
crudStyle.textContent = `
    .custom-popup {
        border-radius: 20px !important;
        border: 2px solid #08003F !important;
        box-shadow: 6px 4px 10px rgba(117, 117, 117, 0.84) !important;
    }
    
    .custom-title {
        color: #08003F !important;
        font-family: "Work Sans", sans-serif !important;
        font-weight: bold !important;
        font-size: 20px !important;
    }
    
    .custom-content {
        color: #2D2D2D !important;
        font-family: "Work Sans", sans-serif !important;
        font-size: 16px !important;
    }
    
    .custom-confirm-btn {
        background-color: #08003F !important;
        color: #ffffff !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 12px 24px !important;
        font-family: "Work Sans", sans-serif !important;
        font-size: 16px !important;
        font-weight: normal !important;
        transition: all 0.3s ease !important;
        margin: 0 8px !important;
    }
    
    .custom-confirm-btn:hover {
        background-color: #100978 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 15px rgba(8, 0, 63, 0.4) !important;
    }
    
    .custom-cancel-btn {
        background-color: #EBE5E5 !important;
        color: #08003F !important;
        border: 2px solid #08003F !important;
        border-radius: 10px !important;
        padding: 12px 24px !important;
        font-family: "Work Sans", sans-serif !important;
        font-size: 16px !important;
        font-weight: normal !important;
        transition: all 0.3s ease !important;
        margin: 0 8px !important;
    }
    
    .custom-cancel-btn:hover {
        background-color: #08003F !important;
        color: #ffffff !important;
        transform: translateY(-2px) !important;
    }
    
    .swal2-icon.swal2-error {
        border-color: #ff0000 !important;
        color: #ff0000 !important;
    }
    
    .swal2-icon.swal2-error .swal2-x-mark {
        color: #ff0000 !important;
    }
    
    .swal2-loader {
        border-color: #5498FF transparent #5498FF transparent !important;
    }

    /* Evitar que el modal dañe el contenido detrás */
    .swal2-backdrop {
        background: rgba(0, 0, 0, 0.5) !important;
    }
    /* Evitar que el modal dañe el contenido detrás */
    .swal2-backdrop {
        background: rgba(0, 0, 0, 0.5) !important;
    }

    /* 🔧 FIX: mantener el layout estable al abrir SweetAlert */
    html.swal2-shown,
    body.swal2-shown {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        position: relative !important;
        height: 100% !important;
    }

    .swal2-shown > *:not(.swal2-container) {
        filter: blur(0px) !important;
    }
    
    .swal2-shown > *:not(.swal2-container) {
        filter: blur(0px) !important;
    }
`;
document.head.appendChild(crudStyle);

// Configuración de SweetAlert2
const CrudSwal = Swal.mixin({
    customClass: {
        confirmButton: 'custom-confirm-btn',
        cancelButton: 'custom-cancel-btn',
        popup: 'custom-popup',
        title: 'custom-title',
        content: 'custom-content'
    },
    buttonsStyling: false,
    backdrop: true,
    allowOutsideClick: false
});

class APICrudManager {
    constructor(config) {
        this.apiUrl = config.apiUrl;
        this.entityName = config.entityName || 'Elemento';
        this.entityNamePlural = config.entityNamePlural || 'Elementos';
        this.fields = config.fields || []; // Array de objetos: { name, label, type, required, options, icon }
        this.viewUrl = config.viewUrl || 'view.html';
        this.foreignKeyFields = config.foreignKeyFields || {}; // { fieldName: { apiUrl, displayField } }
        
        this.currentId = null;
        this.currentData = null;
        this.foreignKeyData = {};
        
        this.init();
    }
    
    init() {
        // Obtener ID de la URL si existe
        const urlParams = new URLSearchParams(window.location.search);
        this.currentId = urlParams.get('id');
        
        // Detectar qué operación estamos realizando según la página actual
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('create.html')) {
            this.initCreate();
        } else if (currentPage.includes('edit.html')) {
            this.initEdit();
        } else if (currentPage.includes('view-one.html')) {
            this.initView();
        } else if (currentPage.includes('delete.html')) {
            this.initDelete();
        }
    }
    
    // ==================== CREATE ====================
    async initCreate() {
        await this.loadForeignKeyData();
        this.renderCreateForm();
        this.setupCreateFormSubmit();
    }
    
    renderCreateForm() {
        const scrollForm = document.querySelector('.scroll-form');
        if (!scrollForm) return;
        
        scrollForm.innerHTML = '';
        
        this.fields.forEach((field) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'form-group-left';
            
            const labelHtml = this.renderLabelWithIcon(field);
            const inputHtml = this.renderInput(field);
            
            groupDiv.innerHTML = `
                <div class="label-left">
                    ${labelHtml}
                </div>
                ${inputHtml}
            `;
            
            scrollForm.appendChild(groupDiv);
        });
    }
    
    renderLabelWithIcon(field) {
        if (field.icon) {
            return `
                <label for="${field.name}" class="label-icon-wrapper">
                    <i class="fas ${field.icon}"></i>
                    <span class="label-text">${field.label}${field.required ? ' *' : ''}</span>
                </label>
            `;
        } else {
            return `<label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>`;
        }
    }
    
    renderInput(field) {
        if (field.type === 'select') {
            let options = '<option value="">Seleccionar...</option>';
            
            if (field.options) {
                options += field.options.map(opt => 
                    `<option value="${opt.value}">${opt.label}</option>`
                ).join('');
            } else if (this.foreignKeyData[field.name]) {
                options += this.foreignKeyData[field.name].map(item => 
                    `<option value="${item.id}">${item.name || item.title || item.description}</option>`
                ).join('');
            }
            
            return `<select id="${field.name}" name="${field.name}" class="input-left" ${field.required ? 'required' : ''}>${options}</select>`;
        } else if (field.type === 'textarea') {
            return `<textarea id="${field.name}" name="${field.name}" class="input-left" ${field.required ? 'required' : ''}></textarea>`;
        } else {
            return `<input type="${field.type || 'text'}" id="${field.name}" name="${field.name}" class="input-left" ${field.required ? 'required' : ''}>`;
        }
    }
    
    setupCreateFormSubmit() {
        const form = document.querySelector('form.create');
        const confirmBtn = form?.querySelector('.confirm');
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.createRecord();
            });
        }
    }
    
    async createRecord() {
        const formData = this.collectFormData();
        
        if (!this.validateFormData(formData)) {
            CrudSwal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos obligatorios',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        
        try {
            CrudSwal.fire({
                title: `Creando ${this.entityName.toLowerCase()}...`,
                allowOutsideClick: false,
                didOpen: () => {
                    CrudSwal.showLoading();
                }
            });
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Error al crear el registro');
            }
            
            CrudSwal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `${this.entityName} creado correctamente`,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = this.viewUrl;
            });
            
        } catch (error) {
            console.error('Error:', error);
            CrudSwal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || `No se pudo crear el ${this.entityName.toLowerCase()}`,
                confirmButtonText: 'Aceptar'
            });
        }
    }
    
    // ==================== EDIT ====================
    async initEdit() {
        if (!this.currentId) {
            CrudSwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se especificó un ID para editar',
                confirmButtonText: 'Volver'
            }).then(() => {
                window.location.href = this.viewUrl;
            });
            return;
        }
        
        await this.loadForeignKeyData();
        await this.loadRecordData();
        this.renderEditForm();
        this.setupEditFormSubmit();
    }
    
    async loadRecordData() {
        try {
            CrudSwal.fire({
                title: 'Cargando datos...',
                allowOutsideClick: false,
                didOpen: () => {
                    CrudSwal.showLoading();
                }
            });
            
            const response = await fetch(`${this.apiUrl}${this.currentId}`);
            
            if (!response.ok) {
                throw new Error('No se pudo cargar el registro');
            }
            
            const result = await response.json();
            this.currentData = result.data || result;
            
            CrudSwal.close();
            
        } catch (error) {
            console.error('Error:', error);
            CrudSwal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo cargar el ${this.entityName.toLowerCase()}`,
                confirmButtonText: 'Volver'
            }).then(() => {
                window.location.href = this.viewUrl;
            });
        }
    }
    
    renderEditForm() {
        const scrollForm = document.querySelector('.scroll-form');
        if (!scrollForm || !this.currentData) return;
        
        scrollForm.innerHTML = '';
        
        this.fields.forEach((field) => {
            const value = this.currentData[field.name] || '';
            const groupDiv = document.createElement('div');
            groupDiv.className = 'form-group-left';
            
            const labelHtml = this.renderLabelWithIcon(field);
            const inputHtml = this.renderInputWithValue(field, value);
            
            groupDiv.innerHTML = `
                <div class="label-left">
                    ${labelHtml}
                </div>
                ${inputHtml}
            `;
            
            scrollForm.appendChild(groupDiv);
        });
    }
    
    renderInputWithValue(field, value) {
        const inputClass = this.fields.indexOf(field) % 2 === 0 ? 'input-left' : 'input-right';
        
        if (field.type === 'select') {
            let options = '<option value="">Seleccionar...</option>';
            
            if (field.options) {
                options += field.options.map(opt => 
                    `<option value="${opt.value}" ${opt.value == value ? 'selected' : ''}>${opt.label}</option>`
                ).join('');
            } else if (this.foreignKeyData[field.name]) {
                options += this.foreignKeyData[field.name].map(item => 
                    `<option value="${item.id}" ${item.id == value ? 'selected' : ''}>${item.name || item.title || item.description}</option>`
                ).join('');
            }
            
            return `<select id="${field.name}" name="${field.name}" class="${inputClass}" ${field.required ? 'required' : ''}>${options}</select>`;
        } else if (field.type === 'textarea') {
            return `<textarea id="${field.name}" name="${field.name}" class="${inputClass}" ${field.required ? 'required' : ''}>${value}</textarea>`;
        } else {
            return `<input type="${field.type || 'text'}" id="${field.name}" name="${field.name}" class="${inputClass}" value="${value}" ${field.required ? 'required' : ''}>`;
        }
    }
    
    setupEditFormSubmit() {
        const form = document.querySelector('form.edit');
        const confirmBtn = form?.querySelector('.confirm');
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.updateRecord();
            });
        }
    }
    
    async updateRecord() {
        const formData = this.collectFormData();
        
        if (!this.validateFormData(formData)) {
            CrudSwal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos obligatorios',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        
        try {
            CrudSwal.fire({
                title: `Actualizando ${this.entityName.toLowerCase()}...`,
                allowOutsideClick: false,
                didOpen: () => {
                    CrudSwal.showLoading();
                }
            });
            
            const response = await fetch(`${this.apiUrl}${this.currentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Error al actualizar el registro');
            }
            
            CrudSwal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `${this.entityName} actualizado correctamente`,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = this.viewUrl;
            });
            
        } catch (error) {
            console.error('Error:', error);
            CrudSwal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || `No se pudo actualizar el ${this.entityName.toLowerCase()}`,
                confirmButtonText: 'Aceptar'
            });
        }
    }
    
    // ==================== VIEW ====================
    async initView() {
        if (!this.currentId) {
            CrudSwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se especificó un ID para visualizar',
                confirmButtonText: 'Volver'
            }).then(() => {
                window.location.href = this.viewUrl;
            });
            return;
        }
        
        await this.loadForeignKeyData();
        await this.loadRecordData();
        this.renderViewForm();
    }
    
    renderViewForm() {
        const scrollForm = document.querySelector('.scroll-form');
        if (!scrollForm || !this.currentData) return;
        
        scrollForm.innerHTML = '';
        
        this.fields.forEach((field) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'form-group-left';
            
            let displayValue = this.currentData[field.name] || 'N/A';
            
            // Si es un campo de clave foránea, buscar el valor legible
            if (field.type === 'select' && this.foreignKeyData[field.name]) {
                const foreignItem = this.foreignKeyData[field.name].find(item => item.id == displayValue);
                if (foreignItem) {
                    displayValue = foreignItem.name || foreignItem.title || foreignItem.description;
                }
            }
            
            const labelHtml = this.renderLabelWithIcon(field);
            
            groupDiv.innerHTML = `
                <div class="label-left">
                    ${labelHtml}
                </div>
                <div class="input-left">
                    <h2>${displayValue}</h2>
                </div>
            `;
            
            scrollForm.appendChild(groupDiv);
        });
    }
    
    // ==================== DELETE ====================
    async initDelete() {
        if (!this.currentId) {
            CrudSwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se especificó un ID para eliminar',
                confirmButtonText: 'Volver'
            }).then(() => {
                window.location.href = this.viewUrl;
            });
            return;
        }
        
        await this.loadRecordData();
        this.updateDeleteMessage();
        this.setupDeleteFormSubmit();
    }
    
    updateDeleteMessage() {
        const messageElement = document.querySelector('.scroll-form h1');
        if (messageElement && this.currentData) {
            const identifier = this.currentData.name || this.currentData.userName || this.currentData.title || this.currentData.id;
            messageElement.textContent = `¿Estás seguro de eliminar "${identifier}"?`;
        }
    }
    
    setupDeleteFormSubmit() {
        const form = document.querySelector('form.delete');
        const confirmBtn = form?.querySelector('.confirm');
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.deleteRecord();
            });
        }
    }
    
    async deleteRecord() {
        const result = await CrudSwal.fire({
            icon: 'warning',
            title: '¿Estás seguro?',
            text: `Esta acción no se puede deshacer`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        
        if (!result.isConfirmed) return;
        
        try {
            CrudSwal.fire({
                title: `Eliminando ${this.entityName.toLowerCase()}...`,
                allowOutsideClick: false,
                didOpen: () => {
                    CrudSwal.showLoading();
                }
            });
            
            const response = await fetch(`${this.apiUrl}${this.currentId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Error al eliminar el registro');
            }
            
            CrudSwal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: `${this.entityName} eliminado correctamente`,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = this.viewUrl;
            });
            
        } catch (error) {
            console.error('Error:', error);
            CrudSwal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || `No se pudo eliminar el ${this.entityName.toLowerCase()}`,
                confirmButtonText: 'Aceptar'
            });
        }
    }
    
    // ==================== UTILIDADES ====================
    collectFormData() {
        const formData = {};
        
        this.fields.forEach(field => {
            const input = document.getElementById(field.name);
            if (input) {
                let value = input.value;
                
                // Convertir a número si es necesario
                if (field.type === 'number' && value !== '') {
                    value = Number(value);
                }
                
                formData[field.name] = value;
            }
        });
        
        return formData;
    }
    
    validateFormData(formData) {
        for (const field of this.fields) {
            if (field.required && (!formData[field.name] || formData[field.name] === '')) {
                return false;
            }
        }
        return true;
    }
    
    async loadForeignKeyData() {
        const promises = Object.entries(this.foreignKeyFields).map(async ([fieldName, config]) => {
            try {
                const response = await fetch(config.apiUrl);
                const result = await response.json();
                this.foreignKeyData[fieldName] = result.data || result;
            } catch (error) {
                console.error(`Error loading foreign key data for ${fieldName}:`, error);
                this.foreignKeyData[fieldName] = [];
            }
        });
        
        await Promise.all(promises);
    }
}

// Exponer la clase globalmente
window.APICrudManager = APICrudManager;
window.CrudSwal = CrudSwal;