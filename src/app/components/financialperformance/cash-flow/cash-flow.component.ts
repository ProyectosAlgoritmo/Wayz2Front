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
import { TableWithRowsChildSubcolumnComponent } from '../../shared/table-with-rows-child-Subcolumn/table-with-rows-child-Subcolumn.component';
import { SharedModule } from '../../shared/shared.module';

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
    TableWithRowsChildSubcolumnComponent,
    SharedModule
  ],
})
export class CashFlowComponent implements OnInit {
  [x: string]: any;
  dataForTable: any[] = [];
  dateYear: any[] = [];
  searchValue: string = '';
  private _selectedYear: string = new Date().getFullYear().toString();
  constructor(
    private financialperformanceService: financialperformanceService,
    private auxService: AuxService
  ) {}

  onSearchChange(): void {
    this.auxService.updateSearch(this.searchValue);
  }

  ngOnInit() {
    this.getCashFlow();
    //this.selectedYear = '2023';
    // this.financialperformanceService.getDataStructure1().subscribe((data) => {
    //   this.dataForTable = data;
    // });
  }

  ObtenerDateCashFlow() {
    this.financialperformanceService
      .ObtenerDateCashFlow('get-caja-flujos-year')
      .subscribe((data) => {
        this.auxService.cerrarVentanaCargando();
        this.dateYear = data.data;
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
    this.auxService.ventanaCargando();
    let year = event;
    if (event == null) {
      year = new Date().getFullYear();
    }
    this.financialperformanceService
      .getCashFlow('get-cash-flow', year)
      .subscribe((data) => {
        this.auxService.cerrarVentanaCargando();
        this.dataForTable = data;
      });
  }
  onSubTableDataSaved(data: any): void {
    this.auxService.ventanaCargando();
    data.year = this._selectedYear; 
    this.financialperformanceService
      .UpdateeCashFlowSubTable('update-cash-flow-subTable', data)
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          await this.auxService.AlertSuccess('Ok', data.message);
          this.getCashFlow();
        } else {
          await this.auxService.AlertError('Error', data.message);
          //this.getCashFlow();
        }
      });
  }
  
  getCashFlow() {
    this.auxService.ventanaCargando();
    this.financialperformanceService
    .getCashFlow('get-cash-flow', Number(this._selectedYear))
    .subscribe((data) => {
      this.ObtenerDateCashFlow();
      this.dataForTable = data;
    });
  }
  
  onMainTableDataSaved(data: any): void {
    this.auxService.ventanaCargando();
    data.year = this._selectedYear; 
    this.financialperformanceService
      .UpdateCashFlow('update-cash-flow', data)
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          await this.auxService.AlertSuccess('Ok', data.message);
          this.getCashFlow();
        } else {
          await this.auxService.AlertError('Error', data.message);
          //this.getCashFlow();
        }
      });
  }
}
