import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AuxService } from '../../../../services/aux-service.service';
import { ConfigService } from '../../../../services/config.service';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-edit-machine',
  standalone: true,
  imports: [NzInputModule, NzIconModule, CommonModule, ReactiveFormsModule, MatDialogModule, SharedModule, NzFormModule],
  templateUrl: './edit-machine.component.html',
  styleUrls: ['./edit-machine.component.css']
})
export class EditMachineComponent implements OnInit {
idMachine: number;
formularioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<EditMachineComponent>
  ) {
    this.idMachine = data.idMachine;
    this.formularioForm = this.fb.group({
      idMachine: [0, ],
      name: ['', Validators.required],
    });
    if (this.data) {
      console.log(this.data);
      this.formularioForm.patchValue({
        idMachine: this.data.idMachine,
        name: this.data.name,
      });
    }
  }
  ngOnInit(): void {
  }

  
  onCancel(): void {
    this.dialogRef.close();
  }

  guardarCambios() {
    if (this.data) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  updateUser() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.configService
        .Update('Update-Machine', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Data updated successfully.',
                ''
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                '"Error updating the record.',
                data.message
              );
            }
          },
          error: (error:any) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              '"Error updating the record.',
              error.message
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Invalid form.',
        'Please review the fields and correct the errors.'
      );
    }
  }
  createUser() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.configService
        .Create('Add-Machine', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Data updated successfully.',
                ''
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error creating the record.',
                data.message
              );
            }
          },
          error: (error:any) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error creating the record.',
              error.message
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Invalid form.',
        'Please review the fields and correct the errors.'
      );
    }
  }

}