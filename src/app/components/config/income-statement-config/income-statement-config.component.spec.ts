import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeStatementConfigComponent } from './income-statement-config.component';

describe('IncomeStatementConfigComponent', () => {
  let component: IncomeStatementConfigComponent;
  let fixture: ComponentFixture<IncomeStatementConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeStatementConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeStatementConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
