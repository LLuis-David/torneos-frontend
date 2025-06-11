import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoService, Partido } from '../../services/bracket.service';
import { EquipoService } from '../../services/equipo.service'; // <-- Agregado
import { EventoService } from '../../services/evento.service'; // <-- Agregado

@Component({
  selector: 'app-partidos',
  standalone: false,
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css']
})
export class PartidosComponent implements OnInit {
  eventoId: string = '';
  nombreEvento: string = ''; // <-- Agregado
  rondas: { [key: number]: Partido[] } = {};
  mensaje: string = '';
  equipos: any[] = []; // <-- Agregado

  constructor(
    private route: ActivatedRoute,
    private partidoService: PartidoService,
    private equipoService: EquipoService, // <-- Agregado
    private eventoService: EventoService // <-- Agregado
  ) {}

  //Booleano para saber si ya se ha generado un bracket
  bracketGenerado: boolean = false;

  //Booleano para el spinner para generar el bracket
  generandoBracket: boolean = false;

  ganadorTorneo: string = ''; 


  ngOnInit(): void {
    this.eventoId = this.route.snapshot.paramMap.get('eventoId') || '';
    console.log('Evento ID capturado desde la ruta:', this.eventoId);
    this.obtenerEquipos(); // <-- Agregado
    this.obtenerEvento(); // <-- Agregar la función para obtener el nombre del evento
    this.cargarPartidos();
  }

  obtenerEvento(): void {
    this.eventoService.getEventoById(this.eventoId).subscribe(evento => {
      this.nombreEvento = evento.nombre; // <-- Asignar el nombre del evento
    });
  }

  obtenerEquipos(): void { // <-- Agregado
    this.equipoService.getEquiposPorEvento(this.eventoId).subscribe(data => {
      this.equipos = data;
    });
  }

  getNombreEquipo(id: string | number): string { // <-- Agregado
    if (id === 0) return 'Bye';
    const equipo = this.equipos.find(e => e.id === id);
    return equipo ? equipo.nombre : 'Desconocido';
  }

  cargarPartidos(): void {
    this.partidoService.getPartidosByEvento(this.eventoId).subscribe(partidos => {
      this.bracketGenerado = partidos.length > 0;
      this.rondas = {};
  
      partidos.forEach(partido => {
        const ronda = partido.ronda || 1;
        if (!this.rondas[ronda]) this.rondas[ronda] = [];
        this.rondas[ronda].push(partido);
      });
  
      this.rondas = Object.fromEntries(
        Object.entries(this.rondas).sort(([a], [b]) => +a - +b)
      );
  
      // 🏆 Detectar al ganador del torneo (DENTRO del subscribe)
      const rondasKeys = Object.keys(this.rondas).map(Number);
      const ultimaRonda = Math.max(...rondasKeys);
      const partidosUltimaRonda = this.rondas[ultimaRonda];
  
      if (partidosUltimaRonda?.length === 1 && partidosUltimaRonda[0].estado === 'Finalizado') {
        const partidoFinal = partidosUltimaRonda[0];
        this.ganadorTorneo = this.getNombreEquipo(partidoFinal.ganadorId ?? 0);
      } else {
        this.ganadorTorneo = ''; // Aún no hay ganador
      }
    });
  }
  
  

  guardarResultado(partido: Partido): void {
    if (partido.marcadorLocal != null && partido.marcadorVisitante != null) {
      partido.estado = 'Finalizado';

      // Determinar el ganador
      if (partido.marcadorLocal > partido.marcadorVisitante) {
        partido.ganadorId = partido.equipoLocalId;
      } else if (partido.marcadorVisitante > partido.marcadorLocal) {
        partido.ganadorId = partido.equipoVisitanteId;
      } else {
        partido.ganadorId = ''; // Empate, se puede manejar de otra forma
      }

      // Guardar el resultado
      this.partidoService.updatePartido(partido.id!, partido).subscribe(() => {
        this.cargarPartidos();
        this.avanzarBracket(partido); // Avanzar el bracket
      });
    }
  }

  avanzarBracket(partido: Partido): void {
    if (!partido.ganadorId || !partido.id) return;

    const partidoActual = this.rondas[partido.ronda]?.find(p => p.id === partido.id);
    if (!partidoActual || !partidoActual['siguientePartidoId'] || !partidoActual['posicionEnSiguiente']) return;

    const rondaSiguiente = this.rondas[partido.ronda + 1];
    const siguiente = rondaSiguiente?.find(p => p.id === partidoActual['siguientePartidoId']);
    if (!siguiente) return;

    if (partidoActual['posicionEnSiguiente'] === 'local') {
      siguiente.equipoLocalId = partido.ganadorId;
    } else if (partidoActual['posicionEnSiguiente'] === 'visitante') {
      siguiente.equipoVisitanteId = partido.ganadorId;
    }

    if (siguiente.equipoLocalId && siguiente.equipoVisitanteId) {
      siguiente.estado = 'Programado';
    }

    this.partidoService.updatePartido(siguiente.id!, siguiente).subscribe(() => {
      this.cargarPartidos();
    });
  }

  generarBracket(): void {
    if (!this.eventoId) {
      this.mensaje = 'No se pudo obtener el eventoId.';
      return;
    }
  
    this.generandoBracket = true; // ⏳ Mostrar spinner
  
    this.partidoService.generarBracket(this.eventoId).subscribe({
      next: () => {
        this.mensaje = 'Bracket generado correctamente.';
        this.cargarPartidos();
      },
      error: err => {
        this.mensaje = err.error || 'Error al generar el bracket.';
      },
      complete: () => {
        this.generandoBracket = false; // ✅ Ocultar spinner
      }
    });
  }  

  getRondasKeys(): number[] {
    return Object.keys(this.rondas).map(r => +r);
  }
}
