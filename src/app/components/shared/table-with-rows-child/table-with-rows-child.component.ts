import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AuxService } from '../../../services/aux-service.service';
import { Subscription } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';


@Component({
  selector: 'app-table-with-rows-child',
  templateUrl: './table-with-rows-child.component.html',
  styleUrls: ['./table-with-rows-child.component.css'],
  imports: [NzTableModule, NgFor, NgIf, FormsModule, NzIconModule,NzInputModule,NzPaginationModule],
  standalone: true,
})
export class TableWithRowsChildComponent implements OnInit {
  columns: Array<{
    title: string;
    field: string;
    sortDirection: 'ascend' | 'descend' | null;
  }> = [];
  subColumns: Array<{ title: string; field: string }> = [];
  expandSet = new Set<number>();
  private _listOfData: any[] = [];
  sortedData: any[] = [];
  searchValue = '';
  @Input() ActionEdit: boolean = false;
  @Output() subTableDataSaved: EventEmitter<any> = new EventEmitter<any>();
  @Output() mainTableDataSaved: EventEmitter<any> = new EventEmitter<any>();

  paginatedData: any[] = [];
  currentPage: number = 1;

  private searchSubscription: Subscription = new Subscription();
  constructor(private auxService: AuxService) {
    this._listOfData = [...this.sortedData];
  }


  ngOnInit() {
    this.searchSubscription = this.auxService
      .getSearchObservable()
      .subscribe((searchTerm) => {
        this.onSearch(searchTerm);
      });

    
  }



  // @Input()
  // set listOfData(value: any[]) {
  //   this._listOfData = value;
  //   this.initializeColumns();
  //   this.sortedData = [...this._listOfData]; // Inicializa los datos ordenados
  //   this.updatePaginatedData();
  // }
  @Input()
  set listOfData(value: any[]) {
    // Asegurarse de que el valor es un array, o bien lo inicializamos con un array vacío
    this._listOfData = Array.isArray(value) ? value : [];

    // Solo inicializar columnas si hay datos disponibles
    if (this._listOfData.length > 0) {
      this.initializeColumns();
      this.sortedData = [...this._listOfData]; // Inicializa los datos ordenados
      this.updatePaginatedData();
    } else {
      console.warn('listOfData está vacío o no es un array.');
    }
  }
  @Input() pageSize: number = 10;

  get listOfData(): any[] {
    return this._listOfData;
  }

  onSearch(searchValue: string): void {
    if (!searchValue) {
      this.sortedData = [...this._listOfData]; 
    } else {
      const searchLower = searchValue.toLowerCase();
      this.sortedData = this._listOfData.filter((item) => {
        return Object.keys(item).some((key) =>
          this.prepareSearchString(item[key]).includes(searchLower)
        );
      });
    }
  }

  prepareSearchString(value: any): string {
    if (value == null) return ''; // Manejar valores nulos o indefinidos
    return value.toString().toLowerCase(); // Convertir cualquier tipo de valor a string en minúsculas
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  initializeColumns(): void {
    // Verificar si _listOfData está definido y tiene al menos un elemento
    if (this._listOfData && this._listOfData.length > 0) {
      // Configurar las columnas para la tabla principal
      const firstRow = this._listOfData[0];
  
      // Verificar que la primera fila no sea nula o indefinida
      if (firstRow) {
        this.columns = Object.keys(firstRow)
          .filter(
            (key) => key !== 'subData' && key !== 'id' && key !== 'description'
          )
          .map((key) => ({
            title: key,
            field: key,
            sortDirection: null, // Ninguna columna ordenada inicialmente
          }));
      } else {
        console.warn('La primera fila de _listOfData está vacía o es nula.');
      }
  
      // Configurar las columnas para la subtabla, si existe subData
      const firstSubRow = this._listOfData[0].subData?.[0];
      if (firstSubRow) {
        this.subColumns = Object.keys(firstSubRow).map((key) => ({
          title: key,
          field: key,
        }));
      } else {
        console.warn('La subData o la primera fila de subData está vacía o no existe.');
      }
    } else {
      console.warn('_listOfData está vacío o no ha sido inicializado.');
    }
  }

  // Este Set se usa para guardar las filas que están expandidas

onExpandChange(id: number, checked: boolean): void {
  if (checked) {
    this.expandSet.add(id); // Añade el id si la fila está expandida
  } else {
    this.expandSet.delete(id); // Elimina el id si la fila no está expandida
  }
}

  // Método para manejar la ordenación
  sortData(field: string): void {
    const column = this.columns.find((col) => col.field === field);
    if (column) {
      column.sortDirection =
        column.sortDirection === 'ascend' ? 'descend' : 'ascend'; // Cambia la dirección de ordenación
      this.sortedData.sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];
        if (valueA < valueB) {
          return column.sortDirection === 'ascend' ? -1 : 1;
        }
        if (valueA > valueB) {
          return column.sortDirection === 'ascend' ? 1 : -1;
        }
        return 0;
      });
    }

    this.updatePaginatedData();
  }
  saveMainTableEdit(data: any): void {
    this.mainTableDataSaved.emit(data);
    data.isEditing = false;  
  }
  
  saveSubTableEdit(data: any): void {
    this.subTableDataSaved.emit(data);
    data.isEditing = false;
  }
  
  toggleEdit(data: any, isEditing: boolean): void {
    data.isEditing = isEditing;
  }


  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.sortedData.slice(startIndex, endIndex);
  }
  
  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
    this.updatePaginatedData();
  }
  
}
