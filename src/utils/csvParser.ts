import type { ServiceData } from '../types';

// Re-export ServiceData for convenience
export type { ServiceData } from '../types';

export const parseCSV = (csvText: string): ServiceData[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const services: ServiceData[] = [];

  // Skip header (line 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(';');
    if (parts.length < 10) continue;

    const tipoServicio = parts[0]?.trim() || '';
    const categoria = parts[1]?.trim() || '';

    if (!tipoServicio || !categoria) continue;

    const precioBaseStr = parts[2]?.replace(/\$/g, '').replace(/,/g, '.').trim() || '0';
    const espesor = parts[3]?.trim() || '';
    const descripcionEspesor = parts[4]?.trim() || '';
    const precioXPie2Str = parts[5]?.replace(/\$/g, '').replace(/,/g, '.').trim() || '0';
    const precioTotalXPie2Str = parts[6]?.replace(/\$/g, '').replace(/,/g, '.').trim() || '0';
    const condicionales = parts[7]?.trim() || '';
    const tamanoMinimoStr = parts[8]?.trim() || '';
    const instalacionIncluida = parts[9]?.trim() || '';

    services.push({
      tipoServicio,
      categoria,
      precioBase: parseFloat(precioBaseStr) || 0,
      espesor,
      descripcionEspesor,
      precioXPie2: parseFloat(precioXPie2Str) || 0,
      precioTotalXPie2: parseFloat(precioTotalXPie2Str) || 0,
      condicionales,
      tamanoMinimo: tamanoMinimoStr === 'N/A' ? null : parseFloat(tamanoMinimoStr.replace(/,/g, '.')) || null,
      instalacionIncluida,
    });
  }

  return services;
};

export const groupServicesByType = (services: ServiceData[]): Record<string, ServiceData[]> => {
  return services.reduce((acc, service) => {
    if (!acc[service.tipoServicio]) {
      acc[service.tipoServicio] = [];
    }
    acc[service.tipoServicio].push(service);
    return acc;
  }, {} as Record<string, ServiceData[]>);
};

export const groupServicesByCategory = (services: ServiceData[]): Record<string, ServiceData[]> => {
  return services.reduce((acc, service) => {
    const key = `${service.tipoServicio}|${service.categoria}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(service);
    return acc;
  }, {} as Record<string, ServiceData[]>);
};
