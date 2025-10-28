# Calculadora de Servicios - Cotizador Profesional

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Una aplicación web moderna y profesional para calcular precios de servicios de rotulación y publicidad, con generación automática de cotizaciones en PDF.

## Características Principales

### Cálculo Inteligente de Precios
- **Precios por pie cuadrado**: Cálculo automático basado en el área
- **Múltiples categorías**: Letras formadas, letras recortadas, impresión digital, rotulación
- **Opciones de espesor**: Diferentes grosores de material con precios variables
- **Tamaños mínimos**: Aplicación automática de precios mínimos según reglas de negocio

### Lógica Especial Implementada

#### Servicios con Luz
Para todas las categorías que incluyen "CON LUZ":
- ✨ Cálculo automático de pastillas LED (B/. 1.25 c/u)
- 🔌 Transformadores (B/. 34.95, rinde 15 ft²)
- 📊 Cantidad de transformadores calculada automáticamente (1 por cada 15 ft², redondeado hacia arriba)
- 💡 Aviso visual de componentes incluidos

#### Letras Recortadas
- 🎨 Opción de color personalizado (+B/. 2.00 por pie²)
- ✓ Checkbox para activar/desactivar el costo adicional

#### Reglas Condicionales
- 📏 Aplicación automática de tamaños mínimos
- 💰 Redondeo de precios según condiciones especiales
- ⚠️ Alertas visuales cuando el tamaño está por debajo del mínimo

### Funcionalidades Avanzadas

#### Gestión de Cotizaciones
- 💾 **Guardado automático**: Las cotizaciones se guardan en localStorage
- 📋 **Historial completo**: Visualiza todas tus cotizaciones anteriores
- 🔍 **Búsqueda y filtros**: Encuentra cotizaciones por servicio, categoría o cliente
- 📊 **Ordenamiento**: Por fecha o por valor total
- 🗑️ **Eliminación**: Gestiona tu historial fácilmente

#### Información del Cliente
- 👤 Nombre del cliente
- 🏢 Empresa
- 📧 Email
- 📱 Teléfono
- 📝 Campos opcionales que se incluyen en el PDF

#### Sistema de Descuentos
- 💸 Descuentos porcentuales configurables
- 📉 Visualización clara del ahorro
- 💯 Aplicable a cualquier cotización

#### Instalación
- 🔧 Opción de incluir costo de instalación
- 💰 Monto personalizable
- ✓ Se agrega al total de la cotización

#### Generación de PDF Profesional
- 📄 **Diseño profesional**: Header con colores corporativos
- 📊 **Desglose detallado**: Todos los componentes del precio
- 👤 **Información del cliente**: Si está disponible
- 📝 **Notas incluidas**: Observaciones especiales
- 💡 **Avisos de componentes**: LED, transformadores, etc.
- 📅 **Fecha y número de cotización**: Para seguimiento
- 💾 **Descarga automática**: PDF listo para enviar

### Diseño Moderno

#### Interfaz de Usuario
- 🎨 **Diseño limpio y profesional**: Esquinas redondeadas, sombras suaves
- 📱 **Responsive**: Se adapta a diferentes tamaños de pantalla
- ⚡ **Animaciones suaves**: Transiciones y efectos visuales
- 🎯 **Intuitivo**: Fácil de usar sin capacitación

#### Modo Oscuro
- 🌙 **Toggle de modo oscuro**: Cambia entre tema claro y oscuro
- 💾 **Preferencia guardada**: Recuerda tu elección
- 👁️ **Mejor para la vista**: Reduce la fatiga visual
- 🎨 **Colores optimizados**: Contraste perfecto en ambos modos

#### Panel Lateral
- 📑 **Lista de servicios**: Todos los tipos disponibles
- 🔍 **Búsqueda en tiempo real**: Filtra servicios rápidamente
- 📊 **Contador de variantes**: Muestra cuántas opciones tiene cada servicio
- 🎯 **Navegación clara**: Selección visual del servicio activo

## Instalación

### Requisitos Previos
- Node.js 18+ instalado
- npm o yarn

### Pasos de Instalación

1. **Navega a la carpeta del proyecto**:
```bash
cd cotizador-servicios
```

2. **Instala las dependencias**:
```bash
npm install
```

3. **Verifica que el CSV esté en la carpeta public**:
El archivo `PRECIO X PIE2 DE LOS SERVICIOS.csv` debe estar en la carpeta `public/`

4. **Inicia el servidor de desarrollo**:
```bash
npm run dev
```

5. **Abre tu navegador**:
La aplicación estará disponible en `http://localhost:5173`

