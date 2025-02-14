import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuxService } from '../../../services/aux-service.service';
import { CenterlineService } from '../../../services/centerline.service';
import { ConfigService } from '../../../services/config.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from '../../shared/shared.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { LimitsAndTargetService } from '../../../services/limitsAndTarget.service';
import { el, th } from 'date-fns/locale';

@Component({
  selector: 'app-change-target-and-limits',
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
    NzCheckboxModule,
  ],
  templateUrl: './change-target-and-limits.component.html',
  styleUrls: ['./change-target-and-limits.component.css'],
})
export class ChangeTargetAndLimitsComponent implements OnInit {
  machines: any[] = [];
  categories: any[] = [];
  centerlines: any[] = [];
  products: any[] = [];
  idProduct: number | null = null;
  idCenterline: number | null = null;
  formularioForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private configService: ConfigService,
    private centerlineService: CenterlineService,
    private limitsAndTargetService: LimitsAndTargetService
  ) {
    this.formularioForm = this.fb.group({
      idMachine: [null, Validators.required],
      idCategory: [null, Validators.required],
      idCenterline: [null, Validators.required],
      idProduct: [null, Validators.required],
      min: [null],
      target: [null],
      max: [null],
      degree360: [false],
    });
  }

  ngOnInit(): void {
    this.getMachines();
  }

  onCategoryChange(categoryId: number): void {
    this.formularioForm.patchValue({ idCenterline: null });
    this.getCenterlines(categoryId);
  }

  onMachineChange(machineId: number): void {
    this.formularioForm.patchValue({
      idCategory: null,
      idProduct: null,
      idCenterline: null,
    });
    this.getCategories(machineId);
    this.getProducts(machineId);
  }

  onProductsChange(productId: number) {
    this.idProduct = productId;
    if (productId && this.idCenterline) {
      this.GetLimitsAndTarget();
    }
  }

  onCenterlineChange(centerlineId: number) {
    this.idCenterline = centerlineId;
    if (this.idProduct && centerlineId) {
      this.GetLimitsAndTarget();
    }
  }

  GetLimitsAndTarget() {
    this.auxService.ventanaCargando();
    if (this.idProduct && this.idCenterline) {
      this.limitsAndTargetService
        .get(`Get-LimitsAndTarget/${this.idProduct}/${this.idCenterline}`)
        .subscribe({
          next: (data: any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.data) {
              this.formularioForm.patchValue({
                min: data.data.min,
                target: data.data.target,
                max: data.data.max,
                degree360: data.data.degree360,
              });
            } else {
              this.formularioForm.patchValue({
                min: null,
                target: null,
                max: null,
                degree360: null,
              });
            }
          },
          error: (error: any) => {
            this.auxService.cerrarVentanaCargando();
          },
        });
    } else {
      this.auxService.cerrarVentanaCargando();
    }
  }

  getMachines() {
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

  getCategories(idMachine: number | null): void {
    if (!idMachine) {
      this.categories = []; // Limpia las categorías si no hay máquina seleccionada
      return;
    }

    this.auxService.ventanaCargando();

    this.configService.get('get-all-Categorys').subscribe({
      next: (data: any) => {
        this.categories = data.data.filter(
          (x: any) => x.idMachine === idMachine
        );
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando(); // Asegúrate de cerrar la ventana en caso de error
        this.auxService.AlertError('Error loading categories: ', error);
      },
    });
  }

  getProducts(idMachine: number): void {
    this.configService.get(`Get-All-Products`).subscribe({
      next: (data: any) => {
        this.products = data.data.filter((x: any) => x.idMachine === idMachine);
        console.log('products', this.products);
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando(); // Asegúrate de cerrar la ventana en caso de error
        this.auxService.AlertError('Error loading categories: ', error);
      },
    });
  }

  getCenterlines(idCategory: number): void {
    this.centerlineService.get('Get-All-Centerline').subscribe({
      next: (data: any) => {
        this.centerlines = data.data.filter(
          (x: any) => x.idCategory == idCategory
        );
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando(); // Asegúrate de cerrar la ventana en caso de error
        this.auxService.AlertError('Error loading categories: ', error);
      },
    });
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

    const min = this.formularioForm.get('min')?.value;
    const max = this.formularioForm.get('max')?.value;
    const degree360 = this.formularioForm.get('degree360')?.value;
    const target = this.formularioForm.get('target')?.value;

    // Convertir a string solo si hay un valor definido, de lo contrario asignar ''
    const minStr = min != null ? min.toString().trim() : '';
    const maxStr = max != null ? max.toString().trim() : '';
    const targetStr = target != null ? target.toString().trim() : '';

    // Si min o max tiene valor, el otro es obligatorio
    if ((minStr !== '' && maxStr === '') || (maxStr !== '' && minStr === '')) {
      this.auxService.AlertWarning(
        'Error',
        'Both min and max must be provided together.'
      );
      return;
    }

    // Validar que min y max sean números SOLO si tienen valor
    if (minStr !== '' && isNaN(Number(minStr))) {
      this.auxService.AlertWarning('Error', 'The min value must be a number.');
      return;
    }

    if (maxStr !== '' && isNaN(Number(maxStr))) {
      this.auxService.AlertWarning('Error', 'The max value must be a number.');
      return;
    }

    // Si min y max están vacíos, target es obligatorio
    if (minStr === '' && maxStr === '' && targetStr === '') {
      this.auxService.AlertWarning(
        'Error',
        'The target is required if min and max are empty.'
      );
      return;
    }

    // Validar que min no sea mayor que max si ambos tienen valores
    if (
      minStr !== '' &&
      maxStr !== '' &&
      Number(minStr) > Number(maxStr) &&
      !degree360
    ) {
      this.auxService.AlertWarning(
        'Error',
        'The min value must be less than the max value.'
      );
      return;
    }

    this.createLimitsAndTarget();
  }

  createLimitsAndTarget(): void {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.limitsAndTargetService
        .Create('Add-LimitsAndTarget', this.formularioForm.value)
        .subscribe({
          next: async (data: any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              this.formularioForm.reset();
              await this.auxService.AlertSuccess(
                'Data registered successfully.',
                ''
              );
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

  onCancel() {
    this.formularioForm.reset();
  }
}
