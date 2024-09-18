import { Component, OnInit } from '@angular/core';
import { SharedStateService } from '../../../../services/shared-state.service';
import { ConfigService } from '../../../../services/config.service';
import { AuxService } from '../../../../services/aux-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../../shared/shared.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialog } from '@angular/material/dialog';
import { BalanceService } from '../../../../services/balance.service';
import { EdittypebalanceComponent } from '../../../config/balanceconfig/typebalance/edittypebalance/edittypebalance.component';
import { CreatetypebalanceComponent } from '../../../config/balanceconfig/typebalance/createtypebalance/createtypebalance.component';
import { CreateStrategicPillarComponent } from './create-strategic-pillar/create-strategic-pillar.component';
import { ProductivityService } from '../../../../services/productivity.service';

@Component({
  selector: 'app-strategic-pillar',
  templateUrl: './strategic-pillar.component.html',
  styleUrls: ['./strategic-pillar.component.css'],
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
export class StrategicPillarComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'estrategia', 'descripcion'];
  columnNames = {
    nombre: 'Nombre',
    estrategia: 'Estrategia',
    descripcion: 'Descripción',
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

  ngOnInit(): void {
    this.getStrategy();
  }

  applyFilter(event: Event) {}

  onEditAction(event: any) {
    console.log('event ', event);
    const dialogRef = this.dialog.open(CreateStrategicPillarComponent, {
      data: {
        idPilarestrategico: event.id,
        nombre: event.nombre,
        descripcion: event.descripcion,
        idEstrategia: event.idEstrategia,
        estrategia: event.estrategia,
        actionEdit: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si el resultado es true, se vuelve a obtener la lista de clientes
        this.configService.ObtenerBalanceTipo().subscribe({
          next: (data) => {
            this.getStrategy();
          },
          error: (error) => {
            this.auxService.AlertError(
              'Error al cargar los tipos de categoría (balance):',
              error
            );
          },
        });
      }
    });
  }

  getStrategy() {
    this.auxService.ventanaCargando();
    this.productivityService
      .getStrategicPillar('get-strategic-pillar')
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          this.dataSource = data.data;
        }
      });
  }

  async onDeleteAction(event: any) {
    console.log('event ', event.id);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .DeleteStrategicPillar('delete-strategic-pillar', event.id)
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

  CreateAction() {
    console.log(event);

    const dialogRef = this.dialog.open(CreateStrategicPillarComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getStrategy();
      }
    });
  }
}
