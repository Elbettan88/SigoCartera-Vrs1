import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarteraEstadoService {
  private monedaActivaSource = new BehaviorSubject<'GTQ' | 'USD'>('GTQ');
  monedaActiva$ = this.monedaActivaSource.asObservable();

  setMoneda(moneda: 'GTQ' | 'USD') {
    this.monedaActivaSource.next(moneda);
  }

  obtenerMonedaActual(): 'GTQ' | 'USD' {
    return this.monedaActivaSource.value;
  }
}
