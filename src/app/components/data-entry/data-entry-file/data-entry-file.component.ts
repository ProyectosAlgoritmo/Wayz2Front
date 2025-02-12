import { Component, OnInit } from '@angular/core';
import { CardDataEntryFileComponent } from '../../shared/card-data-entry-file/card-data-entry-file.component';


@Component({
  selector: 'app-data-entry-file',
  standalone: true,
  imports: [CardDataEntryFileComponent],
  templateUrl: './data-entry-file.component.html',
  styleUrls: ['./data-entry-file.component.css']
})
export class DataEntryFileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
