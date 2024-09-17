import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore'; // Importa Firestore y las funciones necesarias
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private firestore: Firestore) {}  // Inyecta el nuevo Firestore

  getNotificationState(idEmpresa: string): Observable<any> {
    const docRef = doc(this.firestore, `Strategicview/StateEmpresas/${idEmpresa}/notificationState`); // Obtén la referencia al documento
    return docData(docRef);  // Usa docData para obtener un Observable del documento
  }

  updateNotificationState(idEmpresa: string, newState: any): Promise<void> {
    const docRef = doc(this.firestore, `Strategicview/StateEmpresas/${idEmpresa}/notificationState`); // Referencia al documento
    return updateDoc(docRef, { State: newState }); // Actualiza el campo 'state' con el nuevo valor
  }

  updateNotificationStateNoti(idEmpresa: string): Promise<void> {
    const docRef = doc(this.firestore, `Strategicview/StateEmpresas/${idEmpresa}/notificationState`); // Referencia al documento
    return updateDoc(docRef, { notifications: 0 }); // Actualiza el campo 'state' con el nuevo valor
  }
}