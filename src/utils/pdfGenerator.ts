import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CalculatedQuote } from '../types';
import { formatCurrency } from './priceCalculator';

// Re-export type for convenience
export type { CalculatedQuote } from '../types';

export const generateQuotePDF = (quote: CalculatedQuote) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header with company info
  doc.setFillColor(14, 165, 233); // Primary color
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('COTIZACIÓN', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Servicios de Rotulación y Publicidad', pageWidth / 2, 30, { align: 'center' });

  // Quote info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const quoteDate = new Date(quote.date).toLocaleDateString('es-PA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let currentY = 50;

  doc.setFont('helvetica', 'bold');
  doc.text('No. Cotización:', 20, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(quote.id, 60, currentY);

  currentY += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', 20, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(quoteDate, 60, currentY);

  // Client info
  if (quote.clientInfo && quote.clientInfo.name) {
    currentY += 15;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, currentY - 5, pageWidth - 40, 25, 'F');

    currentY += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('INFORMACIÓN DEL CLIENTE', 25, currentY);

    currentY += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${quote.clientInfo.name}`, 25, currentY);

    if (quote.clientInfo.company) {
      currentY += 5;
      doc.text(`Empresa: ${quote.clientInfo.company}`, 25, currentY);
    }

    const contactInfo: string[] = [];
    if (quote.clientInfo.email) contactInfo.push(quote.clientInfo.email);
    if (quote.clientInfo.phone) contactInfo.push(quote.clientInfo.phone);

    if (contactInfo.length > 0) {
      currentY += 5;
      doc.text(`Contacto: ${contactInfo.join(' • ')}`, 25, currentY);
    }

    currentY += 10;
  } else {
    currentY += 10;
  }

  // Service details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('DETALLE DEL SERVICIO', 20, currentY);
  currentY += 10;

  const serviceDetails = [
    ['Tipo de Servicio', quote.serviceType],
    ['Categoría', quote.category],
    ['Espesor/Tipo', quote.thickness],
    ['Área', `${quote.squareFeet} ft²`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [],
    body: serviceDetails,
    theme: 'plain',
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Price breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('DESGLOSE DE PRECIO', 20, currentY);
  currentY += 10;

  const priceBreakdown: (string | number)[][] = [
    ['Precio base', formatCurrency(quote.subtotal)],
  ];

  if (quote.ledCost) {
    priceBreakdown.push([
      `Componentes LED (${quote.transformerQuantity} transformador${
        quote.transformerQuantity! > 1 ? 'es' : ''
      })`,
      formatCurrency(quote.ledCost),
    ]);
  }

  if (quote.customColorCost) {
    priceBreakdown.push(['Color personalizado', formatCurrency(quote.customColorCost)]);
  }

  if (quote.installationCost) {
    priceBreakdown.push(['Instalación', formatCurrency(quote.installationCost)]);
  }

  const subtotal = quote.subtotal + (quote.ledCost || 0) + (quote.customColorCost || 0) + (quote.installationCost || 0);

  priceBreakdown.push(['', '']); // Empty row
  priceBreakdown.push(['SUBTOTAL', formatCurrency(subtotal)]);

  if (quote.discount && quote.discount > 0) {
    const discountAmount = subtotal - quote.total;
    priceBreakdown.push([`Descuento (${quote.discount}%)`, `-${formatCurrency(discountAmount)}`]);
  }

  autoTable(doc, {
    startY: currentY,
    head: [],
    body: priceBreakdown,
    theme: 'plain',
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 130, halign: 'left' },
      1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' },
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    didParseCell: (data) => {
      if (data.row.index === priceBreakdown.length - 1) {
        data.cell.styles.fontSize = 12;
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [14, 165, 233];
        data.cell.styles.textColor = [255, 255, 255];
      }
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // Total
  doc.setFillColor(14, 165, 233);
  doc.rect(20, currentY - 8, pageWidth - 40, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TOTAL:', 25, currentY);
  doc.text(formatCurrency(quote.total), pageWidth - 25, currentY, { align: 'right' });

  currentY += 20;
  doc.setTextColor(0, 0, 0);

  // Notes
  if (quote.notes) {
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('NOTAS:', 20, currentY);
    currentY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(quote.notes, pageWidth - 40);
    doc.text(splitNotes, 20, currentY);
    currentY += splitNotes.length * 5 + 10;
  }

  // LED Components notice
  if (quote.ledCost) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(239, 246, 255);
    doc.rect(20, currentY - 5, pageWidth - 40, 25, 'F');

    currentY += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 64, 175);
    doc.text('INCLUYE COMPONENTES LED:', 25, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('• Pastillas LED: B/. 1.25 c/u', 25, currentY);
    currentY += 5;
    doc.text('• Transformador: B/. 34.95 (rinde 15 ft²)', 25, currentY);
    currentY += 5;
    doc.text('• Sin base ACM', 25, currentY);

    currentY += 10;
    doc.setTextColor(0, 0, 0);
  }

  // Footer
  const footerY = pageHeight - 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text('Esta cotización tiene una validez de 30 días', pageWidth / 2, footerY, {
    align: 'center',
  });
  doc.text(
    'Generado con Calculadora de Servicios',
    pageWidth / 2,
    footerY + 5,
    { align: 'center' }
  );

  // Save
  const fileName = `Cotizacion_${quote.id}_${quote.serviceType.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
