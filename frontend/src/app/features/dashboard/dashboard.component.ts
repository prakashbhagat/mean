import { Component, inject, signal } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-dashboard.component',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  weather = signal<any>(null);
  weatherError: string | null = null;
  isLoggedIn = inject(UserService);

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getWeather().subscribe({
      next: (data) => {
        this.weather.set(data.current_weather);
      },
      error: (err) => {
        this.weatherError = 'Failed to fetch weather data: ' + err.message;
      }
    });
  }

  getWeatherDescription(code: number): string {
    if (code === 0) return 'Clear sky';
    if (code >= 1 && code <= 3) return 'Mainly clear, partly cloudy, or overcast';
    if (code === 45 || code === 48) return 'Fog';
    if (code >= 51 && code <= 67) return 'Drizzle or Rain';
    return 'Unknown';
  }

  logout() {
    this.isLoggedIn.logout();
  }
}
