import { Component, OnInit, Provider, ViewChild } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NzCardModule } from 'ng-zorro-antd/card';
import { registerables } from 'chart.js';
import { AuxService } from '../../../services/aux-service.service';
import { SharedStateService } from '../../../services/shared-state.service';
import { CardPercentageComponent } from '../../shared/card-percentage/card-percentage.component';
import { SharedModule } from '../../shared/shared.module';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { LimitsAndTargetService } from '../../../services/limitsAndTarget.service';

@Component({
  selector: 'app-update-target-and-limits-product',
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
    BaseChartDirective,
    NzCardModule,
    CardPercentageComponent,
  ],
  templateUrl: './update-target-and-limits-product.component.html',
  styleUrls: ['./update-target-and-limits-product.component.css'],
})
export class UpdateTargetAndLimitsProductComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  [x: string]: any;
  dataForTable: any[] = [];
  dateYear: any[] = [];
  searchValue: string = '';
  emitEditToParent = false;
  constructor(
    public dialog: MatDialog,
    private auxService: AuxService,
    private limitsAndTargetService: LimitsAndTargetService,
    private sharedStateService: SharedStateService
  ) {
    Chart.register(...registerables);
  }

  mainTableColumns = [
    { title: 'Categories', field: 'categories', sortDirection: null },
  ];

  subTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Centerline', field: 'centerline', sortDirection: null },
    { title: 'Current min', field: 'CurrentMin', sortDirection: null },
    { title: 'Current target', field: 'CurrentTarget', sortDirection: null },
    { title: 'Current max', field: 'CurrentMax', sortDirection: null },
    { title: 'New min', field: 'NewMin', sortDirection: null },
    { title: 'New target', field: 'NewTarget', sortDirection: null },
    { title: 'New max', field: 'NewMax', sortDirection: null },
    { title: '360 variable', field: 'degree360', sortDirection: null },
  ];

  ngOnInit() {
    this.GetAllLimitsAndTargets();
    // this.sharedStateService.toggleSidenavVisible(true);
    // this.productivityService.getDataStructure1().subscribe((data) => {
    // this.dataForTable = data;
    // });
  }

  GetAllLimitsAndTargets() {
    this.auxService.ventanaCargando();
    this.limitsAndTargetService
      .get('Get-All-LimitsAndTargets')
      .subscribe(async (data: any) => {
        this.dataForTable = data.data;
        console.log('dataForTable ', this.dataForTable);
        if (this.chart) {
          this.chart.update();
        }

        this.auxService.cerrarVentanaCargando();
      });
  }

  // onEditClicked(data: any) {
  //   this.onEditAction(data);
  // }

  // onEditAction(event: any) {
  //   event.estado = event.estado == 'activo' ? true : false;
  //   event.estrategico = event.estrategico == 'activo' ? true : false;
  //   if (event.table == 'principal') {
  //     const dialogRef = this.dialog.open(CreateProjectComponent, {
  //       data: event,
  //     });

  //     dialogRef.afterClosed().subscribe((result) => {
  //       if (result) {
  //         this.Get-All-LimitsAndTargets();
  //       }
  //     });
  //   }

  //   if (event.table == 'subTable') {
  //     const dialogRef = this.dialog.open(CreateProjectStatusComponent, {
  //       data: event,
  //     });

  //     dialogRef.afterClosed().subscribe((result) => {
  //       if (result) {
  //         this.Get-All-LimitsAndTargets();
  //       }
  //     });
  //   }
  // }

  // CreateAction() {
  //   const dialogRef = this.dialog.open(CreateProjectComponent);
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.Get-All-LimitsAndTargets();
  //     }
  //   });
  // }

  // CreateProjectStatus() {
  //   const dialogRef = this.dialog.open(CreateProjectStatusComponent);
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.Get-All-LimitsAndTargets();
  //     }
  //   });
  // }

  // onDeleteAction(event: any) {
  //   console.log('event ', event);
  //   if (event.table == 'principal') {
  //     this.deleteProject(event);
  //   }
  //   if (event.table == 'subTable') {
  //     this.deleteProjectStatus(event);
  //   }
  // }

  // async deleteProject(event: any) {
  //   console.log('event ', event.id);
  //   const result = await this.auxService.AlertConfirmation(
  //     'Seguro que desea eliminar este registro?',
  //     undefined
  //   );
  //   if (result.isConfirmed) {
  //     this.auxService.ventanaCargando();
  //     this.productivityService
  //       .Delete('delete-project', event.id)
  //       .subscribe(async (data:any) => {
  //         this.auxService.cerrarVentanaCargando();
  //         if (data.success == true) {
  //           await this.auxService.AlertSuccess('Ok', data.message);
  //           this.ngOnInit();
  //         } else {
  //           await this.auxService.AlertError('Error', data.message);
  //           //this.getBalance();
  //         }
  //       });
  //   }
  // }

  // async deleteProjectStatus(event: any) {
  //   console.log('event ', event.id);
  //   const result = await this.auxService.AlertConfirmation(
  //     'Seguro que desea eliminar este registro?',
  //     undefined
  //   );
  //   if (result.isConfirmed) {
  //     this.auxService.ventanaCargando();
  //     this.productivityService
  //       .Delete('delete-project-state', event.id)
  //       .subscribe(async (data) => {
  //         this.auxService.cerrarVentanaCargando();
  //         if (data.success == true) {
  //           await this.auxService.AlertSuccess('Ok', data.message);
  //           this.ngOnInit();
  //         } else {
  //           await this.auxService.AlertError('Error', data.message);
  //           //this.getBalance();
  //         }
  //       });
  //   }
  // }
}
