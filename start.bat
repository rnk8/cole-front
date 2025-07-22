@echo off
echo ========================================
echo   Sistema de Informacion del Colegio
echo        Frontend React + Vite
echo ========================================
echo.

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado.
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js detectado correctamente.

echo [2/3] Instalando/verificando dependencias...
if not exist node_modules (
    echo Instalando dependencias por primera vez...
    npm install
    if errorlevel 1 (
        echo ERROR: Fallo la instalacion de dependencias.
        pause
        exit /b 1
    )
) else (
    echo Dependencias ya instaladas.
)

echo [3/3] Iniciando servidor de desarrollo...
echo.
echo ========================================
echo    FRONTEND INICIADO CON EXITO
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:8000
echo 📚 Admin: http://localhost:8000/admin
echo.
echo 👥 USUARIOS DE PRUEBA:
echo ├─ 👨‍💼 admin / admin123 (Administrador)
echo ├─ 👨‍🏫 maestro1-3 / maestro123 (Maestros)
echo ├─ 👨‍🎓 alumno1-6 / alumno123 (Alumnos)
echo └─ 👨‍👩‍👧‍👦 padre1-4 / padre123 (Padres)
echo.
echo 🎯 NUEVAS FUNCIONALIDADES:
echo ├─ 📝 Gestion centralizada de notas
echo ├─ ⭐ Registro de participaciones
echo ├─ 📋 Boletin oficial profesional
echo ├─ 🎨 Interfaz pulida y moderna
echo └─ 🔧 Mejores controles de errores
echo.
echo ⚠️  Asegurate de que el backend este ejecutandose
echo    Usa Ctrl+C para detener el servidor
echo ========================================
echo.

npm run dev 