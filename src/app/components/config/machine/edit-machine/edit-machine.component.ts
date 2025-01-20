import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuxService } from '../../../../services/aux-service.service';
import { ConfigService } from '../../../../services/config.service';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CrewsService } from '../../../../services/crews.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { el, id } from 'date-fns/locale';

@Component({
  selector: 'app-edit-machine',
  standalone: true,
  imports: [
    NzInputModule,
    NzIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
    NzFormModule,
    NzSelectModule,
  ],
  templateUrl: './edit-machine.component.html',
  styleUrls: ['./edit-machine.component.css'],
})
export class EditMachineComponent implements OnInit {
  idMachine: number = 0;
  crews: any;
  formularioForm: FormGroup;
  titulo: string = 'Create machine';
  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private auxService: AuxService,
    private crewsService: CrewsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditMachineComponent>
  ) {
    this.formularioForm = this.fb.group({
      idMachine: [0],
      name: [null, Validators.required],
      idCrew: [null, Validators.required],
    });
    if (this.data) {
      this.titulo = 'Edit machine';
      this.formularioForm.patchValue({
        idMachine: this.data.idMachine,
        name: this.data.name,
        idCrew: this.data.idCrew,
      });
    }
  }
  ngOnInit(): void {
    this.GetCrews();
  }

  GetCrews() {
    this.auxService.ventanaCargando();
    this.crewsService.get('get-all-crews').subscribe({
      next: (data: any) => {
        // this.dataSource = data.data;
        this.crews = data.data.filter((x: any) => x.isActive);
        let idCrew = this.crews.filter((x: any) => x.idCrew == this.formularioForm.get('idCrew')?.value);
        if (idCrew.length == 0) {
          this.auxService.AlertWarning('Warning', 'This crew is no longer available');
          this.formularioForm.get('idCrew')?.setValue(null);
        }else{
          this.auxService.cerrarVentanaCargando();
        }
        //this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error loading crews: ', error);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  guardarCambios() {
    // Marca todos los controles como tocados
    this.formularioForm.markAllAsTouched();

    // Fuerza la actualización de validez de cada control
    Object.keys(this.formularioForm.controls).forEach((key) => {
      this.formularioForm.get(key)?.updateValueAndValidity();
    });

    // Verifica si el formulario es válido
    if (this.formularioForm.invalid) {
      this.auxService.AlertWarning(
        'Invalid form.',
        'Please review the fields and correct the errors.'
      );
      return;
    }

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
          next: async (data: any) => {
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
          error: (error: any) => {
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
          next: async (data: any) => {
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
          error: (error: any) => {
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
