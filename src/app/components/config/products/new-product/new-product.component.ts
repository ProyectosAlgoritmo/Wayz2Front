import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuxService } from '../../../../services/aux-service.service';
import { ConfigService } from '../../../../services/config.service';
import { CrewsService } from '../../../../services/crews.service';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from '../../../shared/shared.module';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-new-product',
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
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent implements OnInit {
  idProduct: number = 0;
  machines: any;
  formularioForm: FormGroup;
  titulo: string = 'Create product';
  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<NewProductComponent>
  ) {
    this.formularioForm = this.fb.group({
      idProduct: [0],
      name: [null, Validators.required],
      idMachine: [null, Validators.required],
    });
    if (this.data) {
      this.titulo = 'Edit product';
      this.formularioForm.patchValue({
        idProduct: this.data.idProduct,
        name: this.data.name,
        idMachine: this.data.idMachine,
      });
    }
  }
  ngOnInit(): void {
    this.GetMachines();
  }

  GetMachines() {
    this.auxService.ventanaCargando();
    this.configService.get('get-all-machines').subscribe({
      next: (data: any) => {
        // this.dataSource = data.data;
        this.machines = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error loading machines: ', error);
      },
    });
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
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.configService
        .Update('Update-Product', this.formularioForm.value)
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
    // Procede con la lógica si el formulario es válido
    this.auxService.ventanaCargando();
    this.configService
      .Create('Add-Product', this.formularioForm.value)
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
  }
}
