import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { procesarArchivoExcelSigo } from './carga-excel.utils';

@Component({
  selector: 'app-carga-excel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carga-excel.html' // 🚀 CORREGIDO: Ruta exacta de tu plantilla HTML
})
export class CargaExcelComponent {
  archivoSeleccionado: File | null = null;
  mensajeEstado = '';
  cargando = false;
  lineasProcesadas = 0;

  constructor(private router: Router) {}

  onArchivoCambio(event: any) {
    const archivos = event.target.files;
    if (archivos && archivos.length > 0) {
      this.archivoSeleccionado = archivos[0];
      this.mensajeEstado = 'Archivo listo: ' + this.archivoSeleccionado?.name;
    }
  }

  subirYProcesarCartera() {
    if (!this.archivoSeleccionado) {
      this.mensajeEstado = 'Por favor, seleccione un archivo de Excel válido (.xlsx).';
      return;
    }

    this.cargando = true;
    this.mensajeEstado = 'Mapeando registros contables de la empresa...';

    procesarArchivoExcelSigo(this.archivoSeleccionado)
      .then((carteraActualizada) => {
        this.cargando = false;
        this.mensajeEstado = '¡Carga masiva finalizada con éxito!';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      })
      .catch((error) => {
        this.cargando = false;
        this.mensajeEstado = 'Error: ' + error;
      });
  }
}
