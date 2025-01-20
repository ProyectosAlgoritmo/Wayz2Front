import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuxService } from '../../../services/aux-service.service';
import { ConfigService } from '../../../services/config.service';
import { SharedStateService } from '../../../services/shared-state.service';
import { EditMachineComponent } from '../machine/edit-machine/edit-machine.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SharedModule } from '../../shared/shared.module';
import { NewProductComponent } from './new-product/new-product.component';


@Component({
  selector: 'app-products',
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
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
    NzFormModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
displayedColumns: string[] = ['name', 'machine',];
  columnNames = {
    name: 'Name',
    machine: 'Machine',
  };
  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];

  constructor(
    private sharedStateService: SharedStateService,
    private configService: ConfigService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.sharedStateService.updateSuggestedQuestions([]);
  }

  ngOnInit(): void {
    this.getProducts();
  }

  // Función para eliminar un usuario
  onDeleteAction(event: any) {
    this.auxService.ventanaCargando();
    this.configService.Delete('Delete-Product', event.idProduct).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Product deleted successfully.',
            data.message
          );
          this.getProducts();
        } else {
          this.auxService.AlertWarning(
            'Error deleting the product.',
            data.message
          );
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error deleting the product.', error.message);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!filterValue) {
      // Si no hay filtro, restaura los datos originales
      this.dataSource = [...this.originalDataSource];
    } else {
      this.dataSource = this.originalDataSource.filter((item) => {
        return this.displayedColumns.some((column) => {
          const columnValue = item[column];
          return (
            columnValue &&
            columnValue.toString().toLowerCase().includes(filterValue)
          );
        });
      });
    }
  }

  CreateAction() {
    const dialogRef = this.dialog.open(NewProductComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProducts();
      }
    });
  }

  getProducts() {
    this.auxService.ventanaCargando();
    this.configService.get('Get-All-Products').subscribe({
      next: (data: any) => {
        if (data.success) {
          this.auxService.cerrarVentanaCargando();

          if (!data.warning) {
            this.dataSource = Array.isArray(data.data) ? data.data : [];
          } else {
            this.auxService.ventanaCargando();
            this.auxService.AlertWarning('Products', data.message);
          }
        } else {
          this.auxService.ventanaCargando();
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error loading products: ', error);
      },
    });
  }

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(NewProductComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProducts();
      }
    });
  }
}

