import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { ButtonstrategicComponent } from './buttonstrategic/buttonstrategic.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TableComponent } from './table/table.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';



@NgModule({
  declarations: [
    ButtonstrategicComponent,
    TableComponent

    // Aquí puedes declarar otros componentes compartidos
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NzInputModule,
    NzIconModule,
    NzTableModule, 
    NzPaginationModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule
    
    // Aquí puedes importar otros módulos de Angular Material o módulos comunes
  ],
  exports: [
    ButtonstrategicComponent,
    TableComponent
    // Aquí puedes exportar otros componentes compartidos
  ]
})
export class SharedModule { }
