import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerbiReportSimpleComponent } from './powerbi-report-simple.component';

describe('PowerbiReportSimpleComponent', () => {
  let component: PowerbiReportSimpleComponent;
  let fixture: ComponentFixture<PowerbiReportSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerbiReportSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerbiReportSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
