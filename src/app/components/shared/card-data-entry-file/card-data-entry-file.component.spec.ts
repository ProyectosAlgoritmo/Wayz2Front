/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardDataEntryFileComponent } from './card-data-entry-file.component';

describe('CardDataEntryFileComponent', () => {
  let component: CardDataEntryFileComponent;
  let fixture: ComponentFixture<CardDataEntryFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDataEntryFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDataEntryFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
