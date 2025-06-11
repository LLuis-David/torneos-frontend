import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

export interface Evento {
  mongoId?: string;
  nombre: string;
  tipo: {
    rama: string;
    deporte: string;
  };
  inscripciones: {
    fechaInicio: string;
    fechaFin: string;
    horaInicio: string;
    horaFin: string;
  };
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  lugar: {
    nombre: string;
    direccion: string;
    capacidad: number;
  };
  descripcion: string;
  estatus: string;
  contacto: {
    profesor: string;
    horarios: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  /** Queda: http://localhost:8080/api/eventos */
  private readonly baseUrl = GLOBAL.url + 'api/eventos';
  private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  listarEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl, { headers: this.jsonHeaders });
  }

  obtenerEventosPorEstatus(estatus: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}?estatus=${estatus}`, { headers: this.jsonHeaders });
  }

  createEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl, evento, { headers: this.jsonHeaders });
  }

  updateEvento(id: string, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${id}`, evento, { headers: this.jsonHeaders });
  }

  deleteEvento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getEventoById(id: string): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`, { headers: this.jsonHeaders });
  }

  getEventoPorId(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  

}

