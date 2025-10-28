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
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Calculadora de Servicios
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Cotización profesional
        </p>
      </div>

      <div className="p-4 space-y-2">
        <button
          onClick={onNewQuote}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm"
        >
          + Nueva Cotización
        </button>
        <button
          onClick={onViewHistory}
          className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200"
        >
          📋 Historial
        </button>
      </div>

      <div className="px-4 pb-4">
        <input
          type="text"
          placeholder="Buscar servicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-1">
          {filteredServices.map((serviceType) => (
            <button
              key={serviceType}
              onClick={() => onServiceSelect(serviceType)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedService === serviceType
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 font-medium shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{serviceType}</span>
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
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
