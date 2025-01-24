import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTooComponent } from './create-too.component';

describe('CreateTooComponent', () => {
  let component: CreateTooComponent;
  let fixture: ComponentFixture<CreateTooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTooComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
