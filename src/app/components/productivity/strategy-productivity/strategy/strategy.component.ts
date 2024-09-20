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
import { CreateStrategicPillarComponent } from '../strategic-pillar/create-strategic-pillar/create-strategic-pillar.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateStrategyComponent } from './create-strategy/create-strategy.component';
import { CreateObjectiveComponent } from './create-objective/create-objective.component';
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
  emitEditToParent = false;
  constructor(
    public dialog: MatDialog,
    private auxService: AuxService,
    private productivityService: ProductivityService
  ) {}

  mainTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Nombre', field: 'nombre', sortDirection: null },
    { title: 'Descripción', field: 'descripcion', sortDirection: null },
  ];

  subTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Nombre', field: 'nombre' },
    { title: 'Etapa', field: 'etapa' },
    { title: 'Porcentaje Avance Real', field: 'porcentajeavance_real' },
    {
      title: 'Porcentaje Avance Proyectado',
      field: 'porcentajeavance_proyectado',
    },
    { title: 'Estado', field: 'estado' },
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

  getStrategy() {
    this.auxService.ventanaCargando();
    this.productivityService
      .get('get-strategy')
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        this.dataForTable = data.data;
      });
  }

  onEditClicked(data: any) {
    this.onEditAction(data);
  }

  onEditAction(event: any) {
    console.log('event', event);
    if (event.table == 'principal') {
      const dialogRef = this.dialog.open(CreateStrategyComponent, {
        data: event,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getStrategy();
        }
      });
    }

    if (event.table == 'subTable') {
      const dialogRef = this.dialog.open(CreateObjectiveComponent, {
        data: event,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getStrategy();
        }
      });
    }
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateStrategyComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getStrategy();
      }
    });
  }

  CreateActionObjetivo() {
    const dialogRef = this.dialog.open(CreateObjectiveComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getStrategy();
      }
    });
  }

  onDeleteAction(event: any) {
    console.log('event ', event);
    if (event.table == 'principal') {
      this.deleteStrategy(event);
    }
    if (event.table == 'subTable') {
      this.deleteObjective(event);
    }
  }

  async deleteStrategy(event: any) {
    console.log('event ', event.id);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-strategy', event.id)
        .subscribe(async (data) => {
          this.auxService.cerrarVentanaCargando();
          if (data.success == true) {
            await this.auxService.AlertSuccess('Ok', data.message);
            //this.ngOnInit();
            window.location.reload();
          } else {
            await this.auxService.AlertError('Error', data.message);
            //this.getBalance();
          }
        });
    }
  }

  async deleteObjective(event: any) {
    console.log('event ', event.id);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-objective', event.id)
        .subscribe(async (data) => {
          this.auxService.cerrarVentanaCargando();
          if (data.success == true) {
            await this.auxService.AlertSuccess('Ok', data.message);
            this.ngOnInit();
          } else {
            await this.auxService.AlertError('Error', data.message);
            //this.getBalance();
          }
        });
    }
  }

}
