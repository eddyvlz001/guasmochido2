# 🚀 SARA - APLICACIÓN LISTA PARA NETLIFY

## ✅ CONTENIDO DE ESTE PROYECTO

Este proyecto contiene una aplicación React completa con:

- **Frontend React** buildeado y optimizado
- **Funciones Serverless** para Netlify
- **Sistema de Login** múltiple (React + HTML puro)
- **Base de datos Supabase** configurada
- **Dashboard completo** con todas las pantallas
- **Documentación completa** para deployment

## 🚀 DEPLOYMENT RÁPIDO EN NETLIFY

### Opción 1: Drag & Drop (2 minutos)
1. Ve a [netlify.com](https://netlify.com)
2. Crea cuenta (gratis)
3. Arrastra la carpeta `build/` al dashboard
4. ¡Listo! Tu app estará online

### Opción 2: GitHub Integration
1. Sube este proyecto a GitHub
2. En Netlify: "New site from Git"
3. Conecta tu repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Functions directory: `src/functions`

## 🔑 VARIABLES DE ENTORNO NECESARIAS

En Netlify Dashboard → Settings → Environment variables:

```
SUPABASE_URL=https://euwcqesokyajfnapyntf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1d2NxZXNva3lhamZuYXB5bnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTE1NTksImV4cCI6MjA2ODg4NzU1OX0.ojdmRlUhCApL0nZqt_3Zsgt5sODleOt5jg3S488gr7Q
```

## 👤 USUARIOS DE PRUEBA

```
admin@test.com / admin123
demo@piensa.com / demo123
test@emergent.com / test123
```

## 📱 URLs DESPUÉS DEL DEPLOYMENT

```
https://tu-app.netlify.app/fast-login.html  ← Login rápido (¡Recomendado!)
https://tu-app.netlify.app/auth/login       ← Login React
https://tu-app.netlify.app/home             ← Dashboard
https://tu-app.netlify.app/auth/register    ← Registro
```

## 📋 TESTING

1. Ve a `/fast-login.html`
2. Click "LOGIN COMO ADMIN"
3. ¡Accederás al dashboard completo!

## 📖 DOCUMENTACIÓN COMPLETA

Lee `DOCUMENTACION_COMPLETA_DEPLOYMENT.md` para:
- Setup local completo
- Configuración de base de datos
- APIs y funciones serverless
- Troubleshooting
- Comandos útiles

---

**🎉 ¡APLICACIÓN COMPLETAMENTE FUNCIONAL Y LISTA!**

*Desarrollada con React, Netlify Functions, Supabase y mucho ❤️*