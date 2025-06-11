import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080'; //Angular carga el proyecto por defecto en este puerto http://localhost:4200

  constructor(private http: HttpClient) { }

  login(user: string, password: string): Observable<any> {
    const loginData = { user, password };
    return this.http.post(`${this.baseUrl}/login`, loginData, { responseType: 'text' });
  }
}
