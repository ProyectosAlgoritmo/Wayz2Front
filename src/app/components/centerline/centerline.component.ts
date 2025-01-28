import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SharedModule } from '../shared/shared.module';
import { TableWithRowsChildComponent } from '../shared/table-with-rows-child/table-with-rows-child.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuxService } from '../../services/aux-service.service';
import { SharedStateService } from '../../services/shared-state.service';
import { CenterlineService } from '../../services/centerline.service';
import { NewCenterlineComponent } from './new-centerline/new-centerline.component';

@Component({
  selector: 'app-centerline',
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
  templateUrl: './centerline.component.html',
  styleUrls: ['./centerline.component.css']
})
export class CenterlineComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'category',
    'machine',
  ];
  

  // Nombres amigables de las columnas
  columnNames = {
    name: 'Name',
    category: 'Category',
    machine: 'Machine',
    
};


  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];

  constructor(
    private sharedStateService: SharedStateService,
    private centerlineService: CenterlineService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.sharedStateService.updateSuggestedQuestions([]);
  }

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(true);
    this.GetCenterline();
  }

  GetCenterline() {
    this.auxService.ventanaCargando();
    this.centerlineService.get('Get-All-Centerline').subscribe({
      next: (data:any) => {
        // this.dataSource = data.data;
        this.dataSource = data.data
        this.originalDataSource = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error:any) => {
        this.auxService.AlertError('Error loading centerline: ', error);
      },
    });
  }


  onEditAction(event: any) {
    const dialogRef = this.dialog.open(NewCenterlineComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetCenterline();
      }
    });
  }

  CreateAction() {
    const dialogRef = this.dialog.open(NewCenterlineComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetCenterline();
      }
    });
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
    this.centerlineService.Delete('Delete-Centerline', event.idCenterline).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Centerline deleted successfully.',
            data.message
          );
          this.GetCenterline();
        } else {
          this.auxService.AlertWarning(
            'Error deleting the Centerline.',
            data.message
          );
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error deleting the Centerline.', error.message);
      },
    });
  }
}

