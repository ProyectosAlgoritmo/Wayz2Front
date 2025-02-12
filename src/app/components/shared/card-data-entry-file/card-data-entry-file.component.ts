import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-data-entry-file',
  standalone: true,
  imports: [NgFor],
  templateUrl: './card-data-entry-file.component.html',
  styleUrls: ['./card-data-entry-file.component.css']
})
export class CardDataEntryFileComponent implements OnInit {
  @Input() title: string = '';
  @Input() values: { complete: number, onTarget: number } = { complete: 0, onTarget: 0 };
  @Input() tableData: { due: number, complete: number, onTarget: number, offTarget: number } = { due: 0, complete: 0, onTarget: 0, offTarget: 0 };
  constructor() { }

  ngOnInit() {
  }

}
