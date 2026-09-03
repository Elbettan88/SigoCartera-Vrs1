import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteQuetzales } from './reporte-quetzales';

describe('ReporteQuetzales', () => {
  let component: ReporteQuetzales;
  let fixture: ComponentFixture<ReporteQuetzales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteQuetzales],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteQuetzales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
