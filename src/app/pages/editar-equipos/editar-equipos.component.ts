import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoService, Equipo } from '../../services/equipo.service';
import { AlumnoService } from '../../services/alumno.service';
import { EventoService } from '../../services/evento.service';

declare const bootstrap: any;

@Component({
  selector: 'app-editar-equipos',
  standalone: false,
  templateUrl: './editar-equipos.component.html',
  styleUrls: ['./editar-equipos.component.css']
})
export class EditarEquiposComponent implements OnInit {
  eventoId!: string;
  nombreEvento: string = '';
  equipos: Equipo[] = [];

  equipoSeleccionado: Equipo = {
    nombre: '',
    rama: '',
    deporte: '',
    eventoId: '',
    integrantes: []
  };

  nuevoIntegrante = {
    nombre: '',
    noCuenta: 0
  };

  integranteEditando: { nombre: string; noCuenta: number } = { nombre: '', noCuenta: 0 };
  integranteOriginalNoCuenta: number = 0;

  constructor(
    private route: ActivatedRoute,
    private equipoService: EquipoService,
    private alumnoService: AlumnoService,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.paramMap.get('eventoId') || '';
    this.cargarNombreEvento();
    this.cargarEquipos();
  }

  cargarNombreEvento(): void {
    this.eventoService.getEventoPorId(this.eventoId).subscribe({
      next: evento => this.nombreEvento = evento.nombre,
      error: err => console.error('Error al obtener nombre del evento', err)
    });
  }

  cargarEquipos(): void {
    this.equipoService.getEquiposPorEvento(this.eventoId).subscribe({
      next: (res) => (this.equipos = res),
      error: (err) => console.error('Error al cargar equipos', err),
    });
  }

  abrirModalEditarEquipo(equipo: Equipo) {
    this.equipoSeleccionado = { ...equipo };
    const modal = new bootstrap.Modal(document.getElementById('modalEditarEquipo'));
    modal.show();
  }

  abrirModalAgregarIntegrante(equipo: Equipo) {
    this.equipoSeleccionado = equipo;
    this.nuevoIntegrante = { nombre: '', noCuenta: 0 };
    const modal = new bootstrap.Modal(document.getElementById('modalAgregarIntegrante'));
    modal.show();
  }

  abrirModalEditarIntegrante(equipo: Equipo, integrante: { nombre: string; noCuenta: number }) {
    this.equipoSeleccionado = equipo;
    this.integranteEditando = { ...integrante };
    this.integranteOriginalNoCuenta = integrante.noCuenta;

    const modal = new bootstrap.Modal(document.getElementById('modalEditarIntegrante'));
    modal.show();
  }

  guardarCambiosEquipo() {
    if (!this.equipoSeleccionado.id) return;

    this.equipoService.updateEquipo(this.equipoSeleccionado.id, this.equipoSeleccionado).subscribe({
      next: () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarEquipo'));
        modal?.hide();
        this.cargarEquipos();
      },
      error: (err) => console.error('Error al guardar cambios del equipo', err),
    });
  }

  guardarIntegrante() {
    if (!this.nuevoIntegrante.nombre || !this.nuevoIntegrante.noCuenta) return;

    const yaExiste = this.equipoSeleccionado.integrantes.some(
      (i) => i.noCuenta === this.nuevoIntegrante.noCuenta
    );

    if (yaExiste) {
      alert('Este número de cuenta ya está registrado en el equipo.');
      return;
    }

    this.alumnoService.getAlumnoPorNoCuenta(this.nuevoIntegrante.noCuenta).subscribe({
      next: (alumno) => {
        this.nuevoIntegrante.nombre = alumno.nombre;

        this.equipoSeleccionado.integrantes.push({ ...this.nuevoIntegrante });

        if (!this.equipoSeleccionado.id) return;

        this.equipoService.updateEquipo(this.equipoSeleccionado.id, this.equipoSeleccionado).subscribe({
          next: () => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarIntegrante'));
            modal?.hide();
            this.cargarEquipos();
          },
          error: (err) => console.error('Error al agregar integrante', err),
        });
      },
      error: () => {
        alert('No se encontró un alumno con ese número de cuenta.');
      }
    });
  }

  eliminarIntegrante(equipoId: string, noCuenta: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar a este integrante?')) {
      this.equipoService.eliminarIntegrante(equipoId, noCuenta).subscribe({
        next: () => this.cargarEquipos(),
        error: (err) => {
          console.error('Error al eliminar integrante', err);
          alert('No se pudo eliminar el integrante.');
        }
      });
    }
  }

  guardarCambiosIntegrante() {
    const yaExiste = this.equipoSeleccionado.integrantes.some(
      i => i.noCuenta === this.integranteEditando.noCuenta
        && i.noCuenta !== this.integranteOriginalNoCuenta
    );
    if (yaExiste) {
      alert('Ya existe un integrante con ese número de cuenta en este equipo.');
      return;
    }

    if (!this.equipoSeleccionado.id) return;

    this.alumnoService.getAlumnoPorNoCuenta(this.integranteOriginalNoCuenta).subscribe({
      next: alumnoDB => {
        const alumnoActualizado = {
          ...alumnoDB,
          noCuenta: this.integranteEditando.noCuenta,
          nombre: this.integranteEditando.nombre
        };

        this.alumnoService.updateAlumno(alumnoDB.id!, alumnoActualizado).subscribe({
          next: () => {
            const idx = this.equipoSeleccionado.integrantes
              .findIndex(i => i.noCuenta === this.integranteOriginalNoCuenta);
            if (idx !== -1) {
              this.equipoSeleccionado.integrantes[idx] = { ...this.integranteEditando };
            }

            this.equipoService.updateEquipo(this.equipoSeleccionado.id!, this.equipoSeleccionado)
              .subscribe({
                next: () => {
                  const modal = bootstrap.Modal
                    .getInstance(document.getElementById('modalEditarIntegrante'));
                  modal?.hide();
                  this.cargarEquipos();
                },
                error: err => {
                  console.error('Error al actualizar equipo con integrante editado', err);
                  alert('No se pudo guardar el cambio en el equipo.');
                }
              });
          },
          error: err => {
            console.error('Error al actualizar alumno', err);
            alert('No se pudo guardar el cambio en el alumno.');
          }
        });
      },
      error: () => {
        alert('No se encontró el alumno original en la base de datos.');
      }
    });
  }

  darDeBajaEquipo(id: string) {
    if (confirm('¿Estás seguro de dar de baja este equipo?')) {
      this.equipoService.deleteEquipo(id).subscribe(() => {
        this.cargarEquipos();
      });
    }
  }
}