## Uso

### Crear una Nueva Cotización

1. **Selecciona un tipo de servicio** del panel lateral
2. **Elige la categoría** del servicio
3. **Selecciona el espesor/tipo** que deseas cotizar
4. **Ingresa los pies cuadrados** del proyecto
5. **Activa opciones adicionales** si aplican:
   - Color personalizado (solo para letras recortadas)
   - Instalación
6. **Agrega un descuento** si es necesario
7. **Escribe notas adicionales** para el cliente
8. **Guarda la cotización** o **genera el PDF** directamente

### Agregar Datos del Cliente

1. Click en **"Agregar datos del cliente"**
2. Completa los campos (solo el nombre es obligatorio)
3. Esta información aparecerá en el PDF generado

### Ver Historial

1. Click en **"Historial"** en el panel lateral
2. Usa el buscador para encontrar cotizaciones específicas
3. Ordena por fecha o por valor total
4. Descarga PDF o elimina cotizaciones antiguas

## Estructura del Proyecto

```
cotizador-servicios/
├── public/
│   └── PRECIO X PIE2 DE LOS SERVICIOS.csv  # Datos de servicios
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx                      # Panel de navegación
│   │   ├── Calculator.tsx                   # Calculadora principal
│   │   └── QuoteHistory.tsx                 # Historial de cotizaciones
│   ├── types/
│   │   └── index.ts                         # Definiciones TypeScript
│   ├── utils/
│   │   ├── csvParser.ts                     # Parser del CSV
│   │   ├── priceCalculator.ts               # Lógica de cálculo
│   │   └── pdfGenerator.ts                  # Generación de PDF
│   ├── App.tsx                              # Componente principal
│   ├── index.css                            # Estilos globales
│   └── main.tsx                             # Punto de entrada
├── tailwind.config.js                       # Configuración de Tailwind
├── tsconfig.json                            # Configuración de TypeScript
├── vite.config.ts                           # Configuración de Vite
└── package.json                             # Dependencias
```

## Tecnologías Utilizadas

- **React 18**: Framework de UI moderna
- **TypeScript**: Tipado estático para mayor seguridad
- **Vite**: Build tool ultra-rápido
- **Tailwind CSS**: Framework de CSS utility-first
- **jsPDF**: Generación de PDF en el navegador
- **jsPDF-AutoTable**: Tablas profesionales en PDF
- **Lucide React**: Iconos modernos
- **localStorage**: Persistencia de datos en el navegador

## Personalización

### Modificar Precios

Edita el archivo CSV en la carpeta `public/`. Los cambios se reflejarán automáticamente al recargar la aplicación.

### Cambiar Colores

Modifica `tailwind.config.js` para ajustar la paleta de colores:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Tus colores personalizados
      }
    }
  }
}
```

### Ajustar Costos de LED y Transformadores

Edita `src/utils/priceCalculator.ts`:

```typescript
export const LED_COST_PER_UNIT = 1.25;        // Precio por pastilla LED
export const TRANSFORMER_COST = 34.95;        // Precio por transformador
export const TRANSFORMER_COVERAGE = 15;       // Cobertura en ft²
export const CUSTOM_COLOR_COST = 2.0;         // Costo de color personalizado
```

## Próximas Funcionalidades Sugeridas

- [ ] **Exportar a Excel**: Exportar cotizaciones a formato .xlsx
- [ ] **Plantillas de cliente**: Guardar clientes frecuentes
- [ ] **Comparador de servicios**: Comparar múltiples opciones lado a lado
- [ ] **Calculadora de margen**: Ver costos vs precio de venta
- [ ] **Multi-idioma**: Soporte para inglés
- [ ] **Email directo**: Enviar cotizaciones por email desde la app
- [ ] **Gráficos de estadísticas**: Visualizar ventas y tendencias
- [ ] **Impresión directa**: Imprimir sin generar PDF
- [ ] **Base de datos**: Sincronización en la nube
- [ ] **Multi-usuario**: Sistema de usuarios y permisos

## Construcción para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`.

Para previsualizar la build de producción:

```bash
npm run preview
```

## Despliegue

Puedes desplegar esta aplicación en:

- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Arrastra la carpeta `dist/` a Netlify
- **GitHub Pages**: Configura GitHub Actions
- **Servidor propio**: Sube la carpeta `dist/` a tu hosting

## Soporte

Para reportar bugs o solicitar nuevas funcionalidades, crea un issue en el repositorio.

## Licencia

MIT License - Siéntete libre de usar y modificar este proyecto.

---

**Desarrollado con ❤️ usando React + TypeScript + Vite**
