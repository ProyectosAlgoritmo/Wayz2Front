import { Component, OnInit, Provider, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  CloudDownloadOutline,
  CloudUploadOutline,
  PlayCircleOutline,
  EyeOutline,
  EditOutline,
} from '@ant-design/icons-angular/icons';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NzCardModule } from 'ng-zorro-antd/card';
import { registerables } from 'chart.js';
import { AuxService } from '../../../services/aux-service.service';
import { SharedModule } from '../../shared/shared.module';
import { da, ro, tr } from 'date-fns/locale';
import { ConfigService } from '../../../services/config.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Router } from '@angular/router';
import { TooService } from '../../../services/too.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ArrangeService } from '../../../services/arrange.service';
import { NzTableModule } from 'ng-zorro-antd/table';

interface DataItem {
  key: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NzInputModule,
    MatToolbarModule,
    NzOptionComponent,
    NzSelectModule,
    NzIconModule,
    SharedModule,
    NzCardModule,
    NzFormModule,
    ReactiveFormsModule,
    NzTableModule,
    CommonModule,
    DragDropModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  machines: any[] = [];
  categories: any[] = [];
  centerlines: any[] = [];
  products: any[] = [];
  searchValue: string = '';
  final_centerline: number = 0;
  formularioForm: FormGroup;
  enablebutton = false;
  emitEditToParent = false;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private auxService: AuxService,
    private configService: ConfigService,
    private router: Router,
    private tooService: TooService,
    private arrangeService: ArrangeService
  ) {
    this.formularioForm = this.fb.group({
      idMachine: [null, Validators.required],
      idCategory: [null, Validators.required],
      idCenterline: [null, Validators.required],
    });
  }
  ngOnInit() {
    this.getMachines();
    this.final_centerline = 0;
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

  onMachineChange(machineId: number): void {
    this.final_centerline = 0;

    if (machineId != null) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        idMachie: machineId,
        idCategory: null,
        idCenterline: null,
      });
      this.auxService.ventanaCargando();
      this.getProducts(machineId);
      this.auxService.cerrarVentanaCargando();
    }
  }
  onCategoryChange(categoryId: number): void {
    this.final_centerline = 0;

    if (categoryId != null) {
      this.auxService.ventanaCargando();

      this.tooService.ObtenerCenterlines(categoryId).subscribe({
        next: (data: any) => {
          this.centerlines = data.data;
          this.auxService.cerrarVentanaCargando();
        },
        error: (error: any) => {
          this.auxService.AlertError('Error loading centerlines: ', error);
        },
      })
    }
  }

  drop(event: CdkDragDrop<DataItem[]>): void {
    moveItemInArray(this.products, event.previousIndex, event.currentIndex);
  }

  getProducts(idMachine: number): void {
    this.configService.get('Get-All-Products').subscribe({
      next: (data: any) => {
        this.products = data.data.filter((x: any) => x.idMachine === idMachine);
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando(); // Asegúrate de cerrar la ventana en caso de error
        this.auxService.AlertError('Error loading categories: ', error);
      },
    });
  }

  onCenterlineChange(CenterlineId: number): void {
    if (CenterlineId != null) {
      this.final_centerline = CenterlineId
      console.log(this.final_centerline)
    }
  }

  Continue() {
    this.auxService.ventanaCargando();
    this.arrangeService
      .arrange('Arrange-products', this.products)
      .subscribe({
        next: async (data: any) => {
          this.auxService.cerrarVentanaCargando();
          if (data.success) {
            return this.auxService.AlertSuccess('Categories arranged successfully.', '');
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
