/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TableWithRowsChildSubcolumnComponent } from './table-with-rows-child-Subcolumn.component';

describe('TableWithRowsChildSubcolumnComponent', () => {
  let component: TableWithRowsChildSubcolumnComponent;
  let fixture: ComponentFixture<TableWithRowsChildSubcolumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableWithRowsChildSubcolumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableWithRowsChildSubcolumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
