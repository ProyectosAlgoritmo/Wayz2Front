import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-buttonstrategic',
  templateUrl: './buttonstrategic.component.html',
  styleUrls: ['./buttonstrategic.component.css']
})
export class ButtonstrategicComponent implements OnInit {
  @Input() customClass: string = 'BotonMorado';
  @Input() label: string = 'Click Me';
  @Input() cancelar: boolean = false;
  @Input() azul: boolean = false;
  @Input() blanco: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
