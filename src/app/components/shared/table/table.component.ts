import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],

})
export class TableComponent implements OnInit {
  @Input() dataSource = new MatTableDataSource<any>([]);
  @Input() displayedColumns: string[] = [];
  @Input() enableSearch: boolean = false;
  @Input() enablePaginator: boolean = false;
  @Input() pageSize: number = 10;
  @Input() showActions: boolean = false;
  @Input() ActionEdit: boolean = true;  
  @Input() ActionView: boolean = false;  
  @Input() ActionImport: boolean = false;  
  @Input() ActionExport: boolean = false;  
  @Input() ActionGo: boolean = false;  

  @Output() exportAction = new EventEmitter<any>();
  @Output() importAction = new EventEmitter<any>();
  @Output() goAction = new EventEmitter<any>();


  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;


  columnsToDisplay: string[] = []; 

  ngOnInit(): void {
    this.columnsToDisplay = [...this.displayedColumns];
    console.log( this.columnsToDisplay); 
    if (this.showActions) {
      this.columnsToDisplay.push('Acciones');
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  capitalizeFirstLetter(column: string): string {
    return column.charAt(0).toUpperCase() + column.slice(1);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
}
