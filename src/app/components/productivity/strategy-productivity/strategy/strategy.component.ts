import { Component, OnInit, Provider } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { TableWithRowsChildComponent } from '../../../shared/table-with-rows-child/table-with-rows-child.component';
import { TableWithRowsChildSubcolumnComponent } from '../../../shared/table-with-rows-child-Subcolumn/table-with-rows-child-Subcolumn.component';
import { SharedModule } from '../../../shared/shared.module';
import { BalanceService } from '../../../../services/balance.service';
import { AuxService } from '../../../../services/aux-service.service';
@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css'],
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
    SharedModule,
  ],
})
export class StrategyComponent implements OnInit {
  [x: string]: any;
  dataForTable: any[] = [];
  dateYear: any[] = [];
  searchValue: string = '';
  private _selectedYear: string = new Date().getFullYear().toString();
  constructor(
    private balanceService: BalanceService,
    private auxService: AuxService
  ) {}

  mainTableColumns = [
    { title: 'Empresa', field: 'empresa', sortDirection: null },
    { title: 'Nombre', field: 'Nombre', sortDirection: null },
    { title: 'Descripción', field: 'Descripcion', sortDirection: null }
  ];
  
  subTableColumns = [
    { title: 'Nombre', field: 'Nombre' },
    { title: 'Etapa', field: 'Etapa' },
    { title: 'Porcentaje Avance Real', field: 'Porcentajeavance_real' },
    { title: 'Porcentaje Avance Proyectado', field: 'Porcentajeavance_proyectado' },
    { title: 'Estado', field: 'Estado' }
  ];

  onSearchChange(): void {
    this.auxService.updateSearch(this.searchValue);
  }

  ngOnInit() {
    //this.getBalance();
    this.balanceService.getDataStructure1().subscribe((data) => {
      this.dataForTable = data;
    });
  }

  ObtenerDateBalance() {
    this.balanceService
      .ObtenerDateBalance('get-balance-year')
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
    this.balanceService.getBalance('get-balance', year).subscribe((data) => {
      this.auxService.cerrarVentanaCargando();
      this.dataForTable = data;
    });
  }

  onSubTableDataSaved(data: any): void {
    this.auxService.ventanaCargando();
    data.year = this._selectedYear;
    console.log(this._selectedYear);
    this.balanceService
      .UpdateeBalanceSubTable('update-balance-subTable', data)
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          await this.auxService.AlertSuccess('Ok', data.message);
          this.getBalance();
        } else {
          await this.auxService.AlertError('Error', data.message);
          //this.getBalance();
        }
      });
  }

  getBalance() {
    this.auxService.ventanaCargando();
    this.balanceService
      .getBalance('get-balance', Number(this._selectedYear))
      .subscribe(async (data) => {
        this.ObtenerDateBalance();
        this.dataForTable = data;
      });
  }

  onMainTableDataSaved(data: any): void {
    this.auxService.ventanaCargando();
    data.year = this._selectedYear;
    this.balanceService
      .UpdateBalance('update-balance', data)
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          await this.auxService.AlertSuccess('Ok', data.message);
          this.getBalance();
        } else {
          await this.auxService.AlertError('Error', data.message);
          //this.getBalance();
        }
      });
  }
}