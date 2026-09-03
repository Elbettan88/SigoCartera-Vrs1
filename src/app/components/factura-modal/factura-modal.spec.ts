import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturaModal } from './factura-modal';

describe('FacturaModal', () => {
  let component: FacturaModal;
  let fixture: ComponentFixture<FacturaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaModal],
    }).compileComponents();

    fixture = TestBed.createComponent(FacturaModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
