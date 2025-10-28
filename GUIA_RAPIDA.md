# Guía Rápida de Uso - Calculadora de Servicios

## Inicio Rápido

### 1. Acceder a la Aplicación

Abre tu navegador y ve a: **http://localhost:5173**

La aplicación cargará automáticamente todos los servicios desde el archivo CSV.

---

## Interfaz Principal

### Panel Lateral Izquierdo
- **Calculadora de Servicios**: Título de la aplicación
- **+ Nueva Cotización**: Reinicia el formulario
- **Historial**: Ver cotizaciones guardadas
- **Buscador**: Filtrar servicios por nombre
- **Lista de Servicios**: Tipos de servicios disponibles con contador de opciones

### Botón de Modo Oscuro
- **Ubicación**: Esquina superior derecha
- **Función**: Alterna entre tema claro y oscuro
- **Persistencia**: Tu preferencia se guarda automáticamente

---

## Cómo Crear una Cotización

### Paso 1: Seleccionar Servicio
1. En el panel lateral, busca o navega por los servicios
2. Haz clic en el tipo de servicio que deseas cotizar
3. Ejemplos:
   - LETRAS FORMADAS
   - LETRAS RECORTADAS
   - IMPRESIÓN DIGITAL GRAN FORMATO
   - ROTULACIÓN DE VIDRIERA
   - ROTULACIÓN DE VEHÍCULOS

### Paso 2: Elegir Categoría
1. El panel principal mostrará un dropdown con las categorías disponibles
2. Selecciona la categoría apropiada
3. Ejemplos para "LETRAS FORMADAS":
   - ACRILICO CON LUZ DIRECTA
   - ACRILICO CON LUZ INDIRECTA
   - ACRILICO SIN LUZ
   - ACERO INOXIDABLE RAYADO SIN LUZ
   - etc.

### Paso 3: Seleccionar Espesor/Tipo
1. Aparecerán tarjetas con las opciones de espesor disponibles
2. Cada tarjeta muestra:
   - Medida del espesor
   - Precio por pie cuadrado
3. Haz clic en la opción deseada

### Paso 4: Ingresar Pies Cuadrados
1. En el campo "Pies Cuadrados (ft²)", ingresa el área del proyecto
2. Usa decimales si es necesario (ejemplo: 12.5)
3. **Importante**: Si aparece una alerta amarilla de "Tamaño mínimo", el sistema aplicará automáticamente el precio mínimo

### Paso 5: Opciones Adicionales

#### Para Servicios CON LUZ:
- **Componentes LED incluidos automáticamente**:
  - Pastillas LED: B/. 1.25 c/u
  - Transformadores: B/. 34.95 (rinde 15 ft²)
- El sistema calcula automáticamente cuántos transformadores se necesitan
- Ejemplo: 20 ft² necesita 2 transformadores (20 ÷ 15 = 1.33, redondeado a 2)

#### Para LETRAS RECORTADAS:
- **Color Personalizado**: Marca el checkbox para agregar B/. 2.00 por ft²

#### Instalación:
1. Marca el checkbox "Incluir instalación"
2. Ingresa el costo de instalación en el campo que aparece

#### Descuentos:
1. Ingresa el porcentaje de descuento (0-100)
2. El descuento se aplicará al total final

#### Notas:
- Agrega observaciones, detalles especiales o instrucciones
- Aparecerán en el PDF generado

### Paso 6: Agregar Información del Cliente (Opcional)
1. Haz clic en "Agregar datos del cliente"
2. Completa los campos:
   - **Nombre** (obligatorio)
   - Empresa (opcional)
   - Email (opcional)
   - Teléfono (opcional)
3. Esta información aparecerá en el PDF

---

## Visualización del Desglose

El panel inferior muestra automáticamente:

- **Precio base**: Cálculo según pies cuadrados y precio por pie²
- **Pastillas LED**: Si aplica, cantidad y costo
- **Transformadores**: Si aplica, cantidad y costo
- **Color personalizado**: Si está activado
- **Instalación**: Si está incluida
- **Subtotal**: Suma de todos los componentes
- **Descuento**: Si hay descuento aplicado
- **TOTAL**: Precio final en balboas (B/.)

---

## Guardar y Generar PDF

### Guardar Cotización
1. Haz clic en **"Guardar Cotización"**
2. Se guardará en el historial local (navegador)
3. Aparecerá un mensaje de confirmación

### Generar PDF
1. Haz clic en **"Generar PDF"**
2. Se descargará automáticamente un archivo PDF con:
   - Header profesional con colores corporativos
   - Número de cotización único
   - Fecha de emisión
   - Información del cliente (si se agregó)
   - Detalles del servicio completos
   - Desglose de precios
   - Notas adicionales
   - Avisos de componentes LED (si aplican)
   - Pie de página con validez de 30 días

---

## Gestión del Historial

