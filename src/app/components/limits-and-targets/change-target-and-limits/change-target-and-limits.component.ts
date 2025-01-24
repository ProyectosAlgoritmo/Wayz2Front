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
      min: [null, Validators.required],
      target: [null, Validators.required],
      max: [null, Validators.required],
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

    if (min !== null && max !== null && min > max) {
      this.auxService.AlertWarning(
        'Error',
        'the new min must be less than the new max'
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
