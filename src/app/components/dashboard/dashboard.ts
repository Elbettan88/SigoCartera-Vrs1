import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importación del enrutador de Angular
import * as XLSX from 'xlsx';

// Importamos moldes y utilidades de los archivos separados
import { Factura, MarcaHijo, ClientePadre } from './dashboard.interfaces';
import { ejecutarEditarEstructura, ejecutarEditarFactura, ejecutarCerrarSesion } from './dashboard.utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  imports: [DecimalPipe, NgClass, FormsModule]
})
export class DashboardComponent implements OnInit {
  fechaHoy = new Date('2026-08-24');
  columnasRangos: ('30' | '60' | '90' | '120' | '120M')[] = ['30', '60', '90', '120', '120M'];
  textoBusqueda: string = '';
  
  reporteCartera: ClientePadre[] = [];
  pagosRecibidosGTQ = 145000;
  pagosRecibidosUSD = 28000;

  // Variables para rastrear la selección activa del usuario
  clienteSeleccionado: ClientePadre | null = null;
  marcaSeleccionada: MarcaHijo | null = null;
  facturaSeleccionada: Factura | null = null;

  constructor(private router: Router) {} // Inyección estricta de dependencia

  ngOnInit() {
    this.cargarCarteraDesdeMemoria();
  }

  cargarCarteraDesdeMemoria() {
    const memoria = localStorage.getItem('sigo_cartera_dinamica');
    if (memoria) {
      this.reporteCartera = JSON.parse(memoria);
    } else {
      this.reporteCartera = [
        {
          nit: '9988776-5',
          razon_social: 'Grupo Q Guatemala, S.A.',
          expandido: true,
          marcas: [
            {
              codigo_hijo: 'M-001',
              nombre_marca: 'RAM',
              expandido: false,
              facturas: [
                { no_factura: 'FAC-8901', fecha_emision: '2026-08-05', moneda: 'GTQ', monto: 50000 },
                { no_factura: 'FAC-8902', fecha_emision: '2026-07-20', moneda: 'GTQ', monto: 20000 }
              ]
            }
          ]
        }
      ];
      this.guardarCarteraEnMemoria();
    }
  }

  guardarCarteraEnMemoria() {
    localStorage.setItem('sigo_cartera_dinamica', JSON.stringify(this.reporteCartera));
  }

  // Despacho de funciones al archivo utils.ts
  botonaEditarEstructura(cliente: ClientePadre, marca: MarcaHijo) {
    ejecutarEditarEstructura(cliente, marca, () => this.guardarCarteraEnMemoria());
  }

  botonEditarFactura(factura: Factura) {
    ejecutarEditarFactura(factura, () => this.guardarCarteraEnMemoria());
  }

  cerrarSesion() {
    ejecutarCerrarSesion(this.router);
  }

  seleccionarClienteMarca(cliente: ClientePadre, marca: MarcaHijo) {
    this.clienteSeleccionado = cliente;
    this.marcaSeleccionada = marca;
    this.facturaSeleccionada = null;
  }

  seleccionarFactura(cliente: ClientePadre, marca: MarcaHijo, factura: Factura) {
    this.clienteSeleccionado = cliente;
    this.marcaSeleccionada = marca;
    this.facturaSeleccionada = factura;
  }

  accionEditarSuperior() {
    if (this.facturaSeleccionada) {
      ejecutarEditarFactura(this.facturaSeleccionada, () => this.guardarCarteraEnMemoria());
    } else if (this.clienteSeleccionado && this.marcaSeleccionada) {
      ejecutarEditarEstructura(this.clienteSeleccionado, this.marcaSeleccionada, () => this.guardarCarteraEnMemoria());
    } else {
      alert('Por favor, seleccione un registro en la tabla.');
    }
  }

  accionAbonarSuperior() {
    if (!this.facturaSeleccionada || !this.marcaSeleccionada) {
      alert('Por favor, seleccione una factura específica.');
      return;
    }

    const abonoStr = prompt('Abonar a ' + this.facturaSeleccionada.no_factura + '.\nSaldo actual: ' + this.facturaSeleccionada.moneda + ' ' + this.facturaSeleccionada.monto.toFixed(2) + '\n\nIngrese monto:');
    if (!abonoStr) return;

    let montoAbono = parseFloat(abonoStr);
    if (isNaN(montoAbono) || montoAbono <= 0) return;

    if (montoAbono >= this.facturaSeleccionada.monto) montoAbono = this.facturaSeleccionada.monto;
    this.facturaSeleccionada.monto -= montoAbono;

    if (this.facturaSeleccionada.moneda === 'GTQ') this.pagosRecibidosGTQ += montoAbono;
    else this.pagosRecibidosUSD += montoAbono;

    if (this.facturaSeleccionada.monto <= 0) {
      this.marcaSeleccionada.facturas = this.marcaSeleccionada.facturas.filter((f: Factura) => f.no_factura !== this.facturaSeleccionada?.no_factura);
      this.facturaSeleccionada = null;
    }

    this.guardarCarteraEnMemoria();
    alert('¡Pago registrado!');
  }

