import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnoService, Alumno } from '../../services/alumno.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-alumno-create',
  standalone: false,
  templateUrl: './alumno-create.component.html',
  styleUrls: ['./alumno-create.component.css']
})
export class AlumnoCreateComponent {
  nuevoAlumno: Alumno = {
    noCuenta: 0,
    nombre: '',
    telEmergencia: '',
    semestre: 1,
    tipoSangre: '',
    noSS: '',
    sexo: ''
  };

  constructor(
    private alumnoService: AlumnoService,
    private router: Router
  ) {}

  registrarAlumno(form: NgForm) {
    if (form.invalid) return;
    this.alumnoService.createAlumno(this.nuevoAlumno).subscribe({
      next: alumno => {
        alert('Alumno registrado correctamente');
        form.resetForm();
        this.nuevoAlumno = {
          noCuenta: 0,
          nombre: '',
          telEmergencia: '',
          semestre: 1,
          tipoSangre: '',
          noSS: '',
          sexo: ''
        };
      },
      error: err => {
        console.error(err);
        alert('Error al registrar alumno');
      }
    });
  }

  regresar() {
    this.router.navigate(['/home']);
  }
}
