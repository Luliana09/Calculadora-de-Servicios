export interface ServiceData {
  tipoServicio: string;
  categoria: string;
  precioBase: number;
  espesor: string;
  descripcionEspesor: string;
  precioXPie2: number;
  precioTotalXPie2: number;
  condicionales: string;
  tamanoMinimo: number | null;
  instalacionIncluida: string;
}

export interface CalculatedQuote {
  id: string;
  date: string;
  serviceType: string;
  category: string;
  thickness: string;
  squareFeet: number;
  basePrice: number;
  thicknessPrice: number;
  subtotal: number;
  ledCost?: number;
  transformerCost?: number;
  transformerQuantity?: number;
  customColorCost?: number;
  installationCost?: number;
  discount?: number;
  total: number;
  notes?: string;
  clientInfo?: ClientInfo;
}

export interface ClientInfo {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
}

export interface QuoteComparison {
  quotes: CalculatedQuote[];
  createdAt: string;
}

export interface LEDComponents {
  ledPastillas: number;
  ledCostPerUnit: number;
  transformerCost: number;
  transformerQuantity: number;
  totalLEDCost: number;
}
