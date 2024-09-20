import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuxService } from '../../../../../services/aux-service.service';
import { ConfigService } from '../../../../../services/config.service';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from '../../../../shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CreatetypebalanceComponent } from '../../../../config/balanceconfig/typebalance/createtypebalance/createtypebalance.component';
import { ProductivityService } from '../../../../../services/productivity.service';

@Component({
  selector: 'app-create-strategic-pillar',
  templateUrl: './create-strategic-pillar.component.html',
  styleUrls: ['./create-strategic-pillar.component.css'],
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
  ],
})
export class CreateStrategicPillarComponent implements OnInit {
  strategicForm: FormGroup;
  estrategys: any;

  constructor(
    private fb: FormBuilder,
    private productivityService: ProductivityService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreatetypebalanceComponent>
  ) {
    this.strategicForm = this.fb.group({
      idPilarestrategico: [0, ],
      nombre: ['', Validators.required],
      idEstrategia: ['', Validators.required],
      descripcion: ['',],
    });
    if (this.data) {
      console.log(this.data);
      this.strategicForm.patchValue({
        idPilarestrategico: this.data.id || 0, // Si 'idPilarestrategico' viene lleno, se carga
        nombre: this.data.nombre || '',          // Si 'nombre' viene lleno, se carga
        idEstrategia: this.data.idEstrategia || '', // Cargar 'idEstrategia' si viene
        descripcion: this.data.descripcion || ''   // Cargar 'descripcion' si viene
      });
    }

    this.getStrategy();
    this.getStrategy();
  }
  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }

  getStrategy() {
    this.productivityService.get('get-strategy').subscribe({
      next: (data) => {
        if (data.success) {
          this.estrategys = data.data; // Vincula los datos al formulario
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError(
          'Error al cargar los tipos de balance:',
          error
        );
      },
    });
  }

  guardarCambios() {
    if (this.data) {
      this.updateStrategicPilar();
    } else {
      this.createStrategicPilar();
    }
  }

  updateStrategicPilar() {
    if (this.strategicForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Update(
          'update-strategic-pillar',
          this.strategicForm.value
        )
        .subscribe({
          next: async (data) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos actualizados correctamente',
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
          error: (error) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error al cargar los tipos de balance:',
              error
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
  createStrategicPilar() {
    if (this.strategicForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Create(
          'create-strategic-pillar',
          this.strategicForm.value
        )
        .subscribe({
          next: async (data) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos actualizados correctamente',
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
          error: (error) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error al cargar los tipos de balance:',
              error
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