  abrirModalNuevaFactura() {
    const nit = prompt('Ingrese el NIT del Cliente:');
    if (!nit) return;

    let cliente = this.reporteCartera.find((c: ClientePadre) => c.nit === nit.trim());
    let razonSocial = cliente ? cliente.razon_social : prompt('NIT Nuevo. Ingrese Razón Social:');
    if (!razonSocial) return;

    if (!cliente) {
      cliente = { nit: nit.trim(), razon_social: razonSocial.trim(), expandido: true, marcas: [] };
      this.reporteCartera.push(cliente);
    }

    const marcaComercial = prompt('Ingrese la Marca:');
    if (!marcaComercial) return;

    let marca = cliente.marcas.find((m: MarcaHijo) => m.nombre_marca.toLowerCase() === marcaComercial.trim().toLowerCase());
    if (!marca) {
      marca = { codigo_hijo: 'M-' + String(cliente.marcas.length + 1).padStart(3, '0'), nombre_marca: marcaComercial.trim(), expandido: true, facturas: [] };
      cliente.marcas.push(marca);
    }

    const noFactura = prompt('Ingrese No. Factura:');
    const montoStr = prompt('Ingrese Monto:');
    if (!noFactura || !montoStr) return;

    marca.facturas.push({
      no_factura: noFactura.trim().toUpperCase(),
      fecha_emision: '2026-08-01',
      moneda: confirm('¿Factura en Quetzales?') ? 'GTQ' : 'USD',
      monto: parseFloat(montoStr)
    });

    this.guardarCarteraEnMemoria();
  }

  calcularTotalMarca(marca: MarcaHijo, rango: string, moneda: 'GTQ' | 'USD'): number {
    return marca.facturas
      .filter((f: Factura) => f.moneda === moneda && (rango === 'total' || this.obtenerRangoVencimiento(f.fecha_emision) === rango))
      .reduce((sum: number, f: Factura) => sum + f.monto, 0);
  }

  obtenerMontoCeldaMarca(marca: MarcaHijo, rango: string, moneda: 'GTQ' | 'USD'): number | null {
    const total = this.calcularTotalMarca(marca, rango, moneda);
    return total > 0 ? total : null;
  }

  calcularTotalClientePadre(cliente: ClientePadre, rango: string, moneda: 'GTQ' | 'USD'): number {
    return cliente.marcas.reduce((sum: number, m: MarcaHijo) => sum + this.calcularTotalMarca(m, rango, moneda), 0);
  }

  obtenerMontoCeldaPadre(cliente: ClientePadre, rango: string, moneda: 'GTQ' | 'USD'): number | null {
    const total = this.calcularTotalClientePadre(cliente, rango, moneda);
    return total > 0 ? total : null;
  }

  obtenerTotalGeneral(rango: string, moneda: 'GTQ' | 'USD'): number {
    return this.carteraFiltrada.reduce((sum: number, c: ClientePadre) => sum + this.calcularTotalClientePadre(c, rango, moneda), 0);
  }

