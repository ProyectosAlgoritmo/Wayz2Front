import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIncomeStatementCategoriesComponent } from './create-income-statement-categories.component';

describe('CreateIncomeStatementCategoriesComponent', () => {
  let component: CreateIncomeStatementCategoriesComponent;
  let fixture: ComponentFixture<CreateIncomeStatementCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIncomeStatementCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIncomeStatementCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
