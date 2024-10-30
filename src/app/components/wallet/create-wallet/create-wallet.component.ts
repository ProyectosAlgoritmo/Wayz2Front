import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { parseISO } from 'date-fns';
import { SharedModule } from '../../shared/shared.module';
import { AuxService } from '../../../services/aux-service.service';
import { UsersService } from '../../../services/users.service';
import { ConfigService } from '../../../services/config.service';
import { WalletService } from '../../../services/wallet.service';
import { Data } from '@angular/router';
import { DateService } from '../../../services/data-service.service';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.css'],
  standalone: true,
  imports: [
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
    NzFormModule,
    NzDatePickerModule,
    NzSwitchModule,
  ],
})
export class CreateWalletComponent implements OnInit {
  formularioForm: FormGroup;
  unidades: any;
  clientes: any;
  date = null;
  titulo = 'Crear cartera';
  isReadonly: boolean = true;
  estapaDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private dateService: DateService,
    private walletService: WalletService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateWalletComponent>
  ) {
    this.formularioForm = this.fb.group({
      idCartera: [null], // id_cartera
      fecha: ['', Validators.required], // fecha
      numeroFactura: ['', Validators.required], // numero_factura
      idUnidad: [null, Validators.required], // id_unidad
      idCliente: [null, Validators.required], // id_cliente
      fechaEmision: [null, Validators.required], // fecha_emision
      fechaVencimiento: [null, Validators.required], // fecha_vencimiento
      valor: [null, Validators.required], // valor
      antiguedadDias: [null], // antiguedad_dias (opcional)
      valorCarteraCorriente: [null], // valor_cartera_corriente (opcional)
      valor30Dias: [null], // valor_30_dias (opcional)
      valor3160Dias: [null], // valor_31_60_dias (opcional)
      valor6190Dias: [null], // valor_61_90_dias (opcional)
      valorMayor91Dias: [null], // valor_mayor_91_dias (opcional)
      totalCartera: [null, Validators.required], // total_cartera
    });
    
    
    if (this.data) {
      this.titulo = 'Editar cartera';
      this.formularioForm.patchValue({
        idCartera: this.data.idCartera || 0, 
        fecha: this.data.fecha ? parseISO(this.data.fecha) : null, // Fecha
        numeroFactura: this.data.numeroFactura || '', // NumeroFactura
        idUnidad: this.data.idUnidad || 0, // idUnidad en lugar de idProductoServicio (según DTO)
        idCliente: this.data.idCliente || 0, // id_cliente
        fechaEmision: this.data.fechaEmision ? parseISO(this.data.fechaEmision) : null, // Fecha_emision
        fechaVencimiento: this.data.fechaVencimiento ? parseISO(this.data.fechaVencimiento) : null, // Fecha_vencimiento
        valor: this.data.valor || 0, // Valor
        antiguedadDias: this.data.antiguedadDias || null, // AntiguedadDias, opcional
        valorCarteraCorriente: this.data.valorCarteraCorriente || null, // ValorCarteraCorriente, opcional
        valor30Dias: this.data.valor30Dias || null, // Valor30Dias, opcional
        valor3160Dias: this.data.valor3160Dias || null, // Valor3160Dias, opcional
        valor6190Dias: this.data.valor6190Dias || null, // Valor6190Dias, opcional
        valorMayor91Dias: this.data.valorMayor91Dias || null, // ValorMayor91Dias, opcional
        totalCartera: this.data.totalCartera || null, // TotalCartera, opcional
      });
    }   
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
    this.getUnidades();
    this.getCliente();
  }
  ngOnInit() {}

  onChange(result: any): void {
    console.log('onChange: ', result);
  }


  onCancel(): void {
    this.dialogRef.close();
    if (this.data) {
      this.data.bActivo = this.data.bActivo ? 'activo' : 'inactivo';
    }
  }

  getUnidades() {
    this.dateService.cargarUnidades().subscribe({
      next: (data: any) => {
        if (data) {
          this.unidades = data;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error:any) => {
        this.auxService.AlertError('Error al cargar los roles:', error);
      },
    });
  }

  getCliente() {
    this.dateService.cargarCliente().subscribe({
      next: (data: any) => {
        if (data) {
          this.clientes = data;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error:any) => {
        this.auxService.AlertError('Error al cargar los roles:', error);
      },
    });
  }

  guardarCambios() {
    if (this.data) {
      this.updateWallet();
    } else {
      this.createWallet();
    }
  }

  updateWallet() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        fechaEmision: new Date(this.formularioForm.value.fechaEmision)
          .toISOString()
          .split('T')[0],
        fechaVencimiento: new Date(this.formularioForm.value.fechaVencimiento)
          .toISOString()
          .split('T')[0],
        fecha: new Date(this.formularioForm.value.fecha)
          .toISOString()
          .split('T')[0],
        
      });
      this.walletService
        .put('update-wallet', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos actualizados correctamente',
                data.message
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error al actualizar el registro',
                data.message
              );
            }
          },
          error: (error:any) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error al actualizar el registro',
              error.message
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Formulario inválido',
        'Por favor, revisa los campos y corrige los errores.'
      );
    }
  }
  createWallet() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        fechaEmision: new Date(this.formularioForm.value.fechaEmision)
          .toISOString()
          .split('T')[0],
        fechaVencimiento: new Date(this.formularioForm.value.fechaVencimiento)
          .toISOString()
          .split('T')[0],
          fecha: new Date(this.formularioForm.value.fecha)
          .toISOString()
          .split('T')[0],
      });
      this.walletService
        .post('create-wallet', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos registrados correctamente',
                data.message
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error al crear el registro',
                data.message
              );
            }
          },
          error: (error:any) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error al crear el registro',
              error.message
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Formulario inválido',
        'Por favor, revisa los campos y corrige los errores.'
      );
    }
  }
}
