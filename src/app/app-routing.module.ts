import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PartidoListComponent } from './components/partido-list/partido-list.component'; // 👈 Agrega esta línea
import { HomeComponent } from './pages/home/home.component';
import { EventoCreateComponent } from './pages/evento-create/evento-create.component';
import { EquipoCreateComponent } from './pages/equipo-create/equipo-create.component';
import { EventoDetalleComponent } from './pages/evento-detalle/evento-detalle.component';
import { EditarEquiposComponent } from './pages/editar-equipos/editar-equipos.component';
import { PartidosComponent } from './pages/partidos/partidos.component';
import { AlumnoCreateComponent } from './pages/alumno-create/alumno-create.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { GestorAlumnosComponent } from './pages/gestor-alumnos/gestor-alumnos.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'partidos', component: PartidoListComponent }, // 👈 Nueva ruta
  { path: 'home', component: HomeComponent }, // ← nueva ruta
  { path: 'eventos/nuevo', component: EventoCreateComponent },
  { path: 'equipo/create/:eventoId', component: EquipoCreateComponent },
  { path: 'evento/:id', component: EventoDetalleComponent},
  { path: 'eventos/:eventoId/editar-equipos',component: EditarEquiposComponent},  
  { path: 'eventos/:eventoId/partidos', component: PartidosComponent },
  {path: 'alumnos/create', component: AlumnoCreateComponent},
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'gestor-alumnos', component: GestorAlumnosComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

