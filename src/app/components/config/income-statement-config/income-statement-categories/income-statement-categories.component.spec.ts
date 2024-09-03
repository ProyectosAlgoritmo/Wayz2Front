import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeStatementCategoriesComponent } from './income-statement-categories.component';

describe('IncomeStatementCategoriesComponent', () => {
  let component: IncomeStatementCategoriesComponent;
  let fixture: ComponentFixture<IncomeStatementCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeStatementCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeStatementCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
