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

import { AuxService } from '../../../../services/aux-service.service';
import { ProductivityService } from '../../../../services/productivity.service';
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
  constructor(
    private auxService: AuxService,
    private productivityService: ProductivityService,
  ) {}

  mainTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Nombre', field: 'nombre', sortDirection: null },
    { title: 'Empresa', field: 'empresa', sortDirection: null },
    { title: 'Descripción', field: 'descripcion', sortDirection: null }
  ];
  
  subTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Etapa', field: 'etapa' },
    { title: 'Porcentaje Avance Real', field: 'porcentajeavance_real' },
    { title: 'Porcentaje Avance Proyectado', field: 'porcentajeavance_proyectado' },
    { title: 'Estado', field: 'estado' }
  ];

  onSearchChange(): void {
    this.auxService.updateSearch(this.searchValue);
  }

  ngOnInit() {
    this.getStrategy();
    // this.productivityService.getDataStructure1().subscribe((data) => {
    //   this.dataForTable = data;
    // });
  }



  onOptionChange(event: any) {
    this.auxService.ventanaCargando();
    this.productivityService.getStrategy('get-strategy').subscribe((data) => {
      this.auxService.cerrarVentanaCargando();
      this.dataForTable = data;
    });
  }

  onSubTableDataSaved(data: any): void {
    this.auxService.ventanaCargando();
    this.productivityService
      .UpdateeStrategySubTable('update-strategy-subTable', data)
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          await this.auxService.AlertSuccess('Ok', data.message);
          this.getStrategy();
        } else {
          await this.auxService.AlertError('Error', data.message);
          //this.getStrategy();
        }
      });
  }

  getStrategy() {
    this.auxService.ventanaCargando();
    this.productivityService
      .getStrategy('get-strategy')
      .subscribe(async (data) => {
        console.log(data);
        this.dataForTable = data.data;
      });
  }

  onMainTableDataSaved(data: any): void {
    this.auxService.ventanaCargando();
    this.productivityService
      .UpdateStrategy('update-strategy', data)
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          await this.auxService.AlertSuccess('Ok', data.message);
          this.getStrategy();
        } else {
          await this.auxService.AlertError('Error', data.message);
          //this.getStrategy();
        }
      });
  }
}