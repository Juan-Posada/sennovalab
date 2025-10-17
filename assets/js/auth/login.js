// Configuración personalizada de SweetAlert2 con los colores de tu CSS
const customSwal = Swal.mixin({
    customClass: {
        confirmButton: 'custom-confirm-btn',
        cancelButton: 'custom-cancel-btn',
        popup: 'custom-popup',
        title: 'custom-title',
        content: 'custom-content'
    },
    buttonsStyling: false
});

// Agregar estilos CSS personalizados para SweetAlert2
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

// API URL
const API_URL = 'https://flutter-project-formative.onrender.com/api/v1';

// Función para hacer login
async function loginUser(userName, password) {
    try {
        // Mostrar loading
        customSwal.fire({
            title: 'Validando credenciales...',
            allowOutsideClick: false,
            didOpen: () => {
                customSwal.showLoading();
            }
        });

        // Obtener todos los usuarios
        const response = await fetch(`${API_URL}/users/`);
        
        if (!response.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        
        const result = await response.json();
        const users = result.data || [];
        
        // Buscar usuario que coincida con userName y password
        const user = users.find(u => 
            u.userName === userName && u.password === password
        );
        
        if (user) {
            // Guardar información del usuario en localStorage
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.userName);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userPhoto', user.photo || '');
            localStorage.setItem('userRole', user.role.name);
            localStorage.setItem('userRoleId', user.role.id);
            localStorage.setItem('userFullName', `${user.name} ${user.lastName}`);
            
            // Login exitoso
            customSwal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Hola ${user.name}, iniciando sesión...`,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                // Redirigir según el rol
                redirectByRole(user.role.name);
            });
        } else {
            // Credenciales incorrectas
            customSwal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: 'Usuario o contraseña incorrectos',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        customSwal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor. Intenta nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Función para redirigir según el rol
function redirectByRole(roleName) {
    // Normalizar el nombre del rol (minúsculas y sin espacios)
    const role = roleName.toLowerCase().trim();
    
    if (role.includes('administradores')) {
        window.location.href = '../admin/admin.html';
    } else if (role.includes('clientes')) {
        window.location.href = '../client/client.html';
    } else {
        // Rol desconocido, redirigir a página por defecto
        window.location.href = '../../../index.html';
    }
}

// Validación de login
document.addEventListener("DOMContentLoaded", function() {
    const btnLogin = document.querySelector(".box-input-send a");
    const inputUsuario = document.querySelectorAll(".input")[0];
    const inputPassword = document.querySelectorAll(".input")[1];

    if (btnLogin) {
        btnLogin.addEventListener("click", function(e) {
            e.preventDefault();
            
            const userName = inputUsuario.value.trim();
            const password = inputPassword.value;

            // Validar que los campos no estén vacíos
            if (!userName || !password) {
                customSwal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Por favor ingresa tu usuario y contraseña',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            // Intentar hacer login
            loginUser(userName, password);
        });

        // Permitir login con Enter
        inputPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                btnLogin.click();
            }
        });
    }
});