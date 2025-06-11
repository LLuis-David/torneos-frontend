import { Component, OnInit } from '@angular/core';
import { EventoService, Evento } from '../../services/evento.service'; // <-- Usamos la interfaz compartida

@Component({
  selector: 'app-home',
  standalone: false, // Indicamos que es un componente standalone
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allEventos: Evento[] = [];
  publicados: Evento[] = [];
  finalizados: Evento[] = [];
  enCurso: Evento[] = [];

  activeTab: 'publicados' | 'finalizados' | 'encurso' = 'publicados';

  constructor(private eventoService: EventoService) {}

  ngOnInit() {
    this.eventoService.listarEventos()
      .subscribe(ev => {
        this.allEventos = ev;
        this.filtrar();
      });
  }

  // Filtra según estatus
  private filtrar() {
    this.publicados  = this.allEventos.filter(e => e.estatus === 'Abierto');
    this.finalizados = this.allEventos.filter(e => e.estatus === 'Cerrado');
    this.enCurso     = this.allEventos.filter(e => e.estatus === 'En curso');
  }

  // Cambia la pestaña activa
  selectTab(tab: 'publicados' | 'finalizados' | 'encurso') {
    this.activeTab = tab;
  }
}



