import { Component, OnInit, Provider } from '@angular/core';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { financialperformanceService } from '../../../services/financialperformance.service';
import { FormsModule } from '@angular/forms';
import { AuxService } from '../../../services/aux-service.service';
import { NgFor } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  CloudDownloadOutline,
  CloudUploadOutline,
  PlayCircleOutline,
  EyeOutline,
  EditOutline,
} from '@ant-design/icons-angular/icons';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableWithRowsChildSubcolumnComponent } from "../../shared/table-with-rows-child-Subcolumn/table-with-rows-child-Subcolumn.component";
@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css'],
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
    TableWithRowsChildSubcolumnComponent
],
})
export class CashFlowComponent implements OnInit {
  [x: string]: any;
  dataForTable: any[] = [];
  dateYear: any[] = [];
  searchValue: string = '';
  private _selectedYear: string = '';
  constructor(
    private financialperformanceService: financialperformanceService,
    private auxService: AuxService
  ) {}

  onSearchChange(): void {
    this.auxService.updateSearch(this.searchValue);
  }

  ngOnInit() {
    // this.financialperformanceService
    //   .getCajaFlujo('get-caja-flujos', new Date().getFullYear())
    //   .subscribe((data) => {
    //     this.dataForTable = data;
    //   });

    this.financialperformanceService
      .ObtenerDateCashFlow('get-caja-flujos-year')
      .subscribe((data) => {
        this.dateYear = data.data;
      });
    this.financialperformanceService
      .getDataStructure1()
      .subscribe((data) => {
        this.dataForTable = data;
      });
  }

  get selectedYear(): string {
    return this._selectedYear;
  }

  set selectedYear(value: string) {
    this._selectedYear = value;
    this.onOptionChange(value);
  }

  onOptionChange(event: any) {
    let year = event;
    if (event == null) {
      year = new Date().getFullYear();
    }
    this.financialperformanceService
      .getCajaFlujo('get-caja-flujos', year)
      .subscribe((data) => {
        this.dataForTable = data;
      });
  }
}
