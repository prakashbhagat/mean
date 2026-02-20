
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { UserService, User } from './user.service';
import { environment } from '../../../environments/environment.development';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let routerSpy = { navigate: jest.fn() };

  let store: { [key: string]: string } = {};
  const mockLocalStorage = {
    getItem: (key: string): string | null => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });

    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    store = {};
    jest.clearAllMocks();
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const mockUser: User = { username: 'testuser', password: 'password123' };

    service.register(mockUser).subscribe(res => {
      expect(res.message).toBe('User registered');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}users/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush({ message: 'User registered' });
  });

  it('should login a user', () => {
    const mockUser: User = { username: 'testuser', password: 'password123' };
    const mockResponse = { message: 'Login successful', token: 'mockToken' };

    service.login(mockUser).subscribe(res => {
      expect(res.token).toEqual('mockToken');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}users/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockResponse);
  });

  it('should save token to localStorage', () => {
    service.saveToken('dummyUrlToken');
    expect(localStorage.getItem('token')).toBe('dummyUrlToken');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should remove token and navigate to login on logout', () => {
    service.saveToken('dummyUrlToken');
    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
