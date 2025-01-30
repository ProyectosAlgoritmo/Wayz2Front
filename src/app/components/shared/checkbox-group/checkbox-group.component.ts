import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';

export interface CheckboxOption {
  label: string;
  value: string;
  checked: boolean;
}

export interface CheckboxGroup {
  groupName: string;
  options: CheckboxOption[];
}

@Component({
  selector: 'app-checkbox-group',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCheckboxModule,  
    NzDividerModule
  ],
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.css']
})
export class CheckboxGroupComponent {
  @Input() groups: CheckboxGroup[] = [];
  @Output() selectionChange = new EventEmitter<CheckboxGroup[]>();

  // Verifica si todas las opciones de un grupo están seleccionadas
  isAllChecked(group: CheckboxGroup): boolean {
    return group.options.every(option => option.checked);
  }

  // Verifica si algunas opciones están seleccionadas (estado indeterminado)
  isIndeterminate(group: CheckboxGroup): boolean {
    const someChecked = group.options.some(option => option.checked);
    return someChecked && !this.isAllChecked(group);
  }

  // Selecciona o deselecciona todas las opciones de un grupo
  toggleAll(group: CheckboxGroup, checked: boolean): void {
    group.options.forEach(option => option.checked = checked);
    this.emitSelectionChange();
  }

  // Maneja el cambio de selección de una opción individual
  onOptionChange(): void {
    this.emitSelectionChange();
  }

  // Emite el evento de cambio de selección al componente padre
  private emitSelectionChange(): void {
    this.selectionChange.emit(this.groups);
  }
}
