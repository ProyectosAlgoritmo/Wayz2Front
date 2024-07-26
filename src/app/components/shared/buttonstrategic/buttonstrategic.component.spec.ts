import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonstrategicComponent } from './buttonstrategic.component';

describe('ButtonstrategicComponent', () => {
  let component: ButtonstrategicComponent;
  let fixture: ComponentFixture<ButtonstrategicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonstrategicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonstrategicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
