# 🎓 Sistema de Información del Colegio - Frontend

Frontend moderno desarrollado en **React + Vite** para el sistema de gestión académica del colegio. Interfaz intuitiva y responsive que permite a maestros, alumnos, padres y administradores gestionar toda la información académica de manera eficiente.

## ✨ Características Principales

### 🔐 **Sistema de Autenticación Completo**
- Login con JWT tokens
- Roles diferenciados (Admin, Maestro, Alumno, Padre)
- Redirección automática según rol
- Logout seguro con limpieza de datos

### 👨‍🏫 **Dashboard del Maestro (Tutor)**
- **📝 Gestión Centralizada de Notas**
  - Vista matricial (alumno x materia)
  - Edición rápida con un clic
  - Colores por rendimiento
  - Selector de periodos académicos
  - Modal de edición completo
- **⭐ Gestión de Participaciones**
  - Registro diario por materia
  - Escala 1-5 con descripción
  - Resumen estadístico
- **👨‍🎓 Vista de Alumnos** del curso
- **📚 Materias** que enseña
- **📊 Estadísticas** en tiempo real

### 👨‍👩‍👧‍👦 **Dashboard del Padre**
- **Selector de hijos** con tarjetas elegantes
- **📋 Boletín oficial** profesional
  - Diseño formal tipo documento
  - Todas las calificaciones por materia
  - Escala de colores y estados
  - Resumen académico completo
- **📊 Estadísticas** de rendimiento
- **🤖 Predicción IA** del rendimiento

### 👨‍🎓 **Dashboard del Alumno**
- **Vista personal** de notas por periodo
- **📅 Registro de asistencia**
- **⭐ Participaciones** en clase
- **🤖 Predicción** de rendimiento académico

### ⚙️ **Dashboard del Administrador**
- **Estadísticas generales** del colegio
- **Acciones rápidas** al panel Django:
  - Gestión de Alumnos
  - Gestión de Maestros
  - Gestión de Cursos
  - Gestión de Materias
  - Gestión de Padres
  - Ver Notas
  - Control de Asistencia
  - Ver Participaciones
  - Panel Admin Completo

## 🛠️ Tecnologías Utilizadas

### **Core**
- **React 18** - Biblioteca de UI
- **Vite** - Build tool ultra-rápido
- **JavaScript (ES6+)** - Lenguaje principal

### **Networking & Estado**
- **Axios** - Cliente HTTP
- **React Context API** - Estado global
- **JWT** - Autenticación

### **Routing & Navegación**
- **React Router DOM** - Navegación SPA
- **Rutas protegidas** por autenticación

### **UI/UX**
- **CSS puro** - Estilos personalizados
- **Responsive Design** - Mobile-first
- **Componentes reutilizables**
- **Animaciones CSS**

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 16+ 
- npm o yarn
- Backend Django ejecutándose en http://localhost:8000

### **1. Instalación**
```bash
# Clonar o navegar al directorio del frontend
cd colegio-frontend

# Instalar dependencias
npm install

# O con yarn
yarn install
```

### **2. Configuración de Variables de Entorno**
Crear archivo `.env` en la raíz del proyecto:
```env
# URL base del backend API
VITE_API_BASE_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000/api
VITE_ADMIN_URL=http://localhost:8000/admin

# Configuración de la aplicación
VITE_APP_NAME="Sistema de Información del Colegio"
VITE_APP_VERSION="1.0.0"
```

### **3. Ejecutar en Desarrollo**
```bash
npm run dev
# O con yarn
yarn dev
```

La aplicación estará disponible en: **http://localhost:5173**

### **4. Script de Inicio Automático (Windows)**
Ejecutar `start.bat` para instalación y inicio automático:
```bash
start.bat
```

## 👥 Usuarios de Prueba

### **Administrador**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Acceso:** Gestión completa del sistema

### **Maestros/Tutores**
- **Usuarios:** `maestro1`, `maestro2`, `maestro3`
- **Contraseña:** `maestro123`
- **Acceso:** Gestión de notas y participaciones de su curso

### **Alumnos**
- **Usuarios:** `alumno1` a `alumno6`
- **Contraseña:** `alumno123`
- **Acceso:** Vista personal de notas y asistencia

