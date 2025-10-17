/**
 * Middleware de Autenticación
 * Incluir en TODAS las páginas protegidas (admin y client)
 */

// Verificar si el usuario está autenticado
function checkAuth() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (!userId || !userName) {
        // No hay sesión, redirigir al login
        window.location.href = '../../../pages/auth/login.html';
        return false;
    }
    
    return true;
}

// Verificar rol de usuario
function checkRole(allowedRoles) {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
        logout();
        return false;
    }
    
    // Normalizar roles
    const normalizedRole = userRole.toLowerCase().trim();
    const normalized = allowedRoles.map(r => r.toLowerCase().trim());
    
    // Verificar si el rol del usuario está permitido
    const hasPermission = normalized.some(role => normalizedRole.includes(role));
    
    if (!hasPermission) {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = '../../../pages/auth/login.html';
        return false;
    }
    
    return true;
}

// Función para cerrar sesión
function logout() {
    // Limpiar localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhoto');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoleId');
    localStorage.removeItem('userFullName');
    
    // Redirigir al login
    window.location.href = '../../../pages/auth/login.html';
}

// Cargar información del usuario en el sidebar
function loadUserProfile() {
    const userName = localStorage.getItem('userName');
    const userPhoto = localStorage.getItem('userPhoto');
    const userFullName = localStorage.getItem('userFullName');
    
    // Actualizar foto de perfil
    const profileImg = document.querySelector('.photo-profile');
    
    if (profileImg) {
        if (userPhoto && userPhoto !== 'null' && userPhoto !== 'ninguna' && userPhoto !== '') {
            profileImg.src = userPhoto;
        } else {
            // Mantener imagen por defecto
            profileImg.src = localStorage.getItem('userPhoto');
        }
        
        profileImg.alt = `Foto de ${userName || 'usuario'}`;
        
        // Agregar efecto de error si la imagen no carga
        profileImg.onerror = function() {
            this.src = '../../../assets/images/app/profile-admin.png';
        };
    }
    
}

// Configurar botón de logout
function setupLogoutButton() {
    const logoutBtn = document.querySelector('.logout a');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Confirmar logout
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                logout();
            }
        });
    }
}

// Obtener información del usuario actual
function getCurrentUser() {
    return {
        id: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail'),
        photo: localStorage.getItem('userPhoto'),
        role: localStorage.getItem('userRole'),
        roleId: localStorage.getItem('userRoleId'),
        fullName: localStorage.getItem('userFullName')
    };
}

// Inicializar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (checkAuth()) {
        // Cargar perfil del usuario
        loadUserProfile();
        
        // Configurar logout
        setupLogoutButton();
    }
});

// Exponer funciones globalmente
window.checkAuth = checkAuth;
window.checkRole = checkRole;
window.logout = logout;
window.getCurrentUser = getCurrentUser;