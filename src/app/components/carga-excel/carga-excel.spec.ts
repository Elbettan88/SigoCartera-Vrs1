import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CargaExcel } from './carga-excel';

describe('CargaExcel', () => {
  let component: CargaExcel;
  let fixture: ComponentFixture<CargaExcel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaExcel],
    }).compileComponents();

    fixture = TestBed.createComponent(CargaExcel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
