import { useState, useEffect } from 'react';
import type { ServiceData, CalculatedQuote } from './types';
import { parseCSV, groupServicesByType } from './utils/csvParser';
import { generateQuotePDF } from './utils/pdfGenerator';
import { Sidebar } from './components/Sidebar';
import { Calculator } from './components/Calculator';
import { QuoteHistory } from './components/QuoteHistory';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [servicesByType, setServicesByType] = useState<Record<string, ServiceData[]>>({});
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<CalculatedQuote[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load CSV on mount
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch('/PRECIO X PIE2 DE LOS SERVICIOS.csv');
        const csvText = await response.text();
        const parsedServices = parseCSV(csvText);
        setServices(parsedServices);
        setServicesByType(groupServicesByType(parsedServices));
      } catch (error) {
        console.error('Error loading CSV:', error);
        alert('Error al cargar el archivo de servicios. Por favor, verifica que el CSV esté en la carpeta public.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCSV();
  }, []);

  // Load quotes from localStorage
  useEffect(() => {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
      try {
        setQuotes(JSON.parse(savedQuotes));
      } catch (error) {
        console.error('Error loading quotes:', error);
      }
    }
  }, []);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save quotes to localStorage
  useEffect(() => {
    if (quotes.length > 0) {
      localStorage.setItem('quotes', JSON.stringify(quotes));
    }
  }, [quotes]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  const handleSaveQuote = (quote: CalculatedQuote) => {
    setQuotes([quote, ...quotes]);
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(quotes.filter((q) => q.id !== id));
  };

  const handleNewQuote = () => {
    setSelectedServiceType(null);
    setShowHistory(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      <Sidebar
        servicesByType={servicesByType}
        selectedService={selectedServiceType}
        onServiceSelect={setSelectedServiceType}
        onNewQuote={handleNewQuote}
        onViewHistory={() => setShowHistory(true)}
      />

      {selectedServiceType && !showHistory ? (
        <Calculator
          services={servicesByType[selectedServiceType] || []}
          serviceType={selectedServiceType}
          onSaveQuote={handleSaveQuote}
          onGeneratePDF={generateQuotePDF}
        />
      ) : !showHistory ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">📊</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Bienvenido a la Calculadora de Servicios
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Selecciona un tipo de servicio del panel lateral para comenzar a calcular cotizaciones profesionales.
            </p>
            <div className="space-y-2 text-left bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Características principales:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>✓ Cálculo automático de precios por pie cuadrado</li>
                <li>✓ Componentes LED incluidos para servicios con luz</li>
                <li>✓ Generación de PDF profesional</li>
                <li>✓ Historial de cotizaciones guardadas</li>
                <li>✓ Descuentos y personalizaciones</li>
                <li>✓ Modo oscuro</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {showHistory && (
        <QuoteHistory
          quotes={quotes}
          onClose={() => setShowHistory(false)}
          onDeleteQuote={handleDeleteQuote}
          onGeneratePDF={generateQuotePDF}
        />
      )}
    </div>
  );
}

export default App;
