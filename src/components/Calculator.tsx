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
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {serviceType}
            </h2>
            <button
              onClick={() => setShowClientForm(!showClientForm)}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
            >
              {showClientForm ? 'Ocultar' : 'Agregar'} datos del cliente
            </button>
          </div>

          {showClientForm && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3 animate-slide-in">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre del cliente *"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Empresa"
                  value={clientInfo.company}
                  onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
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

          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Thickness Selection */}
            {selectedCategory && thicknessOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Espesor / Tipo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {thicknessOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedThickness(option)}
                      className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                        selectedThickness === option
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.espesor} {option.descripcionEspesor}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pies Cuadrados (ft²)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={squareFeet}
                    onChange={(e) => setSquareFeet(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                  />
                  {selectedThickness.tamanoMinimo && squareFeet < selectedThickness.tamanoMinimo && (
                    <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                      ⚠ Tamaño mínimo: {selectedThickness.tamanoMinimo} ft²
                    </p>
                  )}
                </div>

                {/* LED Components Notice */}
                {hasLightService(selectedThickness.categoria) && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                      Incluye componentes LED:
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• Pastillas LED: B/. 1.25 c/u</li>
                      <li>• Transformador: B/. 34.95 (rinde 15 ft²)</li>
                      <li>• Sin base ACM</li>
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

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleSaveQuote}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                Guardar Cotización
              </button>
              <button
                onClick={handleGeneratePDF}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                Generar PDF
              </button>
            </div>
          </div>
        )}

        {!selectedCategory && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Seleccione una categoría para comenzar
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Elija el tipo de servicio y comience a calcular el precio
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
