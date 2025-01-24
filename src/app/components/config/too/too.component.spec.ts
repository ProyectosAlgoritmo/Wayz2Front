import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooComponent } from './too.component';

describe('TooComponent', () => {
  let component: TooComponent;
  let fixture: ComponentFixture<TooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
