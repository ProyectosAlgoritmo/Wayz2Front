import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { SharedStateService } from '../../../services/shared-state.service';
import { ConfigService } from '../../../services/config.service';
import { AuxService } from '../../../services/aux-service.service';
import { ProductivityService } from '../../../services/productivity.service';
import { CreateBoardDirectorsReportComponent } from './create-board-directors-report/create-board-directors-report.component';

@Component({
  selector: 'app-board-directors-report',
  templateUrl: './board-directors-report.component.html',
  styleUrls: ['./board-directors-report.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    SharedModule,
    NzInputModule,
    NzIconModule,
  ],
})
export class BoardDirectorsReportComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'descripcionComite',
    'responsable',
    'porcentajeavanceProyectado',
    'porcentajeavanceReal',
    'fecha',
    'estado',
  ];
  columnNames = {
    nombre: 'Nombre',
    descripcionComite: 'Descripción Comité',
    responsable: 'Responsable',
    porcentajeavanceProyectado: 'Porcentaje Avance Proyectado',
    porcentajeavanceReal: 'Porcentaje Avance Real',
    fecha: 'Fecha',
    estado: 'Estado'
  };
  
  dataSource: any[] = [];

  constructor(
    private sharedStateService: SharedStateService,
    private configService: ConfigService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private router: Router,
    private productivityService: ProductivityService
  ) {}

  ngOnInit(){
    this.GetBoardDirectorsReports();
  }

  GetBoardDirectorsReports() {
    this.productivityService.get('get-board-directors-report').subscribe({
      next: (data:any) => {
        this.dataSource = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar el reporte de junta directiva:', error);
      }
    });
  }

  applyFilter(event: Event) {}

  onEditAction(event: any) {
    event.estado = event.estado == 'activo' ? true : false;
    const dialogRef = this.dialog.open(CreateBoardDirectorsReportComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el resultado es true, se vuelve a obtener la lista de clientes
        this.configService.ObtenerFCTipo().subscribe({
          next: (data) => {
            this.GetBoardDirectorsReports();
          },
          error: (error) => {
            this.auxService.AlertError('Error al cargar los tipos de categoría (flujo de caja):', error);
          }
        });
      }
    });
  }

  async onDeleteAction(event: any) {
    console.log('event ', event);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-board-directors-report', event.idInforme)
        .subscribe(async (data: any) => {
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

  CreateAction() {
    const dialogRef = this.dialog.open(CreateBoardDirectorsReportComponent);
    dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Si el resultado es true, se vuelve a obtener la lista de clientes
            this.configService.ObtenerFCTipo().subscribe({
              next: (data) => {
                this.GetBoardDirectorsReports();
              },
              error: (error) => {
                this.auxService.AlertError('Error al crear el reporte de junta directiva:', error);
              }
            });
          }
    });
  }
}
