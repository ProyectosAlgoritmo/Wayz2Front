import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIncomeStatementTypesComponent } from './create-income-statement-types.component';

describe('CreateIncomeStatementTypesComponent', () => {
  let component: CreateIncomeStatementTypesComponent;
  let fixture: ComponentFixture<CreateIncomeStatementTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIncomeStatementTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIncomeStatementTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
