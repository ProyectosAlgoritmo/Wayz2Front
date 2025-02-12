import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuxService } from '../../../../services/aux-service.service';
import { ConfigService } from '../../../../services/config.service';
import { SharedStateService } from '../../../../services/shared-state.service';
import { EditMachineComponent } from '../edit-machine/edit-machine.component';
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
import { SharedModule } from '../../../shared/shared.module';
import { TableWithRowsChildComponent } from '../../../shared/table-with-rows-child/table-with-rows-child.component';

@Component({
  selector: 'app-machines-production',
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
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
    NzFormModule,
  ],
  templateUrl: './machines-production.component.html',
  styleUrls: ['./machines-production.component.css']
})
export class MachinesProductionComponent implements OnInit {
displayedColumns: string[] = ['name', 'crew',];
  columnNames = {
    name: 'Name',
    crew: 'Crew',
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
    this.getmachine();
  }

  // Función para eliminar un usuario
  async onDeleteAction(event: any) {
    const confirmed = await this.auxService.AlertConfirmation(
      'Are you sure you want to delete this record?',
      'This action cannot be undone.',
      'Yes, delete it!'
    );
  
    if (!confirmed) {
      return; // Si no confirma, no continúa con la eliminación
    }
    this.auxService.ventanaCargando();
    this.configService.Delete('Delete-Machine', event.idMachine).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Machine deleted successfully.',
            data.message
          );
          this.getmachine();
        } else {
          this.auxService.AlertWarning(
            'Error deleting the machine.',
            data.message
          );
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error deleting the machine.', error.message);
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
    const dialogRef = this.dialog.open(EditMachineComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getmachine();
      }
    });
  }

  getmachine() {
    this.auxService.ventanaCargando();
    this.configService.get('Get-All-Machines-production').subscribe({
      next: (data: any) => {
        this.dataSource = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error listing the data:', error);
      },
    });
  }

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(EditMachineComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getmachine();
      }
    });
  }
}

