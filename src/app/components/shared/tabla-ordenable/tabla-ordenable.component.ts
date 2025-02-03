import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

interface DataItem {
  key: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-tabla-ordenable',
  standalone: true,
  imports: [CommonModule, NzTableModule, DragDropModule],
  templateUrl: './tabla-ordenable.component.html',
  styleUrls: ['./tabla-ordenable.component.css']
})
export class TablaOrdenableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  listOfData: DataItem[] = [
    { key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
    { key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
    { key: 3, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
    // Otros datos
  ];

  drop(event: CdkDragDrop<DataItem[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
  }

}
