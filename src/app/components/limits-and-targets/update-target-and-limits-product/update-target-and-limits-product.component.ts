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
import { SharedStateService } from '../../../services/shared-state.service';
import { CardPercentageComponent } from '../../shared/card-percentage/card-percentage.component';
import { SharedModule } from '../../shared/shared.module';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { LimitsAndTargetService } from '../../../services/limitsAndTarget.service';
import { da, ro, tr } from 'date-fns/locale';
import { ConfigService } from '../../../services/config.service';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-update-target-and-limits-product',
  standalone: true,
  providers: [
    {
      provide: NZ_ICONS,
      useValue: [
        CloudDownloadOutline,
        CloudUploadOutline,
        PlayCircleOutline,
        EyeOutline,
        EditOutline,
      ],
    },
  ],
  imports: [
    TableWithRowsChildComponent,
    FormsModule,
    NgFor,
    NzInputModule,
    MatToolbarModule,
    NzOptionComponent,
    NzSelectModule,
    NzIconModule,
    SharedModule,
    BaseChartDirective,
    NzCardModule,
    CardPercentageComponent,
    NzFormModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-target-and-limits-product.component.html',
  styleUrls: ['./update-target-and-limits-product.component.css'],
})
export class UpdateTargetAndLimitsProductComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  [x: string]: any;
  dataForTable: any[] = [];
  machines: any[] = [];
  products: any[] = [];
  searchValue: string = '';
  formularioForm: FormGroup;
  emitEditToParent = false;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private auxService: AuxService,
    private configService: ConfigService,
    private limitsAndTargetService: LimitsAndTargetService,
  ) {
    this.formularioForm = this.fb.group({
      idMachine: [null, Validators.required],
      idProduct: [null, Validators.required],
    });
  }

  mainTableColumns = [
    {
      title: 'Categories',
      field: 'categories',
      sortDirection: null,
      editable: false,
      controlType: 'text',
    },
  ];

  subTableColumns = [
    {
      title: 'Acciones',
      field: 'Acciones',
      sortDirection: null,
      editable: false,
      controlType: 'text',
    },
    {
      title: 'Centerline',
      field: 'centerline',
      sortDirection: null,
      editable: false,
      controlType: 'text',
    },
    {
      title: 'Current min',
      field: 'CurrentMin',
      sortDirection: null,
      editable: false,
      controlType: 'text',
    },
    {
      title: 'Current target',
      field: 'CurrentTarget',
      sortDirection: null,
      editable: false,
      controlType: 'text',
    },
    {
      title: 'Current max',
      field: 'CurrentMax',
      sortDirection: null,
      editable: false,
      controlType: 'text',
    },
    {
      title: 'New min',
      field: 'NewMin',
      sortDirection: null,
      editable: true,
      controlType: 'number',
    },
    {
      title: 'New target',
      field: 'NewTarget',
      sortDirection: null,
      editable: true,
      controlType: 'text',
    },
    {
      title: 'New max',
      field: 'NewMax',
      sortDirection: null,
      editable: true,
      controlType: 'text',
    },
    {
      title: '360 variable',
      field: 'Degree360',
      sortDirection: null,
      editable: true,
      controlType: 'checkbox',
    },
  ];

  ngOnInit() {
    this.getMachines();
    
  }
  onEditClicked(rowData: any) {
    rowData.isEditing = true;
  }

  onSubTableDataCanceled(rowData: any) {
    rowData.isEditing = false;
    rowData.NewMin = '';
    rowData.NewMax = '';
    rowData.NewTarget = '';
  }

  onMachineChange(machineId: number): void {
    this.formularioForm.patchValue({
      idProduct: null,
      idCenterline: null,
    });
    this.getProducts(machineId);
  }
  onProductsChange(IdProduct: number): void {
    this.GetAllLimitsAndTargets(IdProduct);
  }


  getMachines() {
    this.auxService.ventanaCargando();
    this.configService.get('get-all-machines').subscribe({
      next: (data: any) => {
        this.machines = data.data;
        //this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error loading machines: ', error);
      },
    });
  }

  getProducts(idMachine: number): void {
    this.configService.get(`Get-All-Products`).subscribe({
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


  onSubTableDataSaved(rowData: any) {
    if (
      rowData.NewMin.toString().trim() == '' ||
      typeof parseFloat(rowData.NewMin) != 'number'
    ) {
      this.auxService.AlertWarning('Error', 'the new min must be a number');
      return;
    }
    if (
      rowData.NewMax.toString().trim() == '' ||
      typeof parseFloat(rowData.NewMax) != 'number'
    ) {
      this.auxService.AlertWarning('Error', 'the new max must be a number');
      return;
    }
    if (rowData.NewTarget.toString().trim() == '') {
      this.auxService.AlertWarning('Error', 'the new target must be a string');
      return;
    }

    if(parseFloat(rowData.NewMin) > parseFloat(rowData.NewMax)){
      this.auxService.AlertWarning('Error', 'the new min must be less than the new max');
      return;
    }

    this.updateLimitsAndTarget(rowData);
  }

  updateLimitsAndTarget(rowData: any) {
    let dataApi = {
      idLimitsAndTargets: rowData.IdLimitsAndTargets,
      min: rowData.NewMin,
      max: rowData.NewMax,
      target: rowData.NewTarget,
      degree360: rowData.Degree360,
      IdProduct: 0,
    };
    this.auxService.ventanaCargando();
    this.limitsAndTargetService
      .Update('Update-LimitsAndTarget', dataApi)
      .subscribe({
        next: async (data: any) => {
          this.auxService.cerrarVentanaCargando();
          if (data.success) {
            await this.auxService.AlertSuccess(
              'Data registered successfully.',
              ''
            );
            rowData.isEditing = false;
            rowData.CurrentMin = rowData.NewMin;
            rowData.CurrentMax = rowData.NewMax;
            rowData.CurrentTarget = rowData.NewTarget;
            rowData.Degree360 = rowData.Degree360;
            rowData.NewMin = '';
            rowData.NewMax = '';
            rowData.NewTarget = '';
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

  GetAllLimitsAndTargets(IdProduct: number) {
    this.auxService.ventanaCargando();
    this.limitsAndTargetService
      .get('Get-All-LimitsAndTargets')
      .subscribe(async (data: any) => {
        this.dataForTable = data.data;
        if (this.chart) {
          this.chart.update();
        }

        this.auxService.cerrarVentanaCargando();
      });
  }
}
