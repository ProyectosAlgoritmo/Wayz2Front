import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateincomestatementtypecategoryComponent } from './createincomestatementtypecategory.component';

describe('CreateincomestatementtypecategoryComponent', () => {
  let component: CreateincomestatementtypecategoryComponent;
  let fixture: ComponentFixture<CreateincomestatementtypecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateincomestatementtypecategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateincomestatementtypecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
