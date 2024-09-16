import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatebalancetypecategoryComponent } from './createbalancetypecategory.component';

describe('CreatebalancetypecategoryComponent', () => {
  let component: CreatebalancetypecategoryComponent;
  let fixture: ComponentFixture<CreatebalancetypecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatebalancetypecategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatebalancetypecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
