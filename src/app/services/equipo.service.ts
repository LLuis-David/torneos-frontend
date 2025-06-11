import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Integrante {
  noCuenta: number;
  nombre: string;
}

export interface Equipo {
  id?: string;
  nombre: string;
  rama: string;
  deporte: string;
  eventoId: string;
  integrantes: Integrante[];
}

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private readonly baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:8080/api/alumnos'
  : 'https://torneos-backend.onrender.com/api/alumnos';

constructor(private http: HttpClient) {}

  // Crear un equipo
  createEquipo(equipo: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(this.baseUrl, equipo);
  }

  // Obtener equipos de un evento
  getEquiposPorEvento(eventoId: string): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(`${this.baseUrl}/evento/${eventoId}`);
  }

  // Eliminar a un equipo
  deleteEquipo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

// Actualizar un equipo (recomendado)
updateEquipo(id: string, equipo: Equipo): Observable<Equipo> {
  return this.http.put<Equipo>(`${this.baseUrl}/${id}`, equipo);
}

// Eliminar a un integrante específico de un equipo
eliminarIntegrante(equipoId: string, noCuenta: number): Observable<Equipo> {
  return this.http.put<Equipo>(`${this.baseUrl}/${equipoId}/integrantes/${noCuenta}/eliminar`, {});
}


}






