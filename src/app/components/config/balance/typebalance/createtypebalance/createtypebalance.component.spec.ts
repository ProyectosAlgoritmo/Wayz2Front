import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatetypebalanceComponent } from './createtypebalance.component';

describe('CreatetypebalanceComponent', () => {
  let component: CreatetypebalanceComponent;
  let fixture: ComponentFixture<CreatetypebalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatetypebalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatetypebalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
