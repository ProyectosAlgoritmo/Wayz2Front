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
  selector: 'app-editexpense',
  standalone: true,
  imports: [NzInputModule, NzIconModule, CommonModule, ReactiveFormsModule, MatDialogModule, SharedModule, NzFormModule, NzSelectModule],
  templateUrl: './editexpense.component.html',
  styleUrl: './editexpense.component.css'
})
export class EditexpenseComponent {

  IdEgreso: number;
  clientForm: FormGroup;
  unidades: any; 
  tipoegresos: any; 


  constructor(
    private fb: FormBuilder,
    private financialperformanceService: financialperformanceService,
    private configService: ConfigService,
    private dateService: DateService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<EditexpenseComponent>
  ) {

  
    this.IdEgreso = data.IdEgreso;
    this.clientForm = this.fb.group({
      idUnidad: ['', Validators.required],
      idTipoEgreso: ['', Validators.required],
      conceptoEgreso: ['', Validators.required],
      valorEgresoReal: [''],
      valorEgresoProyectado: [''],
      fechaEgreso: [''],
      mes: [{ value: '', disabled: true }],
      fechaModificacion: [''] 
    });

    this.cargarDetalles();
    
   this.dateService.cargarUnidades().subscribe((unidades) => {
      this.unidades = unidades; // Almacena los clientes en una variable
    });

    this.dateService.cargarTipoegresos().subscribe((tipoegresos) => {
      this.tipoegresos = tipoegresos; // Almacena los clientes en una variable
    });
    
  }

  

  cargarDetalles() {
    this.auxService.ventanaCargando();
    this.financialperformanceService.ObtenerDetail(this.IdEgreso, 'Get-Detail-expense').subscribe({
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


      this.financialperformanceService.UpdateData(this.IdEgreso, this.clientForm.value, 'Update-expense').subscribe({
        next: (data) => {
          if (data.success) {

            if(!data.warning){
              this.auxService.AlertSuccess('Actualizar Egresos', data.message);
            }
            else
            {
              this.auxService.cerrarVentanaCargando();
              this.auxService.AlertWarning('Error al actualizar Egresos', data.message);
            }
            this.dialogRef.close(true); // Cierra el diálogo y devuelve un resultado positivo
          } else {
            this.auxService.AlertWarning('Error al actualizar Egresos', data.message);
          }
        },
        error: (error) => {
          this.auxService.cerrarVentanaCargando();
          console.log(error.status); 
          this.auxService.AlertError('Error al actualizar el Egresos:', error);
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
