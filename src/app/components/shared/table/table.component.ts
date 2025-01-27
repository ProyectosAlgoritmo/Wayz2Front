import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { CloudDownloadOutline, CloudUploadOutline, PlayCircleOutline, EyeOutline, EditOutline } from '@ant-design/icons-angular/icons';
import { Router } from '@angular/router';
import { format } from 'date-fns'; // Usar date-fns para formatear fechas

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [
    {
      provide: NZ_ICONS, 
      useValue: [
        CloudDownloadOutline,
        CloudUploadOutline,
        PlayCircleOutline,
        EyeOutline,
        EditOutline
      ]
    }
  ]
})
export class TableComponent implements OnInit {
  @Input() dataSource: any[] = []; 
  @Input() checkActive: boolean = false;
  @Input() displayedColumns: string[] = [];
  @Input() columnNames: { [key: string]: string } = {};
  @Input() pageSize: number = 2;
  @Input() enablePaginator: boolean = true;
  @Input() enableSearch: boolean = true;
  @Input() ActionLeft: boolean = false;
  @Input() showActions: boolean = false;
  @Input() showInputdate: boolean = false;
  @Input() ActionEdit: boolean = false;  
  @Input() ActionDelete: boolean = false;  
  @Input() ActionView: boolean = false;  
  @Input() ActionImport: boolean = false;  
  @Input() ActionExport: boolean = false;  
  @Input() ActionGo: boolean = false;

  @Input() ActionCreate: boolean = false;  
  @Input() ActionImportGo: boolean = false;  

  @Output() exportAction = new EventEmitter<any>();
  @Output() importAction = new EventEmitter<any>();
  @Output() goAction = new EventEmitter<any>();
  @Output() editAction = new EventEmitter<any>();
  @Output() deleteAction = new EventEmitter<any>();

  @Output() Create = new EventEmitter<any>();
  @Output() dateSelected: EventEmitter<any> = new EventEmitter();

  columnsToDisplay: string[] = [];
  paginatedData: any[] = [];
  currentPage: number = 1;
  originalDataSource: any[] = [];
  selectedYearMonth: string | undefined;
  dateYearMonth = [];
  sortDirections: { [key: string]: 'ascend' | 'descend' | null } = {};
  @Input() date: [Date, Date] | undefined;
  

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    

    this.columnsToDisplay = [...this.displayedColumns]; 
    if (this.showActions) {
      if (this.ActionLeft) {
        this.columnsToDisplay.unshift('Acciones');
      } else {
        this.columnsToDisplay.push('Acciones');
      }
    }
    //this.updatePaginatedData();
  }



  onChangedate(result: Date[]): void {
    if (result && result.length === 2) {
      // Obtener el primer día del mes del inicio
      const startDate = new Date(result[0].getFullYear(), result[0].getMonth(), 1);
      
      // Obtener el último día del mes del fin
      const endDate = new Date(result[1].getFullYear(), result[1].getMonth() + 1, 0); // `0` es el último día del mes anterior
  
      const formattedRequestDate = {
        FechaInicio: format(startDate, 'yyyy-MM-dd'), // Formatear la fecha de inicio al formato AAAA-MM-DD
        FechaFin: format(endDate, 'yyyy-MM-dd')       // Formatear la fecha de fin al formato AAAA-MM-DD
      };
  
      this.dateSelected.emit(formattedRequestDate); // Emitir el objeto con las fechas formateadas
    } else if (!result || result.length === 0) {
      // Si el rango de fechas está vacío (por ejemplo, al presionar el botón de cerrar)
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);  // 1 de enero
      const endOfYear = new Date(currentYear, 11, 31);  // 31 de diciembre
  
      const formattedRequestDate = {
        FechaInicio: format(startOfYear, 'yyyy-MM-dd'), // Restablecer la fecha de inicio al 1 de enero del año actual
        FechaFin: format(endOfYear, 'yyyy-MM-dd')       // Restablecer la fecha de fin al 31 de diciembre del año actual
      };
  
      this.date = [startOfYear, endOfYear]; // Restablecer el rango de fechas en el picker
      this.dateSelected.emit(formattedRequestDate); // Emitir el objeto con las fechas restauradas
    }
  }
  

  ngOnChanges(): void {
    this.originalDataSource = [...this.dataSource];
    this.updatePaginatedData();
    this.sortDirections = {};  
  }

  sortData(column: string): void {
    // 1. Toggle la dirección para la columna clickeada
    if (!this.sortDirections[column] || this.sortDirections[column] === 'descend') {
      this.sortDirections[column] = 'ascend';
    } else {
      this.sortDirections[column] = 'descend';
    }

    // 2. Si solo quieres 1 columna ordenada a la vez, limpia las demás
    Object.keys(this.sortDirections).forEach(col => {
      if (col !== column) {
        this.sortDirections[col] = null;
      }
    });

    // 3. Aplica el orden a dataSource (o podrías usar sortedData si lo prefieres)
    this.dataSource.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (this.sortDirections[column] === 'ascend') {
        return valA > valB ? 1 : (valA < valB ? -1 : 0);
      } else {
        return valA < valB ? 1 : (valA > valB ? -1 : 0);
      }
    });

    // 4. Actualizamos la paginación con la data ya ordenada
    this.updatePaginatedData();
  }

  getColumnDisplayName(column: string): string {
    return this.columnNames[column] || this.capitalizeFirstLetter(column);
  }

  capitalizeFirstLetter(column: string): string {
    return column.charAt(0).toUpperCase() + column.slice(1);
  }

  

  onExport(element: any) {
    this.exportAction.emit(element);
  }

  onImport(element: any) {
    this.importAction.emit(element);
  }

  onGo(element: any) {
    this.goAction.emit(element);
  }

  onEdit(element: any) {
    this.editAction.emit(element);
  }

  onDelete(element: any) {
    this.deleteAction.emit(element);
  }

  CreateAction() {
    this.Create.emit();
  }

  onActionImportGo() {
    this.router.navigate(['/import']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // Restaura datos originales si está vacío
    if (!filterValue) {
      this.dataSource = [...this.originalDataSource];
    } else {
      this.dataSource = this.originalDataSource.filter(item => {
        return this.displayedColumns.some(column => {
          const columnValue = item[column];
          return columnValue && columnValue.toString().toLowerCase().includes(filterValue);
        });
      });
    }
    // Después de filtrar, podrías querer resetear sort
    this.sortDirections = {};
    // Y paginar de nuevo
    this.updatePaginatedData();
  }

updatePaginatedData(): void {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedData = this.dataSource.slice(startIndex, endIndex);
}

onPageChange(pageIndex: number): void {
  this.currentPage = pageIndex;
  this.updatePaginatedData();
}




}
