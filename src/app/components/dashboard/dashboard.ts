import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaModalComponent } from '../factura-modal/factura-modal';
import { AbonoModalComponent } from '../abono-modal/abono-modal';
import { EditarModalComponent } from '../editar-modal/editar-modal';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FacturaModalComponent,
    AbonoModalComponent,
    EditarModalComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  textoBusqueda: string = '';
  clienteSeleccionado: any = null;
  marcaSeleccionada: any = null;
  facturaSeleccionada: any = null;
  pagosRecibidosGTQ: number = 0;
  pagosRecibidosUSD: number = 0;

  monedaActiva: 'GTQ' | 'USD' = 'GTQ';
  private syncInterval: any;

  columnasRangos: string[] = ['0-30', '31-60', '61-90', '91-120', '120M'];

  mostrarModal: boolean = false;
  mostrarModalAbono: boolean = false;
  mostrarModalEditar: boolean = false;

  carteraOriginal: any[] = [];
  carteraFiltrada: any[] = [];

  constructor() {}

  ngOnInit() {
    const monedaGuardada = localStorage.getItem('sigo_moneda_activa');
    if (monedaGuardada === 'GTQ' || monedaGuardada === 'USD') {
      this.monedaActiva = monedaGuardada;
    }

    // Escucha reactiva en tiempo real ante clics del sidebar
    this.syncInterval = setInterval(() => {
      const monedaActual = localStorage.getItem('sigo_moneda_activa') as 'GTQ' | 'USD';
      if (monedaActual && monedaActual !== this.monedaActiva) {
        this.monedaActiva = monedaActual;
        this.clienteSeleccionado = null;
        this.marcaSeleccionada = null;
        this.facturaSeleccionada = null;

        // Forzar expansión automática para que Angular dibuje el árbol de inmediato
        this.carteraFiltrada.forEach((c) => {
          c.expandido = true;
          if (c.marcas) {
            c.marcas.forEach((m: any) => (m.expandido = true));
          }
        });
      }
    }, 150);

    // DATOS DE PRUEBA BLINDADOS: Facturas explícitas en ambas monedas para verificar el diseño
    this.carteraOriginal = [
      {
        nit: '814526-7',
        razon_social: 'Corporación Alimentos del Sur, S.A.',
        expandido: true,
        marcas: [
          {
            codigo_hijo: 'MARC-001',
            codigo_interno: 'INT-99',
            nombre_marca: 'Logística Central',
            expandido: true,
            facturas: [
              { no_factura: 'FAC-4501', moneda: 'GTQ', saldo: 15000.0, dias_vencidos: 12 },
              { no_factura: 'FAC-4502', moneda: 'GTQ', saldo: 8500.0, dias_vencidos: 45 },
              { no_factura: 'FAC-4503', moneda: 'USD', saldo: 2400.0, dias_vencidos: 135 },
            ],
          },
        ],
      },
      {
        nit: '334981-2',
        razon_social: 'Importadora Eléctrica, S.A.',
        expandido: true,
        marcas: [
          {
            codigo_hijo: 'MARC-002',
            codigo_interno: 'INT-44',
            nombre_marca: 'Mayoreo Departamental',
            expandido: true,
            facturas: [
              { no_factura: 'FAC-8890', moneda: 'GTQ', saldo: 34000.0, dias_vencidos: 75 },
              { no_factura: 'FAC-8891', moneda: 'USD', saldo: 1150.0, dias_vencidos: 5 },
            ],
          },
        ],
      },
    ];

    this.carteraFiltrada = [...this.carteraOriginal];
  }

  ngOnDestroy() {
    if (this.syncInterval) clearInterval(this.syncInterval);
  }

  filtrarCartera() {
    if (!this.textoBusqueda.trim()) {
      this.carteraFiltrada = [...this.carteraOriginal];
      return;
    }
    const busqueda = this.textoBusqueda.toLowerCase();
    this.carteraFiltrada = this.carteraOriginal.filter(
      (cliente) =>
        cliente.nit.toLowerCase().includes(busqueda) ||
        cliente.razon_social.toLowerCase().includes(busqueda),
    );
  }

  // CORRECCIÓN: Retorna las clases de fondo exactas de Bootstrap para pintar el círculo
  obtenerClaseSemaforo(factura: any): string {
    const dias = Math.max(factura.dias_vencidos || 0, 0);
    if (dias <= 30) return 'bg-success';
    if (dias <= 90) return 'bg-warning';
    return 'bg-danger';
  }

  obtenerRangoFactura(factura: any): string {
    const dias = factura.dias_vencidos || 0;
    if (dias <= 30) return '0-30';
    if (dias <= 60) return '31-60';
    if (dias <= 90) return '61-90';
    if (dias <= 120) return '91-120';
    return '120M';
  }

  obtenerTotalGeneral(rango: string, moneda: string): number {
    let total = 0;
    for (const cliente of this.carteraFiltrada) {
      total += this.obtenerMontoCeldaPadre(cliente, rango, moneda);
    }
    return total;
  }

  obtenerMontoCeldaPadre(cliente: any, rango: string, moneda: string): number {
    let total = 0;
    if (!cliente.marcas) return total;
    for (const marca of cliente.marcas) {
      total += this.obtenerMontoCeldaMarca(marca, rango, moneda);
    }
    return total;
  }

  obtenerMontoCeldaMarca(marca: any, rango: string, moneda: string): number {
    let total = 0;
    if (!marca.facturas) return total;
    for (const fac of marca.facturas) {
      if (fac.moneda === moneda) {
        if (rango === 'total' || this.obtenerRangoFactura(fac) === rango) {
          total += fac.saldo || 0;
        }
      }
    }
    return total;
  }

  seleccionarClienteMarca(cliente: any, marca: any) {
    this.clienteSeleccionado = cliente;
    this.marcaSeleccionada = marca;
    this.facturaSeleccionada = null;
  }

  seleccionarFactura(cliente: any, marca: any, fac: any) {
    this.clienteSeleccionado = cliente;
    this.marcaSeleccionada = marca;
    this.facturaSeleccionada = fac;
  }

  abrirModalNuevaFactura() {
    this.mostrarModal = true;
  }

  cerrarModalFactura() {
    this.mostrarModal = false;
  }

  procesarNuevaFactura(evento: any) {
    const { nitCliente, codigoHijoMarca, factura } = evento;
    const cliente = this.carteraOriginal.find((c) => c.nit === nitCliente);

    if (cliente) {
      const marca = cliente.marcas.find((m: any) => m.codigo_hijo === codigoHijoMarca);
      if (marca) {
        marca.facturas.push(factura);
        cliente.expandido = true;
        marca.expandido = true;
        this.carteraFiltrada = [...this.carteraOriginal];
        this.cerrarModalFactura();
      } else {
        alert('El código de marca (Hijo) ingresado no existe para este cliente.');
      }
    } else {
      alert('El NIT de cliente ingresado no se encuentra registrado.');
    }
  }

  accionAbonarSuperior() {
    if (this.facturaSeleccionada && this.facturaSeleccionada.saldo > 0) {
      this.mostrarModalAbono = true;
    }
  }

  cerrarModalAbono() {
    this.mostrarModalAbono = false;
  }

  procesarAbonoFactura(monto: number) {
    if (!this.facturaSeleccionada) return;
    this.facturaSeleccionada.saldo -= monto;

    if (this.facturaSeleccionada.moneda === 'GTQ') {
      this.pagosRecibidosGTQ += monto;
    } else {
      this.pagosRecibidosUSD += monto;
    }

    if (this.facturaSeleccionada.saldo <= 0) {
      this.facturaSeleccionada = null;
    }

    this.carteraFiltrada = [...this.carteraOriginal];
    this.cerrarModalAbono();
  }

  accionEditarSuperior() {
    if (this.marcaSeleccionada || this.clienteSeleccionado || this.facturaSeleccionada) {
      this.mostrarModalEditar = true;
    }
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
  }

  procesarModificacion(evento: any) {
    const { esMarca, nuevoNombre, nuevoCodigoInterno } = evento;

    if (esMarca && this.marcaSeleccionada) {
      this.marcaSeleccionada.nombre_marca = nuevoNombre;
      this.marcaSeleccionada.codigo_interno = nuevoCodigoInterno;
    } else if (!esMarca && this.clienteSeleccionado) {
      this.clienteSeleccionado.razon_social = nuevoNombre;
    }

    this.carteraFiltrada = [...this.carteraOriginal];
    this.cerrarModalEditar();
  }

  exportarAExcel() {
    if (this.carteraFiltrada.length === 0) {
      alert('No hay datos en la cartera para exportar a Excel.');
      return;
    }

    const filasReporte: any[] = [];
    this.carteraFiltrada.forEach((cliente) => {
      (cliente.marcas || []).forEach((marca: any) => {
        (marca.facturas || []).forEach((fac: any) => {
          filasReporte.push({
            'NIT Cliente': cliente.nit,
            'Razón Social': cliente.razon_social,
            'Código Marca (Hijo)': marca.codigo_hijo,
            'Código Interno': marca.codigo_interno,
            'Nombre Marca': marca.nombre_marca,
            'No. Factura': fac.no_factura,
            Moneda: fac.moneda,
            'Saldo Vivo': fac.saldo,
            'Días Vencidos': fac.dias_vencidos,
            'Rango de Mora': this.obtenerRangoFactura(fac),
          });
        });
      });
    });

    const hojaTrabajo: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filasReporte);
    const libroTrabajo: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroTrabajo, hojaTrabajo, 'Cartera Viva');

    const nombreArchivo = `SigoCartera_Reporte_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(libroTrabajo, nombreArchivo);
  }
}
