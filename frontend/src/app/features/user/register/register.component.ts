import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register.component',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
user = { username: '', password: '' };
  error: string | null = null;

  constructor(private userService: UserService, private router: Router) { }

  register(): void {
    this.userService.register(this.user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        
      },
      error: (err) => this.error = err.error.message
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
