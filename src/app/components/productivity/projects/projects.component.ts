import { Component, OnInit, Provider } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  CloudDownloadOutline,
  CloudUploadOutline,
  PlayCircleOutline,
  EyeOutline,
  EditOutline,
} from '@ant-design/icons-angular/icons';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { AuxService } from '../../../services/aux-service.service';
import { ProductivityService } from '../../../services/productivity.service';
import { CreateProjectComponent } from './create-project/create-project.component';
import { CreateProjectStatusComponent } from './create-project-status/create-project-status.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],standalone: true,
  providers: [
    {
      provide: NZ_ICONS,
      useValue: [
        CloudDownloadOutline,
        CloudUploadOutline,
        PlayCircleOutline,
        EyeOutline,
        EditOutline,
      ],
    },
  ],
  imports: [
    TableWithRowsChildComponent,
    FormsModule,
    NgFor,
    NzInputModule,
    MatToolbarModule,
    NzOptionComponent,
    NzSelectModule,
    NzIconModule,
    SharedModule,
  ],
})
export class ProjectsComponent implements OnInit {

  [x: string]: any;
  dataForTable: any[] = [];
  dateYear: any[] = [];
  searchValue: string = '';
  emitEditToParent = false;
  constructor(
    public dialog: MatDialog,
    private auxService: AuxService,
    private productivityService: ProductivityService
  ) {}

  mainTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Proyecto', field: 'nombre', sortDirection: null },
    { title: 'Lider de proyecto', field: 'liderProyecto', sortDirection: null },
    { title: 'Zona', field: 'zona', sortDirection: null },
    { title: 'Unidad', field: 'unidad', sortDirection: null },
    { title: 'Porcentaje avance Proyectado', field: 'porcentajeavanceProyectado', sortDirection: null },
    { title: 'Porcentaje avance real', field: 'porcentajeavanceReal', sortDirection: null },
    { title: 'Etapa', field: 'etapa', sortDirection: null },
    { title: 'Estado', field: 'estado', sortDirection: null },
    { title: 'Fecha de inicio', field: 'fechaInicio', sortDirection: null },
    { title: 'Fecha final', field: 'fechaFinal', sortDirection: null },
  ];

  subTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Nombre', field: 'nombre', sortDirection: null },
    { title: 'Descripcion', field: 'descripcion', sortDirection: null },
    { title: 'Comentario', field: 'comentario', sortDirection: null },
    { title: 'estado', field: 'estado', sortDirection: null },
    { title: 'Etapa', field: 'etapa', sortDirection: null },
    { title: 'Porcentaje proyectado', field: 'porcentajeProyectado', sortDirection: null },
    { title: 'Porcentaje real', field: 'porcentajeReal', sortDirection: null },
    { title: 'Responsable', field: 'responsable', sortDirection: null },
    { title: 'Fecha de revision', field: 'fechaRevision', sortDirection: null },
  ];

  onSearchChange(): void {
    this.auxService.updateSearch(this.searchValue);
  }

  ngOnInit() {
    this.getProjects();
    // this.productivityService.getDataStructure1().subscribe((data) => {
    //   this.dataForTable = data;
    // });
  }

  getProjects() {
    this.auxService.ventanaCargando();
    this.productivityService.get('get-projects').subscribe(async (data) => {
      this.auxService.cerrarVentanaCargando();
      this.dataForTable = data.data;
    });
  }
  

  onEditClicked(data: any) {
    this.onEditAction(data);
  }

  onEditAction(event: any) {
    event.estado = event.estado == 'activo' ? true : false;
    if (event.table == 'principal') {
      const dialogRef = this.dialog.open(CreateProjectComponent, {
        data: event,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getProjects();
        }
      });
    }

    if (event.table == 'subTable') {
      const dialogRef = this.dialog.open(CreateProjectStatusComponent, {
        data: event,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getProjects();
        }
      });
    }
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateProjectComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProjects();
      }
    });
  }

  CreateProjectStatus() {
    const dialogRef = this.dialog.open(CreateProjectStatusComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProjects();
      }
    });
  }

  onDeleteAction(event: any) {
    console.log('event ', event);
    if (event.table == 'principal') {
      this.deleteProject(event);
    }
    if (event.table == 'subTable') {
      this.deleteProjectStatus(event);
    }
  }

  async deleteProject(event: any) {
    console.log('event ', event.id);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-project', event.id)
        .subscribe(async (data) => {
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

  async deleteProjectStatus(event: any) {
    console.log('event ', event.id);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-project-state', event.id)
        .subscribe(async (data) => {
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

}
