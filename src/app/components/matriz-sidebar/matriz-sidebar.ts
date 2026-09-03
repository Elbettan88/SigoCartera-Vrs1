import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-matriz-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matriz-sidebar.html',
  styleUrls: ['./matriz-sidebar.scss'],
})
export class MatrizSidebarComponent implements OnInit, OnChanges {
  @Input() datosCartera: any[] = [];

  monedaSeleccionada: 'GTQ' | 'USD' = 'GTQ';
  columnasRangos: string[] = ['0-30', '31-60', '61-90', '91-120', '120M'];
  carteraLocal: any[] = [];

  ngOnInit() {
    this.sincronizarCartera();
  }

  ngOnChanges() {
    this.sincronizarCartera();
  }

  sincronizarCartera() {
    this.carteraLocal = JSON.parse(JSON.stringify(this.datosCartera));
  }

  cambiarMoneda(moneda: 'GTQ' | 'USD') {
    this.monedaSeleccionada = moneda;
  }

  obtenerClaseSemaforo(factura: any): string {
    const dias = Math.max(factura.dias_vencidos || 0, 0);
    if (dias <= 30) return 'bg-success';
    if (dias <= 90) return 'bg-warning text-dark';
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

  obtenerMontoPadre(cliente: any, rango: string): number {
    let total = 0;
    if (!cliente.marcas) return total;
    cliente.marcas.forEach((m: any) => {
      total += this.obtenerMontoMarca(m, rango);
    });
    return total;
  }

  obtenerMontoMarca(marca: any, rango: string): number {
    let total = 0;
    if (!marca.facturas) return total;
    marca.facturas.forEach((f: any) => {
      if (f.moneda === this.monedaSeleccionada) {
        if (rango === 'total' || this.obtenerRangoFactura(f) === rango) {
          total += f.saldo || 0;
        }
      }
    });
    return total;
  }
}
