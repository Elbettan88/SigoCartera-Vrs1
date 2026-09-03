import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-abono-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './abono-modal.html',
  styleUrls: ['./abono-modal.scss'],
})
export class AbonoModalComponent implements OnInit {
  // Recibe la información del documento activo en el Dashboard
  @Input() facturaActiva: any = null;

  @Output() alCerrar = new EventEmitter<void>();
  @Output() alAplicarAbono = new EventEmitter<number>();

  montoAbono: number | null = null;

  ngOnInit() {
    // Inicializamos el abono sugiriendo la liquidación total por comodidad
    if (this.facturaActiva) {
      this.montoAbono = this.facturaActiva.saldo;
    }
  }

  cerrar() {
    this.alCerrar.emit();
  }

  procesarAbono() {
    if (this.montoAbono === null || this.montoAbono <= 0) {
      alert('Por favor, ingrese un monto de abono válido mayor a cero.');
      return;
    }

    if (this.montoAbono > this.facturaActiva.saldo) {
      alert(
        `El monto ingresado excede el saldo vivo de la factura (Saldo actual: ${this.facturaActiva.moneda} ${this.facturaActiva.saldo}).`,
      );
      return;
    }

    // Emitimos la cantidad aprobada al componente padre
    this.alAplicarAbono.emit(Number(this.montoAbono));
  }
}
