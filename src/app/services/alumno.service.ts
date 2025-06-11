// src/app/services/alumno.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alumno {
  id?: string;
  noCuenta: number;
  nombre: string;
  telEmergencia: string;
  semestre: number;
  tipoSangre: string;
  noSS: string;
  sexo: string;
}

@Injectable({ providedIn: 'root' })
export class AlumnoService {
  private apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api/alumnos'
    : 'https://torneos-backend.onrender.com/api/alumnos';

  constructor(private http: HttpClient) {}

  /** Trae todos los alumnos registrados */
  getAllAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.apiUrl);
  }

  /** Crea un nuevo alumno */
  createAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiUrl, alumno);
  }

  /** Busca un alumno por su número de cuenta */
  getAlumnoPorNoCuenta(noCuenta: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/buscar/${noCuenta}`);
  }

    /** Actualiza un alumno por su ID */
    updateAlumno(id: string, alumno: Alumno): Observable<Alumno> {
      return this.http.put<Alumno>(`${this.apiUrl}/${id}`, alumno);
    }

}




