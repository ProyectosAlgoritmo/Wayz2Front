import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  private isExpandedSubject = new BehaviorSubject<boolean>(true);
  public isExpanded$ = this.isExpandedSubject.asObservable();

  private isVisibleSubject = new BehaviorSubject<boolean>(true);
  public isVisibleMenu$ = this.isVisibleSubject.asObservable();

  toggleSidenav(): void {
    this.isExpandedSubject.next(!this.isExpandedSubject.value);
  }

  toggleSidenavVisible(state: boolean): void {
    this.isVisibleSubject.next(state);
  }
}
