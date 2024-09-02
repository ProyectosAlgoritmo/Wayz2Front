import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablezComponent } from './tablez.component';

describe('TablezComponent', () => {
  let component: TablezComponent;
  let fixture: ComponentFixture<TablezComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablezComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablezComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
