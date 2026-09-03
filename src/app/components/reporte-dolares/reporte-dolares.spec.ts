import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteDolares } from './reporte-dolares';

describe('ReporteDolares', () => {
  let component: ReporteDolares;
  let fixture: ComponentFixture<ReporteDolares>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDolares],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteDolares);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
