import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyperformanindicatorsComponent } from './keyperformanindicators.component';

describe('KeyperformanindicatorsComponent', () => {
  let component: KeyperformanindicatorsComponent;
  let fixture: ComponentFixture<KeyperformanindicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyperformanindicatorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyperformanindicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
