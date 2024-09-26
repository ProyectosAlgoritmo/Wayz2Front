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
  @Input() iconType: string = ''; // Ícono por defecto
  @Input() title: string = ''; // Título por defecto
  @Input() number: number = 0; // Número por defecto
  @Input() growth: string = ''; // Porcentaje por defecto
  @Input() textoGrowth: string = ''; // text porcentaje por defecto
  @Input() growthIconType: string = ''; // Ícono de crecimiento
  @Input() iconTheme: null | undefined;
  @Input() growthColor: string = 'black'; // Color de crecimiento
  @Input() textoGrowthColor: string = ''; // Color de texto de crecimiento
  constructor() {}

  ngOnInit() {}
}
