import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIncomeStatementCategoriesComponent } from './edit-income-statement-categories.component';

describe('EditIncomeStatementCategoriesComponent', () => {
  let component: EditIncomeStatementCategoriesComponent;
  let fixture: ComponentFixture<EditIncomeStatementCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditIncomeStatementCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIncomeStatementCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
