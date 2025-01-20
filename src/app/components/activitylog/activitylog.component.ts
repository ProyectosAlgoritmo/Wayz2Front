import { Component, OnInit } from '@angular/core';

import { SharedStateService } from '../../services/shared-state.service';
import { PermisosService } from '../../services/permisos.service';
import { AuxService } from '../../services/aux-service.service';
import { DateService } from '../../services/data-service.service';

import { SharedModule } from '../shared/shared.module';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-activitylog',
  templateUrl: './activitylog.component.html',standalone: true,
  imports: [ SharedModule
  ],
  styleUrls: ['./activitylog.component.css']
})




export class ActivitylogComponent implements OnInit {
  displayedColumns: string[] = ['accion', 'procedimiento', 'resultado', 'fecha', 'mensaje', 'nombreUsuario' ];
  columnNames = {
    nombreUsuario: 'Nombre de usuario',
  };
  dataSource: any[] = [];

  constructor(private sharedStateService: SharedStateService
    ,private auxService: AuxService, private DateService: DateService, private notificationService: NotificationService
  ) { 
    const idEmpresa = sessionStorage.getItem('id_empresa')?.toString() || '';
    this.notificationService.updateNotificationStateNoti(idEmpresa)
  }

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(false);


    this.auxService.ventanaCargando();
    this.DateService.LogActividades().subscribe({
      next:(data) =>{

        if(data.success){

          this.auxService.cerrarVentanaCargando();

          if(!data.warning){

            this.dataSource = data.data;

          }
          else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Tus empresas",data.message); 

          }

        }
        else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Error",data.message); 

        }
      },
      error: (error) => {

      },
    }); 
   
  
  }

}
