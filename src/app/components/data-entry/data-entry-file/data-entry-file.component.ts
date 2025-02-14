import { Component, OnInit } from '@angular/core';
import { CardDataEntryFileComponent } from '../../shared/card-data-entry-file/card-data-entry-file.component';
import { DataEntryService } from '../../../services/data-entry.service';
import { AuxService } from '../../../services/aux-service.service';
import { NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfigService } from '../../../services/config.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { BaseChartDirective } from 'ng2-charts';
import { CardPercentageComponent } from '../../shared/card-percentage/card-percentage.component';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-entry-file',
  standalone: true,
  imports: [
    CardDataEntryFileComponent,
    FormsModule,
    NgFor,
    NzInputModule,
    MatToolbarModule,
    NzOptionComponent,
    NzSelectModule,
    NzIconModule,
    SharedModule,
    BaseChartDirective,
    NzCardModule,
    CardPercentageComponent,
    NzFormModule,
    ReactiveFormsModule,
  ],
  templateUrl: './data-entry-file.component.html',
  styleUrls: ['./data-entry-file.component.css'],
})
export class DataEntryFileComponent implements OnInit {
  dataEntries: {
    title: string;
    values: { complete: number; onTarget: number };
    tableData: any;
  }[] = [];
  formularioForm: FormGroup;
  machines: any[] = [];
  products: any[] = [];
  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private dataEntryService: DataEntryService,
    private configService: ConfigService,
    private router: Router
  ) {
    this.formularioForm = this.fb.group({
      idMachine: [null, Validators.required],
      idProduct: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getMachines();
  }

  onMachineChange(machineId: number): void {
    if (!machineId) {
      this.dataEntries = [];
    }
    this.formularioForm.patchValue({
      idProduct: null,
      idCenterline: null,
    });
    this.getProducts(machineId);
    this.GetAllDataEntry(machineId);
  }
  onProductsChange(IdProduct: number): void {
    //this.GetAllLimitsAndTargets(IdProduct);
  }

  onGo() {
    if (!this.formularioForm.value.idProduct) {
      this.auxService.showToast('warning', 'Please select a product');
      return;
    }
    this.router.navigate(['/data-entry', this.formularioForm.value.idProduct]);
  }

  getMachines() {
    this.auxService.ventanaCargando();
    this.configService.get(`get-all-machines-production/${1}`).subscribe({
      next: (data: any) => {
        this.machines = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error loading machines: ', error);
      },
    });
  }

  getProducts(idMachine: number): void {
    this.configService.get(`Get-All-Products`).subscribe({
      next: (data: any) => {
        this.products = data.data.filter((x: any) => x.idMachine === idMachine);
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando(); // Asegúrate de cerrar la ventana en caso de error
        this.auxService.AlertError('Error loading categories: ', error);
      },
    });
  }

  GetAllDataEntry(IdMachine: number) {
    this.auxService.ventanaCargando();
    this.dataEntryService.get(`Get-DataEntry-file/${IdMachine}`).subscribe({
      next: (data: any) => {
        this.auxService.cerrarVentanaCargando();

        this.dataEntries = [
          {
            title: 'Current Shift',
            values: {
              complete: isNaN(data.data[1][0].completeActual / data.data[1][0].dueActual)
                ? 0
                : parseFloat(((data.data[1][0].completeActual / data.data[1][0].dueActual) * 100).toFixed(2)),
              onTarget: isNaN(data.data[1][0].onTargetActual / data.data[1][0].dueActual)
                ? 0
                : parseFloat(((data.data[1][0].onTargetActual / data.data[1][0].dueActual) * 100).toFixed(2)),
            },
            tableData: {
              due: data.data[1][0].dueActual,
              complete: data.data[1][0].completeActual,
              onTarget: data.data[1][0].onTargetActual,
              offTarget: data.data[1][0].offTargetActual,
            },
          },
          {
            title: 'Previous Shift',
            values: {
              complete: isNaN(data.data[0][0].completeAnterior / data.data[0][0].dueAnterior)
                ? 0
                : parseFloat(((data.data[0][0].completeAnterior / data.data[0][0].dueAnterior) * 100).toFixed(2)),
              onTarget: isNaN(data.data[0][0].onTargetAnterior / data.data[0][0].dueAnterior)
                ? 0
                : parseFloat(((data.data[0][0].onTargetAnterior / data.data[0][0].dueAnterior) * 100).toFixed(2)),
            },
            tableData: {
              due: data.data[0][0].dueAnterior,
              complete: data.data[0][0].completeAnterior,
              onTarget: data.data[0][0].onTargetAnterior,
              offTarget: data.data[0][0].offTargetAnterior,
            },
          },
          {
            title: 'Current Day',
            values: {
              complete: isNaN(data.data[2][0].completeDiaActual / data.data[2][0].dueDiaActual)
                ? 0
                : parseFloat(((data.data[2][0].completeDiaActual / data.data[2][0].dueDiaActual) * 100).toFixed(2)),
              onTarget: isNaN(data.data[2][0].onTargetDiaActual / data.data[2][0].dueDiaActual)
                ? 0
                : parseFloat(((data.data[2][0].onTargetDiaActual / data.data[2][0].dueDiaActual) * 100).toFixed(2)),
            },
            tableData: {
              due: data.data[2][0].dueDiaActual,
              complete: data.data[2][0].completeDiaActual,
              onTarget: data.data[2][0].onTargetDiaActual,
              offTarget: data.data[2][0].offTargetDiaActual,
            },
          },
          {
            title: 'Previous Day',
            values: {
              complete: isNaN(data.data[3][0].completeDiaAnterior / data.data[3][0].dueDiaAnterior)
                ? 0
                : parseFloat(((data.data[3][0].completeDiaAnterior / data.data[3][0].dueDiaAnterior) * 100).toFixed(2)),
              onTarget: isNaN(data.data[3][0].onTargetDiaAnterior / data.data[3][0].dueDiaAnterior)
                ? 0
                : parseFloat(((data.data[3][0].onTargetDiaAnterior / data.data[3][0].dueDiaAnterior) * 100).toFixed(2)),
            },
            tableData: {
              due: data.data[3][0].dueDiaAnterior,
              complete: data.data[3][0].completeDiaAnterior,
              onTarget: data.data[3][0].onTargetDiaAnterior,
              offTarget: data.data[3][0].offTargetDiaAnterior,
            },
          },
          {
            title: 'Current Week',
            values: {
              complete: isNaN(data.data[4][0].completeSemanaActual / data.data[4][0].dueSemanaActual)
                ? 0
                : parseFloat(((data.data[4][0].completeSemanaActual / data.data[4][0].dueSemanaActual) * 100).toFixed(2)),
              onTarget: isNaN(data.data[4][0].onTargetSemanaActual / data.data[4][0].dueSemanaActual)
                ? 0
                : parseFloat(((data.data[4][0].onTargetSemanaActual / data.data[4][0].dueSemanaActual) * 100).toFixed(2)),
            },
            tableData: {
              due: data.data[4][0].dueSemanaActual,
              complete: data.data[4][0].completeSemanaActual,
              onTarget: data.data[4][0].onTargetSemanaActual,
              offTarget: data.data[4][0].offTargetSemanaActual,
            },
          },
          {
            title: 'Previous Week',
            values: {
              complete: isNaN(data.data[5][0].completeSemanaAnterior / data.data[5][0].dueSemanaAnterior)
                ? 0
                : parseFloat(((data.data[5][0].completeSemanaAnterior / data.data[5][0].dueSemanaAnterior) * 100).toFixed(2)),
              onTarget: isNaN(data.data[5][0].onTargetSemanaAnterior / data.data[5][0].dueSemanaAnterior)
                ? 0
                : parseFloat(((data.data[5][0].onTargetSemanaAnterior / data.data[5][0].dueSemanaAnterior) * 100).toFixed(2)),
            },
            tableData: {
              due: data.data[5][0].dueSemanaAnterior,
              complete: data.data[5][0].completeSemanaAnterior,
              onTarget: data.data[5][0].onTargetSemanaAnterior,
              offTarget: data.data[5][0].offTargetSemanaAnterior,
            },
          },
          {
            title: 'Current Month',
            values: {
              complete: isNaN(data.data[6][0].completeMesActual / data.data[6][0].dueMesActual)
                ? 0
                : parseFloat(((data.data[6][0].completeMesActual / data.data[6][0].dueMesActual) * 100).toFixed(2)),
              onTarget: isNaN(data.data[6][0].onTargetMesActual / data.data[6][0].dueMesActual)
                ? 0
                : parseFloat(((data.data[6][0].onTargetMesActual / data.data[6][0].dueMesActual) * 100).toFixed(2)),
            },
            tableData: {
              due: data.data[6][0].dueMesActual,
              complete: data.data[6][0].completeMesActual,
              onTarget: data.data[6][0].onTargetMesActual,
              offTarget: data.data[6][0].offTargetMesActual,
            },
          },
        ];
        
        
        
      },
      error: (error: any) => {
        this.auxService.AlertError('Error loading data: ', error);
      },
    });
  }
}
