import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormModule,
} from 'ng-zorro-antd/form';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { SharedModule } from '../shared/shared.module';
import { CrewsService } from '../../services/crews.service';
import { AuxService } from '../../services/aux-service.service';

@Component({
  selector: 'app-crews',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzSelectModule,
    NzTableModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzPaginationComponent,
    NgFor,
    FormsModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzFormModule,
    SharedModule,
  ],
  providers: [],
  templateUrl: './crews.component.html',
  styleUrls: ['./crews.component.css'],
})
export class CrewsComponent implements OnInit {
  // Formulario reactivo
  crewForm!: FormGroup;

  // Valores para los selectores
  days: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
  crewNumbers: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

  // Datos para las tablas
  crewData: any[] = []; // Datos dinámicos para tripulaciones
  shiftData: any[] = []; // Turnos dinámicos
  crewDataInput: string[] = [];
  crewsDataForm = {
    shiftHours: null,
    patternDays: null,
    rotationDay: null,
    crewNumber: null,
    startTime: null,
    name: null,
  };

  combinedData = {
    crewsDataForm: this.crewsDataForm,
    crewData: this.crewData,
    shiftData: this.shiftData,
  };

  // Valores adicionales del formulario
  date: any | null = null;

  constructor(
    private fb: FormBuilder,
    public crewsService: CrewsService,
    public auxService: AuxService
  ) {}

  ngOnInit(): void {
    // Inicialización del formulario reactivo
    this.crewForm = this.fb.group({
      shiftHours: [null, Validators.required],
      patternDays: [null, Validators.required],
      rotationDay: [null, Validators.required],
      crewNumber: [null, Validators.required],
      startTime: [null, Validators.required],
      name: [null, Validators.required],
    });

    // Escucha cambios en el campo crewNumber para actualizar la tabla de tripulaciones
    this.crewForm.get('crewNumber')?.valueChanges.subscribe((value) => {
      this.clearCrewData();
      this.clearShiftData();
      this.generateCrewData(value);
      this.crewDataInput = [];
    });

    // Escucha cambios en los campos relevantes para generar la tabla de turnos
    this.crewForm.valueChanges.subscribe(() => {
      this.generateShifts();
    });

    //  this.shiftData= [
    //   { date: '2025-01-09 08:00', team: 'Team 1' },
    //   { date: '2025-01-09 14:00', team: 'Team 2' },
    //   { date: '2025-01-09 20:00', team: 'Team 3' },
    //   { date: '2025-01-10 02:00', team: 'Team 4' },
    //   { date: '2025-01-10 08:00', team: 'Team 5' },
    //   { date: '2025-01-10 14:00', team: 'Team 6' },
    // ];
  }

  guardarCambios() {
    const validCrewsForm = this.validCrewsForm();
    const isvalidCrews = this.validCrews();
    const isvalidShifts = this.validShifts();

    // if (isvalidCrews && validCrewsForm && isvalidShifts) {
    //   this.combinedData = {
    //     crewsDataForm: this.crewsDataForm,
    //     crewData: this.crewData,
    //     shiftData: this.shiftData,
    //   };
    //   this.auxService.ventanaCargando();
    //   this.crewsService.Create('add-crew-full', this.combinedData).subscribe({
    //     next: async (data: any) => {
    //       this.auxService.cerrarVentanaCargando();
    //       if (data.success) {
    //         this.clearAllData();
    //         await this.auxService.AlertSuccess(
    //           'Data updated successfully.',
    //           ''
    //         );
    //       } else {
    //         this.auxService.AlertWarning(
    //           'Error creating the record.',
    //           data.message
    //         );
    //       }
    //     },
    //     error: (error: any) => {
    //       this.auxService.cerrarVentanaCargando();
    //       this.auxService.AlertError(
    //         'Error creating the record.',
    //         error.message
    //       );
    //     },
    //   });
    // } else {
    //   console.log('Validation failed. Data not saved.');
    // }
  }

  clearAllData() {
    this.clearCrewsDataForm();
    this.clearCrewData();
    this.clearShiftData();
    console.log('All data cleared.');
  }

  clearCrewsDataForm() {
    this.crewForm.reset({
      shiftHours: null,
      patternDays: null,
      rotationDay: null,
      crewNumber: null,
      startTime: null,
      name: null,
    });
    console.log('CrewsDataForm cleared:', this.crewForm.value);
  }

  clearCrewData() {
    this.crewData = [];
    console.log('CrewData cleared:', this.crewData);
  }

  clearShiftData() {
    this.shiftData = [];
    console.log('ShiftData cleared:', this.shiftData);
  }

  validCrewsForm(): boolean {
    // Extraer valores del formulario
    this.crewsDataForm = {
      shiftHours: this.crewForm.get('shiftHours')?.value || null,
      patternDays: this.crewForm.get('patternDays')?.value || null,
      rotationDay: this.crewForm.get('rotationDay')?.value || null,
      crewNumber: this.crewForm.get('crewNumber')?.value || null,
      startTime: this.crewForm.get('startTime')?.value || null,
      name: this.crewForm.get('name')?.value || null,
    };

    // Validaciones
    if (!this.crewsDataForm.name) {
      this.auxService.AlertWarning(
          'Data invalid.','Error: name is required.');
      return false;
    }
    if (!this.crewsDataForm.shiftHours) {
      this.auxService.AlertWarning(
          'Data invalid.','Error: shiftHours is required.');
      return false;
    }
    if (!this.crewsDataForm.patternDays) {
      this.auxService.AlertWarning(
          'Data invalid.','Error: Days Until Pattern Repeats is required.');
      return false;
    }
    if (!this.crewsDataForm.rotationDay) {
      this.auxService.AlertWarning(
          'Data invalid.','Error: 1st Day of Rotation is required.');
      return false;
    }
    if (!this.crewsDataForm.crewNumber) {
      this.auxService.AlertWarning(
          'Data invalid.','Error: Number of Crews is required.');
      return false;
    }
    if (!this.crewsDataForm.startTime) {
      this.auxService.AlertWarning(
          'Data invalid.','Error: Number of Crews is required.');
      return false;
    }

    // Si pasa todas las validaciones
    console.log('Validation successful:', this.crewsDataForm);
    return true;
  }

 