### Ver Historial
1. Haz clic en **"Historial"** en el panel lateral
2. Se abrirá una ventana modal con todas tus cotizaciones

### Buscar Cotizaciones
- Usa el campo de búsqueda para filtrar por:
  - Tipo de servicio
  - Categoría
  - Nombre del cliente
  - Nombre de la empresa

### Ordenar
- **Por fecha**: Muestra las más recientes primero (predeterminado)
- **Por valor**: Muestra las de mayor valor primero

### Acciones en Cotizaciones Guardadas
- **Descargar PDF**: Genera el PDF de esa cotización
- **Eliminar**: Borra la cotización del historial (requiere confirmación)

### Estadísticas del Historial
- En la parte superior verás:
  - Número total de cotizaciones
  - Valor total de todas las cotizaciones

---

## Ejemplos Prácticos

### Ejemplo 1: Letras con Luz
**Solicitud**: Cliente quiere letras de acrílico con luz de 20 ft²

1. Seleccionar: **LETRAS FORMADAS**
2. Categoría: **ACRILICO CON LUZ DIRECTA**
3. Espesor: **4.5 MILIMETRO** (B/. 40.60/ft²)
4. Pies cuadrados: **20**
5. El sistema calcula:
   - Precio base: 20 × 40.60 = B/. 812.00
   - Pastillas LED: 20 unidades × 1.25 = B/. 25.00
   - Transformadores: 2 unidades × 34.95 = B/. 69.90
   - **TOTAL: B/. 906.90**

### Ejemplo 2: Letras Recortadas con Color
**Solicitud**: Letras de PVC espumoso de 15 ft² con color personalizado

1. Seleccionar: **LETRAS RECORTADAS**
2. Categoría: **PVC ESPUMOSO**
3. Espesor: **5 MILIMETRO** (B/. 19.00/ft²)
4. Pies cuadrados: **15**
5. Marcar: **Color personalizado**
6. El sistema calcula:
   - Precio base: 15 × 19.00 = B/. 285.00
   - Color personalizado: 15 × 2.00 = B/. 30.00
   - **TOTAL: B/. 315.00**

### Ejemplo 3: Con Descuento e Instalación
**Solicitud**: Vinil adhesivo de 30 ft² con instalación y 10% de descuento

1. Seleccionar: **IMPRESIÓN DIGITAL GRAN FORMATO**
2. Categoría: **VINIL ADHESIVO LISO**
3. Pies cuadrados: **30**
4. Marcar: **Incluir instalación**
5. Costo de instalación: **50**
6. Descuento: **10%**
7. El sistema calcula:
   - Precio base: 30 × 1.50 = B/. 45.00
   - Instalación: B/. 50.00
   - Subtotal: B/. 95.00
   - Descuento (10%): -B/. 9.50
   - **TOTAL: B/. 85.50**

---

## Consejos y Trucos

### Navegación Rápida
- Usa el buscador del panel lateral para encontrar servicios rápidamente
- Los servicios se actualizan en tiempo real mientras escribes

### Modo Oscuro
- Si trabajas de noche o en ambientes con poca luz, activa el modo oscuro
- Reduce la fatiga visual y ahorra batería en pantallas OLED

### Personalización de Precios
- Para cambiar precios: edita el archivo CSV en la carpeta `public/`
- Después de editar, recarga la página para ver los cambios

### Copiar Cotizaciones
- Si necesitas una cotización similar:
  1. Ve al historial
  2. Observa los detalles
  3. Crea una nueva con los mismos parámetros

### Respaldo de Datos
- Las cotizaciones se guardan en el navegador (localStorage)
- Para exportar: usa el botón de generar PDF
- **Nota**: Si borras los datos del navegador, perderás el historial

---

## Solución de Problemas

### El CSV no se carga
1. Verifica que el archivo `PRECIO X PIE2 DE LOS SERVICIOS.csv` esté en la carpeta `public/`
2. Recarga la página con Ctrl + F5 (Windows) o Cmd + Shift + R (Mac)

### Los precios no son correctos
- Verifica el archivo CSV
- Asegúrate de que los separadores sean punto y coma (;)
- Los números decimales deben usar coma o punto

### No aparece ningún servicio
- Revisa la consola del navegador (F12) para ver errores
- Verifica que el servidor esté corriendo en http://localhost:5173

### El PDF no se descarga
- Revisa que tu navegador permita descargas
- Algunos navegadores bloquean descargas automáticas; permite las descargas del sitio

---

## Atajos de Teclado

- **Tab**: Navegar entre campos
- **Enter**: En campos de texto avanza al siguiente
- **Esc**: Cierra modales (como el historial)
- **Ctrl/Cmd + F**: Buscar en el navegador

---

## Contacto y Soporte

Si encuentras algún problema o tienes sugerencias:
- Revisa el archivo README.md para información técnica
- Reporta bugs o solicita funcionalidades nuevas

---

**Última actualización**: Octubre 2024
**Versión**: 1.0.0
