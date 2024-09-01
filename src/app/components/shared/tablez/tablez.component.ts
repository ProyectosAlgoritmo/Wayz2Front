import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NzTableModule } from 'ng-zorro-antd/table';

interface DataItem {
  [key: string]: any;
}



@Component({
  selector: 'app-tablez',
  templateUrl: './tablez.component.html',
  styleUrls: ['./tablez.component.css'],
})
export class TablezComponent implements OnInit {
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
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

  //listOfColumns: ColumnItem[] = [];
  //listOfData: DataItem[] = [];

  ngOnInit(): void {
    // Convertir MatTableDataSource a un array normal
    //this.listOfData = this.dataSource.data;

    //this.setupColumns();
  }

}
