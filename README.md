# Calculadora de Cotizaciones - Servicios de Rotulación

Aplicación web desarrollada en React para calcular precios de servicios de rotulación basados en un archivo CSV.

## Características Principales

### 1. Cálculo Dinámico de Precios
- Carga automática de servicios desde archivo CSV
- Selección por tipo de servicio, categoría y espesor
- Cálculo automático basado en pies cuadrados (ft²)
- Aplicación automática de condiciones especiales

### 2. Lógica Especial para Servicios con Luz
Para servicios que incluyen "CON LUZ":
- Cálculo automático de transformadores necesarios (1 por cada 15 ft²)
- Precio transformador: B/. 34.95
- Pastillas LED: B/. 1.25 c/u
- El sistema redondea hacia arriba la cantidad de transformadores

### 3. Opción de Color Personalizado
Para "LETRAS RECORTADAS":
- Opción adicional de color personalizado
- Costo adicional: B/. 2.00 por pie²
- Se suma automáticamente al total

### 4. Condiciones del CSV
El sistema reconoce y aplica automáticamente:
- Redondeo a B/. 50.00 si es ≤ 3 pie²
- Redondeo a B/. 5.00 si es ≤ 1.5 pie²
- Validación de tamaño mínimo

### 5. Exportación y Impresión
- Exportar cotización a PDF
- Imprimir directamente desde el navegador
- Diseño optimizado para impresión

## Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar la aplicación:
```bash
npm start
```

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

## Ejemplo de Uso

1. Seleccione el tipo de servicio (ej: LETRAS FORMADAS)
2. Seleccione la categoría (ej: ACRILICO CON LUZ DIRECTA)
3. Si hay múltiples opciones de espesor, seleccione una
4. Ingrese la cantidad de pies cuadrados
5. Para servicios con luz, ingrese la cantidad de pastillas LED
6. Para letras recortadas, active la opción de color personalizado si es necesario
7. Haga clic en "Calcular Precio"
8. Revise el desglose detallado
9. Exporte a PDF o imprima según necesite

## Ejemplo de Cálculo

**Servicio:** Letras Formadas - ACRILICO CON LUZ DIRECTA
**Pies Cuadrados:** 20 ft²
**Precio por Pie²:** B/. 40.60

**Cálculo:**
- Subtotal: 20 × 40.60 = B/. 812.00
- Pastillas LED: (cantidad ingresada) × 1.25
- Transformadores: ceil(20 / 15) = 2 × 34.95 = B/. 69.90
- **Total:** B/. 812.00 + LED + B/. 69.90

## Comandos Disponibles

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
