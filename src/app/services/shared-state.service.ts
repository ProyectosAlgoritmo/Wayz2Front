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


  private isChatVisibleSubject = new BehaviorSubject<boolean>(true);
  public isChatVisible$ = this.isChatVisibleSubject.asObservable();


  private isVisiblestatecompany = new BehaviorSubject<boolean>(true);
  public isVisiblestatecompany$ = this.isVisiblestatecompany.asObservable();



  private suggestedQuestionsSubject = new BehaviorSubject<{ question: string, api: string }[]>([]);


  suggestedQuestions$ = this.suggestedQuestionsSubject.asObservable();


  toggleChatVisibility(state: boolean): void {
    this.isChatVisibleSubject.next(state);
  }


  toggleSidenav(): void {
    this.isExpandedSubject.next(!this.isExpandedSubject.value);
  }

  toggleSidenavVisible(state: boolean): void {
    this.isVisibleSubject.next(state);
  }

  updateNotificationState(idEmpresa: string) {
    sessionStorage.setItem('id_empresa', idEmpresa);
    this.notificationStateSource.next(idEmpresa);
  }


  updateSuggestedQuestions(questions: { question: string, api: string }[]): void {
    this.suggestedQuestionsSubject.next(questions);
  }

  statecompanyVisible(state: boolean): void {
    this.isVisiblestatecompany.next(state);
  }
  
}
