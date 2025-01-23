/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UpdateTargetAndLimitsProductComponent } from './update-target-and-limits-product.component';

describe('UpdateTargetAndLimitsProductComponent', () => {
  let component: UpdateTargetAndLimitsProductComponent;
  let fixture: ComponentFixture<UpdateTargetAndLimitsProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTargetAndLimitsProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTargetAndLimitsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
