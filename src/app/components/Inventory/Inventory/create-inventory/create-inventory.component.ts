import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { parseISO } from 'date-fns';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AuxService } from '../../../../services/aux-service.service';
import { DateService } from '../../../../services/data-service.service';
import { SharedModule } from '../../../shared/shared.module';
import { InventoryService } from '../../../../services/inventory.service';
import { da } from 'date-fns/locale';

@Component({
  selector: 'app-create-inventory',
  templateUrl: './create-inventory.component.html',
  styleUrls: ['./create-inventory.component.css'],
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
export class CreateInventoryComponent implements OnInit {
  formularioForm: FormGroup;
  tiposInventario: any;
  date = null;
  titulo = 'Crear Inventario';
  isReadonly: boolean = true;
  estapaDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private dateService: DateService,
    private inventoryService: InventoryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateInventoryComponent>
  ) {
    this.formularioForm = this.fb.group({
      idInventario: [null], // id_inventario
      fecha: ['', Validators.required], // fecha
      fechaCompra: [null, Validators.required], // fecha_compra
      fechaVencimiento: [null, Validators.required], // fecha_vencimiento
      idTipoInventario: [null, Validators.required], // id_tipo_inventario
      proveedor: [null, Validators.required], // proveedor
      descripcion: ['', Validators.required], // descripcion
      cantidad: [null, Validators.required], // cantidad
      valorUnitario: [null, Validators.required], // valor_unitario
      ubicacion: ['', Validators.required], // ubicacion
    });
    
    if (this.data) {
      console.log(data);
      this.titulo = 'Editar Inventario';
      this.formularioForm.patchValue({
        idInventario: this.data.idInventario || 0, // id_inventario
        fecha: this.data.fecha ? parseISO(this.data.fecha) : null, // fecha
        fechaCompra: this.data.fechaCompra ? parseISO(this.data.fechaCompra) : null, // fecha_compra
        fechaVencimiento: this.data.fechaVencimiento ? parseISO(this.data.fechaVencimiento) : null, // fecha_vencimiento
        idTipoInventario: this.data.idTipoInventario || 0, // id_tipo_inventario
        proveedor: this.data.proveedor || '', // proveedor
        descripcion: this.data.descripcion || '', // descripcion
        cantidad: this.data.cantidad || 0, // cantidad
        valorUnitario: this.data.valorUnitario || 0, // valor_unitario
        ubicacion: this.data.ubicacion || '', // ubicacion
      });
    } 
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
    this.getTypeInventory();
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

  getTypeInventory() {
    this.inventoryService.get('get-type-inventory').subscribe({
      next: (data: any) => {
        if (data) {
          this.tiposInventario = data.data;
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
      this.updateInventory();
    } else {
      this.createInventory();
    }
  }

  updateInventory() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        fechaCompra: new Date(this.formularioForm.value.fechaCompra)
          .toISOString()
          .split('T')[0],
        fechaVencimiento: new Date(this.formularioForm.value.fechaVencimiento)
          .toISOString()
          .split('T')[0],
        fecha: new Date(this.formularioForm.value.fecha)
          .toISOString()
          .split('T')[0],
        
      });
      this.inventoryService
        .put('update-inventory', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos actualizados correctamente',
                ''
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
  createInventory() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        fechaCompra: new Date(this.formularioForm.value.fechaCompra)
          .toISOString()
          .split('T')[0],
        fechaVencimiento: new Date(this.formularioForm.value.fechaVencimiento)
          .toISOString()
          .split('T')[0],
        fecha: new Date(this.formularioForm.value.fecha)
          .toISOString()
          .split('T')[0],
      });
      this.inventoryService
        .post('create-inventory', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos registrados correctamente',
                ''
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
