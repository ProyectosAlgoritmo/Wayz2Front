import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditincomestatementtypecategoryComponent } from './editincomestatementtypecategory.component';

describe('EditincomestatementtypecategoryComponent', () => {
  let component: EditincomestatementtypecategoryComponent;
  let fixture: ComponentFixture<EditincomestatementtypecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditincomestatementtypecategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditincomestatementtypecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
