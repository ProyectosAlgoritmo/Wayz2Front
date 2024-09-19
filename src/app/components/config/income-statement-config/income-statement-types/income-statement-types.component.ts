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
import { CreateIncomeStatementTypesComponent } from './create-income-statement-types/create-income-statement-types.component';
import { EditIncomeStatementTypesComponent } from './edit-income-statement-types/edit-income-statement-types.component';
import { ResultStatusService } from '../../../../services/result-status.service';

@Component({
  selector: 'app-income-statement-types',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule, NzIconModule
  ],
  templateUrl: './income-statement-types.component.html',
  styleUrl: './income-statement-types.component.css'
})
export class IncomeStatementTypesComponent {
  displayedColumns: string[] = ['nombreTipo', 'nombreCategoria'];
  columnNames = {
    nombreTipo: 'Nombre',
    nombreCategoria: 'Nombre categoría'
  };
  dataSource: any[] = [];

  constructor(private sharedStateService: SharedStateService, 
    private configService: ConfigService,
     private auxService: AuxService, 
     public dialog: MatDialog, private router: Router,
     private resultStatusService: ResultStatusService) { }

  ngOnInit(): void {

    this.sharedStateService.toggleSidenavVisible(true);

    this.auxService.ventanaCargando();
    this.configService.ObtenerERTipo().subscribe({
      next: (data) => {

        if (data.success) {

          this.auxService.cerrarVentanaCargando();

          if (!data.warning) {

            this.dataSource = Array.isArray(data.data) ? data.data : [];

          }
          else {

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Estado de resultados tipo de categoría", data.message);

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
        this.auxService.AlertError('Error al cargar los tipos de categoría (estado de resultados):', error);
      },
    });
  }



  applyFilter(event: Event) {
  }

  onEditAction(event: any) {

    const dialogRef = this.dialog.open(EditIncomeStatementTypesComponent, {
      data: { idcategory: event.idEstadoresultadotipo }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el resultado es true, se vuelve a obtener la lista de clientes
        this.configService.ObtenerERTipo().subscribe({
          next: (data) => {

            this.dataSource = data.data;
            this.auxService.cerrarVentanaCargando();
          },
          error: (error) => {
            this.auxService.AlertError('Error al cargar los tipos de categoría (estado de resultados):', error);
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
      this.resultStatusService
        .DeleteResultStatus('delete-result-status-tipe', event.idEstadoresultadotipo)
        .subscribe(async (data:any) => {
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
    
    const dialogRef = this.dialog.open(CreateIncomeStatementTypesComponent);
  
    dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Si el resultado es true, se vuelve a obtener la lista de clientes
            this.configService.ObtenerERTipo().subscribe({
              next: (data) => {
  
                this.dataSource = data.data;
                this.auxService.cerrarVentanaCargando();
              },
              error: (error) => {
                this.auxService.AlertError('Error al cargar los tipos de categoría (estado de resultados):', error);
              }
            });
          }
    });

  }
}
