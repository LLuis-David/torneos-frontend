import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';

// Módulos de Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

// Importa LoginComponent correctamente como standalone
import { LoginComponent } from './pages/login/login.component';

//Para hacer uso de los servicios
import { HttpClientModule } from '@angular/common/http';

//Andres
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';

//Servicio partido-list
import { PartidoListComponent } from './components/partido-list/partido-list.component';
import { HomeComponent } from './pages/home/home.component';
import { EventoFormComponent } from './pages/evento-form/evento-form.component';
import { EventoCreateComponent } from './pages/evento-create/evento-create.component';
import { EquipoCreateComponent } from './pages/equipo-create/equipo-create.component';
import { EventoDetalleComponent } from './pages/evento-detalle/evento-detalle.component';
import { EditarEquiposComponent } from './pages/editar-equipos/editar-equipos.component';
import { PartidosComponent } from './pages/partidos/partidos.component';
import { AlumnoCreateComponent } from './pages/alumno-create/alumno-create.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';

//Estadisticas
import { NgChartsModule } from 'ng2-charts';
import { GestorAlumnosComponent } from './pages/gestor-alumnos/gestor-alumnos.component';


@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    DashboardComponent,
    HeaderComponent,
    PartidoListComponent,
    HomeComponent,
    EventoFormComponent,
    EventoCreateComponent,
    EquipoCreateComponent,
    EventoDetalleComponent,
    EditarEquiposComponent,
    PartidosComponent,
    AlumnoCreateComponent,
    EstadisticasComponent,
    GestorAlumnosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgChartsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
    LoginComponent, //Ahora se importa aquí, no en declarations
    //PartidoListComponent,
    HttpClientModule //Para hacer uso de los servicios
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
