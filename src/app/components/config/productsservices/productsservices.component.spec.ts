import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsservicesComponent } from './productsservices.component';

describe('ProductsservicesComponent', () => {
  let component: ProductsservicesComponent;
  let fixture: ComponentFixture<ProductsservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsservicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
