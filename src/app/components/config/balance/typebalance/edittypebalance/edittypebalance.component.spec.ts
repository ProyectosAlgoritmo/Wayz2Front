import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdittypebalanceComponent } from './edittypebalance.component';

describe('EdittypebalanceComponent', () => {
  let component: EdittypebalanceComponent;
  let fixture: ComponentFixture<EdittypebalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdittypebalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdittypebalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
