import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditproductsservicesComponent } from './editproductsservices.component';

describe('EditproductsservicesComponent', () => {
  let component: EditproductsservicesComponent;
  let fixture: ComponentFixture<EditproductsservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditproductsservicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditproductsservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
