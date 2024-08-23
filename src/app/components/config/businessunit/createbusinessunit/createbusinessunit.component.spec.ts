import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatebusinessunitComponent } from './createbusinessunit.component';

describe('CreatebusinessunitComponent', () => {
  let component: CreatebusinessunitComponent;
  let fixture: ComponentFixture<CreatebusinessunitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatebusinessunitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatebusinessunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
