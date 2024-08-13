import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuxService } from '../../../services/aux-service.service';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-editclient',
  standalone: true,
  imports: [],
  templateUrl: './editclient.component.html',
  styleUrl: './editclient.component.css'
})
export class EditclientComponent {
  idcliente: number;

  constructor(private configService: ConfigService, private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) {

    this.idcliente = data.idclient;
    this.cargardetalles()
  }

  cargardetalles(){
    this.auxService.ventanaCargando();
    this.configService.ObtenerDetailClient(this.idcliente).subscribe({
      next:(data) =>{

        if(data.success){

          this.auxService.cerrarVentanaCargando();

          if(!data.warning){

            //this.dataSource.data = data.data;

          }
          else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Clientes",data.message); 

          }

        }
        else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Error",data.message); 

        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error al cargar los clientes:', error);
      },
    }); 
  }


}
