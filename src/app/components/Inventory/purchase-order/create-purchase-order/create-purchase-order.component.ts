import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { parseISO } from 'date-fns';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AuxService } from '../../../../services/aux-service.service';
import { DateService } from '../../../../services/data-service.service';
import { InventoryService } from '../../../../services/inventory.service';
import { SharedModule } from '../../../shared/shared.module';
import { CreateInventoryComponent } from '../../Inventory/create-inventory/create-inventory.component';

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css'],
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
export class CreatePurchaseOrderComponent implements OnInit {
  formularioForm: FormGroup;
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
    private dialogRef: MatDialogRef<CreatePurchaseOrderComponent>
  ) {
    this.formularioForm = this.fb.group({
      idOrdenCompra: [null],
      proveedor: [null, Validators.required], // proveedor
      descripcion: ['', Validators.required], // descripcion
      fechaOrdenCompra: [null, Validators.required], // fecha_orden_compra
      fechaPactadaEntrada: [null, Validators.required], // fecha_pactada_entrega
      fechaRealEntrega: [null, Validators.required], // fecha_real_entrega
      cantidad: [null, Validators.required], // cantidad
      valorUnitario: [null, Validators.required], // valor_unitario
      cerrada: [false, Validators.required], // cerrada (BIT)
    });
    
    if (this.data) {
      console.log(this.data);
      this.titulo = 'Editar Orden de Compra';
      this.formularioForm.patchValue({
        idOrdenCompra: this.data.idOrdenCompra || 0,
        proveedor: this.data.proveedor || '', // proveedor
        descripcion: this.data.descripcion || '', // descripcion
        fechaOrdenCompra: this.data.fechaOrdenCompra ? parseISO(this.data.fechaOrdenCompra) : null, // fecha_orden_compra
        fechaPactadaEntrada: this.data.fechaPactadaEntrada ? parseISO(this.data.fechaPactadaEntrada) : null, // fecha_pactada_entrega
        fechaRealEntrega: this.data.fechaRealEntrega ? parseISO(this.data.fechaRealEntrega) : null, // fecha_real_entrega
        cantidad: this.data.cantidad || 0, // cantidad
        valorUnitario: this.data.valorUnitario || 0, // valor_unitario
        cerrada: this.data.cerrada || false, // cerrada (BIT)
      });
    }
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
    
  }
  ngOnInit() {
  }

  onChange(result: any): void {
    console.log('onChange: ', result);
  }

  onCancel(): void {
    this.dialogRef.close();
    if (this.data) {
      this.data.cerrada = this.data.cerrada ? 'activo' : 'inactivo';
    }
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
        fechaRealEntrega: new Date(this.formularioForm.value.fechaRealEntrega)
          .toISOString()
          .split('T')[0],
        fechaPactadaEntrada: new Date(
          this.formularioForm.value.fechaPactadaEntrada
        )
          .toISOString()
          .split('T')[0],
        fechaOrdenCompra: new Date(this.formularioForm.value.fechaOrdenCompra)
          .toISOString()
          .split('T')[0],
      });
      this.inventoryService
        .put('update-purchase-orders', this.formularioForm.value)
        .subscribe({
          next: async (data: any) => {
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
          error: (error: any) => {
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
        fechaRealEntrega: new Date(this.formularioForm.value.fechaRealEntrega)
          .toISOString()
          .split('T')[0],
        fechaPactadaEntrada: new Date(
          this.formularioForm.value.fechaPactadaEntrada
        )
          .toISOString()
          .split('T')[0],
        fechaOrdenCompra: new Date(this.formularioForm.value.fechaOrdenCompra)
          .toISOString()
          .split('T')[0],
      });
      this.inventoryService
        .post('create-purchase-orders', this.formularioForm.value)
        .subscribe({
          next: async (data: any) => {
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
          error: (error: any) => {
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
