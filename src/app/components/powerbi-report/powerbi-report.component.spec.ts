import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBiReportComponent } from './powerbi-report.component';

describe('PowerBiReportComponent', () => {
  let component: PowerBiReportComponent;
  let fixture: ComponentFixture<PowerBiReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerBiReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerBiReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
