import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AuxService } from '../../../../services/aux-service.service';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from '../../../shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { financialperformanceService } from '../../../../services/financialperformance.service';
import { ConfigService } from '../../../../services/config.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DateService } from '../../../../services/data-service.service';


@Component({
  selector: 'app-editincome',
  standalone: true,
  imports: [NzInputModule, NzIconModule, CommonModule, ReactiveFormsModule, MatDialogModule, SharedModule, NzFormModule, NzSelectModule],
  templateUrl: './editincome.component.html',
  styleUrl: './editincome.component.css'
})
export class EditincomeComponent {
  idingreso: number;
  clientForm: FormGroup;
  productos: any; 
  zonas: any; 
  clientes: any; 
  vendedores: any; 


  constructor(
    private fb: FormBuilder,
    private financialperformanceService: financialperformanceService,
    private configService: ConfigService,
    private dateService: DateService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<EditincomeComponent>
  ) {
    
    this.idingreso = data.idingreso;
    this.clientForm = this.fb.group({
      idCliente: ['', Validators.required],
      idProductoServicio: ['', Validators.required],
      idZona: ['', Validators.required],
      idVendedor: ['', Validators.required],
      conceptoIngreso: ['', Validators.required],
      cantidadReal: [''],
      cantidadProyectada: [''],
      valorIngresoReal: [''],
      valorIngresoProyectado: [''],
      fecha: [''],
      mes: [{ value: '', disabled: true }],
      fechaModificacion: [''] 
    });

    this.cargarDetalles();
    
    this.dateService.cargarCliente().subscribe((clientes) => {
      this.clientes = clientes; // Almacena los clientes en una variable
    });

    this.dateService.cargarVendedor().subscribe((vendedores) => {
      this.vendedores = vendedores; // Almacena los clientes en una variable
    });

    this.dateService.cargarProductos().subscribe((productos) => {
      this.productos = productos; // Almacena los clientes en una variable
    });

    this.dateService.cargarZonas().subscribe((zonas) => {
      this.zonas = zonas; // Almacena los clientes en una variable
    });
  }

  

  cargarDetalles() {
    this.auxService.ventanaCargando();
    this.financialperformanceService.ObtenerDetail(this.idingreso, 'Get-Detail-Income').subscribe({
      next: (data) => {
        this.auxService.cerrarVentanaCargando();

        if (data.success) {
          if (!data.warning) {
            this.clientForm.patchValue(data.data); // Vincula los datos al formulario
          } else {
            this.auxService.AlertWarning("Ingresos", data.message); 
          }
        } else {
          this.auxService.AlertWarning("Error", data.message); 
        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error al cargar los ingresos:', error);
      },
    });
  }



  onCancel(): void {
    this.dialogRef.close();
  }

  guardarCambios() {
    if (this.clientForm.valid) {
      this.auxService.ventanaCargando();

      console.log(this.clientForm); 


      this.financialperformanceService.UpdateData(this.idingreso, this.clientForm.value, 'Update-Income').subscribe({
        next: (data) => {
          if (data.success) {

            if(!data.warning){
              this.auxService.AlertSuccess('Actualizar Ingreso', data.message);
            }
            else
            {
              this.auxService.cerrarVentanaCargando();
              this.auxService.AlertWarning('Error al actualizar Ingreso', data.message);
            }
            this.dialogRef.close(true); // Cierra el diálogo y devuelve un resultado positivo
          } else {
            this.auxService.AlertWarning('Error al actualizar Ingreso', data.message);
          }
        },
        error: (error) => {
          this.auxService.cerrarVentanaCargando();
          console.log(error.status); 
          this.auxService.AlertError('Error al actualizar el Ingreso:', error);
        }
      });
    } else {
      this.auxService.AlertWarning('Formulario inválido', 'Por favor, revisa los campos y corrige los errores.');
    }
  }
  

  onInputChange(event: any, controlName: string): void {
    const input = event.target.value;
    const sanitizedInput = this.auxService.validateDecimal(input);
    this.clientForm.get(controlName)?.setValue(sanitizedInput, { emitEvent: false });
  }

}
