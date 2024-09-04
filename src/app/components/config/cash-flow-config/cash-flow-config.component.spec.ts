import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowConfigComponent } from './cash-flow-config.component';

describe('CashFlowConfigComponent', () => {
  let component: CashFlowConfigComponent;
  let fixture: ComponentFixture<CashFlowConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashFlowConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
