// src/app/pages/estadisticas/estadisticas.component.ts

import { Component, OnInit } from '@angular/core';
import { EstadisticasService, Alumno, Evento } from '../../services/Estadisticas.service';

@Component({
  selector: 'app-estadisticas',
  standalone: false,
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  // — Para sexo
  porcentajeMasculino = 0;
  porcentajeFemenino = 0;

  // — Para semestres
  semestres: number[] = [];
  cantidadesPorSemestre: number[] = [];

  // — Para eventos por deporte
  deportes: string[] = [];
  eventosPorDeporte: number[] = [];

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit(): void {
    // Carga alumnos
    this.estadisticasService.getAllAlumnos().subscribe(alumnos => {
      this.calcularSexo(alumnos);
      this.calcularSemestres(alumnos);
    });

    // Carga eventos
    this.estadisticasService.getAllEventos().subscribe(eventos => {
      this.calcularEventosPorDeporte(eventos);
    });
  }

  private calcularSexo(alumnos: Alumno[]): void {
    const total = alumnos.length;
    const masc = alumnos.filter(a => a.sexo === 'Masculino').length;
    const fem  = alumnos.filter(a => a.sexo === 'Femenino').length;

    this.porcentajeMasculino = total > 0 ? Math.round((masc / total) * 100) : 0;
    this.porcentajeFemenino  = total > 0 ? Math.round((fem  / total) * 100) : 0;
  }

  private calcularSemestres(alumnos: Alumno[]): void {
    const conteo: { [sem: number]: number } = {};
    alumnos.forEach(a => {
      if (a.semestre != null) {
        conteo[a.semestre] = (conteo[a.semestre] || 0) + 1;
      }
    });
    this.semestres = Object.keys(conteo).map(n => +n).sort((a, b) => a - b);
    this.cantidadesPorSemestre = this.semestres.map(s => conteo[s]);
  }

  private calcularEventosPorDeporte(eventos: Evento[]): void {
    const conteo: { [dep: string]: number } = {};
    eventos.forEach(e => {
      const dep = e.tipo?.deporte || 'Desconocido';
      conteo[dep] = (conteo[dep] || 0) + 1;
    });
    this.deportes = Object.keys(conteo);
    this.eventosPorDeporte = this.deportes.map(d => conteo[d]);
  }
}

