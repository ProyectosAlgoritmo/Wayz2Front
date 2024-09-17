
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
  messages: { role: string; content: string }[] = [];
  chatVisible: boolean = true;

  suggestedQuestions: string[] = [];

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef, private sharedStateService: SharedStateService,
    private router: Router, private activatedRoute: ActivatedRoute
  ){
    this.sharedStateService.suggestedQuestions$.subscribe(questions => {
      this.suggestedQuestions = questions;
    });
  }

  

  sendMessage(): void {
    if (this.userInput.trim()) {

      console.log(this.userInput);
      this.messages.push({ role: 'User', content: this.userInput });
      console.log(this.messages); 

      const chatHistoryRequest = {
        Mensajes: this.messages.map(msg => ({
          role: msg.role === 'User' ? 'user' : 'assistant',
          content: msg.content
        }))
      };

      this.chatService.getChatResponse(chatHistoryRequest).subscribe(response => {
        this.messages.push({ role: 'AI', content: response.choices[0].message.content });
        //console.log(response.choices[0].message.content);
      });
      this.userInput = '';
      this.cdr.detectChanges();
      // Aquí podrías agregar la lógica para enviar el mensaje a través de un servicio

      
    }
  }

  selectSuggestedQuestion(question: string): void {
    this.userInput = question;  // Inserta la pregunta seleccionada en el campo de entrada
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
