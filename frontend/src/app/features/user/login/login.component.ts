import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-login.component',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user = { username: '', password: '' };
  error: string | null = null;

  constructor(private userService: UserService, private router: Router) { }

  login(): void {
    this.userService.login(this.user).subscribe({
      next: (res) => {
        this.userService.saveToken(res.token);
        this.router.navigate(['/']);
      },
      error: (err) => this.error = err.error.message
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
