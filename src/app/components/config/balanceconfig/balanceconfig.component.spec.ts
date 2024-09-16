import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceconfigComponent } from './balanceconfig.component';

describe('BalanceconfigComponent', () => {
  let component: BalanceconfigComponent;
  let fixture: ComponentFixture<BalanceconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceconfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
