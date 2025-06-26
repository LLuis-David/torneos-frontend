import { Component, OnInit } from '@angular/core';
import { GestorAlumnoService, Alumno } from '../../services/gestorAlumno.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


type AlumnoConEdicion = Omit<Alumno, 'id'> & { id?: string, editando?: boolean };

@Component({
  selector: 'app-gestor-alumnos',
  standalone: false,
  templateUrl: './gestor-alumnos.component.html',
  styleUrls: ['./gestor-alumnos.component.css']
})
export class GestorAlumnosComponent implements OnInit {
  alumnos: AlumnoConEdicion[] = [];
  alumnosFiltrados: AlumnoConEdicion[] = [];
  private copiaAlumnos: Map<string, AlumnoConEdicion> = new Map();

  filtro: string = '';
  filtroSemestre: string = '';
  filtroSexo: string = '';

  semestres: number[] = [1, 2, 3, 4, 5, 6];
  sexos: string[] = ['Masculino', 'Femenino'];

  constructor(private alumnoService: GestorAlumnoService) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.alumnoService.getAlumnos().subscribe(data => {
      this.alumnos = data.map(a => ({ ...a, editando: false }));
      this.copiaAlumnos.clear();
      this.aplicarFiltro();
    });
  }

  aplicarFiltro(): void {
    let filtroMinusculas = this.filtro.toLowerCase().trim();

    this.alumnosFiltrados = this.alumnos.filter(a => {
      const cumpleBusqueda = 
        a.nombre.toLowerCase().includes(filtroMinusculas) || 
        a.noCuenta.toString().includes(filtroMinusculas);

      const cumpleSemestre = this.filtroSemestre ? a.semestre.toString() === this.filtroSemestre : true;
      const cumpleSexo = this.filtroSexo ? a.sexo === this.filtroSexo : true;

      return cumpleBusqueda && cumpleSemestre && cumpleSexo;
    });
  }

  resaltarTexto(texto: string): string {
    if (!this.filtro) return texto;
    const filtroEscapado = this.escapeRegExp(this.filtro);
    const regex = new RegExp(`(${filtroEscapado})`, 'gi');
    return texto.replace(regex, '<u>$1</u>');
  }

  escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  iniciarEdicion(alumno: AlumnoConEdicion): void {
    alumno.editando = true;
    if (alumno.id) {
      this.copiaAlumnos.set(alumno.id, { ...alumno });
    }
  }

  cancelarEdicion(alumno: AlumnoConEdicion): void {
    if (alumno.id && this.copiaAlumnos.has(alumno.id)) {
      const copia = this.copiaAlumnos.get(alumno.id)!;
      Object.assign(alumno, copia);
      alumno.editando = false;
      this.copiaAlumnos.delete(alumno.id);
    } else {
      this.alumnos = this.alumnos.filter(a => a !== alumno);
      this.aplicarFiltro();
    }
  }

  guardarCambios(alumno: AlumnoConEdicion): void {
    if (
      alumno.noCuenta == null ||
      isNaN(alumno.noCuenta) ||
      !alumno.nombre.trim() ||
      !alumno.telEmergencia?.trim() ||
      !alumno.semestre ||
      !alumno.tipoSangre.trim() ||
      !alumno.noSS?.trim() ||
      !alumno.sexo.trim()
    ) {
      alert('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    if (!alumno.id) {
      const { id, editando, ...alumnoSinId } = alumno;
      this.alumnoService.createAlumno(alumnoSinId).subscribe(() => {
        this.cargarAlumnos();
      });
    } else {
      this.alumnoService.updateAlumno(alumno.id!, alumno).subscribe(() => {
        alumno.editando = false;
        this.copiaAlumnos.delete(alumno.id!);
        this.cargarAlumnos();
      });
    }
  }

  eliminarAlumno(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este alumno?')) {
      this.alumnoService.deleteAlumno(id).subscribe(() => {
        this.cargarAlumnos();
      });
    }
  }


  agregarAlumno(): void {
    this.alumnos.unshift({
      noCuenta: 0,
      nombre: '',
      telEmergencia: '',
      semestre: 1,
      tipoSangre: '',
      noSS: '',
      sexo: '',
      editando: true
    });
    this.aplicarFiltro();
  }

generarReporte(): void {
  const doc = new jsPDF();
  const fecha = new Date().toLocaleDateString();

  const encabezados = [
    ['No. de Cuenta', 'Nombre', 'Tel. Emergencia', 'Semestre', 'Tipo de Sangre', 'No. Seguro Social', 'Sexo']
  ];

  const filas = this.alumnosFiltrados.map(a => [
    a.noCuenta,
    a.nombre,
    a.telEmergencia,
    a.semestre,
    a.tipoSangre,
    a.noSS,
    a.sexo
  ]);

  const img = new Image();
  img.src = 'assets/images/logo2.png'; // Asegúrate de tener esta imagen en src/assets/logo.png

  img.onload = () => {
    const imgWidth = 20;
    const imgHeight = 20;
    doc.addImage(img, 'PNG', 14, 10, imgWidth, imgHeight);

    // Título y fecha (alineado con el logo)
    doc.setFont('times', 'bold');
    doc.setFontSize(16); 
    doc.text('Reporte de Alumnos', 40, 18);

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 40, 24);

    // Tabla en escala de grises
    autoTable(doc, {
      startY: 35,
      head: encabezados,
      body: filas,
      styles: { fontSize: 8, textColor: [50, 50, 50] },
      headStyles: {
        fillColor: [200, 200, 200], // gris claro
        textColor: [0, 0, 0]
      },
      alternateRowStyles: { fillColor: [245, 245, 245] } // filas intercaladas
    });

    // Descargar PDF
    doc.save(`reporte_alumnos_${fecha.replace(/\//g, '-')}.pdf`);
  };
}



}










