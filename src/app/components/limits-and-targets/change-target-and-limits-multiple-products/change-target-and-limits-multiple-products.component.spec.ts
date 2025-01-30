/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChangeTargetAndLimitsMultipleProductsComponent } from './change-target-and-limits-multiple-products.component';

describe('ChangeTargetAndLimitsMultipleProductsComponent', () => {
  let component: ChangeTargetAndLimitsMultipleProductsComponent;
  let fixture: ComponentFixture<ChangeTargetAndLimitsMultipleProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTargetAndLimitsMultipleProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTargetAndLimitsMultipleProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
