import { Component, OnInit, Provider } from '@angular/core';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
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
import { BalanceService } from '../../../services/balance.service';
@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
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
export class BalanceComponent implements OnInit {

  [x: string]: any;
  dataForTable: any[] = [];
  dateYear: any[] = [];
  searchValue: string = '';
  private _selectedYear: string = new Date().getFullYear().toString();
  constructor(
    private balanceService: BalanceService,
    private auxService: AuxService
  ) {}

  onSearchChange(): void {
    this.auxService.updateSearch(this.searchValue);
  }

  ngOnInit() {
    this.getBalance();
    // this.balanceService.getDataStructure1().subscribe((data) => {
    //   this.dataForTable = data;
    // });
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
    this.balanceService
      .getBalance('get-balance', year)
      .subscribe((data) => {
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
      .subscribe((data) => {
        this.auxService.cerrarVentanaCargando();
        this.getBalance();
        if (data.success == true) {
        }
      });
  }
  
  getBalance() {
    this.auxService.ventanaCargando();
    this.balanceService
    .getBalance('get-balance', Number(this._selectedYear))
    .subscribe((data) => {
      this.ObtenerDateBalance();
      this.dataForTable = data;
    });
  }
  
  onMainTableDataSaved(data: any): void {
    this.auxService.ventanaCargando();
    data.year = this._selectedYear; 
    this.balanceService
      .UpdateBalance('update-balance', data)
      .subscribe((data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
         this.getBalance();
        }
      });
  }

}
