import { Component, OnInit } from '@angular/core';
import { Partido, PartidoService } from '../../services/partido.service';

@Component({
  standalone: false,
  selector: 'app-partido-list',
  templateUrl: './partido-list.component.html',
  styleUrls: ['./partido-list.component.css']
})
export class PartidoListComponent implements OnInit {

  partidos: Partido[] = [];

  constructor(private partidoService: PartidoService) { }

  ngOnInit(): void {
    this.obtenerPartidos();
  }

  obtenerPartidos(): void {
    this.partidoService.getAll().subscribe({
      next: (data) => {
        this.partidos = data;
      },
      error: (err) => {
        console.error('Error al obtener partidos', err);
      }
    });
  }
}

