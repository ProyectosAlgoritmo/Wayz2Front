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
import { ResultStatusService } from '../../../services/result-status.service';
import { SharedStateService } from '../../../services/shared-state.service';
@Component({
  selector: 'app-result-status',
  templateUrl: './result-status.component.html',
  styleUrls: ['./result-status.component.css'],
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
export class ResultStatusComponent implements OnInit {
  [x: string]: any;
  dataForTable: any[] = [];
  dateYear: any[] = [];
  searchValue: string = '';
  private _selectedYear: string = new Date().getFullYear().toString();
  constructor(
    private resultStatusService: ResultStatusService,
    private auxService: AuxService,
    private sharedStateService: SharedStateService
  ) {}

  onSearchChange(): void {
    this.auxService.updateSearch(this.searchValue);
  }

  ngOnInit() {
    this.getResultStatus();
    this.sharedStateService.toggleSidenavVisible(true);
    // this.resultStatusService.getDataStructure1().subscribe((data) => {
    //   this.dataForTable = data;
    // });
  }

  ObtenerDateResultStatus() {
    this.resultStatusService
      .ObtenerDateResultStatus('get-result-status-year')
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
    this.resultStatusService
      .getResultStatus('get-result-status', year)
      .subscribe((data) => {
        this.auxService.cerrarVentanaCargando();
        this.dataForTable = data;
      });
  }
  onSubTableDataSaved(data: any): void {
    this.auxService.ventanaCargando();
    data.year = this._selectedYear; 
    this.resultStatusService
      .UpdateeResultStatusSubTable('update-result-status-subTable', data)
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          await this.auxService.AlertSuccess('Ok', data.message);
          this.getResultStatus();
        } else {
          await this.auxService.AlertError('Error', data.message);
          //this.getResultStatus();
        }
      });
  }
  
  getResultStatus() {
    this.auxService.ventanaCargando();
    this.resultStatusService
    .getResultStatus('get-result-status', Number(this._selectedYear))
    .subscribe((data) => {
      this.ObtenerDateResultStatus();
      this.dataForTable = data;
    });
  }
  
  onMainTableDataSaved(data: any): void {
    this.auxService.ventanaCargando();
    data.year = this._selectedYear; 
    this.resultStatusService
      .UpdateResultStatus('update-result-status', data)
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          await this.auxService.AlertSuccess('Ok', data.message);
          this.getResultStatus();
        } else {
          await this.auxService.AlertError('Error', data.message);
          //this.getResultStatus();
        }
      });
  }

}
