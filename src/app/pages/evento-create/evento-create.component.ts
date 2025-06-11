import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-evento-create',
  standalone: false,
  templateUrl: './evento-create.component.html',
  styleUrls: ['./evento-create.component.css']
})
export class EventoCreateComponent implements OnInit {
  // Inicializamos el objeto con todos los campos
  evento: Evento = {
    nombre: '',
    tipo: { rama: '', deporte: '' },
    inscripciones: { fechaInicio: '', fechaFin: '', horaInicio: '', horaFin: '' },
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    lugar: { nombre: '', direccion: '', capacidad: 0 },
    descripcion: '',
    estatus: 'Abierto',
    contacto: { profesor: '', horarios: '' }
  };

  // Opciones para estatus
  estatusOptions = ['Abierto', 'En curso', 'Cerrado'];

  constructor(public router: Router, private eventoService: EventoService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.eventoService.createEvento(this.evento).subscribe({
      next: (saved) => {
        alert('Evento creado con éxito');
        this.router.navigate(['/home']); // o la ruta que uses como "home"
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el evento');
      }
    });
  }

}

