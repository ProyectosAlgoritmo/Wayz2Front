import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';


@Component({
  selector: 'app-table-with-rows-child',
  templateUrl: './table-with-rows-child.component.html',
  styleUrls: ['./table-with-rows-child.component.css'],
  imports: [NzTableModule, NgFor, NgIf],
  standalone: true,
})
export class TableWithRowsChildComponent implements OnInit {
  private _listOfData: any[] = [];

  @Input()
  set listOfData(value: any[]) {
    this._listOfData = value;
    this.initializeColumns();
  }

  get listOfData(): any[] {
    return this._listOfData;
  }

  columns: Array<{ title: string; field: string }> = [];
  subColumns: Array<{ title: string; field: string }> = [];
  expandSet = new Set<number>();

  ngOnInit(): void {}

  initializeColumns(): void {
    if (this._listOfData.length > 0) {
      // Configurar las columnas para la tabla principal
      const firstRow = this._listOfData[0];
      this.columns = Object.keys(firstRow).filter(key => key !== 'subData' && key !== 'id' && key !== 'description').map(key => ({
        title: key,
        field: key
      }));

      // Configurar las columnas para la subtabla
      const firstSubRow = this._listOfData[0].subData?.[0];
      if (firstSubRow) {
        this.subColumns = Object.keys(firstSubRow).map(key => ({
          title: key,
          field: key
        }));
      }
    }
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}
