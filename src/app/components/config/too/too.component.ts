import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuxService } from '../../../services/aux-service.service';
import { ConfigService } from '../../../services/config.service';
import { SharedStateService } from '../../../services/shared-state.service';
import { TooService } from '../../../services/too.service';
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
import { Router } from '@angular/router';


@Component({
  selector: 'app-too',
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
  templateUrl: './too.component.html',
  styleUrl: './too.component.css'
})
export class TooComponent {
  displayedColumns: string[] = ['machine', 'category','centerline'];
  columnNames = {
    name: 'Name',
    machine: 'Machine',
    centerline: 'Centerline'
  };
  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];

  constructor(
    private sharedStateService: SharedStateService,
    private configService: ConfigService,
    private tooService: TooService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.sharedStateService.updateSuggestedQuestions([]);
  }

  ngOnInit(): void {
    this.getToos();
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
    this.configService.Delete('Delete-Product', event.idProduct).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Product deleted successfully.',
            data.message
          );
          this.getToos();
        } else {
          this.auxService.AlertWarning(
            'Error deleting the product.',
            data.message
          );
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error deleting the TOO.', error.message);
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
    this.router.navigate(['/create-too'])
  }

  getToos() {
    this.auxService.ventanaCargando();
    this.tooService.get('get-all-toos').subscribe({
      next: (data: any) => {
        if (data.success) {
          this.auxService.cerrarVentanaCargando();

          if (!data.warning) {
            this.dataSource = Array.isArray(data.data) ? data.data : [];
          } else {
            this.auxService.ventanaCargando();
            this.auxService.AlertWarning('Theory of operation', data.message);
          }
        } else {
          this.auxService.ventanaCargando();
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error loading theory of operation: ', error);
      },
    });
  }

  onEditAction(event: any) {

    this.router.navigate(['/create-edit-too',event.idCenterline])
    

  }
}
