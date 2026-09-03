import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte-quetzales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-quetzales.html',
  styleUrls: ['./reporte-quetzales.scss'],
})
export class ReporteQuetzalesComponent implements OnChanges {
  // Recibe la lista maestra de la cartera desde el componente padre
  @Input() datosCartera: any[] = [];

  // Arreglo optimizado para renderizar el resumen en el sidebar
  resumenMarcas: any[] = [];
  totalGeneralGTQ: number = 0;

  // Escucha cambios en los datos en tiempo real (ej: si agregan facturas o abonos)
  ngOnChanges() {
    this.calcularReporte();
  }

  calcularReporte() {
    const mapaMarcas: { [key: string]: { nombre: string; codigoInterno: string; saldo: number } } =
      {};
    this.totalGeneralGTQ = 0;

    // Recorremos la estructura Pivot: Cliente ➔ Marca ➔ Facturas
    this.datosCartera.forEach((cliente) => {
      (cliente.marcas || []).forEach((marca: any) => {
        // Usamos el código hijo como llave única para consolidar
        const llave = marca.codigo_hijo;

        if (!mapaMarcas[llave]) {
          mapaMarcas[llave] = {
            nombre: marca.nombre_marca,
            codigoInterno: marca.codigo_interno || '',
            saldo: 0,
          };
        }

        // Sumar únicamente documentos en Quetzales
        (marca.facturas || []).forEach((fac: any) => {
          if (fac.moneda === 'GTQ') {
            const mto = fac.saldo || 0;
            mapaMarcas[llave].saldo += mto;
            this.totalGeneralGTQ += mto;
          }
        });
      });
    });

    // Convertimos el mapa en un arreglo ordenado de mayor a menor deuda
    this.resumenMarcas = Object.values(mapaMarcas).sort((a, b) => b.saldo - a.saldo);
  }
}
