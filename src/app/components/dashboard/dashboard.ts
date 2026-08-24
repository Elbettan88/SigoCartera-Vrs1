import { Component } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import * as XLSX from 'xlsx'; // <-- 1. Importación obligatoria para generar archivos

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [DecimalPipe, NgClass]
})
export class DashboardComponent {
  fechaHoy = new Date('2026-08-24');

  reporteCartera = [
    {
      cliente: 'Distribuidora Comercial de Guatemala, S.A.',
      expandido: false,
      facturas: [
        { no_factura: 'FAC-8901', fecha_emision: '2026-08-05', moneda: 'GTQ', monto: 50000 },
        { no_factura: 'FAC-8902', fecha_emision: '2026-07-20', moneda: 'GTQ', monto: 20000 },
        { no_factura: 'FAC-8903', fecha_emision: '2026-06-28', moneda: 'GTQ', monto: 15000 }
      ]
    },
    {
      cliente: 'Corporación Textil del Norte',
      expandido: false,
      facturas: [
        { no_factura: 'FAC-4510', fecha_emision: '2026-08-02', moneda: 'GTQ', monto: 12450 },
        { no_factura: 'FAC-4511', fecha_emision: '2026-07-10', moneda: 'GTQ', monto: 40000 },
        { no_factura: 'FAC-4512', fecha_emision: '2026-07-05', moneda: 'USD', monto: 2500 },
        { no_factura: 'FAC-4513', fecha_emision: '2026-06-01', moneda: 'GTQ', monto: 15000 },
        { no_factura: 'FAC-4514', fecha_emision: '2026-04-25', moneda: 'GTQ', monto: 25000 },
        { no_factura: 'FAC-4515', fecha_emision: '2026-04-20', moneda: 'USD', monto: 2500 },
        { no_factura: 'FAC-4516', fecha_emision: '2026-03-10', moneda: 'GTQ', monto: 20000 }
      ]
    },
    {
      cliente: 'Suministros Industriales, S.A.',
      expandido: false,
      facturas: [
        { no_factura: 'FAC-3022', fecha_emision: '2026-02-15', moneda: 'GTQ', monto: 25210 }
      ]
    }
  ];

  pagosRecibidosGTQ = 145000;
  pagosRecibidosUSD = 28000;

  toggleCliente(item: any) {
    item.expandido = !item.expandido;
  }

  obtenerDiasAtraso(fechaEmisionStr: string): number {
    const emision = new Date(fechaEmisionStr);
    const vencimiento = new Date(emision.getTime() + (30 * 24 * 60 * 60 * 1000));
    return Math.floor((this.fechaHoy.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24));
  }

  obtenerRangoVencimiento(fechaEmisionStr: string): '30' | '60' | '90' | '120' | '120M' {
    const dias = this.obtenerDiasAtraso(fechaEmisionStr);
    if (dias <= 0) return '30';
    if (dias <= 30) return '60';
    if (dias <= 60) return '90';
    if (dias <= 90) return '120';
    return '120M';
  }

  obtenerClaseSemaforo(fechaEmisionStr: string): string {
    const dias = this.obtenerDiasAtraso(fechaEmisionStr);
    if (dias <= 0) return 'semaforo-verde';
    if (dias <= 60) return 'semaforo-amarillo';
    if (dias <= 120) return 'semaforo-naranja';
    return 'semaforo-rojo';
  }

  calcularTotalPadre(cliente: any, columna: 'total' | '30' | '60' | '90' | '120' | '120M', moneda: 'GTQ' | 'USD'): number {
    return cliente.facturas
      .filter((f: any) => f.moneda === moneda && (columna === 'total' || this.obtenerRangoVencimiento(f.fecha_emision) === columna))
      .reduce((sum: number, f: any) => sum + f.monto, 0);
  }

  obtenerMontoCelda(cliente: any, columna: 'total' | '30' | '60' | '90' | '120' | '120M', moneda: 'GTQ' | 'USD'): number | null {
    const total = this.calcularTotalPadre(cliente, columna, moneda);
    return total > 0 ? total : null;
  }

  obtenerTotalGeneral(columna: 'total' | '30' | '60' | '90' | '120' | '120M', moneda: 'GTQ' | 'USD'): number {
    return this.reporteCartera.reduce((sum, c) => sum + this.calcularTotalPadre(c, columna, moneda), 0);
  }

  // 🚀 2. FUNCIÓN DE EXPORTACIÓN DIRECTA ESTILO LIBRO CONTABLE
  exportarAExcel() {
    // Definimos los encabezados planos para las columnas en Excel
    const filasExcel: any[] = [
      ['SigoCartera - Reporte Consolidado Avanzado de Antigüedad de Saldos'],
      [`Fecha de Corte: ${this.fechaHoy.toLocaleDateString()}`],
      [], // Fila en blanco de separación
      [
        'Cliente / Razón Social', 
        'Total (GTQ)', 'Total (USD)', 
        '0-30d (GTQ)', '0-30d (USD)', 
        '31-60d (GTQ)', '31-60d (USD)', 
        '61-90d (GTQ)', '61-90d (USD)', 
        '91-120d (GTQ)', '91-120d (USD)', 
        '+120d (GTQ)', '+120d (USD)'
      ]
    ];

    // Recorremos la matriz para inyectar las filas de los clientes
    this.reporteCartera.forEach(item => {
      filasExcel.push([
        item.cliente,
        this.calcularTotalPadre(item, 'total', 'GTQ') || 0,
        this.calcularTotalPadre(item, 'total', 'USD') || 0,
        this.calcularTotalPadre(item, '30', 'GTQ') || 0,
        this.calcularTotalPadre(item, '30', 'USD') || 0,
        this.calcularTotalPadre(item, '60', 'GTQ') || 0,
        this.calcularTotalPadre(item, '60', 'USD') || 0,
        this.calcularTotalPadre(item, '90', 'GTQ') || 0,
        this.calcularTotalPadre(item, '90', 'USD') || 0,
        this.calcularTotalPadre(item, '120', 'GTQ') || 0,
        this.calcularTotalPadre(item, '120', 'USD') || 0,
        this.calcularTotalPadre(item, '120M', 'GTQ') || 0,
        this.calcularTotalPadre(item, '120M', 'USD') || 0
      ]);
    });

    // Añadimos la fila final de Totales de la Empresa
    filasExcel.push([
      'TOTAL EMPRESA:',
      this.obtenerTotalGeneral('total', 'GTQ'),   this.obtenerTotalGeneral('total', 'USD'),
      this.obtenerTotalGeneral('30', 'GTQ'),      this.obtenerTotalGeneral('30', 'USD'),
      this.obtenerTotalGeneral('60', 'GTQ'),      this.obtenerTotalGeneral('60', 'USD'),
      this.obtenerTotalGeneral('90', 'GTQ'),      this.obtenerTotalGeneral('90', 'USD'),
      this.obtenerTotalGeneral('120', 'GTQ'),     this.obtenerTotalGeneral('120', 'USD'),
      this.obtenerTotalGeneral('120M', 'GTQ'),    this.obtenerTotalGeneral('120M', 'USD')
    ]);

    // Generamos el objeto de la hoja de cálculo
    const hoja: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(filasExcel);
    const libro: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Antigüedad de Saldos');

    // Forzamos la descarga del archivo físico binario .xlsx en el navegador
    XLSX.writeFile(libro, 'SigoCartera_Reporte_Consolidado.xlsx');
  }
}
