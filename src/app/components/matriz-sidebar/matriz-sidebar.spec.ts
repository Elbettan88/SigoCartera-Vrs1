import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatrizSidebar } from './matriz-sidebar';

describe('MatrizSidebar', () => {
  let component: MatrizSidebar;
  let fixture: ComponentFixture<MatrizSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrizSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(MatrizSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
