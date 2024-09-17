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
import { CreatetypebalanceComponent } from './createtypebalance/createtypebalance.component';
import { EdittypebalanceComponent } from './edittypebalance/edittypebalance.component';
import { BalanceService } from '../../../../services/balance.service';


@Component({
  selector: 'app-typebalance',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule, NzIconModule
  ],
  templateUrl: './typebalance.component.html',
  styleUrl: './typebalance.component.css'
})
export class TypebalanceComponent implements OnInit{
  displayedColumns: string[] = ['nombreTipo', 'nombreBalanceCategoria'];
  columnNames = {
    nombreTipo: 'Nombre',
    nombreBalanceCategoria: 'Nombre categoría'
  };
  dataSource: any[] = [];

  constructor(private sharedStateService: SharedStateService,
     private configService: ConfigService, 
     private auxService: AuxService, 
     public dialog: MatDialog, private router: Router,
     private balanceService:BalanceService) { }

  ngOnInit(): void {

    this.sharedStateService.toggleSidenavVisible(true);

    this.auxService.ventanaCargando();
    this.configService.ObtenerBalanceTipo().subscribe({
      next: (data) => {

        if (data.success) {

          this.auxService.cerrarVentanaCargando();

          if (!data.warning) {

            this.dataSource = data.data;

          }
          else {

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Balance tipo de categoría", data.message);

          }

        }
        else {

          this.auxService.ventanaCargando();
          this.auxService.AlertWarning("Error", data.message);

        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        console.log(error.status);
        this.auxService.AlertError('Error al cargar los tipos de categoría (balance):', error);
      },
    });
  }



  applyFilter(event: Event) {
  }

  onEditAction(event: any) {

    const dialogRef = this.dialog.open(EdittypebalanceComponent, {
      data: { idcategory: event.idBalancetipo }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el resultado es true, se vuelve a obtener la lista de clientes
        this.configService.ObtenerBalanceTipo().subscribe({
          next: (data) => {

            this.dataSource = data.data;
            this.auxService.cerrarVentanaCargando();
          },
          error: (error) => {
            this.auxService.AlertError('Error al cargar los tipos de categoría (balance):', error);
          }
        });
      }
    });

  }

  async onDeleteAction(event: any) {
    console.log('event ', event);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?', undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.balanceService
        .DeleteBalance('delete-balance-tipe', event.idBalancetipo)
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
    
    const dialogRef = this.dialog.open(CreatetypebalanceComponent);
  
    dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Si el resultado es true, se vuelve a obtener la lista de clientes
            this.configService.ObtenerBalanceTipo().subscribe({
              next: (data) => {
  
                this.dataSource = data.data;
                this.auxService.cerrarVentanaCargando();
              },
              error: (error) => {
                this.auxService.AlertError('Error al cargar las zonas:', error);
              }
            });
          }
    });

  }
}
