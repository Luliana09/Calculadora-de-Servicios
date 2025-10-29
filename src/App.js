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
  const [aplicarITBMS, setAplicarITBMS] = useState(false);

  // Estados para el conversor de unidades
  const [unidadMedida, setUnidadMedida] = useState('cm');
  const [ancho, setAncho] = useState('');
  const [alto, setAlto] = useState('');

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

  // Función para calcular pies cuadrados desde ancho y alto
  const calcularPiesCuadrados = () => {
    if (!ancho || !alto) return;

    const anchoNum = parseFloat(ancho);
    const altoNum = parseFloat(alto);

    if (isNaN(anchoNum) || isNaN(altoNum) || anchoNum <= 0 || altoNum <= 0) {
      alert('Por favor ingrese valores válidos de ancho y alto');
      return;
    }

    let areaEnPies2 = 0;

    switch (unidadMedida) {
      case 'cm':
        // Convertir cm² a ft²: 1 ft² = 929.0304 cm²
        areaEnPies2 = (anchoNum * altoNum) / 929.0304;
        break;
      case 'in':
        // Convertir in² a ft²: 1 ft² = 144 in²
        areaEnPies2 = (anchoNum * altoNum) / 144;
        break;
      case 'ft':
        // Ya está en pies
        areaEnPies2 = anchoNum * altoNum;
        break;
      case 'm':
        // Convertir m² a ft²: 1 m² = 10.7639 ft²
        areaEnPies2 = (anchoNum * altoNum) * 10.7639;
        break;
      default:
        break;
    }

    setPies2(areaEnPies2.toFixed(2));
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

    const precioBase = parsePrecio(servicioSeleccionado['PRECIO BASE']);
    const precioPorPie = parsePrecio(servicioSeleccionado['PRECIO X PIE2']);
    const condicionales = servicioSeleccionado['CONDICIONALES '] || servicioSeleccionado['CONDICIONALES'] || '';
    const tamanoMinimo = parseFloat(servicioSeleccionado['TAMAÑO MINIMO EN PIE2']) || 0;
    const conLuz = servicioSeleccionado['CON LUZ'] === 'SI';

    let detalles = {
      servicio: `${tipoSeleccionado} - ${categoriaSeleccionada}`,
      espesor: servicioSeleccionado['ESPESOR EN MILIMETROS'],
      pies2: pies,
      precioBase: precioBase,
      precioPorPie2: precioPorPie,
      subtotal: 0,
      costoLED: 0,
      costoTransformador: 0,
      cantidadTransformadores: 0,
      costoColorPersonalizado: 0,
      subtotalSinITBMS: 0,
      itbms: 0,
      total: 0
    };

    // Calcular subtotal base: (precio base * pies) + (precio por pie * pies)
    let subtotal = (precioBase * pies) + (precioPorPie * pies);

    // Aplicar condicionales del CSV de forma dinámica
    if (condicionales && condicionales.trim() !== 'N/A') {
      // Patrón para "SI AREA TOTAL DE PIES2 ≤ A X PIE2 REDONDIAR EL TOTAL DEL CALCULO Y"
      // O "SI EL AREA TOTAL DE IMPRESIÓN ES ≤ A X PIE2 REDONDIAR EL TOTAL DE CALCULO A Y"
      const redondeoMatch = condicionales.match(/≤ A ([\d,.]+) PIE2?\s+REDONDIAR\s+EL TOTAL\s+(?:DEL|DE)\s+CALCULO\s+(?:A\s+)?([\d,.]+)/i);
      if (redondeoMatch) {
        const limite = parseFloat(redondeoMatch[1].replace(',', '.'));
        const valorRedondeo = parseFloat(redondeoMatch[2].replace(',', '.'));
        if (pies <= limite) {
          subtotal = valorRedondeo;
        }
      }

      // Patrón para "SI AREA TOTAL >= X PIES CUADRADOS USAR UN GROSOR DE Y MM"
      const grosorRecomendadoMatch = condicionales.match(/≥ ([\d,.]+)\s*PIES CUADRADOS USAR UN GROSOR DE ([\d,.]+)\s*MM/i);
      if (grosorRecomendadoMatch) {
        const limite = parseFloat(grosorRecomendadoMatch[1].replace(',', '.'));
        const grosorRecomendado = grosorRecomendadoMatch[2];
        if (pies >= limite) {
          detalles.grosorRecomendado = `Se recomienda usar grosor de ${grosorRecomendado}mm para esta cantidad de pies cuadrados`;
        }
      }
    }

    // Validar tamaño mínimo
    if (tamanoMinimo > 0 && pies < tamanoMinimo) {
      alert(`El tamaño mínimo para este servicio es ${tamanoMinimo} pie²`);
      return;
    }

    detalles.subtotal = subtotal;

    // Lógica para servicios CON LUZ (usando la columna CON LUZ del CSV)
    if (conLuz) {
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

    // Calcular subtotal sin ITBMS (suma de todos los costos)
    detalles.subtotalSinITBMS = detalles.subtotal + detalles.costoLED + detalles.costoTransformador + detalles.costoColorPersonalizado;

    // Calcular ITBMS (7% del subtotal sin ITBMS) solo si está activado
    detalles.itbms = aplicarITBMS ? detalles.subtotalSinITBMS * 0.07 : 0;

    // Calcular total final (subtotal sin ITBMS + ITBMS)
    detalles.total = detalles.subtotalSinITBMS + detalles.itbms;

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

    rows.push([aplicarITBMS ? 'Subtotal sin ITBMS' : 'Subtotal', `B/. ${desglose.subtotalSinITBMS.toFixed(2)}`]);

    if (aplicarITBMS) {
      rows.push(['ITBMS (7%)', `B/. ${desglose.itbms.toFixed(2)}`]);
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
                {opcionesEspesor.map((opcion, idx) => (
                  <option key={idx} value={idx}>
                    {opcion['ESPESOR EN MILIMETROS']} {opcion['MILIMETRO(MM) MAS FUERTE']}
                  </option>
                ))}
              </select>
            </div>
          )}

          {servicioSeleccionado && (
            <>
              {(() => {
                const cond = servicioSeleccionado['CONDICIONALES '] || servicioSeleccionado['CONDICIONALES'] || '';
                if (!cond || cond.trim() === 'N/A') return null;

                // Simplificar el texto de las condicionales
                let textoSimplificado = '';

                // Condicional combinada: redondeo + grosor recomendado
                if (cond.includes('SI AREA TOTAL DE PIES2 ≤ A 3 PIE2 REDONDIAR EL TOTAL DEL CALCULO') &&
                    cond.includes('SI AREA TOTAL >= 3PIES CUADRADOS USAR UN GROSOR DE 4,5MM')) {
                  textoSimplificado = '• Si el área es menor o igual a 3 pie², el total se redondeará a B/. 50.00\n• Si el área es mayor o igual a 3 pie², se recomienda usar el grosor de 4.5 MM';
                }
                // Solo redondeo a 50.00
                else if (cond.includes('SI AREA TOTAL DE PIES2 ≤ A 3 PIE2 REDONDIAR EL TOTAL DEL CALCULO')) {
                  textoSimplificado = 'Si el área es menor o igual a 3 pie², el total se redondeará a B/. 50.00';
                }
                // Solo grosor recomendado
                else if (cond.includes('SI AREA TOTAL >= 3PIES CUADRADOS USAR UN GROSOR DE 4,5MM')) {
                  textoSimplificado = 'Si el área es mayor o igual a 3 pie², se recomienda usar el grosor de 4.5 MM';
                }
                // Redondeo a 5.00 para impresiones
                else if (cond.includes('SI EL AREA TOTAL DE IMPRESIÓN ES ≤ A 1,5 PIE2 REDONDIAR EL TOTAL DE CALCULO A 5,00')) {
                  textoSimplificado = 'Si el área es menor o igual a 1.5 pie², el total se redondeará a B/. 5.00';
                }
                else {
                  textoSimplificado = cond;
                }

                return (
                  <div className="alert-info" style={{marginTop: '15px'}}>
                    <h3>Nota Importante</h3>
                    <p style={{whiteSpace: 'pre-line'}}>{textoSimplificado}</p>
                  </div>
                );
              })()}

              <div className="conversor-unidades">
                <h3>Ingrese las medidas para obtener el costo:</h3>

                <div className="unidades-selector">
                  <label>Unidad de Medida:</label>
                  <div className="unidades-botones">
                    <button
                      type="button"
                      className={`btn-unidad ${unidadMedida === 'cm' ? 'active' : ''}`}
                      onClick={() => setUnidadMedida('cm')}
                    >
                      Centímetros (cm)
                    </button>
                    <button
                      type="button"
                      className={`btn-unidad ${unidadMedida === 'in' ? 'active' : ''}`}
                      onClick={() => setUnidadMedida('in')}
                    >
                      Pulgadas (in)
                    </button>
                    <button
                      type="button"
                      className={`btn-unidad ${unidadMedida === 'ft' ? 'active' : ''}`}
                      onClick={() => setUnidadMedida('ft')}
                    >
                      Pies (ft)
                    </button>
                    <button
                      type="button"
                      className={`btn-unidad ${unidadMedida === 'm' ? 'active' : ''}`}
                      onClick={() => setUnidadMedida('m')}
                    >
                      Metros (m)
                    </button>
                  </div>
                </div>

                <div className="medidas-inputs">
                  <div className="form-group">
                    <label>Ancho:</label>
                    <div className="input-con-unidad">
                      <input
                        type="number"
                        value={ancho}
                        onChange={(e) => setAncho(e.target.value)}
                        className="form-control"
                        placeholder={`Ej: 120`}
                        step="0.01"
                        min="0"
                      />
                      <span className="unidad-label">{unidadMedida}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Alto:</label>
                    <div className="input-con-unidad">
                      <input
                        type="number"
                        value={alto}
                        onChange={(e) => setAlto(e.target.value)}
                        className="form-control"
                        placeholder={`Ej: 80`}
                        step="0.01"
                        min="0"
                      />
                      <span className="unidad-label">{unidadMedida}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={calcularPiesCuadrados}
                  className="btn-calcular-area"
                >
                  Calcular Área en Pies²
                </button>
              </div>

              <div className="form-group">
                <label>Pies Cuadrados (ft²):</label>
                <input
                  type="number"
                  value={pies2}
                  onChange={(e) => setPies2(e.target.value)}
                  className="form-control"
                  placeholder="Se calculará automáticamente o ingrese directamente"
                  step="0.01"
                  min="0"
                />
              </div>

              {servicioSeleccionado['CON LUZ'] === 'SI' && (
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

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={aplicarITBMS}
                    onChange={(e) => setAplicarITBMS(e.target.checked)}
                  />
                  Aplicar ITBMS (7%)
                </label>
              </div>

              <button onClick={calcularPrecio} className="btn-primary">
                Calcular Precio
              </button>
            </>
          )}
        </div>

        {desglose && (
          <div className="resultado-section" id="resultado-impresion">
            <h2>Resumen de Cotización</h2>

            {desglose.grosorRecomendado && (
              <div className="alert-info" style={{marginBottom: '20px'}}>
                <h3>Recomendación</h3>
                <p>{desglose.grosorRecomendado}</p>
              </div>
            )}

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
                <span className="label">Precio Base:</span>
                <span className="value">B/. {desglose.precioBase.toFixed(2)}</span>
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

              <div className="desglose-row subtotal">
                <span className="label">Subtotal{aplicarITBMS ? ' sin ITBMS' : ''}:</span>
                <span className="value">B/. {desglose.subtotalSinITBMS.toFixed(2)}</span>
              </div>

              {aplicarITBMS && (
                <div className="desglose-row">
                  <span className="label">ITBMS (7%):</span>
                  <span className="value">B/. {desglose.itbms.toFixed(2)}</span>
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
