import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte-dolares',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-dolares.html',
  styleUrls: ['./reporte-dolares.scss'],
})
export class ReporteDolaresComponent implements OnChanges {
  @Input() datosCartera: any[] = [];

  resumenMarcas: any[] = [];
  totalGeneralUSD: number = 0;

  ngOnChanges() {
    this.calcularReporte();
  }

  calcularReporte() {
    const mapaMarcas: { [key: string]: { nombre: string; codigoInterno: string; saldo: number } } =
      {};
    this.totalGeneralUSD = 0;

    this.datosCartera.forEach((cliente) => {
      (cliente.marcas || []).forEach((marca: any) => {
        const llave = marca.codigo_hijo;

        if (!mapaMarcas[llave]) {
          mapaMarcas[llave] = {
            nombre: marca.nombre_marca,
            codigoInterno: marca.codigo_interno || '',
            saldo: 0,
          };
        }

        (marca.facturas || []).forEach((fac: any) => {
          if (fac.moneda === 'USD') {
            const mto = fac.saldo || 0;
            mapaMarcas[llave].saldo += mto;
            this.totalGeneralUSD += mto;
          }
        });
      });
    });

    this.resumenMarcas = Object.values(mapaMarcas).sort((a, b) => b.saldo - a.saldo);
  }
}
