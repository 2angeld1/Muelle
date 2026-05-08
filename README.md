# 🚢 MUELLE - Inteligencia Logística Avanzada

**Muelle** es una plataforma SaaS de próxima generación diseñada para automatizar y optimizar la cadena de suministro global. Mediante el uso de inteligencia artificial y automatización robótica de procesos (RPA), Muelle elimina los cuellos de botella en la gestión de itinerarios y documentación aduanera.

![Muelle Banner](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200&h=400)

## 🤖 Caitlyn AI: El "Itinerary Hunter"
El corazón de Muelle es **Caitlyn**, un agente autónomo capaz de cazar itinerarios en tiempo real navegando por los portales de las principales navieras del mundo.

### Características Principales:
- 🚀 **Búsqueda Multi-Fuente Paralela:** Consulta simultáneamente a Maersk, MSC, CMA CGM, Hapag-Lloyd y COSCO.
- 📡 **Live Logs (WebSockets):** Notificaciones en tiempo real del progreso de búsqueda (Caitlyn narra cada paso que da).
- 🧠 **Smart Discovery:** Detección dinámica de campos, placeholders y formatos de fecha en cualquier portal logístico.
- 📸 **Visión por Computadora (OCR):** Extracción de datos precisos mediante el análisis de capturas de pantalla con EasyOCR.
- 🕵️‍♂️ **Navegación Sigilosa:** Bypass de banners de cookies y validaciones mediante inyección de eventos nativos.

## 🛠️ Stack Tecnológico

### Frontend (Muelle App)
- **Framework:** Next.js 15+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS con estética Dark Mode Premium.
- **Iconografía:** Lucide React.
- **Comunicación:** WebSockets para logs en vivo.

### Backend (Caitlyn Engine)
- **Core:** FastAPI (Python 3.12+)
- **Automatización:** Playwright (Chromium)
- **IA/OCR:** EasyOCR + PyTorch.
- **Base de Datos:** MongoDB.
- **Procesamiento:** Asyncio para ejecución paralela de scrapers.

## 🚀 Instalación y Desarrollo

### Requisitos
- Node.js 18+
- Python 3.10+
- MongoDB local o en la nube.

### Configuración del Backend (Caitlyn)
```bash
cd ionic-maps-backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

### Configuración del Frontend (Muelle)
```bash
cd Muelle
npm install
npm run dev
```

## 🌐 Estructura del Proyecto
- `/Muelle`: Aplicación principal en Next.js.
- `/ionic-maps-backend`: Microservicio de IA y automatización.
- `/app/scrapers`: Motores de búsqueda inteligente (SmartFinder).
- `/app/ai`: Almacén de datasets y capturas de debug.

---
Desarrollado con ❤️ por **Angel F.** para modernizar la logística mundial.
