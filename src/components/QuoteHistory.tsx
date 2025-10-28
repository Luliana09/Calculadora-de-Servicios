import { useState } from 'react';
import type { CalculatedQuote } from '../types';
import { formatCurrency } from '../utils/priceCalculator';
import { X, Search, Download, Trash2 } from 'lucide-react';

interface QuoteHistoryProps {
  quotes: CalculatedQuote[];
  onClose: () => void;
  onDeleteQuote: (id: string) => void;
  onGeneratePDF: (quote: CalculatedQuote) => void;
}

export const QuoteHistory = ({
  quotes,
  onClose,
  onDeleteQuote,
  onGeneratePDF,
}: QuoteHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');

  const filteredQuotes = quotes
    .filter(
      (q) =>
        q.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.clientInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.clientInfo?.company?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.total - a.total;
    });

  const totalRevenue = quotes.reduce((sum, q) => sum + q.total, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Historial de Cotizaciones
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {quotes.length} cotizaciones • Total: {formatCurrency(totalRevenue)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por servicio, categoría o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'total')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="date">Más recientes</option>
              <option value="total">Mayor valor</option>
            </select>
          </div>
        </div>

        {/* Quote List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay cotizaciones guardadas
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? 'No se encontraron resultados para tu búsqueda'
                  : 'Las cotizaciones que guardes aparecerán aquí'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {quote.serviceType}
                        </h3>
                        <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full">
                          {quote.category}
                        </span>
                      </div>
                      {quote.clientInfo && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Cliente: <span className="font-medium">{quote.clientInfo.name}</span>
                          {quote.clientInfo.company && (
                            <span> • {quote.clientInfo.company}</span>
                          )}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(quote.date).toLocaleDateString('es-PA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(quote.total)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {quote.squareFeet} ft²
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Espesor:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {quote.thickness}
                      </div>
                    </div>
                    {quote.ledCost && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">LED:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(quote.ledCost)}
                        </div>
                      </div>
                    )}
                    {quote.customColorCost && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Color:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(quote.customColorCost)}
                        </div>
                      </div>
                    )}
                    {quote.discount && quote.discount > 0 && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Descuento:</span>
                        <div className="font-medium text-red-600 dark:text-red-400">
                          {quote.discount}%
                        </div>
                      </div>
                    )}
                  </div>

                  {quote.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                      {quote.notes}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onGeneratePDF(quote)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Descargar PDF
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de eliminar esta cotización?')) {
                          onDeleteQuote(quote.id);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
