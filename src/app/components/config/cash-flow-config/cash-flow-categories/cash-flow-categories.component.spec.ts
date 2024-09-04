import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowCategoriesComponent } from './cash-flow-categories.component';

describe('CashFlowCategoriesComponent', () => {
  let component: CashFlowCategoriesComponent;
  let fixture: ComponentFixture<CashFlowCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashFlowCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
