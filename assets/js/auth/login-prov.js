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

    /* 🔧 FIX layout SweetAlert */
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
`;
document.head.appendChild(style);



// ======================================================
// 🔥 LOGIN LOCAL (SIN API)
// ======================================================

// Usuarios de prueba locales
const LOCAL_USERS = [
    {
        id: 1,
        userName: "JuanPosada",
        password: "123",
        email: "juan@example.com",
        name: "Juan",
        lastName: "Posada",
        photo: "",
        role: {
            id: 2,
            name: "clientes"
        }
    },
    {
        id: 2,
        userName: "MariaPaula",
        password: "123",
        email: "maria@example.com",
        name: "Maria",
        lastName: "Paula",
        photo: "",
        role: {
            id: 1,
            name: "administradores"
        }
    }
];



// ======================================================
// 🔥 FUNCIÓN DE LOGIN (LOCAL)
// ======================================================
async function loginUser(userName, password) {
    try {
        customSwal.fire({
            title: 'Validando credenciales...',
            allowOutsideClick: false,
            didOpen: () => {
                customSwal.showLoading();
            }
        });

        // Buscar en el arreglo LOCAL
        const user = LOCAL_USERS.find(u =>
            u.userName === userName && u.password === password
        );

        if (user) {
            // Guardar en localStorage
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.userName);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userPhoto', user.photo || '');
            localStorage.setItem('userRole', user.role.name);
            localStorage.setItem('userRoleId', user.role.id);
            localStorage.setItem('userFullName', `${user.name} ${user.lastName}`);

            customSwal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Hola ${user.name}, iniciando sesión...`,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                redirectByRole(user.role.name);
            });
        } else {
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
            title: 'Error inesperado',
            text: 'Ocurrió un error inesperado. Intenta nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    }
}



// ======================================================
// 🔥 REDIRECCIÓN POR ROL
// ======================================================
function redirectByRole(roleName) {
    const role = roleName.toLowerCase().trim();

    if (role.includes('administradores')) {
        window.location.href = '../admin/admin.html';
    } else if (role.includes('clientes')) {
        window.location.href = '../client/client.html';
    } else {
        window.location.href = '../../../index.html';
    }
}



// ======================================================
// 🔥 VALIDACIÓN Y BOTÓN DE LOGIN
// ======================================================
document.addEventListener("DOMContentLoaded", function () {
    const btnLogin = document.querySelector(".box-input-send a");
    const inputUsuario = document.querySelectorAll(".input")[0];
    const inputPassword = document.querySelectorAll(".input")[1];

    if (btnLogin) {
        btnLogin.addEventListener("click", function (e) {
            e.preventDefault();

            const userName = inputUsuario.value.trim();
            const password = inputPassword.value;

            if (!userName || !password) {
                customSwal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Por favor ingresa tu usuario y contraseña',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            loginUser(userName, password);
        });

        // Login con Enter
        inputPassword.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') btnLogin.click();
        });
    }
});
