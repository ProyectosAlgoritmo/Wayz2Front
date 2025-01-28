import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from '../../shared/shared.module';
import { AuxService } from '../../../services/aux-service.service';
import { CenterlineService } from '../../../services/centerline.service';
import { ConfigService } from '../../../services/config.service';
import { LimitsAndTargetService } from '../../../services/limitsAndTarget.service';

@Component({
  selector: 'app-category-no-running',
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
  templateUrl: './category-no-running.component.html',
  styleUrls: ['./category-no-running.component.css']
})
export class CategoryNoRunningComponent implements OnInit {
  machines: any[] = [];
  categories: any[] = [];
  centerlines: any[] = [];
  products: any[] = [];
  idProduct: number | null = null;
  idCategory: number | null = null;
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
      idProduct: [null, Validators.required],
      comments: [null, Validators.required],
      notRunning: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getMachines();
  }

  onCategoryChange(categoryId: number): void {
    this.idCategory = categoryId;
    if (categoryId && this.products) {
      this.GetNotRunnigbyCategoryAndProduc();
    }
  }

  onMachineChange(machineId: number): void {
    this.formularioForm.patchValue({
      idCategory: null,
      idProduct: null,
    });
    this.getCategories(machineId);
    this.getProducts(machineId);
  }

  onProductsChange(productId: number) {
    this.idProduct = productId;
    if (productId && this.idCategory) {
      this.GetNotRunnigbyCategoryAndProduc();
    }
  }

  GetNotRunnigbyCategoryAndProduc() {
    this.auxService.ventanaCargando();
    if (this.idProduct && this.idCategory) {
      this.limitsAndTargetService
        .get(`Get-NotRunning/${this.idProduct}/${this.idCategory}`)
        .subscribe({
          next: (data: any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.data) {
              this.formularioForm.patchValue({
                notRunning: data.data.notRunning.toString(),
                comments: data.data.comments,
              });
            }else{ 
              this.formularioForm.patchValue({
                comments: null,
                notRunning: null,
              });
            }
          },
          error: (error: any) => {
            this.auxService.cerrarVentanaCargando();
          },
        });
    }else{
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
    this.AddUpdateNotRunning();
  }

  AddUpdateNotRunning(): void {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.limitsAndTargetService
        .Create('Add-Update-NotRunning', this.formularioForm.value)
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
