import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EquipoService, Equipo, Integrante } from '../../services/equipo.service';
import { AlumnoService, Alumno } from '../../services/alumno.service';

@Component({
  selector: 'app-equipo-create',
  standalone: false,
  templateUrl: './equipo-create.component.html',
  styleUrls: ['./equipo-create.component.css']
})
export class EquipoCreateComponent implements OnInit {
  eventoId = '';

  // Lista local de alumnos ya registrados
  alumnos: Alumno[] = [];

  // Modelo de Equipo
  equipo: Equipo = {
    nombre: '',
    rama: '',
    deporte: '',
    eventoId: '',
    integrantes: []
  };

  // campo intermedio para ingresar noCuenta
  noCuentaIntegrante = '';

  constructor(
    private equipoService: EquipoService,
    private alumnoService: AlumnoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.paramMap.get('eventoId') || '';
    this.equipo.eventoId = this.eventoId;
    // opcional: cargar lista previa de alumnos
    this.alumnoService.getAllAlumnos?.().subscribe(list => this.alumnos = list);
  }

  /** Agrega un integrante al equipo */
  agregarIntegrante(): void {
    const no = Number(this.noCuentaIntegrante);
    if (!no) {
      alert('Introduce un No. de cuenta válido');
      return;
    }
    // buscar en la lista local
    const al = this.alumnos.find(a => a.noCuenta === no);
    if (!al) {
      alert(`Alumno ${no} no encontrado. Regístralo primero.`);
      return;
    }
    if (this.equipo.integrantes.some(i => i.noCuenta === no)) {
      alert('Ese alumno ya está en el equipo.');
      return;
    }
    this.equipo.integrantes.push({ noCuenta: al.noCuenta, nombre: al.nombre });
    this.noCuentaIntegrante = '';
  }

  /** Guarda el equipo */
  registrarEquipo(): void {
    if (!this.equipo.nombre.trim()) {
      alert('Dale un nombre al equipo.');
      return;
    }
    if (this.equipo.integrantes.length === 0) {
      alert('Agrega al menos un integrante.');
      return;
    }
    this.equipoService.createEquipo(this.equipo).subscribe({
      next: () => {
        alert('Equipo creado con éxito');
        this.router.navigate(['/home']);
      },
      error: err => {
        console.error(err);
        alert('Error al crear el equipo.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }
}

