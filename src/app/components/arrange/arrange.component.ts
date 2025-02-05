import { Component, OnInit } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CategoriesComponent } from './categories/categories.component';
import { MachinesComponent } from './machines/machines.component';
import { ProductsComponent } from './products/products.component';
import { CenterlinesComponent } from './centerlines/centerlines.component';

@Component({
  selector: 'app-arrange',
  standalone: true,
  imports: [
        NzTabsModule,
        CategoriesComponent,
        MachinesComponent,
        ProductsComponent,
        CenterlinesComponent,
  ],
  templateUrl: './arrange.component.html',
  styleUrl: './arrange.component.css'
})
export class ArrangeComponent {

}
