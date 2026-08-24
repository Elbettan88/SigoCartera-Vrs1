import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-carga-excel',
  templateUrl: './carga-excel.html',
  styleUrl: './carga-excel.scss',
  imports: [NgIf, NgFor]
})
export class CargaExcelComponent {
  datosPrevisualizacion: any[] = [];
  columnas: string[] = [];
  nombreArchivo: string = '';

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length !== 1) return;

    const file = input.files[0];
    this.nombreArchivo = file.name;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      
      // Leer el libro de trabajo de Excel en formato binario
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      
      // Obtener el nombre de la primera hoja
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      
      // Convertir las filas a formato JSON legible
      const json: any[] = XLSX.utils.sheet_to_json(ws);
      
      if (json.length > 0) {
        // Extraer los nombres de las columnas para las cabeceras
        this.columnas = Object.keys(json[0]);
        // Mostrar los primeros 5 registros como previsualización
        this.datosPrevisualizacion = json.slice(0, 5);
      }
    };
    
    reader.readAsBinaryString(file);
  }
}
