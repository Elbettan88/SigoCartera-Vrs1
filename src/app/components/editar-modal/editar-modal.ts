import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-modal.html', // Sincronizado con el archivo físico
  styleUrls: ['./editar-modal.scss'],
})
export class EditarModalComponent implements OnInit {
  @Input() clienteActivo: any = null;
  @Input() marcaActiva: any = null;

  @Output() alCerrar = new EventEmitter<void>();
  @Output() alGuardarCambios = new EventEmitter<any>();

  esMarca: boolean = false;
  nombreEntidad: string = '';
  codigoInternoAdicional: string = '';

  ngOnInit() {
    if (this.marcaActiva) {
      this.esMarca = true;
      this.nombreEntidad = this.marcaActiva.nombre_marca;
      this.codigoInternoAdicional = this.marcaActiva.codigo_interno || '';
    } else if (this.clienteActivo) {
      this.esMarca = false;
      this.nombreEntidad = this.clienteActivo.razon_social;
    }
  }

  cerrar() {
    this.alCerrar.emit();
  }

  guardar() {
    if (!this.nombreEntidad.trim()) {
      alert('El nombre comercial o razón social no puede quedar vacío.');
      return;
    }

    this.alGuardarCambios.emit({
      esMarca: this.esMarca,
      nuevoNombre: this.nombreEntidad,
      nuevoCodigoInterno: this.codigoInternoAdicional,
    });
  }
}
