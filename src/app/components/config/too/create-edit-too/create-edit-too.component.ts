import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlign, NzFlexModule, NzJustify } from 'ng-zorro-antd/flex';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NgFor } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  ArrowRightOutline,
  CloudUploadOutline,
  PlayCircleOutline,
  EyeOutline,
  EditOutline,
} from '@ant-design/icons-angular/icons';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NzCardModule } from 'ng-zorro-antd/card';
import { registerables } from 'chart.js';
import { AuxService } from '../../../../services/aux-service.service';
import { SharedStateService } from '../../../../services/shared-state.service';
import { CardPercentageComponent } from '../../../shared/card-percentage/card-percentage.component';
import { SharedModule } from '../../../shared/shared.module';
import { TableWithRowsChildComponent } from '../../../shared/table-with-rows-child/table-with-rows-child.component';
import { LimitsAndTargetService } from '../../../../services/limitsAndTarget.service';
import { da, ro, tr } from 'date-fns/locale';
import { ConfigService } from '../../../../services/config.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TooService } from '../../../../services/too.service';

import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzUploadChangeParam,
  NzUploadModule,
  NzUploadFile,
} from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-create-edit-too',
  standalone: true,
  providers: [
    {
      provide: NZ_ICONS,
      useValue: [ArrowRightOutline],
    },
  ],
  imports: [
    FormsModule,
    NzButtonModule,
    NzFlexModule,
    NzSegmentedModule,
    NgFor,
    NzInputModule,
    MatToolbarModule,
    NzOptionComponent,
    NzSelectModule,
    NzIconModule,
    SharedModule,
    TableWithRowsChildComponent,
    BaseChartDirective,
    NzCardModule,
    CardPercentageComponent,
    NzFormModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzUploadModule,
  ],
  templateUrl: './create-edit-too.component.html',
  styleUrl: './create-edit-too.component.css',
})
export class CreateEditTooComponent implements OnInit {
  machines: any[] = [];
  categories: any[] = [];
  centerlines: any[] = [];
  searchValue: string = '';
  final_centerline: number = 0;
  enablebutton = false;
  emitEditToParent = false;

  public selectedJustification: NzJustify = 'space-evenly';
  public selectedJustification2: NzJustify = 'space-between';
  public selectedJustification3: NzJustify = 'center';
  public selectedLAlignment: NzAlign = 'flex-start';
  formularioForm: FormGroup;
  formularioForm2: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private fb2: FormBuilder,
    public dialog: MatDialog,
    private auxService: AuxService,
    private configService: ConfigService,
    private limitsAndTargetService: LimitsAndTargetService,
    private tooService: TooService,
    private messageService: NzMessageService
  ) {
    this.formularioForm = this.fb.group({
      idMachine: [null, Validators.required],
      idCategory: [null, Validators.required],
      idCenterline: [null, Validators.required],
    });

    this.formularioForm2 = this.fb2.group({
      question1: [null, Validators.required],
      question2: [null, Validators.required],
      question3: [null, Validators.required],
      question4: [null, Validators.required],
      question5: [null, Validators.required],
      question6: [null, Validators.required],
      question7: [null, Validators.required],
      question8: [null, Validators.required],
      question9: [null, Validators.required],
      question10: [null, Validators.required],
      question11: [null, Validators.required],
      question12: [null, Validators.required],
      question13: [null, Validators.required],
      question14: [null, Validators.required],
      question15: [null, Validators.required],
      question16: [null, Validators.required],
      question17: [null, Validators.required],
      question18: [null, Validators.required],
      question19: [null, Validators.required],
      question20: [null, Validators.required],
      question21: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getMachines();
    this.final_centerline = 0;
    let pageName = this.route.snapshot.paramMap.get('id') || '';

    this.formularioForm2.patchValue({
      question1: 'This centerline is used to control ',
      question2: 'The centerline does this by changing ',
      question3: 'Increasing this value will increase the ',
      question4: 'If the value is to high the ',
      question5: 'If the value is to low the ',
      question6: 'Home',
      question7: 'Next screen',
      question8: '',
      question9: '',
      question10: '',
      question11: '',
      question12: '',
      question13: '',
      question14: '',
      question15: '',
      question16: '',
      question17: '',
      question18: '',
      question19: '',
      question20: '',
      question21: '',
    });
  }

  getMachines() {
    this.auxService.ventanaCargando();
    this.configService.get('get-all-machines').subscribe({
      next: (data: any) => {
        // this.dataSource = data.data;
        this.machines = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error loading machines: ', error);
      },
    });
  }

  onMachineChange(machineId: number): void {
    this.final_centerline = 0;

    if (machineId != null) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        idMachie: machineId,
        idCategory: null,
        idCenterline: null,
      });
      this.tooService.ObtenerCategorias(machineId).subscribe({
        next: (data: any) => {
          this.categories = data.data;
          this.auxService.cerrarVentanaCargando();
        },
        error: (error: any) => {
          this.auxService.AlertError('Error loading categories: ', error);
        },
      });
    }
  }
  onCategoryChange(categoryId: number): void {
    this.final_centerline = 0;

    if (categoryId != null) {
      this.auxService.ventanaCargando();

      this.tooService.ObtenerCenterlines(categoryId).subscribe({
        next: (data: any) => {
          this.centerlines = data.data;
          this.auxService.cerrarVentanaCargando();
        },
        error: (error: any) => {
          this.auxService.AlertError('Error loading centerlines: ', error);
        },
      });
    }
  }

  onCenterlineChange(CenterlineId: number): void {
    if (CenterlineId != null) {
      this.final_centerline = CenterlineId;
      console.log(this.final_centerline);
    }
  }

  // handleChange({ file, fileList }: NzUploadChangeParam): void {
  //   const status = file.status;
  //   if (status !== 'uploading') {
  //     console.log(file, fileList);
  //   }
  //   if (status === 'done') {
  //     this.messageService.success(`${file.name} file uploaded successfully.`);
  //   } else if (status === 'error') {
  //     this.messageService.error(`${file.name} file upload failed.`);
  //   }
  // }

  fileList: NzUploadFile[] = [];
  beforeUpload = (file: NzUploadFile): boolean => {
    // Verifica que el archivo sea una imagen
    const isImage = file.type ? file.type.startsWith('image/') : false;

    if (!isImage) {
      this.messageService.error('Solo se pueden subir imágenes.');
      return false; // Rechaza el archivo
    }

    this.fileList = [...this.fileList, file];
    return false;
  };

  guardarImagenes(): void {
    if (this.fileList.length === 0) {
      this.messageService.warning('No hay imágenes para guardar.');
      return;
    }

    console.log('Imágenes seleccionadas:', this.fileList);

    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('imagenes', file as File);
    });

    console.log('Contenido de FormData:');
    for (const pair of (formData as any).entries()) {
      console.log(`Clave: ${pair[0]}, Valor:`, pair[1]);
    }

    this.messageService.success('Imágenes listas para ser enviadas.');
  }

  Continue(){

  }

  Back(){

  }
}
