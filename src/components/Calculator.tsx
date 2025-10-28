import { useState, useEffect } from 'react';
import type { ServiceData, CalculatedQuote, ClientInfo } from '../types';
import {
  calculateServicePrice,
  applyDiscount,
  formatCurrency,
  hasLightService,
  isLetrasRecortadas,
} from '../utils/priceCalculator';

interface CalculatorProps {
  services: ServiceData[];
  serviceType: string;
  onSaveQuote: (quote: CalculatedQuote) => void;
  onGeneratePDF: (quote: CalculatedQuote) => void;
}

export const Calculator = ({
  services,
  serviceType,
  onSaveQuote,
  onGeneratePDF,
}: CalculatorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedThickness, setSelectedThickness] = useState<ServiceData | null>(null);
  const [squareFeet, setSquareFeet] = useState<number>(1.5);
  const [includeCustomColor, setIncludeCustomColor] = useState<boolean>(false);
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(false);
  const [installationCost, setInstallationCost] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [showClientForm, setShowClientForm] = useState<boolean>(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    company: '',
    email: '',
    phone: '',
  });

  // Group services by category
  const categories = Array.from(new Set(services.map((s) => s.categoria)));

  // Get thickness options for selected category
  const thicknessOptions = services.filter((s) => s.categoria === selectedCategory);

  // Reset selections when category changes
  useEffect(() => {
    if (selectedCategory && thicknessOptions.length > 0) {
      setSelectedThickness(thicknessOptions[0]);
    }
  }, [selectedCategory]);

  // Calculate price
  const calculation = selectedThickness
    ? calculateServicePrice(
        selectedThickness,
        squareFeet,
        includeCustomColor,
        includeInstallation,
        installationCost
      )
    : null;

  const totalAfterDiscount = calculation
    ? applyDiscount(calculation.total, discountPercent)
    : 0;

  const handleSaveQuote = () => {
    if (!calculation || !selectedThickness) return;

    const quote: CalculatedQuote = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      serviceType,
      category: selectedThickness.categoria,
      thickness: `${selectedThickness.espesor} ${selectedThickness.descripcionEspesor}`,
      squareFeet,
      basePrice: calculation.basePrice,
      thicknessPrice: calculation.thicknessPrice,
      subtotal: calculation.subtotal,
      ledCost: calculation.ledComponents?.totalLEDCost,
      transformerCost: calculation.ledComponents?.transformerCost,
      transformerQuantity: calculation.ledComponents?.transformerQuantity,
      customColorCost: calculation.customColorCost,
      installationCost: calculation.installationCost,
      discount: discountPercent,
      total: totalAfterDiscount,
      notes,
      clientInfo: clientInfo.name ? clientInfo : undefined,
    };

    onSaveQuote(quote);
    alert('Cotización guardada exitosamente!');
  };

  const handleGeneratePDF = () => {
    if (!calculation || !selectedThickness) return;

    const quote: CalculatedQuote = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      serviceType,
      category: selectedThickness.categoria,
      thickness: `${selectedThickness.espesor} ${selectedThickness.descripcionEspesor}`,
      squareFeet,
      basePrice: calculation.basePrice,
      thicknessPrice: calculation.thicknessPrice,
      subtotal: calculation.subtotal,
      ledCost: calculation.ledComponents?.totalLEDCost,
      transformerCost: calculation.ledComponents?.transformerCost,
      transformerQuantity: calculation.ledComponents?.transformerQuantity,
      customColorCost: calculation.customColorCost,
      installationCost: calculation.installationCost,
      discount: discountPercent,
      total: totalAfterDiscount,
      notes,
      clientInfo: clientInfo.name ? clientInfo : undefined,
    };

    onGeneratePDF(quote);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-8 animate-fade-in border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-500 to-purple-500">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {serviceType}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure los detalles de su cotización</p>
            </div>
            <button
              onClick={() => setShowClientForm(!showClientForm)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {showClientForm ? '👤 Ocultar Cliente' : '👤 Agregar Cliente'}
            </button>
          </div>

          {showClientForm && (
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl space-y-4 animate-slide-in shadow-inner border-2 border-blue-100 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>📝</span> Información del Cliente
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre del cliente *"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white transition-all shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Empresa"
                  value={clientInfo.company}
                  onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white transition-all shadow-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white transition-all shadow-sm"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Category Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl shadow-md border-2 border-blue-100 dark:border-gray-600">
              <label className="block text-base font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-xl">🏷️</span>
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white font-medium text-lg shadow-sm transition-all cursor-pointer hover:border-blue-400"
              >
                <option value="">✨ Seleccione una categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Thickness Selection */}
            {selectedCategory && thicknessOptions.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl shadow-md border-2 border-purple-100 dark:border-gray-600">
                <label className="block text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">📏</span>
                  Espesor / Tipo
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {thicknessOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedThickness(option)}
                      className={`p-5 border-3 rounded-xl text-left transition-all duration-200 transform hover:scale-105 ${
                        selectedThickness === option
                          ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-xl scale-105'
                          : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 hover:border-blue-400 hover:shadow-lg'
                      }`}
                    >
                      <div className={`font-bold text-base mb-1 ${
                        selectedThickness === option ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                        {option.espesor} {option.descripcionEspesor}
                      </div>
                      <div className={`text-sm font-semibold ${
                        selectedThickness === option ? 'text-white/90' : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {formatCurrency(option.precioTotalXPie2)}/ft²
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Square Feet Input */}
            {selectedThickness && (
              <>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl shadow-md border-2 border-green-100 dark:border-gray-600">
                  <label className="block text-base font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">📐</span>
                    Pies Cuadrados (ft²)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={squareFeet}
                      onChange={(e) => setSquareFeet(parseFloat(e.target.value) || 0)}
                      className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white text-2xl font-bold shadow-sm transition-all"
                    />
                    <span className="absolute right-5 top-4 text-gray-400 text-lg font-medium">ft²</span>
                  </div>
                  {selectedThickness.tamanoMinimo && squareFeet < selectedThickness.tamanoMinimo && (
                    <div className="mt-3 p-3 bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
                        <span>⚠️</span>
                        Tamaño mínimo requerido: {selectedThickness.tamanoMinimo} ft²
                      </p>
                    </div>
                  )}
                </div>

                {/* LED Components Notice */}
                {hasLightService(selectedThickness.categoria) && (
                  <div className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 border-2 border-blue-300 dark:border-blue-700 rounded-2xl shadow-lg">
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-3 text-lg flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      Incluye componentes LED:
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2 ml-8">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Pastillas LED: <strong>B/. 1.25</strong> c/u
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Transformador: <strong>B/. 34.95</strong> (rinde 15 ft²)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Sin base ACM
                      </li>
                    </ul>
                  </div>
                )}

                {/* Custom Color Option for Letras Recortadas */}
                {isLetrasRecortadas(serviceType) && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="customColor"
                      checked={includeCustomColor}
                      onChange={(e) => setIncludeCustomColor(e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <label
                      htmlFor="customColor"
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      Agregar color personalizado (+B/. 2.00/ft²)
                    </label>
                  </div>
                )}

                {/* Installation Option */}
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="installation"
                      checked={includeInstallation}
                      onChange={(e) => setIncludeInstallation(e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <label
                      htmlFor="installation"
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      Incluir instalación
                    </label>
                  </div>
                  {includeInstallation && (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={installationCost}
                      onChange={(e) => setInstallationCost(parseFloat(e.target.value) || 0)}
                      placeholder="Costo de instalación"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  )}
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notas adicionales
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Observaciones, detalles especiales..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        {calculation && selectedThickness && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Desglose de Precio
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Precio base ({squareFeet} ft²)</span>
                <span>{formatCurrency(calculation.subtotal)}</span>
              </div>

              {calculation.ledComponents && (
                <>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>
                      Pastillas LED ({calculation.ledComponents.ledPastillas} unidades)
                    </span>
                    <span>
                      {formatCurrency(
                        calculation.ledComponents.ledPastillas *
                          calculation.ledComponents.ledCostPerUnit
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>
                      Transformadores ({calculation.ledComponents.transformerQuantity} unidades)
                    </span>
                    <span>
                      {formatCurrency(
                        calculation.ledComponents.transformerQuantity *
                          calculation.ledComponents.transformerCost
                      )}
                    </span>
                  </div>
                </>
              )}

              {calculation.customColorCost && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Color personalizado</span>
                  <span>{formatCurrency(calculation.customColorCost)}</span>
                </div>
              )}

              {calculation.installationCost && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Instalación</span>
                  <span>{formatCurrency(calculation.installationCost)}</span>
                </div>
              )}

              {calculation.minimumApplied && (
                <div className="text-sm text-amber-600 dark:text-amber-400 italic">
                  * Se aplicó precio mínimo
                </div>
              )}

              {selectedThickness.condicionales && selectedThickness.condicionales !== 'N/A' && (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic pt-2">
                  Condición: {selectedThickness.condicionales}
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between text-lg font-medium text-gray-900 dark:text-white">
                  <span>Subtotal</span>
                  <span>{formatCurrency(calculation.total)}</span>
                </div>
              </div>

              {discountPercent > 0 && (
                <>
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Descuento ({discountPercent}%)</span>
                    <span>-{formatCurrency(calculation.total - totalAfterDiscount)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-2xl font-bold text-primary-600 dark:text-primary-400">
                      <span>Total</span>
                      <span>{formatCurrency(totalAfterDiscount)}</span>
                    </div>
                  </div>
                </>
              )}

              {discountPercent === 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-2xl font-bold text-primary-600 dark:text-primary-400">
                    <span>Total</span>
                    <span>{formatCurrency(calculation.total)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSaveQuote}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>Guardar Cotización</span>
              </button>
              <button
                onClick={handleGeneratePDF}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <span>📄</span>
                <span>Generar PDF</span>
              </button>
            </div>
          </div>
        )}

        {!selectedCategory && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl p-16 text-center border-2 border-gray-100 dark:border-gray-600">
            <div className="text-8xl mb-6 animate-bounce">📊</div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Seleccione una categoría para comenzar
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Elija el tipo de servicio y comience a calcular el precio de forma profesional
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
