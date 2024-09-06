import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AuxService } from '../../../services/aux-service.service';
import { Subscription } from 'rxjs';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { CloudDownloadOutline, CloudUploadOutline, PlayCircleOutline, EyeOutline, EditOutline } from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-table-with-rows-child-Subcolumn',
  templateUrl: './table-with-rows-child-Subcolumn.component.html',
  styleUrls: ['./table-with-rows-child-Subcolumn.component.css'],
  imports: [NzTableModule, NgFor, NgIf, FormsModule, NzIconModule],
  standalone: true,
  providers: [
    {
      provide: NZ_ICONS, 
      useValue: [
        CloudDownloadOutline,
        CloudUploadOutline,
        PlayCircleOutline,
        EyeOutline,
        EditOutline
      ]
    }
  ]
})
export class TableWithRowsChildSubcolumnComponent implements OnInit {
  showActionsColumn: boolean = true;

  listOfData: any[] = [];
  expandSet = new Set<number>();

  ngOnInit(): void {
    this.listOfData = [
      {
        id: 1,
        street: 'Lake Park',
        age: 25,
        building: 'C',
        number: 2035,
        direccion1: 'Main St 123',
        direccion2: 'Apt 45',
        email: 'john@example.com',
        phone: '555-1234',
        subData: [
          {
            street: 'Sub St',
            age: 30,
            building: 'B',
            number: 404,
            direccion1: 'Sub St 456',
            direccion2: 'Suite 34',
            email: 'sub@example.com',
            phone: '555-4321'
          },
          {
            street: 'Green Ave',
            age: 35,
            building: 'A',
            number: 101,
            direccion1: 'Green Ave 789',
            direccion2: 'Floor 3',
            email: 'green@example.com',
            phone: '555-5678'
          }
        ]
      },
      {
        id: 2,
        street: 'Ocean Drive',
        age: 28,
        building: 'D',
        number: 1234,
        direccion1: 'Ocean St 567',
        direccion2: 'Suite 100',
        email: 'mary@example.com',
        phone: '555-9876',
        subData: [
          {
            street: 'Blue St',
            age: 40,
            building: 'E',
            number: 505,
            direccion1: 'Blue St 891',
            direccion2: 'Apt 12',
            email: 'blue@example.com',
            phone: '555-6543'
          },
          {
            street: 'Sunset Blvd',
            age: 32,
            building: 'F',
            number: 707,
            direccion1: 'Sunset Blvd 222',
            direccion2: 'Suite 200',
            email: 'sunset@example.com',
            phone: '555-2233'
          }
        ]
      },
      {
        id: 3,
        street: 'Hilltop Rd',
        age: 22,
        building: 'G',
        number: 6789,
        direccion1: 'Hilltop Rd 303',
        direccion2: 'Room 404',
        email: 'jake@example.com',
        phone: '555-7890',
        subData: [
          {
            street: 'Forest Rd',
            age: 27,
            building: 'H',
            number: 909,
            direccion1: 'Forest Rd 555',
            direccion2: 'Apt 5',
            email: 'forest@example.com',
            phone: '555-3322'
          },
          {
            street: 'Maple St',
            age: 45,
            building: 'I',
            number: 1212,
            direccion1: 'Maple St 123',
            direccion2: 'Floor 2',
            email: 'maple@example.com',
            phone: '555-4421'
          }
        ]
      }
    ];
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onEdit(data: any): void {
    // Lógica para editar el registro
    console.log('Editando registro:', data);
  }

  toggleActionsColumn(): void {
    // Método para alternar la visibilidad de la columna de acciones
    this.showActionsColumn = !this.showActionsColumn;
  }

}
