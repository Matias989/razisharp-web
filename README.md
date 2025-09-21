# 🎮 Razisharp Website

Sitio web oficial de **Razisharp**, streamer de anime y gaming. Una plataforma moderna donde los seguidores pueden registrarse, votar por animes y seguir el progreso de capítulos.

## ✨ Características

- 🎨 **Diseño Dark Fantasy**: Inspirado en el personaje mascota de Razisharp
- 🔐 **Autenticación Segura**: Sistema de login/registro con JWT
- ⭐ **Sistema de Votación**: Los usuarios pueden votar por sus animes favoritos
- 📊 **Panel de Administración**: Gestión de animes y progreso de capítulos
- 📱 **Responsive Design**: Optimizado para móvil y desktop
- 🚀 **Optimizado para Netlify**: Deploy automático y serverless functions

## 🎨 Tema Visual

- **Color Principal**: #32868A (Cyan)
- **Estilo**: Dark Fantasy con elementos góticos
- **Personaje Mascota**: Skull con cuernos y ojos cyan brillantes
- **Animaciones**: Efectos de glow, float y partículas

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes (Serverless Functions)
- **Base de Datos**: MongoDB Atlas
- **Estilos**: Tailwind CSS con animaciones personalizadas
- **Hosting**: Netlify (compatible)
- **Autenticación**: JWT + bcryptjs

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd razisharp-website
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` basado en `env.example`:

```bash
cp env.example .env.local
```

Configura las siguientes variables:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/razisharp?retryWrites=true&w=majority

# JWT Secret (genera una clave segura)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# Optional: Admin User Email
ADMIN_EMAIL=admin@razisharp.com
```

### 4. Configurar MongoDB Atlas

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un nuevo cluster
3. Obtén la connection string
4. Configura las variables de entorno

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 6. Iniciar Sesión

**Usuario Administrador:**
- Email: `razisharp@kick.com`
- Password: `Razisharp2024!`

## 📦 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en modo producción
- `npm run lint` - Ejecutar linter

## 🌐 Deploy en Netlify

### Opción 1: Deploy Automático desde GitHub

1. Conecta tu repositorio de GitHub a Netlify
2. Configura las variables de entorno en Netlify:
   - `MONGODB_URI`
   - `JWT_SECRET`
3. Netlify construirá y desplegará automáticamente

### Opción 2: Deploy Manual

```bash
# Construir el proyecto
npm run build

# Subir la carpeta '.next' a Netlify
```

## 📁 Estructura del Proyecto

```
razisharp-website/
├── pages/                 # Páginas de Next.js
│   ├── api/              # API Routes (Serverless Functions)
│   │   ├── auth/         # Autenticación
│   │   └── animes/       # Gestión de animes
│   ├── animes/           # Página de votación
│   ├── login.tsx         # Página de login
│   ├── register.tsx      # Página de registro
│   └── about.tsx         # Página sobre Razisharp
├── lib/                  # Utilidades
│   └── mongodb.ts        # Conexión a MongoDB
├── types/                # Tipos TypeScript
│   └── index.ts          # Interfaces y tipos
├── styles/               # Estilos
│   └── globals.css       # Estilos globales con Tailwind
├── public/               # Assets estáticos
├── package.json          # Dependencias y scripts
├── next.config.js        # Configuración de Next.js
├── tailwind.config.js    # Configuración de Tailwind
└── README.md            # Este archivo
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios

### Animes
- `GET /api/animes` - Obtener lista de animes
- `GET /api/animes/top` - Obtener top 3 animes más votados
- `GET /api/animes/top-obs-compact` - Vista compacta con fondo transparente
- `GET /api/animes/top-obs` - Vista HTML optimizada para OBS Studio
- `GET /api/animes/top-data` - Datos JSON del top 3 para integración
- `POST /api/animes` - Crear anime (Admin)
- `GET /api/animes/[id]` - Obtener anime específico
- `PUT /api/animes/[id]` - Actualizar anime (Admin)
- `DELETE /api/animes/[id]` - Eliminar anime (Admin)
- `POST /api/animes/vote` - Votar por anime

### Estadísticas
- `GET /api/stats` - Obtener estadísticas generales

## 📺 Integración con OBS Studio

### Endpoints Especializados
- **`/api/animes/top-obs-compact`**: Vista compacta con fondo transparente (solo info esencial)
- **`/api/animes/top-obs`**: Vista HTML completa optimizada para OBS
- **`/api/animes/top-data`**: Datos JSON para integración personalizada
- **`/obs-config`**: Página de configuración con instrucciones detalladas

### Características OBS
- **Auto-refresh**: Actualización automática cada 30 segundos
- **Diseño responsive**: Se adapta a diferentes dimensiones
- **Efectos visuales**: Partículas de fondo y animaciones
- **Temática consistente**: Mantiene el estilo fantasy del sitio

### Configuración Recomendada
- **Ancho**: 800px - 1200px
- **Alto**: 600px - 800px
- **FPS**: 30 FPS
- **Cache**: Deshabilitado para actualizaciones en tiempo real

### Uso en OBS
1. Agrega una fuente "Navegador" en OBS
2. Usa la URL: `https://tu-dominio.com/api/animes/top-obs`
3. Configura las dimensiones según tus necesidades
4. El contenido se actualiza automáticamente

## 🎨 Personalización

### Colores
Los colores principales están definidos en `tailwind.config.js`:
- Primary: #32868A (Cyan)
- Dark: Gradientes de grises oscuros
- Accent: Cyan brillante para efectos

### Animaciones
Las animaciones personalizadas están en `styles/globals.css`:
- `animate-float` - Efecto de flotación
- `animate-glow` - Efecto de brillo
- `animate-pulse-slow` - Pulso lento

### Componentes
Los componentes reutilizables están definidos como clases CSS:
- `.btn-primary` - Botón principal
- `.btn-secondary` - Botón secundario
- `.card` - Tarjeta base
- `.card-glow` - Tarjeta con efecto de brillo

## 🔒 Seguridad

- Contraseñas hasheadas con bcryptjs
- Tokens JWT para autenticación
- Validación de datos en cliente y servidor
- CORS configurado para producción
- Variables de entorno para datos sensibles

## 📱 Responsive Design

El sitio está optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Pantallas grandes (1440px+)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**Razisharp** - Streamer de Anime & Gaming
- 🌐 Sitio web: [razisharp.com](https://razisharp.com)
- 🎮 Kick: [@razisharp](https://kick.com/razisharp)
- 📺 Twitch: [@razisharp](https://www.twitch.tv/razisharp)
- 💬 Discord: [Comunidad](https://discord.gg/hjKpTgfTPu)

## 🙏 Agradecimientos

- Next.js por el framework
- Tailwind CSS por los estilos
- MongoDB Atlas por la base de datos
- Netlify por el hosting
- La comunidad de anime por la inspiración

---

⭐ **¡No olvides darle una estrella al proyecto si te gusta!** ⭐
