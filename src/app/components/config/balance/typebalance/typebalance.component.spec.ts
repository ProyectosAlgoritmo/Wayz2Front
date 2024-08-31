import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypebalanceComponent } from './typebalance.component';

describe('TypebalanceComponent', () => {
  let component: TypebalanceComponent;
  let fixture: ComponentFixture<TypebalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypebalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypebalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
