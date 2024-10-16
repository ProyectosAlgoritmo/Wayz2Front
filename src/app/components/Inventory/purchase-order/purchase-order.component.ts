import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuxService } from '../../../services/aux-service.service';
import { InventoryService } from '../../../services/inventory.service';
import { SharedStateService } from '../../../services/shared-state.service';
import { SharedModule } from '../../shared/shared.module';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css'],
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
export class PurchaseOrderComponent implements OnInit {
  displayedColumns: string[] = [
    'proveedor',  // Nueva columna
    'descripcion',  // Nueva columna
    'fechaOrdenCompra',  // Fecha de orden de compra
    'fechaPactadaEntrada',  // Fecha pactada de entrega
    'fechaRealEntrega',  // Fecha real de entrega
    'cantidad',  // Nueva columna
    'valorUnitario',  // Nueva columna
    'cerrada',  // Nueva columna de tipo BIT
  ];
  
  // Nombres amigables de las nuevas columnas
  columnNames = {
    proveedor: 'Proveedor',
    descripcion: 'Descripción',
    fechaOrdenCompra: 'Fecha de Orden de Compra',
    fechaPactadaEntrada: 'Fecha Pactada de Entrega',
    fechaRealEntrega: 'Fecha Real de Entrega',
    cantidad: 'Cantidad',
    valorUnitario: 'Valor Unitario',
    cerrada: 'Cerrada',  // Columna de tipo BIT (booleano)
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
    this.GetPurchaseOrder();
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.GetPurchaseOrder(); 
    // Aquí puedes manejar las fechas seleccionadas
  }

  GetPurchaseOrder() {
    this.auxService.ventanaCargando();
    this.inventoryService.post('get-purchase-orders',this.dates).subscribe({
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
    event.cerrada = event.cerrada === 'activo' ? true : false;
    const dialogRef = this.dialog.open(CreatePurchaseOrderComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetPurchaseOrder();
      }
    });
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreatePurchaseOrderComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetPurchaseOrder();
      }
    });
  }

  // Función para eliminar un usuario
  onDeleteAction(event: any) {
    this.auxService.ventanaCargando();
    this.inventoryService.Delete('delete-purchase-order', event.idUsuario).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Registro eliminado correctamente',
            data.message
          );
          this.GetPurchaseOrder();
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
