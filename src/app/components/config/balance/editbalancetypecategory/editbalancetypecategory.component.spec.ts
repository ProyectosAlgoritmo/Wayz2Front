import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditbalancetypecategoryComponent } from './editbalancetypecategory.component';

describe('EditbalancetypecategoryComponent', () => {
  let component: EditbalancetypecategoryComponent;
  let fixture: ComponentFixture<EditbalancetypecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditbalancetypecategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditbalancetypecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
