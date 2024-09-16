import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditzoneComponent } from './editzone.component';

describe('EditzoneComponent', () => {
  let component: EditzoneComponent;
  let fixture: ComponentFixture<EditzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditzoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
