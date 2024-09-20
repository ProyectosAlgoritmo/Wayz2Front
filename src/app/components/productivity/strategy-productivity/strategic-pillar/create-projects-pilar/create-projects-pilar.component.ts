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
  selector: 'app-create-projects-pilar',
  templateUrl: './create-projects-pilar.component.html',
  styleUrls: ['./create-projects-pilar.component.css'],
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
export class CreateProjectsPilarComponent implements OnInit {
  strategicForm: FormGroup;
  estrategysPilar: any;
  projects: any = null;
  titulo: string = 'Crear pilar de proyectos';

  constructor(
    private fb: FormBuilder,
    private productivityService: ProductivityService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateProjectsPilarComponent>
  ) {
    this.strategicForm = this.fb.group({
      idPilarProyectos: [0, ],
      idPilarestrategico: ['', Validators.required],
      idProyecto: ['', Validators.required],
    });
    this.getStrategyPilar();
    this.getProjcts();
  }
  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }

  getStrategyPilar() {
    this.productivityService.get('get-strategic-pillar').subscribe({
      next: (data) => {
        if (data.success) {
          this.estrategysPilar = data.data; // Vincula los datos al formulario
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError(
          'Error al cargar los pilares estrategicos:',
          error
        );
      },
    });
  }
  getProjcts() {
    this.productivityService.get('get-projects').subscribe({
      next: (data) => {
        if (data.success) {
          this.projects = data.data; // Vincula los datos al formulario
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError(
          'Error al cargar los proyectos:',
          error
        );
      },
    });
  }

  guardarCambios() {
    if (this.data) {
      //this.updateStrategicPilar();
    } else {
      this.createProjectsPilar();
    }
  }

  createProjectsPilar() {
    if (this.strategicForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Create(
          'create-project-pillar',
          this.strategicForm.value
        )
        .subscribe({
          next: async (data) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos guardados correctamente',
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
              'Error al crear el registro:',
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
