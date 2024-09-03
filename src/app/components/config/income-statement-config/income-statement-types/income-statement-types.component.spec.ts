import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeStatementTypesComponent } from './income-statement-types.component';

describe('IncomeStatementTypesComponent', () => {
  let component: IncomeStatementTypesComponent;
  let fixture: ComponentFixture<IncomeStatementTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeStatementTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeStatementTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
