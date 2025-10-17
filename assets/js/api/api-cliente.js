/**
 * Sistema de Carga de Proyecto y Seguimiento para Cliente
 * Valida y muestra solo el proyecto vinculado al cliente autenticado
 */

class ClientProjectLoader {
    constructor() {
        this.API_URL = 'https://flutter-project-formative.onrender.com/api/v1';
        this.userId = localStorage.getItem('userId');
        this.userRole = localStorage.getItem('userRole');
        this.userName = localStorage.getItem('userName');
        
        this.projectMonitoring = null;
        this.projectDetails = null;
        
        this.init();
    }
    
    async init() {
        // Verificar autenticación
        if (!this.userId || !this.userName) {
            this.redirectToLogin('No has iniciado sesión');
            return;
        }
        
        // Verificar que sea un cliente
        if (!this.userRole || !this.userRole.toLowerCase().includes('cliente')) {
            this.showError('Acceso denegado. Solo clientes pueden acceder a esta página.');
            return;
        }
        
        // Cargar datos del proyecto
        await this.loadClientProject();
    }
    
    async loadClientProject() {
        try {
            this.showLoading();
            
            // 1. Obtener el seguimiento del proyecto del usuario
            const monitoringResponse = await fetch(`${this.API_URL}/projectsMonitoring/`);
            if (!monitoringResponse.ok) throw new Error('Error al cargar seguimiento');
            
            const monitoringData = await monitoringResponse.json();
            const allMonitorings = monitoringData.data || monitoringData;
            
            // Buscar el seguimiento del usuario actual
            this.projectMonitoring = allMonitorings.find(m => m.fkIdUsers == this.userId);
            
            if (!this.projectMonitoring) {
                this.hideLoading();
                this.showNoProject();
                return;
            }
            
            // 2. Obtener detalles del proyecto asociado
            const projectResponse = await fetch(`${this.API_URL}/projectSennovas/${this.projectMonitoring.fkIdProjectSennova}`);
            if (!projectResponse.ok) throw new Error('Error al cargar proyecto');
            
            const projectData = await projectResponse.json();
            this.projectDetails = projectData.data || projectData;
            
            this.hideLoading();
            
            // 3. Actualizar la interfaz con los datos
            this.updateUI();
            
        } catch (error) {
            console.error('Error al cargar proyecto:', error);
            this.hideLoading();
            this.showError('No se pudo cargar la información del proyecto. Intenta nuevamente.');
        }
    }
    
    updateUI() {
        // Actualizar saludo con nombre del usuario
        this.updateWelcome();
        
        // Actualizar fase del proyecto
        this.updatePhase();
        
        // Actualizar estado del proyecto
        this.updateState();
        
        // Actualizar descripción
        this.updateDescription();
        
        // Actualizar fecha de inicio
        this.updateStartDate();
        
        // Actualizar título del proyecto
        this.updateProjectTitle();
    }
    
    updateWelcome() {
        const hiElement = document.querySelector('.hi');
        if (hiElement && this.projectMonitoring?.user) {
            const fullName = `${this.projectMonitoring.user.name} ${this.projectMonitoring.user.lastName}`;
            hiElement.textContent = `¡Hola, ${fullName}!`;
        }
    }
    
    updatePhase() {
        const phaseElement = document.querySelector('.phase h2');
        if (phaseElement && this.projectMonitoring) {
            phaseElement.textContent = this.projectMonitoring.phase.toUpperCase();
        }
    }
    
    updateState() {
        const stateElement = document.querySelector('.active h2');
        if (stateElement && this.projectMonitoring) {
            stateElement.textContent = this.projectMonitoring.state.toUpperCase();
        }
    }
    
    updateDescription() {
        const descElement = document.querySelector('.description h2');
        if (descElement && this.projectMonitoring) {
            descElement.textContent = this.projectMonitoring.description;
        }
    }
    
    updateStartDate() {
        const dateElement = document.querySelector('.date h2');
        if (dateElement && this.projectDetails) {
            const date = new Date(this.projectDetails.startDate);
            const formattedDate = date.toLocaleDateString('es-CO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            dateElement.textContent = formattedDate;
        }
    }
    
    updateProjectTitle() {
        const titleElement = document.querySelector('.title-indicator');
        if (titleElement && this.projectDetails) {
            titleElement.textContent = this.projectDetails.name;
        }
    }
    
    showLoading() {
        const content = document.querySelector('.content');
        if (!content) return;
        
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p>Cargando tu proyecto...</p>
            </div>
        `;
        
        // Agregar estilos inline
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(8, 0, 63, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        const loadingContent = loadingOverlay.querySelector('.loading-content');
        loadingContent.style.cssText = `
            text-align: center;
            color: white;
        `;
        
        const spinner = loadingOverlay.querySelector('.spinner');
        spinner.style.cssText = `
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        `;
        
        // Agregar animación
        if (!document.getElementById('spinner-animation')) {
            const style = document.createElement('style');
            style.id = 'spinner-animation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        content.appendChild(loadingOverlay);
    }
    
    hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) overlay.remove();
    }
    
    showNoProject() {
        const momentsDiv = document.querySelector('.moments');
        if (momentsDiv) {
            momentsDiv.innerHTML = `
                <div class="no-project-message">
                    <h2>No tienes un proyecto asignado</h2>
                    <p>Por favor contacta al administrador para más información.</p>
                </div>
            `;
        }
        
        // Ocultar sección de información
        const aboutDiv = document.querySelector('.about');
        if (aboutDiv) aboutDiv.style.display = 'none';
    }
    
    showError(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: 'custom-confirm-btn',
                    popup: 'custom-popup',
                    title: 'custom-title',
                    content: 'custom-content'
                },
                buttonsStyling: false
            });
        } else {
            alert(message);
        }
    }
    
    redirectToLogin(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión no válida',
                text: message,
                confirmButtonText: 'Ir al login',
                customClass: {
                    confirmButton: 'custom-confirm-btn',
                    popup: 'custom-popup',
                    title: 'custom-title',
                    content: 'custom-content'
                },
                buttonsStyling: false
            }).then(() => {
                window.location.href = '../auth/login.html';
            });
        } else {
            alert(message);
            window.location.href = '../auth/login.html';
        }
    }
    
    // Método público para refrescar datos
    refresh() {
        this.loadClientProject();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.clientProjectLoader = new ClientProjectLoader();
});

// Exponer globalmente
window.ClientProjectLoader = ClientProjectLoader;