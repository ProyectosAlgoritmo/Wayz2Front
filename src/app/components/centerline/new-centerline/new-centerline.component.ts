import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from '../../shared/shared.module';
import { AuxService } from '../../../services/aux-service.service';
import { ConfigService } from '../../../services/config.service';
import { NewProductComponent } from '../../config/products/new-product/new-product.component';
import { CenterlineService } from '../../../services/centerline.service';

@Component({
  selector: 'app-new-centerline',
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
    FormsModule,
  ],
  templateUrl: './new-centerline.component.html',
  styleUrls: ['./new-centerline.component.css']
})
export class NewCenterlineComponent implements OnInit {
  idCenterline: number = 0;
  categories: any;
  machines: any;
  formularioForm: FormGroup;
  titulo: string = 'Create centerline';
  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private centerlineService: CenterlineService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<NewProductComponent>
  ) {
    this.formularioForm = this.fb.group({
      idCenterline: [0],
      name: [null, Validators.required],
      idCategory: [null, Validators.required],
      idMachine: [0, ],
    });
    if (this.data) {
      this.titulo = 'Edit centerline';
      this.formularioForm.patchValue({
        idCenterline: this.data.idCenterline,
        name: this.data.name,
        idCategory: this.data.idCategory,
        idMachine: this.data.idMachine,
      });
      this.GetCategories(this.data.idMachine);
    }
  }
  ngOnInit(): void {
    this.GetMachines();
  }

  changeMachine(event: any) {
    this.formularioForm.patchValue({
      idCategory: null,
    });
    this.GetCategories(event);
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

  GetCategories(idMachine: number | null): void {
    if (!idMachine) {
      this.categories = []; // Limpia las categorías si no hay máquina seleccionada
      return;
    }
  
    this.auxService.ventanaCargando();
  
    this.configService.get('get-all-Categorys').subscribe({
      next: (data: any) => {
        this.categories = data.data.filter((x: any) => x.idMachine === idMachine);
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando(); // Asegúrate de cerrar la ventana en caso de error
        this.auxService.AlertError('Error loading categories: ', error);
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
      this.centerlineService
        .Update('Update-Centerline', this.formularioForm.value)
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
    this.centerlineService
      .Create('Add-Centerline', this.formularioForm.value)
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
