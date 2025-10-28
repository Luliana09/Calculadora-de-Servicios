import { useState } from 'react';
import type { ServiceData } from '../types';

interface SidebarProps {
  servicesByType: Record<string, ServiceData[]>;
  selectedService: string | null;
  onServiceSelect: (serviceType: string) => void;
  onNewQuote: () => void;
  onViewHistory: () => void;
}

export const Sidebar = ({
  servicesByType,
  selectedService,
  onServiceSelect,
  onNewQuote,
  onViewHistory,
}: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = Object.keys(servicesByType).filter((type) =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen shadow-xl">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Calculadora de Servicios
            </h1>
            <p className="text-sm text-blue-100">
              Cotización profesional
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <button
          onClick={onNewQuote}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Nueva Cotización</span>
        </button>
        <button
          onClick={onViewHistory}
          className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center gap-2"
        >
          <span>📋</span>
          <span>Historial</span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm"
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="space-y-2">
          {filteredServices.map((serviceType) => (
            <button
              key={serviceType}
              onClick={() => onServiceSelect(serviceType)}
              className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 transform ${
                selectedService === serviceType
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md hover:scale-102 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{serviceType}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  selectedService === serviceType
                    ? 'bg-white/30 text-white'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                }`}>
                  {servicesByType[serviceType].length}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>No se encontraron servicios</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <p>Total de servicios: {Object.keys(servicesByType).length}</p>
      </div>
    </div>
  );
};
