import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-create-too',
  standalone: true,
  imports: [
    FormsModule,
    NzSelectModule
  ],
  templateUrl: './create-too.component.html',
  styleUrl: './create-too.component.css'
})
export class CreateTooComponent {
  selectedValue = null;
}
