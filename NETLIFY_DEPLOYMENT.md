# Instrucciones de Deployment en Netlify

## 1. Preparación
La aplicación está lista para deployment con:
- ✅ Build exitoso (`npm run build`)
- ✅ Funciones serverless configuradas en `src/functions/`
- ✅ Configuración de Netlify en `netlify.toml`
- ✅ Variables de entorno configuradas

## 2. Deployment Manual en Netlify

### Opción A: Drag & Drop
1. Ve a [netlify.com](https://netlify.com) y crea una cuenta
2. En el dashboard, arrastra y suelta la carpeta `build/` 
3. Tu sitio se desplegará instantáneamente

### Opción B: Git Deploy (Recomendado)
1. Sube el código a GitHub
2. En Netlify dashboard → "New site from Git"
3. Conecta tu repositorio
4. Configuración de build:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Functions directory: `src/functions`

## 3. Variables de Entorno en Netlify
En el dashboard de tu sitio → Settings → Environment variables:
```
SUPABASE_URL=https://euwcqesokyajfnapyntf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1d2NxZXNva3lhamZuYXB5bnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTE1NTksImV4cCI6MjA2ODg4NzU1OX0.ojdmRlUhCApL0nZqt_3Zsgt5sODleOt5jg3S488gr7Q
```

## 4. Crear Usuarios de Prueba en Supabase
1. Ve a tu dashboard de Supabase
2. Authentication → Users → "Add user"
3. Crea estos usuarios:
   - Email: `test@emergent.com`, Password: `test123`
   - Email: `demo@emergent.com`, Password: `demo123`

## 5. Funciones Disponibles
- `/.netlify/functions/login` - Login de usuarios
- `/.netlify/functions/register` - Registro de usuarios
- `/.netlify/functions/setup` - Setup inicial (crear usuarios)

## 6. Testing
Después del deployment:
1. Ve a tu URL de Netlify
2. Navega a `/auth/login`
3. Usa los botones de testing para probar login
4. Verifica en DevTools la comunicación con funciones

## 7. URLs Finales
- Frontend: `https://your-site-name.netlify.app`
- Funciones: `https://your-site-name.netlify.app/.netlify/functions/[function-name]`