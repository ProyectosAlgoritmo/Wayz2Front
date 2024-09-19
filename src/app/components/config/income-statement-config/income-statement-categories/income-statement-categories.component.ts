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
import { EditIncomeStatementCategoriesComponent } from './edit-income-statement-categories/edit-income-statement-categories.component';
import { CreateIncomeStatementCategoriesComponent } from './create-income-statement-categories/create-income-statement-categories.component';
import { ResultStatusService } from '../../../../services/result-status.service';


@Component({
  selector: 'app-income-statement-categories',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule, NzIconModule
  ],
  templateUrl: './income-statement-categories.component.html',
  styleUrl: './income-statement-categories.component.css'
})
export class IncomeStatementCategoriesComponent {
  displayedColumns: string[] = ['nombreCategoria'];
  columnNames = {
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
    this.configService.ObtenerERTipoCategoria().subscribe({
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
        this.auxService.AlertError('Error al cargar los tipos de categoría (Estado de resultados):', error);
      },
    });
  }



  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.dataSource.filter(item => 
      item.nombreCategoria.toLowerCase().includes(filterValue)
    );
  }

  onEditAction(event: any) {

    const dialogRef = this.dialog.open(EditIncomeStatementCategoriesComponent, {
      data: { idcategory: event.idErcategoria }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el resultado es true, se vuelve a obtener la lista de clientes
        this.configService.ObtenerERTipoCategoria().subscribe({
          next: (data) => {

            this.dataSource = data.data;
            this.auxService.cerrarVentanaCargando();
          },
          error: (error) => {
            this.auxService.AlertError('Error al cargar los tipos de categoría (Estado de resultados):', error);
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
        .DeleteResultStatus('delete-result-status', event.idErcategoria)
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
    
    const dialogRef = this.dialog.open(CreateIncomeStatementCategoriesComponent);
  
    dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Si el resultado es true, se vuelve a obtener la lista de clientes
            this.configService.ObtenerERTipoCategoria().subscribe({
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
