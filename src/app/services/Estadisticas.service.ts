// src/app/services/estadisticas.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alumno {
  id: string;
  noCuenta: number;
  nombre: string;
  telEmergencia: string;
  semestre: number;
  tipoSangre: string;
  noSS: string;
  sexo: 'Masculino' | 'Femenino';
}

export interface Evento {
  mongoId: string;
  nombre: string;
  tipo: { rama: string; deporte: string };
  // ...otros campos si los necesitas
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private readonly baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'
    : 'https://torneos-backend.onrender.com/api';

  private readonly ALUMNOS_URL = `${this.baseUrl}/alumnos`;
  private readonly EVENTOS_URL = `${this.baseUrl}/eventos`;

  constructor(private http: HttpClient) {}

  getAllAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.ALUMNOS_URL);
  }

  getAllEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.EVENTOS_URL);
  }
}