### **Padres**
- **Usuarios:** `padre1` a `padre4`
- **Contraseña:** `padre123`
- **Acceso:** Información académica de sus hijos

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── dashboards/         # Dashboards por rol
│   │   ├── AdminDashboard.jsx
│   │   ├── MaestroDashboard.jsx
│   │   ├── AlumnoDashboard.jsx
│   │   └── PadreDashboard.jsx
│   ├── ui/                 # Componentes reutilizables
│   │   ├── AdminButton.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Toast.jsx
│   │   └── ErrorBoundary.jsx
│   ├── Login.jsx           # Componente de login
│   ├── Layout.jsx          # Layout común
│   ├── Dashboard.jsx       # Router de dashboards
│   ├── ProtectedRoute.jsx  # HOC para rutas protegidas
│   ├── NotasManager.jsx    # Gestión de notas (maestros)
│   ├── ParticipacionesManager.jsx  # Gestión de participaciones
│   └── Boletin.jsx         # Boletín oficial (padres)
├── context/
│   └── AuthContext.jsx     # Contexto de autenticación
├── services/
│   └── api.js              # Configuración de Axios
├── config/
│   └── config.js           # Configuración de URLs
├── index.css               # Estilos globales
├── App.jsx                 # Componente principal
└── main.jsx                # Punto de entrada
```

## 🎨 Características de UI/UX

### **Diseño Moderno**
- **Cards elegantes** con sombras y bordes redondeados
- **Colores semánticos** (verde=bueno, amarillo=regular, rojo=malo)
- **Tipografía limpia** y legible
- **Espaciado consistente**

### **Interactividad**
- **Hover effects** en botones y cards
- **Transiciones suaves** CSS
- **Loading states** con spinners
- **Feedback visual** inmediato

### **Responsive Design**
- **Grid layouts** adaptativos
- **Mobile-first** approach
- **Flexbox** para alineación
- **Breakpoints** para diferentes pantallas

### **Componentes Inteligentes**
- **Toast notifications** para feedback
- **Error boundaries** para manejo de errores
- **Loading spinners** contextuales
- **Modales** con overlay

## 🔧 Funcionalidades Detalladas

### **📝 Gestión de Notas (Maestros)**
1. **Vista Matricial**
   - Tabla con alumnos en filas y materias en columnas
   - Cada celda muestra la nota actual
   - Colores automáticos según rendimiento
   - Scroll horizontal para muchas materias

2. **Edición Rápida**
   - Click en cualquier celda para editar
   - Modal con formulario completo
   - Validación de datos en tiempo real
   - Guardar con Enter o botón

3. **Características Avanzadas**
   - Selector de periodo académico
   - Observaciones por nota
   - Estadísticas automáticas
   - Filtrado por curso del tutor

### **📋 Boletín Oficial (Padres)**
1. **Diseño Profesional**
   - Header institucional
   - Información del estudiante
   - Tabla de calificaciones formal
   - Escala de colores explicativa

2. **Funcionalidades**
   - Selector de periodo
   - Cálculo automático de promedios
   - Estados por materia
   - Información de asistencia

### **⚙️ Panel de Administración**
1. **Estadísticas en Vivo**
   - Contadores de entidades
   - Cards con colores distintivos
   - Actualización automática

2. **Acciones Rápidas**
   - Botones directos al Django Admin
   - Manejo de errores de conexión
   - Feedback visual de carga

## 🔗 Integración con Backend

### **Endpoints Utilizados**
```javascript
// Autenticación
POST /api/auth/login/
POST /api/auth/refresh/

// Gestión
GET /api/alumnos/
GET /api/maestros/
GET /api/cursos/
GET /api/materias/
GET /api/padres/

// Académico
GET/POST/PUT /api/notas/
GET/POST /api/participaciones/
GET /api/asistencia/
GET /api/prediccion/{alumno_id}/{periodo}/
```

### **Autenticación JWT**
- Tokens almacenados en `localStorage`
- Interceptor automático en todas las requests
- Renovación automática de tokens
- Logout automático en 401

### **Manejo de Errores**
- Interceptor global de errores
- Toast notifications para feedback
- Fallbacks para conexión perdida
- Error boundaries para errores de React

## 🚀 Optimizaciones Implementadas

### **Rendimiento**
- **Code splitting** automático con Vite
- **Lazy loading** de componentes
- **Memoización** de cálculos pesados
- **Debouncing** en búsquedas

### **Experiencia de Usuario**
- **Loading states** en todas las operaciones
- **Error handling** robusto
- **Feedback visual** inmediato
- **Navegación intuitiva**

### **Mantenimiento**
- **Componentes reutilizables**
- **Configuración centralizada**
- **Separación de responsabilidades**
- **Código autodocumentado**

## 📱 Responsiveness

### **Breakpoints**
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** > 1024px

### **Adaptaciones**
- **Grids flexibles** que se ajustan
- **Navegación adaptativa**
- **Tablas responsivas** con scroll horizontal
- **Modales** que se adaptan al viewport

## 🛡️ Seguridad

### **Autenticación**
- Tokens JWT con expiración
- Logout automático en tokens inválidos
- Validación de roles en frontend
- Rutas protegidas por autenticación

### **Validación**
- Validación de formularios en tiempo real
- Sanitización de inputs
- Manejo seguro de URLs externas
- Prevención de XSS básica

## 🔄 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Vista previa del build
npm run lint         # Linting del código

# Windows
start.bat           # Instalación y inicio automático
```

## 🐛 Resolución de Problemas

### **Error de CORS**
```javascript
// Ya configurado en el backend Django
// Si persiste, verificar que el backend esté en localhost:8000
```

### **Error 401 (No autorizado)**
```javascript
// Limpiar localStorage y volver a loguearse
localStorage.clear();
```

### **Botones del Admin no funcionan**
```javascript
// Verificar que Django esté ejecutándose en localhost:8000
// Revisar la consola del navegador para errores específicos
```

### **Loading infinito**
```javascript
// Verificar conexión al backend
// Revisar logs de la consola
// Verificar formato de respuesta de la API
```

## 🔮 Características Futuras

### **v2.0 Planificado**
- [ ] **PWA** (Progressive Web App)
- [ ] **Offline support** básico
- [ ] **Push notifications**
- [ ] **Dark mode** toggle
- [ ] **Exportación PDF** de boletines
- [ ] **Chat** en tiempo real
- [ ] **Calendario** académico integrado
- [ ] **Reportes** personalizables

### **Mejoras UX**
- [ ] **Drag & drop** para gestión de datos
- [ ] **Filtros avanzados** en tablas
- [ ] **Búsqueda global** inteligente
- [ ] **Shortcuts** de teclado
- [ ] **Tour guiado** para nuevos usuarios

## 📞 Soporte

### **Contacto**
- **Email:** admin@colegio.com
- **Documentación:** Este README
- **Issues:** Reportar en el repositorio

### **Recursos**
- **Backend API:** http://localhost:8000/api/
- **Panel Admin:** http://localhost:8000/admin/
- **Frontend:** http://localhost:5173/

---

**💻 Desarrollado con ❤️ para la gestión educativa moderna**

*Sistema completo y profesional para colegios que buscan digitalizar y optimizar sus procesos académicos.*
