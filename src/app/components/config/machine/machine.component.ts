import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedStateService } from '../../../services/shared-state.service';
import { ConfigService } from '../../../services/config.service';
import { AuxService } from '../../../services/aux-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../shared/shared.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { EditMachineComponent } from './edit-machine/edit-machine.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { MachinesOffProductionComponent } from './machines-off-production/machines-off-production.component';
import { MachinesProductionComponent } from './machines-production/machines-production.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-machine',
  standalone: true,
  imports: [
    NzTabsModule,
    MachinesOffProductionComponent,
    MachinesProductionComponent
  ],
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css'],
})
export class MachineComponent implements OnInit {

  constructor(
    private sharedStateService: SharedStateService,
   
  ) {
    this.sharedStateService.updateSuggestedQuestions([]);
  }

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(true);
  }

  
}
