import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbonoModal } from './abono-modal';

describe('AbonoModal', () => {
  let component: AbonoModal;
  let fixture: ComponentFixture<AbonoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbonoModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AbonoModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
