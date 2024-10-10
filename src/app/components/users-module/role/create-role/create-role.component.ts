import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AuxService } from '../../../../services/aux-service.service';
import { UsersService } from '../../../../services/users.service';
import { SharedModule } from '../../../shared/shared.module';
import { el } from 'date-fns/locale';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css'],
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
    FormsModule,
    NzCheckboxModule
  ],
})
export class CreateRoleComponent implements OnInit {
  formularioForm: FormGroup;
  titulo: string = 'Crear rol';

  // Definir los grupos de checkboxes
  checkboxGroups:any = [
  ];

  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateRoleComponent>
  ) {
    // Inicializar el formulario
    this.formularioForm = this.fb.group({
      idRol: [null],
      rol: ['', Validators.required],
      checkboxGroups: this.fb.array([])
    });

    if (this.data) {
      this.titulo = 'Editar rol';
      this.formularioForm.patchValue({
        idRol: this.data.idRol || 0,
        rol: this.data.rol || '',
      });
      // Opcional: Inicializar checkboxGroups basado en los datos recibidos
    }else{
      this.GetPermissions();
    }

    // Cerrar el diálogo al hacer clic fuera
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
  }

  ngOnInit() {
    
  }

  GetPermissions() {
    this.auxService.ventanaCargando();
    this.usersService.get('get-permissions').subscribe({
      next: (data) => {
        console.log(data.data);
        this.checkboxGroups = data.data;
        this.initializeCheckboxGroups();
        this.auxService.cerrarVentanaCargando();
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar los usuarios:', error);
      },
    });
  }

  // Inicializar los grupos de checkboxes en el formulario
  initializeCheckboxGroups() {
    const checkboxGroupsControl = this.formularioForm.get('checkboxGroups') as FormArray;
    this.checkboxGroups.forEach((group:any) => {
      const groupForm = this.fb.group({
        groupName: [group.groupName],
        allChecked: [false],
        indeterminate: [false],
        options: this.fb.array(
          group.options.map((option:any) => new FormControl(false))
        )
      });

      // Si estás editando, puedes establecer los valores iniciales aquí
      if (this.data && this.data.checkboxGroups) {
        const dataGroup = this.data.checkboxGroups.find((dg: any) => dg.groupName === group.groupName);
        if (dataGroup) {
          groupForm.patchValue({
            allChecked: dataGroup.selected.length === group.options.length,
            indeterminate: dataGroup.selected.length > 0 && dataGroup.selected.length < group.options.length
          });
          const optionsControl = groupForm.get('options') as FormArray;
          group.options.forEach((option: { value: any; }, index: number) => {
            optionsControl.at(index).setValue(dataGroup.selected.includes(option.value));
          });
        }
      }

      // Suscribirse a cambios en las opciones para actualizar 'allChecked' e 'indeterminate'
      const options = groupForm.get('options') as FormArray;
      options.valueChanges.subscribe(values => {
        const allChecked = values.every((val: boolean) => val);
        const noneChecked = values.every((val: boolean) => !val);
        groupForm.patchValue({
          allChecked: allChecked,
          indeterminate: !allChecked && values.some((val: boolean) => val)
        }, { emitEvent: false });
      });

      // Suscribirse a cambios en 'allChecked' para actualizar todas las opciones
      groupForm.get('allChecked')?.valueChanges.subscribe((checked: boolean | null) => {
        const options = groupForm.get('options') as FormArray;
        options.controls.forEach(control => control.setValue(checked));
      });

      checkboxGroupsControl.push(groupForm);
    });
  }

  // Obtener los controles de checkboxGroups
  get checkboxGroupsControls() {
    return this.formularioForm.get('checkboxGroups') as FormArray;
  }

  // Obtener los controles de opciones de un grupo específico
  getCheckboxGroupControls(index: number): FormArray {
    return (this.formularioForm.get('checkboxGroups') as FormArray).at(index).get('options') as FormArray;
  }

  // Cancelar y cerrar el diálogo
  onCancel(): void {
    this.dialogRef.close();
    if (this.data) {
      this.data.estado = this.data.estado ? 'activo' : 'inactivo';
    }
  }

  // Guardar los cambios
  guardarCambios() {
    if (this.formularioForm.valid) {
      // Preparar los datos de los checkboxes
      const selectedOptions = this.formularioForm.value.checkboxGroups.map((group: any, index: number) => ({
        groupName: group.groupName,
        selected: group.options
          .map((checked: boolean, j: number) => checked ? this.checkboxGroups[index].options[j].value : null)
          .filter((v: string | null) => v !== null)
      }));

      const formData = {
        ...this.formularioForm.value,
        checkboxGroups: selectedOptions
      };

      if (this.data) {
        this.updateUser(formData);
      } else {
        this.createUser(formData);
      }
    } else {
      this.auxService.AlertWarning(
        'Formulario inválido',
        'Por favor, revisa los campos y corrige los errores.'
      );
    }
  }

  // Actualizar un rol existente
  updateUser(formData: any) {
    this.auxService.ventanaCargando();
    this.usersService.Update('update-role', formData).subscribe({
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
  }

  // Crear un nuevo rol
  createUser(formData: any) {
    this.auxService.ventanaCargando();
    this.usersService.Create('create-role', formData).subscribe({
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
  }
}