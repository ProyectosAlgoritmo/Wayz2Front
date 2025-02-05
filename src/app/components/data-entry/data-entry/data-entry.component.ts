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
import { ro, tr } from 'date-fns/locale';
import { Router, ActivatedRoute } from '@angular/router';
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
  product: any = {};
  dataOriginal: any[] = [];
  searchValue: string = '';
  initial: string = '';
  emitEditToParent = false;
  machineValue: string = '';
  productValue: string = '';
  startTimeValue: string = '';
  endTimeValue: string = '';
  currentDatetimeValue: string = new Date().toLocaleString();
  currentShiftValue: string = '';
  currentTimeValue: string = '';
  initialValue: string = '';
  currentShiftId: number = 0;
  idProduct: number = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private auxService: AuxService,
    private configService: ConfigService,
    private dataEntryService: DataEntryService
  ) {}

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
    this.idProduct = parseInt(this.route.snapshot.paramMap.get('id') || '0', 0);
    setInterval(() => {
      this.currentDatetimeValue = new Date().toLocaleString(); // Guardamos la fecha como string
      this.updateCurrentShift();
    }, 1000);
    if (this.idProduct) {
      this.getProducts(this.idProduct);
    }
  }

  getProducts(idProduct: number): void {
    this.configService.get(`Get-Product/${idProduct}`).subscribe({
      next: (data: any) => {
        this.product = data.data;
        this.machineValue = this.product.machine || '';
        this.productValue = this.product.name || '';
        this.GetAllDataEntry(this.idProduct);
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando(); // Asegúrate de cerrar la ventana en caso de error
        this.auxService.AlertError('Error loading categories: ', error);
      },
    });
  }

  updateCurrentShift() {
    if (!this.dataOriginal || !this.dataOriginal[0]?.subData) {
      this.resetShiftValues();
      return;
    }

    let now = new Date();
    let foundShift = false; // Flag para saber si se encontró un turno válido en este ciclo

    this.dataOriginal[0].subData.forEach((subDataEntry: any) => {
      if (!subDataEntry.crewShifts || subDataEntry.crewShifts.length === 0)
        return;

      let shifts = subDataEntry.crewShifts.map((shift: any) => ({
        ...shift,
        shiftTime: new Date(shift.shift), // Convertimos la fecha del turno a Date
      }));

      // Ordenamos los turnos cronológicamente
      shifts.sort(
        (a: { shiftTime: Date }, b: { shiftTime: Date }) =>
          a.shiftTime.getTime() - b.shiftTime.getTime()
      );

      // Calcular duración del turno dinámicamente
      let shiftDuration = this.calculateShiftDuration(shifts);

      let currentShift = null;
      let nextShift = null;

      // Determinar cuál es el turno actual
      for (let i = 0; i < shifts.length; i++) {
        let shiftStart = shifts[i].shiftTime;
        let shiftEnd =
          i + 1 < shifts.length
            ? shifts[i + 1].shiftTime
            : new Date(shiftStart.getTime() + shiftDuration);

        if (now >= shiftStart && now < shiftEnd) {
          currentShift = shifts[i];
          nextShift = shifts[i + 1] || null;
          foundShift = true;
          break;
        }
      }

      if (currentShift) {
        this.setShiftValues(currentShift, nextShift, shiftDuration);
      }
    });

    // Si no se encontró un turno en esta ejecución, resetear las variables a null
    if (!foundShift) {
      this.resetShiftValues();
    }
  }

  resetShiftValues() {
    // Asegurar que no se conserven valores viejos si ya no hay turnos válidos
    this.currentShiftId = 0;
    this.currentShiftValue = "No active shift";
    this.startTimeValue = "--:--";
    this.endTimeValue = "--:--";
    this.currentTimeValue = "Not available";
  }

  // Calcular la duración del turno basada en el primer y segundo turno
  calculateShiftDuration(shifts: any[]): number {
    if (shifts.length > 1) {
      let duration =
        shifts[1].shiftTime.getTime() - shifts[0].shiftTime.getTime();
      return duration;
    }
    // Si solo hay un turno, asumir 8 horas por defecto
    return 8 * 60 * 60 * 1000; // 8 horas en milisegundos
  }

  setShiftValues(
    currentShift: any,
    nextShift: any | null,
    shiftDuration: number
  ) {
    this.currentShiftId = currentShift.idCrewShifts; // Guarda el ID del turno actual
    this.currentShiftValue = currentShift.name || ''; // Nombre del turno actual
    this.startTimeValue = this.formatTime(currentShift.shiftTime); // Hora de inicio del turno
    this.endTimeValue = nextShift
      ? this.formatTime(nextShift.shiftTime)
      : this.formatTime(
          new Date(currentShift.shiftTime.getTime() + shiftDuration)
        ); // Hora de fin
    this.currentTimeValue = currentShift.shift; // Fecha y hora del turno activo

    // console.log("Turno activo:", {
    //   id: this.currentShiftId,
    //   name: this.currentShiftValue,
    //   start: this.startTimeValue,
    //   end: this.endTimeValue,
    //   datetime: this.currentTimeValue,
    //   duration: shiftDuration / (60 * 60 * 1000) + " horas",
    // });
  }

  // Formatea la hora sin segundos
  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    if (!this.initial || this.initial == '') {
      this.auxService.AlertWarning(
        'Please fill all the fields.',
        'Initials are required.'
      );
      return;
    }
    if (this.currentShiftId == 0 || !this.currentShiftId) {
      this.auxService.AlertWarning(
        'Please fill all the fields.',
        'There is no active shift.'
      );
      return;
    }
    if (!rowData.value) {
      this.auxService.AlertWarning(
        'Please fill all the fields.',
        'the value record is required.'
      );
      return;
    }
    rowData.isEditing = true;
    if (
      (rowData.value < rowData.min &&
        rowData.value > rowData.max &&
        rowData.value != rowData.target) &&
      rowData.min < rowData.max
    ) {
      rowData.onTarget = false;
    }
    if (
      (rowData.value > rowData.min &&
        rowData.value < rowData.max &&
        rowData.value != rowData.target) &&
      rowData.min > rowData.max
    ) {
      rowData.onTarget = false;
    }
    this.AddOrUpdateTbDataEntry(rowData);
  }

  AddOrUpdateTbDataEntry(rowData: any) {
    let dataApi = {
      idDataEntry: null,
      idLimitsAndTargets: rowData.idLimitsAndTargets,
      idCrewShifts: this.currentShiftId,
      value: rowData.value,
      comments: rowData.comments,
      initials: this.initial,
      onTarget: rowData.onTarget,
    };

    if (!this.idProduct) {
      this.auxService.AlertWarning(
        'Please select a product.',
        'Select a product to continue.'
      );
      return;
    }

    this.auxService.ventanaCargando();
    this.dataEntryService.Create('add-DataEntry', dataApi).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Data registered successfully.',
            ''
          );
          if (this.idProduct) {
            this.GetAllDataEntry(this.idProduct);
          }
        } else {
          this.auxService.AlertWarning(
            'Error creating the record.',
            data.message
          );
        }
      },
      error: (error: any) => {
        if (this.idProduct) {
          this.GetAllDataEntry(this.idProduct);
        }
        this.auxService.AlertError('Error creating the record.', error.message);
      },
    });
  }

  GetAllDataEntry(IdProduct: number) {
    if (!IdProduct) {
      this.dataForTable = [];
      this.subTableColumns = [];
      return;
    }
    this.auxService.ventanaCargando();
    this.dataEntryService.get(`Get-All-DataEntry/${IdProduct}`).subscribe({
      next: (data: any) => {
        this.dataOriginal = data.data;
        this.dataForTable = this.formatDataForTable(data.data);
        this.subTableColumns = this.generateSubTableColumns(
          this.dataForTable[0]?.subData || []
        );
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error loading data: ', error);
      },
    });
  }

  private generateSubTableColumns(data: any[]): any[] {
    if (!data || data.length === 0) return [];

    const hiddenFields = ['idCenterline', 'idLimitsAndTargets'];

    let columnsFromData = Object.keys(data[0])
      .filter((key) => !hiddenFields.includes(key)) // Asegurar que no se filtren `value` y `comments`
      .map((key) => ({
        title: this.formatTitle(key),
        field: key,
        sortDirection: null,
        editable: key === 'value' || key === 'comments',
        controlType: this.getControlType(key),
      }));

    // Asegurar que la columna "Actions" siempre esté presente
    if (!columnsFromData.some((col) => col.field === 'Acciones')) {
      columnsFromData.unshift({
        title: 'Actions',
        field: 'Acciones',
        sortDirection: null,
        editable: false,
        controlType: 'text',
      });
    }

    return columnsFromData;
  }

  // Método para definir el tipo de control en la tabla
  private getControlType(key: string): string {
    if (key === 'value' || key === 'comments') return 'text'; // Editable
    if (key === 'degree360') return 'checkbox'; // Checkbox
    return 'text'; // Default
  }

  // Método opcional para formatear títulos
  private formatTitle(key: string): string {
    return key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Convierte camelCase a "Camel Case"
      .replace(/_/g, ' ') // Reemplaza guiones bajos con espacios
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitaliza cada palabra
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
            formattedEntry[
              shift.shift
            ] = `${shift.dataEntry.value} - ${shift.dataEntry.initials}`;
          } else {
            formattedEntry[shift.shift] = ''; // Dejar vacío en lugar de "undefined - undefined"
          }
        });

        return formattedEntry;
      }),
    }));
  }
}
