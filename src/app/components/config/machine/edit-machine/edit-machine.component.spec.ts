/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditMachineComponent } from './edit-machine.component';

describe('EditMachineComponent', () => {
  let component: EditMachineComponent;
  let fixture: ComponentFixture<EditMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
