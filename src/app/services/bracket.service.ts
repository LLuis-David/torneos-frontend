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
  
    // Nuevos campos agregados por el backend:
    siguientePartidoId?: string;
    posicionEnSiguiente?: 'local' | 'visitante';
    partidoAnteriorLocalId?: string;
    partidoAnteriorVisitanteId?: string;
  }

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  private apiUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:8080/api/partidos'
  : 'https://torneos-backend.onrender.com/api/partidos';

  constructor(private http: HttpClient) {}

  getPartidosByEvento(eventoId: string): Observable<Partido[]> {
    return this.http.get<Partido[]>(`${this.apiUrl}/evento/${eventoId}`);
  }

  getPartidosByEventoAndRonda(eventoId: string, ronda: number): Observable<Partido[]> {
    return this.http.get<Partido[]>(`${this.apiUrl}/evento/${eventoId}/ronda/${ronda}`);
  }

  updatePartido(id: string, partido: Partido): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl}/${id}`, partido);
  }

  generarBracket(eventoId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generar-bracket/${eventoId}`, {});
  }

}
