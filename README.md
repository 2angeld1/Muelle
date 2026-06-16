# 🚢 NexoExport — Gestión Inteligente de Exportaciones

**NexoExport** es una plataforma diseñada para centralizar, automatizar y optimizar los procesos de exportación, integrando clientes, documentación, contenedores, seguimiento y reportes en un solo lugar.

## 🎯 MVP 1.0 — Centralización

### Módulos Incluidos
- 📊 **Dashboard** — KPIs en tiempo real, gráficos de exportaciones, alertas
- 📦 **Exportaciones** — CRUD completo con expediente único por exportación
- 📄 **Documentación** — Checklist de documentos por exportación
- 🚢 **Contenedores** — Vista consolidada de todos los contenedores
- 📍 **Tracking** — Seguimiento de embarques con barra de progreso
- 👥 **Clientes** — Gestión de cartera de clientes
- 📊 **Reportes** — Análisis por cliente, país y mes
- 🔔 **Alertas** — Centro de notificaciones

## 🛠️ Stack Tecnológico
- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **Base de Datos:** MongoDB + Mongoose
- **Fuente:** Inter (Google Fonts)

## 🚀 Inicio Rápido

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Cargar Datos Demo
Al entrar al dashboard, presiona el botón **"Cargar Datos Demo"** para generar 16 exportaciones de ejemplo con clientes, contenedores y documentos.

## 🌐 Variables de Entorno
```
MONGODB_URI="mongodb://localhost:27017/nexoexport"
```

## 📋 Roadmap
- **v1.0** — Centralización (actual)
- **v2.0** — Automatización (Gmail API, Google Drive)
- **v3.0** — Asistente Inteligente (IA conversacional)

---
Desarrollado con ❤️ por **Angel F.** para optimizar la gestión de exportaciones.
