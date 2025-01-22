import { NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormModule,
} from 'ng-zorro-antd/form';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { SharedModule } from '../shared/shared.module';
import { CrewsService } from '../../services/crews.service';
import { AuxService } from '../../services/aux-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedStateService } from '../../services/shared-state.service';
import { CreateUserComponent } from '../users-module/users/create-user/create-user.component';
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
import { TableWithRowsChildComponent } from '../shared/table-with-rows-child/table-with-rows-child.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crews',
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
  templateUrl: './crews.component.html',
  styleUrls: ['./crews.component.css'],
})
export class CrewsComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'hours',
    'days',
    'startDay',
    'startTime',
  ];
  

  // Nombres amigables de las columnas
  columnNames = {
    name: 'Name',
    hours: 'Shift Hours',
    days: 'Days Until Pattern Repeats',
    startDay: '1st Day of Rotation',
    startTime: 'Start Time of First Shift',
};



  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];

  constructor(
    private sharedStateService: SharedStateService,
    private crewsService: CrewsService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.sharedStateService.updateSuggestedQuestions([]);
  }

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(true);
    this.GetCrews();
  }

  GetCrews() {
    this.auxService.ventanaCargando();
    this.crewsService.get('get-all-crews').subscribe({
      next: (data) => {
        // this.dataSource = data.data;
        this.dataSource = data.data
        this.originalDataSource = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error) => {
        this.auxService.AlertError('Error loading crews: ', error);
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

  // onEditAction(event: any) {
  //   event.bActivo = event.bActivo === 'active' ? true : false;
  //   const dialogRef = this.dialog.open(CreateUserComponent, {
  //     data: event,
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.GetCrews();
  //     }
  //   });
  // }

  CreateAction() {
    this.router.navigate(['/new-crews']);
  }

 
}

