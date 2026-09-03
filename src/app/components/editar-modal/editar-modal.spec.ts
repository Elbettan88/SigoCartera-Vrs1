import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarModal } from './editar-modal';

describe('EditarModal', () => {
  let component: EditarModal;
  let fixture: ComponentFixture<EditarModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
