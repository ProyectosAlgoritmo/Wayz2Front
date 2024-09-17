import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatezoneComponent } from './createzone.component';

describe('CreatezoneComponent', () => {
  let component: CreatezoneComponent;
  let fixture: ComponentFixture<CreatezoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatezoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatezoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
