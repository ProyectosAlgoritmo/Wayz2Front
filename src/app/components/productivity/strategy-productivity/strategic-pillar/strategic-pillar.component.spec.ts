/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StrategicPillarComponent } from './strategic-pillar.component';

describe('StrategicPillarComponent', () => {
  let component: StrategicPillarComponent;
  let fixture: ComponentFixture<StrategicPillarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategicPillarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategicPillarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
