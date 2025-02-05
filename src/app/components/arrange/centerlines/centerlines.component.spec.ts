import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterlinesComponent } from './centerlines.component';

describe('CenterlinesComponent', () => {
  let component: CenterlinesComponent;
  let fixture: ComponentFixture<CenterlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterlinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
