import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

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
  ],
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
 
   // Valores adicionales del formulario
   date: any | null = null;
 
   constructor(private fb: FormBuilder) {}
 
   ngOnInit(): void {
     // Inicialización del formulario reactivo
     this.crewForm = this.fb.group({
       shiftHours: [null],
       patternDays: [null],
       rotationDay: [null],
       crewNumber: [null],
       startTime: [null],
     });
 
     // Escucha cambios en el campo crewNumber para actualizar la tabla de tripulaciones
     this.crewForm.get('crewNumber')?.valueChanges.subscribe((value) => {
       this.generateCrewData(value);
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

   onNameChange(index: number, newValue: string): void {
    // Actualizas el arreglo independiente con el valor que se va tecleando
    this.crewDataInput[index] = newValue;
    console.log(`Nombre de la fila ${index}: ${newValue}`);
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
    if (timeParts.length !== 2 || isNaN(Number(timeParts[0])) || isNaN(Number(timeParts[1]))) {
      console.error('Invalid startTime format. Expected HH:mm format:', startTime);
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
      for (let i = 0; i < (patternDays * 24 / shiftHours); i++) {
        nuevosDatos.push({
          date: this.formatDateTime(currentDate), // Formatea la fecha
          team: `Team ${i + 1}`
        });
  
        currentDate = new Date(currentDate.getTime() + shiftHours * 60 * 60 * 1000); // Incrementar la fecha por el tiempo del turno
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
 