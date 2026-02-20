import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface SnackbarMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbarSubject = new Subject<SnackbarMessage>();
  snackbar$ = this.snackbarSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackbarSubject.next({ message, type });
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string) { this.show(msg, 'error'); }
  info(msg: string) { this.show(msg, 'info'); }
}