  get carteraFiltrada() {
    if (!this.textoBusqueda.trim()) return this.reporteCartera;
    const busqueda = this.textoBusqueda.toLowerCase();
    return this.reporteCartera.filter((c: ClientePadre) => c.razon_social.toLowerCase().includes(busqueda) || c.nit.includes(busqueda));
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

  exportarAExcel() {
    const filasExcel: any[] = [
      ['SigoCartera - Reporte Jerárquico Dinámico'],
      ['Fecha de Corte: ' + this.fechaHoy.toLocaleDateString()],
      [],
      [
        'Esquema Jerárquico de Cuentas', 'NIT / Código', 'Tipo Registro',
        'Total (GTQ)', 'Total (USD)', '0-30d (GTQ)', '0-30d (USD)', 
        '31-60d (GTQ)', '31-60d (USD)', '61-90d (GTQ)', '61-90d (USD)', 
        '91-120d (GTQ)', '91-120d (USD)', '+120d (GTQ)', '+120d (USD)'
      ]
    ];

    const propiedadesFilas: any[] = [
      { hpt: 20 }, { hpt: 15 }, { hpt: 15 }, { hpt: 25 }
    ];

    for (const cliente of this.carteraFiltrada) {
      filasExcel.push([
        cliente.razon_social.toUpperCase(), 
        cliente.nit, 
        'CLIENTE PADRE',
        this.calcularTotalClientePadre(cliente, 'total', 'GTQ') || 0,
        this.calcularTotalClientePadre(cliente, 'total', 'USD') || 0,
        this.calcularTotalClientePadre(cliente, '30', 'GTQ') || 0,
        this.calcularTotalClientePadre(cliente, '30', 'USD') || 0,
        this.calcularTotalClientePadre(cliente, '60', 'GTQ') || 0,
        this.calcularTotalClientePadre(cliente, '60', 'USD') || 0,
        this.calcularTotalClientePadre(cliente, '90', 'GTQ') || 0,
        this.calcularTotalClientePadre(cliente, '90', 'USD') || 0,
        this.calcularTotalClientePadre(cliente, '120', 'GTQ') || 0,
        this.calcularTotalClientePadre(cliente, '120', 'USD') || 0,
        this.calcularTotalClientePadre(cliente, '120M', 'GTQ') || 0,
        this.calcularTotalClientePadre(cliente, '120M', 'USD') || 0
      ]);
      propiedadesFilas.push({ level: 0, hpt: 20 });

      for (const mof of cliente.marcas) {
        filasExcel.push([
        '    • Marca: ' + mof.nombre_marca,mof.codigo_hijo,'MARCA HIJO',this.calcularTotalMarca(mof, 'total', 'GTQ') || 0,this.calcularTotalMarca(mof, 'total', 'USD') || 0,this.calcularTotalMarca(mof, '30', 'GTQ') || 0,this.calcularTotalMarca(mof, '30', 'USD') || 0,this.calcularTotalMarca(mof, '60', 'GTQ') || 0,this.calcularTotalMarca(mof, '60', 'USD') || 0,this.calcularTotalMarca(mof, '90', 'GTQ') || 0,this.calcularTotalMarca(mof, '90', 'USD') || 0,this.calcularTotalMarca(mof, '120', 'GTQ') || 0,this.calcularTotalMarca(mof, '120', 'USD') || 0,this.calcularTotalMarca(mof, '120M', 'GTQ') || 0,this.calcularTotalMarca(mof, '120M', 'USD') || 0]);propiedadesFilas.push({ level: 1, hpt: 18 });for (const fof of mof.facturas) {filasExcel.push(['        Factura: ' + fof.no_factura,'','FACTURA DETALLE',fof.moneda === 'GTQ' ? fof.monto : 0,fof.moneda === 'USD' ? fof.monto : 0,(fof.moneda === 'GTQ' && this.obtenerRangoVencimiento(fof.fecha_emision) === '30') ? fof.monto : 0,(fof.moneda === 'USD' && this.obtenerRangoVencimiento(fof.fecha_emision) === '30') ? fof.monto : 0,(fof.moneda === 'GTQ' && this.obtenerRangoVencimiento(fof.fecha_emision) === '60') ? fof.monto : 0,(fof.moneda === 'USD' && this.obtenerRangoVencimiento(fof.fecha_emision) === '60') ? fof.monto : 0,(fof.moneda === 'GTQ' && this.obtenerRangoVencimiento(fof.fecha_emision) === '90') ? fof.monto : 0,(fof.moneda === 'USD' && this.obtenerRangoVencimiento(fof.fecha_emision) === '90') ? fof.monto : 0,(fof.moneda === 'GTQ' && this.obtenerRangoVencimiento(fof.fecha_emision) === '120') ? fof.monto : 0,(fof.moneda === 'USD' && this.obtenerRangoVencimiento(fof.fecha_emision) === '120') ? fof.monto : 0,(fof.moneda === 'GTQ' && this.obtenerRangoVencimiento(fof.fecha_emision) === '120M') ? fof.monto : 0,(fof.moneda === 'USD' && this.obtenerRangoVencimiento(fof.fecha_emision) === '120M') ? fof.monto : 0]);propiedadesFilas.push({ level: 2, hpt: 15 });}}}filasExcel.push(['TOTAL GENERAL CARTERA EMPRESA', '', 'TOTAL CONSOLIDADO',this.obtenerTotalGeneral('total', 'GTQ'), this.obtenerTotalGeneral('total', 'USD'),this.obtenerTotalGeneral('30', 'GTQ'), this.obtenerTotalGeneral('30', 'USD'),this.obtenerTotalGeneral('60', 'GTQ'), this.obtenerTotalGeneral('60', 'USD'),this.obtenerTotalGeneral('90', 'GTQ'), this.obtenerTotalGeneral('90', 'USD'),this.obtenerTotalGeneral('120', 'GTQ'), this.obtenerTotalGeneral('120', 'USD'),this.obtenerTotalGeneral('120M', 'GTQ'), this.obtenerTotalGeneral('120M', 'USD')]);propiedadesFilas.push({ level: 0, hpt: 22 });const hoja: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(filasExcel);hoja['!rows'] = propiedadesFilas;const libro: XLSX.WorkBook = XLSX.utils.book_new();XLSX.utils.book_append_sheet(libro, hoja, 'Matriz Dinámica Sigo');XLSX.writeFile(libro, 'SigoCartera_Tabla_Dinamica_Real.xlsx');}}