/**
 * Middleware de Autenticación (Versión Mejorada)
 * Incluir en TODAS las páginas protegidas (admin y client)
 */

// =====================
// Estilos personalizados SweetAlert2
// =====================
if (!document.getElementById('auth-style')) {
    const authStyle = document.createElement('style');
    authStyle.id = 'auth-style';
    authStyle.textContent = `
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
    `;
    document.head.appendChild(authStyle);
}

// =====================
// Verificación SweetAlert
// =====================
if (typeof Swal === 'undefined') {
    console.error('SweetAlert2 no está disponible. Verifica que el script se cargue antes de este archivo.');
}

// =====================
// Configuración de SweetAlert2
// =====================
const AuthSwal = Swal.mixin({
    customClass: {
        confirmButton: 'custom-confirm-btn',
        cancelButton: 'custom-cancel-btn',
        popup: 'custom-popup',
        title: 'custom-title',
        content: 'custom-content'
    },
    buttonsStyling: false
});

// =====================
// Funciones principales
// =====================
const Auth = {
    checkAuth() {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        
        if (!userId || !userName) {
            console.warn('Usuario no autenticado, redirigiendo...');
            window.location.href = '/pages/auth/login.html';
            return false;
        }
        return true;
    },

    checkRole(allowedRoles) {
        const userRole = localStorage.getItem('userRole');
        if (!userRole) {
            this.logout();
            return false;
        }

        const normalizedRole = userRole.toLowerCase().trim();
        const normalized = allowedRoles.map(r => r.toLowerCase().trim());

        const hasPermission = normalized.includes(normalizedRole);
        if (!hasPermission) {
            AuthSwal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'No tienes permisos para acceder a esta página',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = '/pages/auth/login.html';
            });
            return false;
        }
        return true;
    },

    logout() {
        console.log('Ejecutando logout...');
        AuthSwal.fire({
            icon: 'question',
            title: '¿Cerrar Sesión?',
            text: '¿Estás seguro que deseas salir?',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Mostrar loading
                AuthSwal.fire({
                    title: 'Cerrando sesión...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        AuthSwal.showLoading();
                    }
                });
                
                // Limpiar localStorage
                const keys = [
                    'userId', 'userName', 'userEmail', 'userPhoto',
                    'userRole', 'userRoleId', 'userFullName'
                ];
                keys.forEach(k => localStorage.removeItem(k));

                // Mostrar mensaje de éxito y redirigir
                setTimeout(() => {
                    AuthSwal.fire({
                        icon: 'success',
                        title: '¡Hasta pronto!',
                        text: 'Has cerrado sesión correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = '/pages/auth/login.html';
                    });
                }, 600);
            }
        });
    },

    loadUserProfile() {
        const userName = localStorage.getItem('userName');
        const userPhoto = localStorage.getItem('userPhoto');
        const profileImg = document.querySelector('.photo-profile');

        if (profileImg) {
            if (userPhoto && userPhoto !== 'null' && userPhoto !== 'ninguna' && userPhoto !== '') {
                profileImg.src = userPhoto;
            } else {
                profileImg.src = '/assets/images/app/profile-admin.png';
            }

            profileImg.alt = `Foto de ${userName || 'usuario'}`;
            profileImg.onerror = function() {
                this.src = '/assets/images/app/profile-admin.png';
            };
        }
    },

    setupLogoutButton() {
        const logoutBtn = document.querySelector('.logout a');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault(); // evita redirección inmediata
                Auth.logout();
            });
            console.log('Botón de logout configurado correctamente.');
        } else {
            console.warn('Botón de logout no encontrado.');
        }
    },

    getCurrentUser() {
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
};

// =====================
// Inicialización
// =====================
document.addEventListener('DOMContentLoaded', function() {
    if (Auth.checkAuth()) {
        Auth.loadUserProfile();
        Auth.setupLogoutButton();
    }
});

// =====================
// Exponer globalmente
// =====================
window.Auth = Auth;
