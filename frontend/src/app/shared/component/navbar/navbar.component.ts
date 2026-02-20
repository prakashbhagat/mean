import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent {
    userService = inject(UserService);
    cartCount = 0; 

    isAuthenticated$ = this.userService.user$.pipe(map(token => !!token));

    logout() {
        this.userService.logout();
    }
}
