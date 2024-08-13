import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadImportComponent } from './file-upload-import.component';

describe('FileUploadImportComponent', () => {
  let component: FileUploadImportComponent;
  let fixture: ComponentFixture<FileUploadImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
