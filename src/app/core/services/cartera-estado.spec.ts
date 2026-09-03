import { TestBed } from '@angular/core/testing';
import { CarteraEstado } from './cartera-estado';

describe('CarteraEstado', () => {
  let service: CarteraEstado;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarteraEstado);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
