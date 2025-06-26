// src/app/pages/evento-detalle/evento-detalle.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }      from '@angular/router';
import { EventoService }       from '../../services/evento.service';
import { EquipoService }       from '../../services/equipo.service';

// Importaciones para PDF
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-evento-detalle',
  standalone: false,
  templateUrl: './evento-detalle.component.html',
  styleUrls: ['./evento-detalle.component.css']
})
export class EventoDetalleComponent implements OnInit {
  eventoId!: string;
  evento: any;
  equipos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private equipoService: EquipoService
  ) {}

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.paramMap.get('id')!;
    this.eventoService.getEventoPorId(this.eventoId).subscribe({
      next: data => this.evento = data,
      error: err => console.error('Error al obtener el evento', err)
    });
    this.equipoService.getEquiposPorEvento(this.eventoId).subscribe({
      next: data => this.equipos = data,
      error: err => console.error('Error al obtener equipos', err)
    });
  }

//Formato del PDF de la Convocatoria
convocatoriaPdf(): void {
  const logoSuperior = new Image();
  logoSuperior.src = 'assets/images/logo2.png';

  const logoInferior = new Image();
  logoInferior.src = 'assets/images/futbolLogo.jpg';

  logoSuperior.onload = () => {
    logoInferior.onload = () => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let y = 20;

      // Logo superior centrado
      const logoSupAncho = 40;
      const logoSupAlto = 40;
      const posXSuperior = (pageWidth - logoSupAncho) / 2;
      doc.addImage(logoSuperior, 'PNG', posXSuperior, y, logoSupAncho, logoSupAlto);
      y += logoSupAlto + 10;

      // Título principal
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(0, 102, 204);
      doc.text('CONVOCATORIA', pageWidth / 2, y, { align: 'center' });
      y += 12;

      // Subtítulo
      doc.setFontSize(18);
      doc.setTextColor(0);
      doc.text(this.evento.nombre.toUpperCase(), pageWidth / 2, y, { align: 'center' });
      y += 20;

      // Sección: Descripción
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(22, 160, 133);
      doc.text('¿De qué trata este evento?', margin, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(doc.splitTextToSize(this.evento.descripcion, pageWidth - margin * 2), margin, y);
      y += 24;

      // Sección: Datos generales
      const secciones = [
        { titulo: 'Categoría:', valor: `${this.evento.tipo.rama} – ${this.evento.tipo.deporte}` },
        { titulo: 'Fechas del evento:', valor: `${new Date(this.evento.fechaInicio).toLocaleDateString()} al ${new Date(this.evento.fechaFin).toLocaleDateString()}` },
        { titulo: 'Hora de inicio:', valor: this.evento.horaInicio },
        { titulo: 'Lugar:', valor: `${this.evento.lugar.nombre}, ${this.evento.lugar.direccion}` },
        { titulo: 'Capacidad:', valor: `${this.evento.lugar.capacidad} personas` },
        { titulo: 'Profesor responsable:', valor: `${this.evento.contacto.profesor}` },
        { titulo: 'Horario de atención:', valor: `${this.evento.contacto.horarios}` }
      ];

      secciones.forEach(sec => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(54, 69, 79);
        doc.text(sec.titulo, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);
        doc.text(sec.valor, margin + 45, y);
        y += 8;
      });

      y += 10;

      // Sección: Inscripciones
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 87, 34);
      doc.text('¡Inscríbete a tiempo!', margin, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Desde: ${new Date(this.evento.inscripciones.fechaInicio).toLocaleDateString()} – ${this.evento.inscripciones.horaInicio}`, margin, y); y += 6;
      doc.text(`Hasta: ${new Date(this.evento.inscripciones.fechaFin).toLocaleDateString()} – ${this.evento.inscripciones.horaFin}`, margin, y); y += 16;

      // Llamado a la acción
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(76, 175, 80);
      doc.text('¡Te esperamos!', pageWidth / 2, y, { align: 'center' });

      // Imagen inferior centrada y más grande
      const logoInfAncho = 80;
      const logoInfAlto = 35;
      const posXInferior = (pageWidth - logoInfAncho) / 2;
      const posYInferior = pageHeight - margin - logoInfAlto;

      doc.addImage(logoInferior, 'PNG', posXInferior, posYInferior, logoInfAncho, logoInfAlto);

      // Guardar PDF
      doc.save(`Convocatoria_${this.evento.nombre}.pdf`);
    };
  };
}



generarReporte(): void {
  const logo = new Image();
  logo.src = 'assets/images/logo2.png';

  logo.onload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let y = 10;

    // Logo superior izquierdo
    const logoWidth = 20;
    const logoHeight = 20;
    doc.addImage(logo, 'PNG', margin, y, logoWidth, logoHeight);

    // Título principal y subtítulo
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text('Reporte del Torneo', margin + logoWidth + 6, y + 8);

    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.text(this.evento.nombre, margin + logoWidth + 6, y + 16);

    // Fecha de emisión alineada a la derecha, al nivel del título
    const fecha = new Date().toLocaleDateString();
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${fecha}`, pageWidth - margin, y + 8, { align: 'right' });

    y += 30;

    // Tabla de Información del Evento
    autoTable(doc, {
      startY: y,
      head: [['Campo', 'Valor']],
      body: [
        ['Nombre del evento', this.evento.nombre],
        ['Descripción', this.evento.descripcion],
        ['Categoría', `${this.evento.tipo.rama} – ${this.evento.tipo.deporte}`],
        ['Fechas', `${new Date(this.evento.fechaInicio).toLocaleDateString()} al ${new Date(this.evento.fechaFin).toLocaleDateString()}`],
        ['Hora de inicio', this.evento.horaInicio],
        ['Lugar', `${this.evento.lugar.nombre}, ${this.evento.lugar.direccion}`],
        ['Capacidad', this.evento.lugar.capacidad.toString()],
        ['Contacto', `${this.evento.contacto.profesor} (${this.evento.contacto.horarios})`],
        ['Inscripciones',
          `Desde: ${new Date(this.evento.inscripciones.fechaInicio).toLocaleDateString()} - ${this.evento.inscripciones.horaInicio}\n` +
          `Hasta: ${new Date(this.evento.inscripciones.fechaFin).toLocaleDateString()} - ${this.evento.inscripciones.horaFin}`
        ]
      ],
      styles: { font: 'times', fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 'auto' }
      },
      margin: { left: margin, right: margin }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Tabla de Equipos
    if (this.equipos.length) {
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.text('Listado de Equipos Inscritos', margin, y); y += 4;

      autoTable(doc, {
        startY: y,
        head: [['#', 'Nombre del Equipo', 'Rama', 'Deporte', 'Integrantes']],
        body: this.equipos.map((eq, index) => [
          index + 1,
          eq.nombre,
          eq.rama,
          eq.deporte,
          eq.integrantes.map((i: any) => `${i.nombre} (${i.noCuenta})`).join(', ')
        ]),
        styles: { font: 'times', fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { left: margin, right: margin }
      });

      y = (doc as any).lastAutoTable.finalY + 20;
    }

    // Vo.Bo. Coordinador de Deportes
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text('Vo.Bo. Coordinador de Deportes', pageWidth / 2, y, { align: 'center' }); y += 15;

    // Línea para firma
    doc.line(pageWidth / 2 - 40, y, pageWidth / 2 + 40, y); y += 8;

    // Guardar PDF
    doc.save(`Reporte_${this.evento.nombre}.pdf`);
  };
}

}


