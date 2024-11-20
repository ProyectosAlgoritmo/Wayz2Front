import { Component, OnInit } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { UsersComponent } from "./users/users.component";
import { RoleComponent } from "./role/role.component";
import { SharedStateService } from '../../services/shared-state.service';


@Component({
  selector: 'app-users-module',
  templateUrl: './users-module.component.html',
  styleUrls: ['./users-module.component.css'],
  standalone: true,
  imports: [NzTabsModule, UsersComponent, RoleComponent],
})
export class UsersModuleComponent implements OnInit {

  constructor(private sharedStateService: SharedStateService) { }

  ngOnInit() {
    this.sharedStateService.toggleSidenavVisible(true);
  }

}
