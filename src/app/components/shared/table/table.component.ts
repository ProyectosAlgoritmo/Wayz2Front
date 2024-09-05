import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { CloudDownloadOutline, CloudUploadOutline, PlayCircleOutline, EyeOutline, EditOutline } from '@ant-design/icons-angular/icons';
import { Router } from '@angular/router';

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
  @Input() displayedColumns: string[] = [];
  @Input() columnNames: { [key: string]: string } = {};
  @Input() pageSize: number = 2;
  @Input() enablePaginator: boolean = true;
  @Input() enableSearch: boolean = true;
  @Input() ActionLeft: boolean = false;
  @Input() showActions: boolean = false;
  @Input() ActionEdit: boolean = false;  
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

  @Output() Create = new EventEmitter<any>();

  columnsToDisplay: string[] = [];
  paginatedData: any[] = [];
  currentPage: number = 1;
  originalDataSource: any[] = [];
  

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

  ngOnChanges(): void {
    this.originalDataSource = [...this.dataSource];
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

  CreateAction() {
    this.Create.emit();
  }

  onActionImportGo() {
    this.router.navigate(['/import']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    // Restaura los datos originales si el filtro está vacío
    if (!filterValue) {
        this.dataSource = [...this.originalDataSource];
    } else {
        // Filtra los datos en base al valor ingresado
        this.dataSource = this.originalDataSource.filter(item => {
            return this.displayedColumns.some(column => {
                const columnValue = item[column];
                // Verifica si el valor de la columna existe y coincide con el filtro
                return columnValue && columnValue.toString().toLowerCase().includes(filterValue);
            });
        });
    }

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
