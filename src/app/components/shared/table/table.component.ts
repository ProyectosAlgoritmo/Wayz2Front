import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../../../utilities/custom-mat-paginator-intl';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ],
})
export class TableComponent implements OnInit {
  @Input() dataSource = new MatTableDataSource<any>([]);
  @Input() displayedColumns: string[] = [];
  @Input() columnNames: { [key: string]: string } = {};
  @Input() enableSearch: boolean = false;
  @Input() enablePaginator: boolean = false;
  @Input() pageSize: number = 10;
  @Input() ActionLeft: boolean = false;
  @Input() showActions: boolean = false;
  @Input() ActionEdit: boolean = false;  
  @Input() ActionView: boolean = false;  
  @Input() ActionImport: boolean = false;  
  @Input() ActionExport: boolean = false;  
  @Input() ActionGo: boolean = false;  

  @Output() exportAction = new EventEmitter<any>();
  @Output() importAction = new EventEmitter<any>();
  @Output() goAction = new EventEmitter<any>();
  @Output() editAction = new EventEmitter<any>();


  @ViewChild(MatSort) sort: MatSort | undefined;
  //@ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnsToDisplay: string[] = []; 

  ngOnInit(): void {
    this.columnsToDisplay = [...this.displayedColumns];
    console.log( this.columnsToDisplay); 
    if (this.showActions) {
      if(this.ActionLeft == false)
      {
      this.columnsToDisplay.push('Acciones');
      }else{
        this.columnsToDisplay.unshift('Acciones');
      }
    }
  
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.enablePaginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
    }
  }


  getColumnDisplayName(column: string): string {
    return this.columnNames[column] || this.capitalizeFirstLetter(column);
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

  onEdit(element: any) {
    this.editAction.emit(element);
  }
}
