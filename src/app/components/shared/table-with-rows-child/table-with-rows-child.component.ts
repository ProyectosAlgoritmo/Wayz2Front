import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuxService } from '../../../services/aux-service.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-table-with-rows-child',
  templateUrl: './table-with-rows-child.component.html',
  styleUrls: ['./table-with-rows-child.component.css'],
  imports: [
    NzTableModule,
    NgFor,
    NgIf,
    FormsModule,
    NzIconModule,
    NzInputModule,
    NzPaginationModule,
  ],
  standalone: true,
})
export class TableWithRowsChildComponent implements OnInit {
  // Definición de las columnas y subcolumnas como @Input() para recibirlas desde el componente padre
  @Input() columns: Array<{ title: string; field: string; sortDirection: 'ascend' | 'descend' | null }> = [];
  @Input() subColumns: Array<{ title: string; field: string }> = [];
  @Input() listOfData: any[] = []; // Datos principales
  @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Input() ActionEdit: boolean = false;
  @Input() pageSize: number = 10;
  @Input() emitEditEvent: boolean = false; 
  @Output() subTableDataSaved: EventEmitter<any> = new EventEmitter<any>();
  @Output() mainTableDataSaved: EventEmitter<any> = new EventEmitter<any>();

  expandSet = new Set<number>();
  sortedData: any[] = [];
  paginatedData: any[] = [];
  currentPage: number = 1;
  searchValue = '';
  private searchSubscription: Subscription = new Subscription();

  constructor(private auxService: AuxService) {}

  ngOnInit() {
    // Suscripción a los términos de búsqueda
    this.searchSubscription = this.auxService.getSearchObservable().subscribe((searchTerm) => {
      this.onSearch(searchTerm);
    });

    // Genera columnas automáticamente si no se proporcionan desde el componente padre
    if (!this.columns.length && this.listOfData.length) {
      this.initializeColumns();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['listOfData']) {
      this.sortedData = [...this.listOfData];
      this.updatePaginatedData();
      if (!this.columns.length) {
        this.initializeColumns(); // Inicializa columnas si no se han recibido del padre
      }
    }
  }

  // Inicializa las columnas basadas en los datos, si no se reciben desde el componente padre
  initializeColumns(): void {
    if (this.listOfData.length > 0) {
      const firstRow = this.listOfData[0];
      if (firstRow) {
        // Configurar columnas automáticamente si no se pasan desde el padre
        this.columns = Object.keys(firstRow)
          .filter(key => key !== 'subData' && key !== 'id')
          .map(key => ({
            title: key,
            field: key,
            sortDirection: null // Ninguna columna ordenada inicialmente
          }));
      }

      // Inicializa las subcolumnas si hay datos en `subData`
      const firstRowWithSubData = this.listOfData.find(item => item.subData && item.subData.length > 0);
      if (firstRowWithSubData) {
        const firstSubRow = firstRowWithSubData.subData[0];
        this.subColumns = Object.keys(firstSubRow).map(key => ({
          title: key,
          field: key
        }));
      }

      // Agregar la columna 'Acciones' al principio de ambas tablas
      this.columns.unshift({
        title: 'Acciones',
        field: 'Acciones',
        sortDirection: null
      });
      this.subColumns.unshift({ title: 'Acciones', field: 'Acciones' });
    }
  }

  // Expande o colapsa filas
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id); // Añadir id si la fila está expandida
    } else {
      this.expandSet.delete(id); // Eliminar id si la fila está colapsada
    }
  }

  // Ordena los datos al hacer click en la cabecera de la columna
  sortData(field: string): void {
    const column = this.columns.find(col => col.field === field);
    if (column) {
      column.sortDirection = column.sortDirection === 'ascend' ? 'descend' : 'ascend'; // Cambia la dirección de ordenación
      this.sortedData.sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];
        if (valueA < valueB) return column.sortDirection === 'ascend' ? -1 : 1;
        if (valueA > valueB) return column.sortDirection === 'ascend' ? 1 : -1;
        return 0;
      });
    }
    this.updatePaginatedData();
  }

  // Guarda la edición en la tabla principal
  saveMainTableEdit(data: any): void {
    this.mainTableDataSaved.emit(data);
    data.isEditing = false;
  }

  // Guarda la edición en la subtabla
  saveSubTableEdit(data: any): void {
    this.subTableDataSaved.emit(data);
    data.isEditing = false;
  }


  toggleEdit(data: any, isEditing: boolean): void {
    if (this.emitEditEvent) {
      if (isEditing) {
        this.editClicked.emit(data);  // Si emitEditEvent es true, se emite el evento al padre
      }
    } else {
      data.isEditing = isEditing;  // Si emitEditEvent es false, se activa la edición local
    }
  }
  
  
  // Actualiza los datos paginados
  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.sortedData.slice(startIndex, endIndex);
  }

  // Cambia la página actual
  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
    this.updatePaginatedData();
  }

  // Realiza la búsqueda en la tabla
  onSearch(searchValue: string): void {
    if (!searchValue) {
      this.sortedData = [...this.listOfData];
    } else {
      const searchLower = searchValue.toLowerCase();
      this.sortedData = this.listOfData.filter((item) => {
        return Object.keys(item).some((key) =>
          this.prepareSearchString(item[key]).includes(searchLower)
        );
      });
    }
    this.updatePaginatedData(); // Asegúrate de actualizar los datos paginados después de la búsqueda
  }

  // Prepara el valor para la búsqueda
  prepareSearchString(value: any): string {
    if (value == null) return ''; // Manejar valores nulos o indefinidos
    return value.toString().toLowerCase(); // Convertir cualquier tipo de valor a string en minúsculas
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
