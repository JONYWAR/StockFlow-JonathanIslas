# PROCESS.md — StockFlow Technical Exam

## 📋 Problema Abordado

El objetivo es construir **StockFlow**: un sistema de control de inventario multi-sucursal con:
- CRUD de productos y sucursales
- Gestión de stock por sucursal
- Registro de movimientos con histórico
- Procesamiento asíncrono de movimientos
- Dashboard con visualización y filtros
- Sistema de reintentos
- Reportes por rango de fechas

---

### **Development Tools**
- **WebStorm** - IDE for TypeScript, React, and Next.js
- **PostMan** - API testing and debugging
- **Figma** - UI design

## 🎯 Estrategia de Priorización

Aplicando la restricción de **48 horas**, decidí priorizar según el valor funcional y el riesgo:

### **Fase 1: Foundation (Completado)**
1. ✅ Setup del proyecto: Next.js + MongoDB + TypeScript
2. ✅ Infraestructura: conexión DB, variables de entorno
3. ✅ Modelo base: **Producto** con validación Zod
4. ✅ CRUD API: endpoints funcionales con error handling

**Decisión:** Comenzar con lo más simple (Producto) para validar la pipeline completa: API → DB → Deployment.

### **Fase 2: Core Entities (Completado)**
- ✅ Modelo **Sucursal** (nombre, ubicación)
- ✅ Modelo **Stock** (relación Producto ↔ Sucursal)
- ✅ Modelo **Movimiento** (tipos: entrada, salida, transferencia)
- ✅ API endpoints para CRUD de sucursales
- ✅ API endpoints para CRUD de movimientos
- ✅ API endpoints para CRUD de Stock

### **Fase 3: Async Processing (Próximo)**
- ✅ Sistema de cola para movimientos (estado: `pending` →`processed`/`failed`)
- ✅ Worker que procesa movimientos en background
- ✅ Actualización de stocks con transacciones
- ✅ Sistema de reintentos (al menos 1 reintento)

### **Fase 4: Frontend Dashboard (Final)**
- ✅ Listado de productos con stock total y por sucursal
- ✅ Listado de movimientos con filtros (estado, sucursal)
- ✅ Formularios para crear movimientos
- ✅ Detalle de movimientos
- ✅ Reporte por rango de fechas

---


## Architecture Overview

---


```
┌─────────────────┐
│   GitHub Repo   │
└────────┬────────┘
         │ (push)
         ▼
┌─────────────────┐
│     Vercel      │ ◄─── Auto Deploy
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  StockFlow App (Next.js)        │
│  ├── Frontend (React)           │
│  └── Backend (API Routes)       │
└────────┬────────────────────────┘
         │ (API calls)
         ▼
┌─────────────────────────────────┐
│  MongoDB Atlas                  │
│  (Cloud Database - Free Tier)   │
└─────────────────────────────────┘
```



## 🎓 Decisiones Técnicas Clave

### **1. Usar Next.js con API Routes (vs Backend Separado)**

**Decisión:** Monorepo con Next.js (frontend + backend integrados)

**Por qué:**
- ✅ Es el stack recomendado, Deploy simplificado en Vercel: un solo proyecto, push → live
- ✅ Compartir tipos TypeScript entre frontend y API
- ✅ No requiere configurar CORS externa
- ✅ Variables de entorno centralizadas
- ✅ Desarrollo local menos complejo

**Trade-off aceptado:**
- Escalabilidad limitada si el API crece exponencialmente (requeriría refactor posterior)
- Sin embargo, para esta fase y el scope es óptimo

---

### **2. Validación con Zod (vs solo Mongoose validation)**

**Decisión:** Zod en capa API + Mongoose schemas

**Por qué:**
- ✅ Validación en request en tiempo de ejecución (segura contra datos malformados)
- ✅ Errores detallados y tipados para el frontend
- ✅ Type-safe inferring de tipos TypeScript
- ✅ Reutilizable en frontend si necesario

**Alternativas consideradas:**
- Solo Mongoose: menos control sobre request parsing
- Joi: más verbose, Zod es más moderno
- Clase-validator: más pesado para el caso de uso

---

## **Known Issues:**
- Major > Al eliminar un producto o branch, provoca interrupción de servicio
al intentar leer los Movimientos, ya que hace uso de los IDs los cuales ya no existen.

---

## 📝 Notas Finales

- El `README.md` ya incluye instrucciones de setup y justificación de decisiones
- Este `PROCESS.md` se actualizará con cada milestone completado
- Evitaré commits grandes: pequeños commits lógicos (un cambio por commit)
- Variables sensibles en `.env.local` (nunca commiteadas)
- URL de Vercel estará en README una vez completado el MVP

**Comenzando:** 2026-04-28  
**Target de entrega:** 2026-04-30 (48 horas)

---
