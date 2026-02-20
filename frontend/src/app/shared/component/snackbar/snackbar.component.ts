import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { SnackbarService } from '../../service/snackbar';
import { CommonModule } from '@angular/common';

interface SnackbarMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
})
export class SnackbarComponent {
  messages: SnackbarMessage[] = [];
  private cdr = inject(ChangeDetectorRef);

  constructor(private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.snackbarService.snackbar$.subscribe((msg) => {
      console.log('Snackbar received:', msg);
      this.messages = [...this.messages, msg];
      this.cdr.detectChanges(); 
      setTimeout(() => this.removeMessage(msg), 5000);
    });
  }

  removeMessage(msg: SnackbarMessage) {
    this.messages = this.messages.filter(m => m !== msg);
    this.cdr.detectChanges();
  }
}
