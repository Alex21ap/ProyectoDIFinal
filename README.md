# 🚀 Proyecto Final - Gestión Educativa

Este es un sistema integral de gestión académica desarrollado con **Angular 19** para el frontend y **Node.js (Express)** con **JWT** para el backend.

## 📋 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (v18 o superior)
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)
- [Git](https://git-scm.com/)

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
Primero, clona el proyecto en tu máquina local y entra en la carpeta:

```bash
git clone https://github.com/Alex21ap/ProyectoDIFinal
cd ProyectoDIFinal

## Configuración del Backend
1. Ir a la carpeta `academia-app/backend`.
2. Ejecutar `npm install`.
3. Copiar `.env.example` a un nuevo archivo `.env`.
4. Ejecutar `npm start`.

## Configuración del Frontend
1. Ir a la carpeta `academia-app/`.
2. Ejecutar `npm install`.
3. Ejecutar `ng serve`.

---

## 👤 Usuarios de Prueba

Para probar las diferentes interfaces y permisos del sistema, puede utilizar las siguientes credenciales:

| Rol | Usuario | Contraseña | Acceso |
| **Administrador** | `admin` | `admin123` | Gestión total, usuarios y cursos  |
| **Profesor** | `profesor` | `prof123` | Gestión total, cursos  |
| **Estudiante** | `estudiante` | `estu123` | Catálogo de cursos e inscripciones |

> **Nota:** Estas credenciales están configuradas por defecto en el servidor para facilitar la evaluación del proyecto.