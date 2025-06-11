import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Partido {
  id?: string;
  equipoLocalId: string;
  equipoVisitanteId: string;
  eventoId: string;
  marcadorLocal: number;
  marcadorVisitante: number;
  estado: string;
  ganadorId?: string;
  observaciones?: string;
  ronda: number;
}

@Injectable({
  providedIn: 'root'
})
export class PartidoService {

  private apiUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:8080/api/alumnos'
  : 'https://torneos-backend.onrender.com/api/alumnos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.apiUrl);
  }

  getById(id: string): Observable<Partido> {
    return this.http.get<Partido>(`${this.apiUrl}/${id}`);
  }

  create(partido: Partido): Observable<Partido> {
    return this.http.post<Partido>(this.apiUrl, partido);
  }

  update(id: string, partido: Partido): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl}/${id}`, partido);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

