# Sobrapp Web - Plataforma de Entregas

Una aplicación web moderna para conectar clientes que necesitan enviar sobres con motociclistas disponibles para entregas, desarrollada con React, TypeScript y Material-UI.

## 🚀 Características

### Para Clientes
- **Registro y autenticación** de usuarios
- **Crear solicitudes de entrega** con origen, destino, urgencia y precio
- **Seguimiento en tiempo real** del estado de las entregas
- **Historial completo** de todas las entregas realizadas
- **Confirmación de entregas** cuando son completadas

### Para Motociclistas
- **Ver entregas disponibles** en tiempo real
- **Aceptar entregas** con un solo clic
- **Iniciar y completar entregas** con actualizaciones de estado
- **Navegación integrada** hacia destinos
- **Ganancias y estadísticas** de rendimiento

### Características Generales
- **Diseño responsive** que funciona en desktop, tablet y móvil
- **Interfaz moderna** con Material-UI y animaciones suaves
- **Navegación intuitiva** con sidebar y breadcrumbs
- **Notificaciones en tiempo real** para actualizaciones de estado
- **Validación de formularios** en tiempo real
- **Manejo de errores** robusto y user-friendly

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para mejor desarrollo
- **Material-UI (MUI)** - Componentes de UI modernos y accesibles
- **React Router DOM** - Navegación entre páginas
- **Framer Motion** - Animaciones fluidas y atractivas

### Backend
- **Supabase** - Backend-as-a-Service con PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **Row Level Security (RLS)** - Seguridad a nivel de fila
- **bcryptjs** - Hashing seguro de contraseñas

### Herramientas de Desarrollo
- **Create React App** - Configuración inicial del proyecto
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd sobrapp-web
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   REACT_APP_SUPABASE_URL=tu_url_de_supabase
   REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

5. **Abrir en el navegador**
   La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AppNavigator.tsx
│   ├── DeliveryCard.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoginScreen.tsx
│   ├── MainLayout.tsx
│   ├── RegisterScreen.tsx
│   ├── SplashScreen.tsx
│   └── UserTypeScreen.tsx
├── config/             # Configuraciones
│   └── supabase.ts
├── context/            # Contextos de React
│   └── NavigationContext.tsx
├── screens/            # Pantallas principales
│   ├── AvailableDeliveriesScreen.tsx
│   ├── CreateDeliveryScreen.tsx
│   ├── DeliveriesScreen.tsx
│   ├── HomeScreen.tsx
│   ├── NavigationScreen.tsx
│   └── ProfileScreen.tsx
├── services/           # Servicios de API
│   ├── authService.ts
│   └── deliveryService.ts
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts
├── utils/              # Utilidades y helpers
│   ├── constants.ts
│   └── errorHandler.ts
├── App.tsx             # Componente principal
└── index.tsx           # Punto de entrada
```

## 🔧 Configuración de Supabase

### 1. Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Guarda la URL y la clave anónima

### 2. Configurar Base de Datos
Ejecuta los siguientes comandos SQL en el editor SQL de Supabase:

```sql
-- Crear tabla de usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('client', 'driver')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de entregas
CREATE TABLE deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  origin VARCHAR(500) NOT NULL,
  destination VARCHAR(500) NOT NULL,
  urgency VARCHAR(50) NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high')),
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para usuarios
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Políticas de RLS para entregas
CREATE POLICY "Anyone can view pending deliveries" ON deliveries
  FOR SELECT USING (status = 'pending');

CREATE POLICY "Clients can view their own deliveries" ON deliveries
  FOR SELECT USING (client_id::text = auth.uid()::text);

CREATE POLICY "Drivers can view accepted deliveries" ON deliveries
  FOR SELECT USING (driver_id::text = auth.uid()::text);

CREATE POLICY "Clients can create deliveries" ON deliveries
  FOR INSERT WITH CHECK (client_id::text = auth.uid()::text);

CREATE POLICY "Drivers can update accepted deliveries" ON deliveries
  FOR UPDATE USING (driver_id::text = auth.uid()::text);
```

## 🚀 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Ejectuar configuración de CRA
npm run eject
```

## 📱 Uso de la Aplicación

### Registro y Autenticación
1. Selecciona tu tipo de usuario (Cliente o Motociclista)
2. Completa el formulario de registro con tus datos
3. Inicia sesión con tu email y contraseña

### Para Clientes
1. **Crear Entrega**: Ve a "Crear Entrega" y completa el formulario
2. **Seguir Entregas**: Ve a "Mis Entregas" para ver el estado
3. **Confirmar Entrega**: Confirma cuando la entrega sea completada

### Para Motociclistas
1. **Ver Disponibles**: Ve a "Entregas Disponibles" para ver ofertas
2. **Aceptar Entrega**: Haz clic en "Aceptar Entrega" en la que te interese
3. **Gestionar Entregas**: Ve a "Mis Entregas" para iniciar y completar
4. **Navegar**: Usa el botón "Navegar" para abrir Google Maps

## 🎨 Personalización

### Temas y Colores
Los colores y temas se pueden personalizar en:
- `src/App.tsx` - Configuración del tema principal
- `src/utils/constants.ts` - Colores y configuraciones de la app

### Componentes
Los componentes están diseñados para ser reutilizables y personalizables:
- `DeliveryCard` - Tarjeta de entrega reutilizable
- `MainLayout` - Layout principal con sidebar
- `ErrorBoundary` - Manejo de errores global

## 🔒 Seguridad

- **Autenticación**: Implementada con Supabase Auth
- **Autorización**: Row Level Security (RLS) en PostgreSQL
- **Validación**: Validación de formularios en frontend y backend
- **Hashing**: Contraseñas hasheadas con bcryptjs
- **HTTPS**: Recomendado para producción

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Netlify
1. Conecta tu repositorio a Netlify
2. Configura el build command: `npm run build`
3. Configura las variables de entorno

### Otros
La aplicación se puede desplegar en cualquier plataforma que soporte aplicaciones React estáticas.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@sobrapp.com
- Documentación: [docs.sobrapp.com](https://docs.sobrapp.com)
- Issues: [GitHub Issues](https://github.com/sobrapp/web/issues)

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- ✅ Lanzamiento inicial
- ✅ Autenticación completa
- ✅ Gestión de entregas
- ✅ Interfaz responsive
- ✅ Integración con Supabase
- ✅ Navegación en tiempo real 