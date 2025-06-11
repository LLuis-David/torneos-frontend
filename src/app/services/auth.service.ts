import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:8080/api/alumnos'
      : 'https://torneos-backend.onrender.com/api/alumnos';
  
    constructor(private http: HttpClient) {}

  login(user: string, password: string): Observable<any> {
    const loginData = { user, password };
    return this.http.post(`${this.baseUrl}/login`, loginData, { responseType: 'text' });
  }
}
