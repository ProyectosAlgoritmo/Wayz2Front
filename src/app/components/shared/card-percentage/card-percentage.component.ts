import { Component, Input, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { AppComponent } from '../../../app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-card-percentage',
  templateUrl: './card-percentage.component.html',
  styleUrls: ['./card-percentage.component.css'],
  standalone: true,
  imports: [NzCardModule, NzIconModule, NgFor, NgIf],
})
export class CardPercentageComponent implements OnInit {
  @Input() iconType: string = 'user'; // Ícono por defecto
  @Input() title: string = 'Objetivos Cumplidos'; // Título por defecto
  @Input() number: number = 0; // Número por defecto
  @Input() growth: string = '0% este mes'; // Porcentaje por defecto
  @Input() growthIconType: string = 'arrow-up'; // Ícono de crecimiento
  @Input() iconTheme: null | undefined;
  constructor() {}

  ngOnInit() {}
}
