import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';

function App() {
  const [servicios, setServicios] = useState([]);
  const [tiposServicio, setTiposServicio] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [opcionesEspesor, setOpcionesEspesor] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [pies2, setPies2] = useState('');
  const [cantidadLED, setCantidadLED] = useState('');
  const [colorPersonalizado, setColorPersonalizado] = useState(false);
  const [desglose, setDesglose] = useState(null);

  // Cargar datos del CSV
  useEffect(() => {
    fetch('/servicios.csv')
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          complete: (results) => {
            const serviciosLimpios = results.data.filter(s => s['TIPO DE SERVICIO']);
            setServicios(serviciosLimpios);

            // Extraer tipos de servicio únicos
            const tipos = [...new Set(serviciosLimpios.map(s => s['TIPO DE SERVICIO']))];
            setTiposServicio(tipos);
          }
        });
      });
  }, []);

  // Actualizar categorías cuando cambia el tipo de servicio
  useEffect(() => {
    if (tipoSeleccionado) {
      const cats = [...new Set(
        servicios
          .filter(s => s['TIPO DE SERVICIO'] === tipoSeleccionado)
          .map(s => s.CATEGORIA)
      )];
      setCategorias(cats);
      setCategoriaSeleccionada('');
      setOpcionesEspesor([]);
      setServicioSeleccionado(null);
    }
  }, [tipoSeleccionado, servicios]);

  // Actualizar opciones de espesor cuando cambia la categoría
  useEffect(() => {
    if (categoriaSeleccionada) {
      const opciones = servicios.filter(
        s => s['TIPO DE SERVICIO'] === tipoSeleccionado && s.CATEGORIA === categoriaSeleccionada
      );
      setOpcionesEspesor(opciones);

      // Si solo hay una opción, seleccionarla automáticamente
      if (opciones.length === 1) {
        setServicioSeleccionado(opciones[0]);
      } else {
        setServicioSeleccionado(null);
      }
    }
  }, [categoriaSeleccionada, tipoSeleccionado, servicios]);

  // Función para convertir precio de string a número
  const parsePrecio = (precioStr) => {
    if (!precioStr) return 0;
    return parseFloat(precioStr.replace(/\$/g, '').replace(/,/g, '.').trim());
  };

  // Calcular precio
  const calcularPrecio = () => {
    if (!servicioSeleccionado || !pies2) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const pies = parseFloat(pies2);
    if (isNaN(pies) || pies <= 0) {
      alert('Por favor ingrese un valor válido de pies cuadrados');
      return;
    }

    const precioTotalPorPie = parsePrecio(servicioSeleccionado['PRECIO TOTAL X PIE2']);
    const condicionales = servicioSeleccionado.CONDICIONALES || '';
    const tamanoMinimo = parseFloat(servicioSeleccionado['TAMAÑO MINIMO EN PIE2']) || 0;

    let detalles = {
      servicio: `${tipoSeleccionado} - ${categoriaSeleccionada}`,
      espesor: servicioSeleccionado['ESPESOR EN MILIMETROS'],
      pies2: pies,
      precioPorPie2: precioTotalPorPie,
      subtotal: 0,
      costoLED: 0,
      costoTransformador: 0,
      cantidadTransformadores: 0,
      costoColorPersonalizado: 0,
      total: 0
    };

    // Calcular subtotal base
    let subtotal = pies * precioTotalPorPie;

    // Aplicar condicionales del CSV de forma dinámica
    if (condicionales && condicionales.trim() !== 'N/A') {
      // Patrón para "SI ES ≤ A X PIE2 REDONDIAR A Y"
      const redondeoMenorMatch = condicionales.match(/SI ES ≤ A ([\d,.]+) PIE2? REDONDIAR A ([\d,.]+)/i);
      if (redondeoMenorMatch) {
        const limite = parseFloat(redondeoMenorMatch[1].replace(',', '.'));
        const valorRedondeo = parseFloat(redondeoMenorMatch[2].replace(',', '.'));
        if (pies <= limite) {
          subtotal = valorRedondeo;
        }
      }

      // Patrón para "SI ES ≥ A X PIE2 REDONDIAR A Y" (por si existe)
      const redondeoMayorMatch = condicionales.match(/SI ES ≥ A ([\d,.]+) PIE2? REDONDIAR A ([\d,.]+)/i);
      if (redondeoMayorMatch) {
        const limite = parseFloat(redondeoMayorMatch[1].replace(',', '.'));
        const valorRedondeo = parseFloat(redondeoMayorMatch[2].replace(',', '.'));
        if (pies >= limite) {
          subtotal = valorRedondeo;
        }
      }
    }

    // Validar tamaño mínimo
    if (tamanoMinimo > 0 && pies < tamanoMinimo) {
      alert(`El tamaño mínimo para este servicio es ${tamanoMinimo} pie²`);
      return;
    }

    detalles.subtotal = subtotal;

    // Lógica para servicios CON LUZ
    if (categoriaSeleccionada.includes('CON LUZ')) {
      const precioPastillaLED = 1.25;
      const precioTransformador = 34.95;
      const rendimientoTransformador = 15; // ft² por transformador

      // Calcular cantidad de transformadores necesarios (redondear hacia arriba)
      const cantidadTransformadores = Math.ceil(pies / rendimientoTransformador);
      detalles.cantidadTransformadores = cantidadTransformadores;
      detalles.costoTransformador = cantidadTransformadores * precioTransformador;

      // Costo de LEDs (cantidad ingresada por el usuario)
      if (cantidadLED && parseFloat(cantidadLED) > 0) {
        detalles.costoLED = parseFloat(cantidadLED) * precioPastillaLED;
      }
    }

    // Lógica para letras recortadas con color personalizado
    if (tipoSeleccionado === 'LETRAS RECORTADAS' && colorPersonalizado) {
      detalles.costoColorPersonalizado = pies * 2.00;
    }

    // Calcular total
    detalles.total = detalles.subtotal + detalles.costoLED + detalles.costoTransformador + detalles.costoColorPersonalizado;

    setDesglose(detalles);
  };

  // Generar PDF
  const generarPDF = () => {
    if (!desglose) {
      alert('Primero debe calcular el precio');
      return;
    }

    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.text('Cotización de Servicio', 105, 20, { align: 'center' });

    // Fecha
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);

    // Información del servicio
    doc.setFontSize(12);
    doc.text('Detalles del Servicio:', 20, 45);

    const rows = [
      ['Tipo de Servicio', desglose.servicio],
      ['Espesor', desglose.espesor],
      ['Pies Cuadrados', desglose.pies2.toString()],
      ['Precio por Pie²', `B/. ${desglose.precioPorPie2.toFixed(2)}`],
      ['Subtotal', `B/. ${desglose.subtotal.toFixed(2)}`]
    ];

    if (desglose.costoLED > 0) {
      rows.push(['Costo Pastillas LED', `B/. ${desglose.costoLED.toFixed(2)}`]);
    }

    if (desglose.costoTransformador > 0) {
      rows.push([
        `Transformadores (${desglose.cantidadTransformadores})`,
        `B/. ${desglose.costoTransformador.toFixed(2)}`
      ]);
    }

    if (desglose.costoColorPersonalizado > 0) {
      rows.push(['Color Personalizado', `B/. ${desglose.costoColorPersonalizado.toFixed(2)}`]);
    }

    rows.push(['TOTAL', `B/. ${desglose.total.toFixed(2)}`]);

    autoTable(doc, {
      startY: 50,
      head: [['Concepto', 'Valor']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      footStyles: { fillColor: [41, 128, 185], fontStyle: 'bold' }
    });

    // Notas adicionales
    if (desglose.costoTransformador > 0) {
      const finalY = doc.lastAutoTable.finalY;
      doc.setFontSize(10);
      doc.text('Nota: Incluye pastillas LED (B/. 1.25 c/u) + transformador (B/. 34.95, rinde 15 ft²), sin base ACM.', 20, finalY + 15, { maxWidth: 170 });
    }

    doc.save('cotizacion.pdf');
  };

  // Función para imprimir
  const imprimirCotizacion = () => {
    window.print();
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Calculadora de Cotizaciones</h1>

        <div className="form-section">
          <div className="form-group">
            <label>Tipo de Servicio:</label>
            <select
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
              className="form-control"
            >
              <option value="">Seleccione un tipo de servicio</option>
              {tiposServicio.map((tipo, idx) => (
                <option key={idx} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {tipoSeleccionado && (
            <div className="form-group">
              <label>Categoría:</label>
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="form-control"
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {opcionesEspesor.length > 1 && (
            <div className="form-group">
              <label>Espesor/Opción:</label>
              <select
                value={servicioSeleccionado ? servicios.indexOf(servicioSeleccionado) : ''}
                onChange={(e) => setServicioSeleccionado(opcionesEspesor[e.target.value])}
                className="form-control"
              >
                <option value="">Seleccione una opción</option>
                {opcionesEspesor.map((opcion, idx) => {
                  const condicional = opcion.CONDICIONALES && opcion.CONDICIONALES.trim() !== 'N/A'
                    ? ` - ${opcion.CONDICIONALES}`
                    : '';
                  return (
                    <option key={idx} value={idx}>
                      {opcion['ESPESOR EN MILIMETROS']} {opcion['MILIMETRO(MM) MAS FUERTE']}{condicional}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {servicioSeleccionado && (
            <>
              {servicioSeleccionado.CONDICIONALES &&
               servicioSeleccionado.CONDICIONALES.trim() !== 'N/A' && (
                <div className="alert-info" style={{marginTop: '15px'}}>
                  <h3>Nota Importante</h3>
                  <p>{servicioSeleccionado.CONDICIONALES}</p>
                </div>
              )}

              <div className="form-group">
                <label>Pies Cuadrados (ft²):</label>
                <input
                  type="number"
                  value={pies2}
                  onChange={(e) => setPies2(e.target.value)}
                  className="form-control"
                  placeholder="Ingrese los pies cuadrados"
                  step="0.01"
                  min="0"
                />
              </div>

              {categoriaSeleccionada.includes('CON LUZ') && (
                <div className="alert-info">
                  <h3>Información de Iluminación</h3>
                  <p>Incluye pastillas LED (B/. 1.25 c/u) + transformador (B/. 34.95, rinde 15 ft²), sin base ACM.</p>
                  <div className="form-group">
                    <label>Cantidad de Pastillas LED:</label>
                    <input
                      type="number"
                      value={cantidadLED}
                      onChange={(e) => setCantidadLED(e.target.value)}
                      className="form-control"
                      placeholder="Ingrese cantidad de LEDs"
                      min="0"
                    />
                  </div>
                </div>
              )}

              {tipoSeleccionado === 'LETRAS RECORTADAS' && (
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={colorPersonalizado}
                      onChange={(e) => setColorPersonalizado(e.target.checked)}
                    />
                    Color Personalizado (+B/. 2.00 por ft²)
                  </label>
                </div>
              )}

              <button onClick={calcularPrecio} className="btn-primary">
                Calcular Precio
              </button>
            </>
          )}
        </div>

        {desglose && (
          <div className="resultado-section" id="resultado-impresion">
            <h2>Resumen de Cotización</h2>
            <div className="desglose">
              <div className="desglose-row">
                <span className="label">Servicio:</span>
                <span className="value">{desglose.servicio}</span>
              </div>
              <div className="desglose-row">
                <span className="label">Espesor:</span>
                <span className="value">{desglose.espesor}</span>
              </div>
              <div className="desglose-row">
                <span className="label">Pies Cuadrados:</span>
                <span className="value">{desglose.pies2} ft²</span>
              </div>
              <div className="desglose-row">
                <span className="label">Precio por Pie²:</span>
                <span className="value">B/. {desglose.precioPorPie2.toFixed(2)}</span>
              </div>
              <div className="desglose-row subtotal">
                <span className="label">Subtotal:</span>
                <span className="value">B/. {desglose.subtotal.toFixed(2)}</span>
              </div>

              {desglose.costoLED > 0 && (
                <div className="desglose-row">
                  <span className="label">Costo Pastillas LED:</span>
                  <span className="value">B/. {desglose.costoLED.toFixed(2)}</span>
                </div>
              )}

              {desglose.costoTransformador > 0 && (
                <div className="desglose-row">
                  <span className="label">Transformadores ({desglose.cantidadTransformadores}):</span>
                  <span className="value">B/. {desglose.costoTransformador.toFixed(2)}</span>
                </div>
              )}

              {desglose.costoColorPersonalizado > 0 && (
                <div className="desglose-row">
                  <span className="label">Color Personalizado:</span>
                  <span className="value">B/. {desglose.costoColorPersonalizado.toFixed(2)}</span>
                </div>
              )}

              <div className="desglose-row total">
                <span className="label">TOTAL:</span>
                <span className="value">B/. {desglose.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="botones-accion">
              <button onClick={generarPDF} className="btn-secondary">
                Exportar a PDF
              </button>
              <button onClick={imprimirCotizacion} className="btn-secondary">
                Imprimir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
