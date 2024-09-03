import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIncomeStatementTypesComponent } from './edit-income-statement-types.component';

describe('EditIncomeStatementTypesComponent', () => {
  let component: EditIncomeStatementTypesComponent;
  let fixture: ComponentFixture<EditIncomeStatementTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditIncomeStatementTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIncomeStatementTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
