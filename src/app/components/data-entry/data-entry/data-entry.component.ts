import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseChartDirective } from 'ng2-charts';
import { AuxService } from '../../../services/aux-service.service';
import { ConfigService } from '../../../services/config.service';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { CardPercentageComponent } from '../../shared/card-percentage/card-percentage.component';
import { SharedModule } from '../../shared/shared.module';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import {
  CloudDownloadOutline,
  CloudUploadOutline,
  PlayCircleOutline,
  EyeOutline,
  EditOutline,
} from '@ant-design/icons-angular/icons';
import { DataEntryService } from '../../../services/data-entry.service';
@Component({
  selector: 'app-data-entry',
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
    ReactiveFormsModule,
  ],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css'],
})
export class DataEntryComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  [x: string]: any;
  dataForTable: any[] = [];
  machines: any[] = [];
  products: any[] = [];
  searchValue: string = '';
  formularioForm: FormGroup;
  emitEditToParent = false;
  machineValue: string = 'Machine 1';
  productValue: string = 'Product A';
  startTimeValue: string = '08:00 AM';
  endTimeValue: string = '04:00 PM';
  currentDatetimeValue: string = new Date().toLocaleString();
  currentShiftValue: string = 'Shift 1';
  currentTimeValue: string = new Date().toLocaleTimeString();
  initialValue: string = 'AB';
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private auxService: AuxService,
    private configService: ConfigService,
    private dataEntryService: DataEntryService
  ) {
    this.formularioForm = this.fb.group({
      initial: [null, Validators.required],
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
      title: 'Actions',
      field: 'Acciones',
      sortDirection: null,
      editable: false,
      controlType: 'text',
    },
  ];

  ngOnInit() {
    setInterval(() => {
      this.currentDatetimeValue = new Date().toLocaleString();
    }, 1000);
    this.GetAllDataEntry(5);
  }
  onEditClicked(rowData: any) {
    rowData.isEditing = true;
  }

  onSubTableDataCanceled(rowData: any) {
    rowData.isEditing = false;
    rowData.newMin = '';
    rowData.newMax = '';
    rowData.newTarget = '';
  }


  onSubTableDataSaved(rowData: any) {
    // if (
    //   rowData.newMin.toString().trim() == '' ||
    //   typeof parseFloat(rowData.newMin) != 'number'
    // ) {
    //   this.auxService.AlertWarning('Error', 'the new min must be a number');
    //   return;
    // }
    // if (
    //   rowData.newMax.toString().trim() == '' ||
    //   typeof parseFloat(rowData.newMax) != 'number'
    // ) {
    //   this.auxService.AlertWarning('Error', 'the new max must be a number');
    //   return;
    // }
    // if (rowData.newTarget.toString().trim() == '') {
    //   this.auxService.AlertWarning('Error', 'the new target must be a string');
    //   return;
    // }

    // if (
    //   parseFloat(rowData.NewMin) > parseFloat(rowData.newMax) &&
    //   !rowData.degree360
    // ) {
    //   this.auxService.AlertWarning(
    //     'Error',
    //     'the new min must be less than the new max'
    //   );
    //   return;
    // }

    this.updateLimitsAndTarget(rowData);
  }

  updateLimitsAndTarget(rowData: any) {
    console.log(`rowData`, rowData);
    let dataApi = {
      idLimitsAndTargets: rowData.idLimitsAndTargets,
      min: rowData.newMin,
      max: rowData.newMax,
      target: rowData.newTarget,
      degree360: rowData.degree360,
      idProduct: rowData.idProduct,
      idCenterline: rowData.idCenterline,
    };
    // this.auxService.ventanaCargando();
    // this.dataEntryService.Update('Update-LimitsAndTarget', dataApi).subscribe({
    //   next: async (data: any) => {
    //     this.auxService.cerrarVentanaCargando();
    //     if (data.success) {
    //       await this.auxService.AlertSuccess(
    //         'Data registered successfully.',
    //         ''
    //       );
    //       rowData.isEditing = false;
    //       rowData.currentMin = rowData.newMin;
    //       rowData.currentMax = rowData.newMax;
    //       rowData.currentTarget = rowData.newTarget;
    //       rowData.degree360 = rowData.degree360;
    //       rowData.newMin = '';
    //       rowData.newMax = '';
    //       rowData.newTarget = '';
    //     } else {
    //       this.auxService.AlertWarning(
    //         'Error creating the record.',
    //         data.message
    //       );
    //     }
    //   },
    //   error: (error: any) => {
    //     this.auxService.cerrarVentanaCargando();
    //     this.auxService.AlertError('Error creating the record.', error.message);
    //   },
    // });
  }

  GetAllDataEntry(IdProduct: number) {
    if (!IdProduct) {
      this.dataForTable = [];
      this.subTableColumns = [];
      return;
    }
  
    //this.auxService.ventanaCargando();
    
    this.dataEntryService.get(`Get-All-DataEntry/${IdProduct}`).subscribe({
      next: (data: any) => {
        this.dataForTable = this.formatDataForTable(data.data); 
        this.subTableColumns = this.generateSubTableColumns(this.dataForTable[0]?.subData || []);
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error loading data: ', error);
      },
    });
  }
  

  private generateSubTableColumns(data: any[]): any[] {
    if (!data || data.length === 0) return [];
  
    const hiddenFields = ["idCenterline", "idLimitsAndTargets"];
  
    let columnsFromData = Object.keys(data[0])
      .filter((key) => !hiddenFields.includes(key)) // Asegurar que no se filtren `value` y `comments`
      .map((key) => ({
        title: this.formatTitle(key),
        field: key,
        sortDirection: null,
        editable: key === "value" || key === "comments",
        controlType: this.getControlType(key),
      }));
  
    // Asegurar que la columna "Actions" siempre esté presente
    if (!columnsFromData.some((col) => col.field === "Acciones")) {
      columnsFromData.unshift({
        title: "Actions",
        field: "Acciones",
        sortDirection: null,
        editable: false,
        controlType: "text",
      });
    }
  
    return columnsFromData;
  }
  
  
  
  // Método para definir el tipo de control en la tabla
  private getControlType(key: string): string {
    if (key === "value" || key === "comments") return "text"; // Editable
    if (key === "degree360") return "checkbox"; // Checkbox
    return "text"; // Default
  }
  
  // Método opcional para formatear títulos
  private formatTitle(key: string): string {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Convierte camelCase a "Camel Case"
      .replace(/_/g, " ") // Reemplaza guiones bajos con espacios
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitaliza cada palabra
  }
  

  private formatDataForTable(data: any[]): any[] {
    return data.map((category) => ({
      idCategories: category.idCategories,
      categories: category.categories,
      subData: category.subData.map((centerline: any) => {
        let formattedEntry: any = {
          idCenterline: centerline.idCenterline,
          centerline: centerline.centerline,
          idLimitsAndTargets: centerline.idLimitsAndTargets,
          min: centerline.min,
          target: centerline.target,
          max: centerline.max,
          degree360: centerline.degree360,
          value: centerline.value,
          comments: centerline.comments,
        };
  
        // Convertimos crewShifts en encabezados de fecha y concatenamos `value` + `initials`
        centerline.crewShifts?.forEach((shift: any) => {
          if (shift.dataEntry) {
            formattedEntry[shift.shift] = `${shift.dataEntry.value} - ${shift.dataEntry.initials}`;
          } else {
            formattedEntry[shift.shift] = ""; // Dejar vacío en lugar de "undefined - undefined"
          }
        });
  
        return formattedEntry;
      }),
    }));
  }
  
  
  
}
