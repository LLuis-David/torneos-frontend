export interface Tipo {
    rama: string;
    deporte: string;
  }
  
  export interface Inscripciones {
    fechaInicio: string;
    fechaFin: string;
    horaInicio: string;
    horaFin: string;
  }
  
  export interface Lugar {
    nombre: string;
    direccion: string;
    capacidad: number;
  }
  
  export interface Contacto {
    profesor: string;
    horarios: string;
  }
  
  export interface Evento {
    mongoId?: string;
    nombre: string;
    tipo: Tipo;
    inscripciones: Inscripciones;
    fechaInicio: string;
    fechaFin: string;
    horaInicio: string;
    lugar: Lugar;
    descripcion: string;
    estatus: string;
    contacto: Contacto;
  }
  