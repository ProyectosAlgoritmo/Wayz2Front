import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { AuxService } from '../../../services/aux-service.service';
import { ConfigService } from '../../../services/config.service';
import { SharedStateService } from '../../../services/shared-state.service';

@Component({
  selector: 'app-categorys',
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
  templateUrl: './categorys.component.html',
  styleUrls: ['./categorys.component.css']
})
export class CategorysComponent implements OnInit {
  displayedColumns: string[] = ['name', 'machine',];
  columnNames = {
    name: 'Name',
    crew: 'Machine',
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
    this.getCategory();
  }

  // Función para eliminar un usuario
  onDeleteAction(event: any) {
    this.auxService.ventanaCargando();
    this.configService.Delete('Delete-category', event.idCategory).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Category deleted successfully.',
            data.message
          );
          this.getCategory();
        } else {
          this.auxService.AlertWarning(
            'Error deleting the category.',
            data.message
          );
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error deleting the category.', error.message);
      },
    });
  }

 
  CreateAction() {
    const dialogRef = this.dialog.open(NewCategoryComponent);
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.getCategory();
      }
    });
  }

  getCategory() {
    this.auxService.ventanaCargando();
    this.configService.get('Get-All-Categorys').subscribe({
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
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.getCategory();
      }
    });
  }
}
