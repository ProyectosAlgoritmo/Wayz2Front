import { Component, OnInit } from '@angular/core';
import { RoleComponent } from '../users-module/role/role.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { UsersComponent } from '../users-module/users/users.component';
import { ChangeTargetAndLimitsComponent } from './change-target-and-limits/change-target-and-limits.component';

@Component({
  selector: 'app-limits-and-targets',
  standalone: true,
  imports: [NzTabsModule,ChangeTargetAndLimitsComponent, UsersComponent, RoleComponent],
  templateUrl: './limits-and-targets.component.html',
  styleUrls: ['./limits-and-targets.component.css']
})
export class LimitsAndTargetsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
