import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditbusinessunitComponent } from './editbusinessunit.component';

describe('EditbusinessunitComponent', () => {
  let component: EditbusinessunitComponent;
  let fixture: ComponentFixture<EditbusinessunitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditbusinessunitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditbusinessunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
