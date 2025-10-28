import type { ServiceData, LEDComponents } from '../types';

// Re-export types for convenience
export type { ServiceData, LEDComponents } from '../types';

export const LED_COST_PER_UNIT = 1.25;
export const TRANSFORMER_COST = 34.95;
export const TRANSFORMER_COVERAGE = 15; // ft²
export const CUSTOM_COLOR_COST = 2.0; // per ft²

export const calculateLEDComponents = (squareFeet: number): LEDComponents => {
  // Estimate LED pastillas (approx 1 per ft²)
  const ledPastillas = Math.ceil(squareFeet);
  const transformerQuantity = Math.ceil(squareFeet / TRANSFORMER_COVERAGE);
  const totalLEDCost = (ledPastillas * LED_COST_PER_UNIT) + (transformerQuantity * TRANSFORMER_COST);

  return {
    ledPastillas,
    ledCostPerUnit: LED_COST_PER_UNIT,
    transformerCost: TRANSFORMER_COST,
    transformerQuantity,
    totalLEDCost,
  };
};

export const hasLightService = (category: string): boolean => {
  return category.toUpperCase().includes('CON LUZ');
};

export const isLetrasRecortadas = (serviceType: string): boolean => {
  return serviceType.toUpperCase().includes('LETRAS RECORTADAS');
};

export const calculateServicePrice = (
  service: ServiceData,
  squareFeet: number,
  includeCustomColor: boolean = false,
  includeInstallation: boolean = false,
  installationCost: number = 0
): {
  basePrice: number;
  thicknessPrice: number;
  subtotal: number;
  ledComponents?: LEDComponents;
  customColorCost?: number;
  installationCost?: number;
  total: number;
  minimumApplied: boolean;
} => {
  let basePrice = service.precioBase;
  const thicknessPrice = service.precioXPie2;
  let subtotal = (basePrice + thicknessPrice) * squareFeet;

  // Apply minimum size rules
  let minimumApplied = false;
  if (service.condicionales) {
    const condicionales = service.condicionales.toUpperCase();

    // Check for specific rounding rules
    if (condicionales.includes('REDONDIAR A 50') && squareFeet <= 3) {
      subtotal = 50;
      minimumApplied = true;
    } else if (condicionales.includes('REDONDIAR A 5') && squareFeet <= 1.5) {
      subtotal = 5;
      minimumApplied = true;
    }
  }

  let ledComponents: LEDComponents | undefined;
  let customColorCost: number | undefined;
  let finalInstallationCost: number | undefined;

  // Add LED components for services with light
  if (hasLightService(service.categoria)) {
    ledComponents = calculateLEDComponents(squareFeet);
  }

  // Add custom color cost for "Letras Recortadas"
  if (isLetrasRecortadas(service.tipoServicio) && includeCustomColor) {
    customColorCost = squareFeet * CUSTOM_COLOR_COST;
  }

  // Add installation cost if applicable
  if (includeInstallation && installationCost > 0) {
    finalInstallationCost = installationCost;
  }

  const total =
    subtotal +
    (ledComponents?.totalLEDCost || 0) +
    (customColorCost || 0) +
    (finalInstallationCost || 0);

  return {
    basePrice,
    thicknessPrice,
    subtotal,
    ledComponents,
    customColorCost,
    installationCost: finalInstallationCost,
    total,
    minimumApplied,
  };
};

export const applyDiscount = (amount: number, discountPercent: number): number => {
  return amount - (amount * (discountPercent / 100));
};

export const formatCurrency = (amount: number): string => {
  return `B/. ${amount.toFixed(2)}`;
};
