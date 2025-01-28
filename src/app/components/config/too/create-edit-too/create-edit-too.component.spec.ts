import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditTooComponent } from './create-edit-too.component';

describe('CreateEditTooComponent', () => {
  let component: CreateEditTooComponent;
  let fixture: ComponentFixture<CreateEditTooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditTooComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditTooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
