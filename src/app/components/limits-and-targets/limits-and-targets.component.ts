import { Component, OnInit } from '@angular/core';
import { RoleComponent } from '../users-module/role/role.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { UsersComponent } from '../users-module/users/users.component';
import { ChangeTargetAndLimitsComponent } from './change-target-and-limits/change-target-and-limits.component';
import { UpdateTargetAndLimitsProductComponent } from './update-target-and-limits-product/update-target-and-limits-product.component';
import { CategoryNoRunningComponent } from './category-no-running/category-no-running.component';
import { ChangeTargetAndLimitsMultipleProductsComponent } from './change-target-and-limits-multiple-products/change-target-and-limits-multiple-products.component';

@Component({
  selector: 'app-limits-and-targets',
  standalone: true,
  imports: [
    NzTabsModule,
    ChangeTargetAndLimitsComponent,
    UsersComponent,
    RoleComponent,
    UpdateTargetAndLimitsProductComponent,
    CategoryNoRunningComponent,
    ChangeTargetAndLimitsMultipleProductsComponent,
  ],
  templateUrl: './limits-and-targets.component.html',
  styleUrls: ['./limits-and-targets.component.css'],
})
export class LimitsAndTargetsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
