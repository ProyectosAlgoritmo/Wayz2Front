
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Component, ChangeDetectorRef, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat-service.service';
import { SharedStateService } from '../../services/shared-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AIService } from '../../services/AI.service';
import { AuxService } from '../../services/aux-service.service';

@Component({
  selector: 'app-chat-ai',
  standalone: true,
  imports: [
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzListModule,
    NzAvatarModule,
    NzIconModule,CommonModule ],
    
  templateUrl: './chat-ai.component.html',
  styleUrl: './chat-ai.component.css'
})
export class ChatAIComponent implements AfterViewChecked {
  @ViewChild('chatList') private chatList!: ElementRef;
  userInput: string = '';
  userrequest: string = '';
  messages: { role: string; content: string }[] = [];
  messagesfront: { role: string; content: string }[] = [];
  chatVisible: boolean = true;

  suggestedQuestions: { question: string, api: string }[] = [];
  dates: any = {};
  


  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef, private sharedStateService: SharedStateService,
    private router: Router, private activatedRoute: ActivatedRoute, private aIService: AIService, 
    private auxService: AuxService
  ){
    this.sharedStateService.suggestedQuestions$.subscribe(questions => {
      this.suggestedQuestions = questions;
    });

    const currentYear = new Date().getFullYear(); // Obtiene el año actual

    this.dates = {
      FechaInicio: `${currentYear}-01-01`, // Establece la fecha de inicio al 1 de enero del año actual
      FechaFin: `${currentYear}-12-31`     // Establece la fecha de fin al 31 de diciembre del año actual
    };
  }

  formatMessageContent(content: string): string {
    // Reemplazar saltos de línea y otros formateos que quieres conservar
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Negritas
      .replace(/__(.*?)__/g, '<em>$1</em>')  // Cursivas
  }

  

  sendMessage(): void {
    if (this.userInput.trim()) {

      this.messagesfront.push({ role: 'User', content: this.userInput });
      
      let mensajereal = (!this.userrequest || this.userrequest.trim() === '') ? this.userInput : this.userrequest;
      this.messages.push({ role: 'User', content: mensajereal });

      const chatHistoryRequest = {
        Mensajes: this.messages.map(msg => ({
          role: msg.role === 'User' ? 'user' : 'assistant',
          content: msg.content
        }))
      };

      this.chatService.getChatResponse(chatHistoryRequest).subscribe(response => {
        this.messages.push({ role: 'AI', content: response.choices[0].message.content });
        this.messagesfront.push({ role: 'AI', content: response.choices[0].message.content });;
      });
      this.userInput = '';
      this.userrequest = '';
      this.cdr.detectChanges();
      // Aquí podrías agregar la lógica para enviar el mensaje a través de un servicio

      
    }
  }

  selectSuggestedQuestion(question: any): void {
    

    this.auxService.ventanaCargando();
    this.aIService.GetDatapost(question.api, this.dates).subscribe({
      next:(data) =>{

        if(data.success){

          this.auxService.cerrarVentanaCargando();

          if(!data.warning){
            //this.userInput = question.question + 'La data es la siguiente' + ;  // Inserta la pregunta seleccionada en el campo de entrada
            const formattedData = JSON.stringify(data.data, null, 2);  // Formatea los datos como JSON con indentación
            this.userInput = question.question;  // Inserta la pregunta y la data en el campo de entrada
            this.userrequest = question.question + '\nLa data es la siguiente:\n' + formattedData+ ". Responde de forma concisa y en no más de 500 palabras.";
            //this.dataSource = data.data;

          }
          else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("AI",data.message); 

          }

        }
        else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("AI",data.message); 

        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error al la data AI:', error);
      },
    }); 


  }

  closeChat(): void {
    this.sharedStateService.toggleChatVisibility(false);
  }
  trackByFn(index: number, item: any): number {
    return index; // O puedes retornar un identificador único si lo tienes
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatList.nativeElement.scrollTop = this.chatList.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
