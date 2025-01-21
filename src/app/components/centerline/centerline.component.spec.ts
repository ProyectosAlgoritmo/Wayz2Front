/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CenterlineComponent } from './centerline.component';

describe('CenterlineComponent', () => {
  let component: CenterlineComponent;
  let fixture: ComponentFixture<CenterlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
