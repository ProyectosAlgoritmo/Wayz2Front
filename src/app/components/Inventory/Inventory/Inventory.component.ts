import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../../shared/shared.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { MatDialog } from '@angular/material/dialog';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuxService } from '../../../services/aux-service.service';
import { SharedStateService } from '../../../services/shared-state.service';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { InventoryService } from '../../../services/inventory.service';
import { CreateInventoryComponent } from './create-inventory/create-inventory.component';

@Component({
  selector: 'app-Inventory',
  templateUrl: './Inventory.component.html',
  styleUrls: ['./Inventory.component.css'],
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
    TableWithRowsChildComponent,
  ],
})
export class InventoryComponent implements OnInit {
  displayedColumns: string[] = [
    'fecha',
    'fechaCompra',  // Cambié según tu nueva columna
    'fechaVencimiento',  // Cambié según tu nueva columna
    'idTipoInventario',  // Cambié según tu nueva columna
    'proveedor',  // Nueva columna
    'descripcion',  // Nueva columna
    'cantidad',  // Nueva columna
    'valorUnitario',  // Nueva columna
    'ubicacion',  // Nueva columna
  ];
  
  // Nombres amigables de las nuevas columnas
  columnNames = {
    fecha: 'Fecha',
    fechaCompra: 'Fecha de Compra',  // Ajustado al nuevo campo
    fechaVencimiento: 'Fecha de Vencimiento',
    idTipoInventario: 'ID Tipo Inventario',
    proveedor: 'Proveedor',
    descripcion: 'Descripción',
    cantidad: 'Cantidad',
    valorUnitario: 'Valor Unitario',
    ubicacion: 'Ubicación',
  };


  dates: any = {};
  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];

  constructor(
    private sharedStateService: SharedStateService,
    private inventoryService: InventoryService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.sharedStateService.updateSuggestedQuestions([]);
    const currentYear = new Date().getFullYear();
    this.dates = {
      FechaInicio: `${currentYear}-01-01`, 
      FechaFin: `${currentYear}-12-31`     
    };
  }

  ngOnInit(): void {
    this.GetInventory();
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.GetInventory(); 
    // Aquí puedes manejar las fechas seleccionadas
  }

  GetInventory() {
    this.auxService.ventanaCargando();
    this.inventoryService.post('get-inventory',this.dates).subscribe({
      next: (data) => {
        this.dataSource = data.data;
        this.originalDataSource = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar los datos:', error);
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

  onEditAction(event: any) {
    event.bActivo = event.bActivo === 'activo' ? true : false;
    const dialogRef = this.dialog.open(CreateInventoryComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetInventory();
      }
    });
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateInventoryComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetInventory();
      }
    });
  }

  // Función para eliminar un usuario
  onDeleteAction(event: any) {
    this.auxService.ventanaCargando();
    this.inventoryService.Delete('delete-inventory', event.idInventario).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Registro eliminado correctamente',
            data.message
          );
          this.GetInventory();
        } else {
          this.auxService.AlertWarning(
            'Error al eliminar el registro',
            data.message
          );
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error al eliminar el registro', error.message);
      },
    });
  }
}
