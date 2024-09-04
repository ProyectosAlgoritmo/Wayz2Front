import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowTypesComponent } from './cash-flow-types.component';

describe('CashFlowTypesComponent', () => {
  let component: CashFlowTypesComponent;
  let fixture: ComponentFixture<CashFlowTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashFlowTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
