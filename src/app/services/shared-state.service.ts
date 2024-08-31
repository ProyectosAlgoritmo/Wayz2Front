import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  private isExpandedSubject = new BehaviorSubject<boolean>(true);
  public isExpanded$ = this.isExpandedSubject.asObservable();

  private isVisibleSubject = new BehaviorSubject<boolean>(true);
  public isVisibleMenu$ = this.isVisibleSubject.asObservable();

  private notificationStateSource = new BehaviorSubject<string | null>(sessionStorage.getItem('id_empresa'));
  notificationState$ = this.notificationStateSource.asObservable();

  toggleSidenav(): void {
    this.isExpandedSubject.next(!this.isExpandedSubject.value);
  }

  toggleSidenavVisible(state: boolean): void {
    this.isVisibleSubject.next(state);
  }

  updateNotificationState(idEmpresa: string) {
    console.log("empresa actualizada")
    sessionStorage.setItem('id_empresa', idEmpresa);
    this.notificationStateSource.next(idEmpresa);
  }

  getDataStructure1(): Observable<any[]> {
    const data = [
      {
        id: 1,
        dato1: 'John Brown',
        dato2: 32,
        dato3: 'New York No. 1 Lake Park',
        description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
        subData: [
          { nombre: 'John Brown', apellido: 32, edad: 'New York No. 1 Lake Park', familia: 'YES. ' },
          { nombre: 'Jim Green', apellido: 42, edad: 'London No. 1 Lake Park', familia: 'YES. ' }
        ]
      },
      {
        id: 2,
        dato1: 'Jim Green',
        dato2: 42,
        dato3: 'London No. 1 Lake Park',
        description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
        subData: [
          { nombre: 'Joe Black', apellido: 32, edad: 'Sidney No. 1 Lake Park', familia: 'YES. ' }
        ]
      }
    ];
    return of(data);
  }
}
