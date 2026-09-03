import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-factura-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura-modal.html', // Apunta al archivo físico del disco
  styleUrls: ['./factura-modal.scss'],
})
export class FacturaModalComponent implements OnInit {
  @Input() nitPreseleccionado: string = '';
  @Input() codigoHijoPreseleccionado: string = '';

  @Output() alCerrar = new EventEmitter<void>();
  @Output() alGuardar = new EventEmitter<any>();

  nuevaFactura: any = {
    nitCliente: '',
    codigoHijoMarca: '',
    no_factura: '',
    moneda: 'GTQ',
    saldo: null,
    dias_vencidos: 0,
  };

  ngOnInit() {
    this.nuevaFactura.nitCliente = this.nitPreseleccionado;
    this.nuevaFactura.codigoHijoMarca = this.codigoHijoPreseleccionado;
  }

  cerrar() {
    this.alCerrar.emit();
  }

  enviarFormulario() {
    if (
      !this.nuevaFactura.nitCliente ||
      !this.nuevaFactura.codigoHijoMarca ||
      !this.nuevaFactura.no_factura ||
      this.nuevaFactura.saldo === null
    ) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this.alGuardar.emit({
      nitCliente: this.nuevaFactura.nitCliente,
      codigoHijoMarca: this.nuevaFactura.codigoHijoMarca,
      factura: {
        no_factura: this.nuevaFactura.no_factura,
        moneda: this.nuevaFactura.moneda,
        saldo: Number(this.nuevaFactura.saldo),
        dias_vencidos: Number(this.nuevaFactura.dias_vencidos),
      },
    });
  }
}
