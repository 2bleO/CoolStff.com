# Coolstff.com - Plataforma de E-commerce de Productos Innovadores

Una plataforma web que funciona como sitio de comercio electrónico afiliado, permitiendo la publicación de productos innovadores y artículos sobre diseños conceptuales o futuristas.

## Configuración del Proyecto

### Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Cuenta de Firebase

### Variables de Entorno

El proyecto requiere las siguientes variables de entorno. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=tu_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### Configuración de Firebase

1. Crea un proyecto en Firebase Console
2. Habilita los siguientes servicios:
   - Authentication
   - Firestore Database
   - Storage
   - Analytics
3. En Authentication > Settings > Authorized domains, agrega los dominios autorizados
4. Configura los métodos de autenticación necesarios

### Instalación

1. Clona el repositorio:
```bash
git clone <url_del_repositorio>
cd coolstff.com
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
# o
yarn start
```

## Características

- Gestión de productos y artículos
- Sistema de autenticación de usuarios
- Sistema de favoritos
- Comentarios en productos y artículos
- Integración con enlaces de afiliados
- Diseño responsive

## Estructura del Proyecto

```
src/
  ├── components/     # Componentes reutilizables
  ├── contexts/       # Contextos de React (Auth, etc)
  ├── firebase/       # Configuración de Firebase
  ├── pages/          # Páginas de la aplicación
  ├── types/          # Definiciones de tipos TypeScript
  └── utils/          # Utilidades y helpers
```

## Seguridad

- Las credenciales de Firebase se manejan a través de variables de entorno
- El archivo .env está incluido en .gitignore
- Se implementa persistencia de sesión para una mejor experiencia de usuario
- Se siguen las mejores prácticas de seguridad de Firebase

## Contribución

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.