  // Función para validar todos los elementos de crewData
  validCrews(): boolean {
    for (let i = 0; i < this.crewData.length; i++) {
      const crew = this.crewData[i];

      // Validar que "team" tenga un valor válido
      if (!crew.team || crew.team <= 0) {
        this.auxService.AlertWarning(
          'Data invalid.',
          `Error in Crews at index ${i+1}: "team" is required and must be greater than 0.`
        );
        return false;
      }

      // Validar que "name" no esté vacío
      if (!crew.name || crew.name.trim() === '') {
        this.auxService.AlertWarning(
          'Data invalid.',
          `Error in Crews at index ${i+1}: "name" is required and cannot be empty.`
        );
        return false;
      }
    }

    // Si todos los elementos son válidos
    console.log('Validation successful for all crewData:', this.crewData);
    return true;
  }
  
   // Función para validar todos los elementos de shiftData
   validShifts(): boolean {
    // Recorrer cada elemento del array para validarlo
    for (let i = 0; i < this.shiftData.length; i++) {
      const shift = this.shiftData[i];

      // Validar que "date" tenga un valor válido
      if (
        !shift.date ||
        typeof shift.date !== 'string' ||
        shift.date.trim() === ''
      ) {
        this.auxService.AlertWarning(
          'Data invalid.',
          `Error in Shifts at index ${i+1}: "date" is required and must be a non-empty string.`
        );
        return false;
      }

      // Validar que "team" tenga un valor válido
      if (
        !shift.team ||
        typeof shift.team !== 'string' ||
        shift.team.trim() === ''
      ) {
        this.auxService.AlertWarning(
          'Data invalid.',
          `Error in Shifts at index ${i+1}: "team" is required and must be a non-empty string.`
        );
        return false;
      }
    }

    // Si todos los elementos son válidos
    console.log('Validation successful for all shiftData:', this.shiftData);
    return true;
  }


  onNameChange(index: number, newValue: string): void {
    // Actualizas el arreglo independiente con el valor que se va tecleando
    this.crewDataInput[index] = newValue;
    console.log(`Nombre de la fila ${index}: ${newValue}`);
  }

  onTeamChange(index: number, newTeam: string): void {
    console.log(`Shift ${index} cambió su team a: ${newTeam}`);
  }

  // Genera dinámicamente los datos de las tripulaciones
  generateCrewData(crewCount: number): void {
    this.crewData = Array.from({ length: crewCount }, (_, i) => ({
      team: i + 1,
      name: ``,
    }));
  }

  // Genera dinámicamente los turnos
  generateShifts(): void {
    const shiftHours = this.crewForm.get('shiftHours')?.value;
    const rotationDay = this.crewForm.get('rotationDay')?.value;
    let startTime = this.crewForm.get('startTime')?.value;
    const patternDays = this.crewForm.get('patternDays')?.value;

    if (!shiftHours || !rotationDay || !startTime || !patternDays) {
      this.shiftData = []; // Resetea los datos si faltan campos
      console.error('Missing values for generating shifts.');
      return;
    }

    // Si startTime es un objeto Date, formatearlo a HH:mm
    if (startTime instanceof Date) {
      const hours = startTime.getHours().toString().padStart(2, '0');
      const minutes = startTime.getMinutes().toString().padStart(2, '0');
      startTime = `${hours}:${minutes}`;
    }

    const timeParts = startTime.split(':');
    if (
      timeParts.length !== 2 ||
      isNaN(Number(timeParts[0])) ||
      isNaN(Number(timeParts[1]))
    ) {
      console.error(
        'Invalid startTime format. Expected HH:mm format:',
        startTime
      );
      this.shiftData = [];
      return;
    }

    try {
      const startDate = new Date(rotationDay);
      const [hours, minutes] = timeParts.map(Number);
      startDate.setHours(hours, minutes, 0, 0);

      const nuevosDatos = [];
      let currentDate = new Date(startDate);

      // Generar los turnos según los días de patrón y la duración de cada turno
      for (let i = 0; i < (patternDays * 24) / shiftHours; i++) {
        nuevosDatos.push({
          date: this.formatDateTime(currentDate), // Formatea la fecha
          team: `Team ${i + 1}`,
        });

        currentDate = new Date(
          currentDate.getTime() + shiftHours * 60 * 60 * 1000
        ); // Incrementar la fecha por el tiempo del turno
      }

      // Asignar los datos generados a shiftData
      this.shiftData = [...nuevosDatos]; // Usar el spread operator para crear una nueva referencia

      console.log('Shift Data:', this.shiftData);
    } catch (error) {
      console.error('Error generating shifts:', error);
      this.shiftData = []; // Resetea si ocurre un error
    }
    console.log(`input ${this.crewDataInput}`);
  }

  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  //  // Devuelve el sufijo ordinal para los números
  //  getOrdinalSuffix(number: number): string {
  //    const suffixes = ['th', 'st', 'nd', 'rd'];
  //    const value = number % 100;
  //    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  //  }

  // Lógica de cambio de fechas
  onChange(result: any): void {
    console.log('onChange: ', result);
  }
}
