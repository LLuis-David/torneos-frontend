import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Asegúrate de que la ruta es la correcta frontend\src\app\services\auth.service.ts

@Component({
  selector: 'app-login',
  standalone: true, // Indicamos que es un componente standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    // Llamamos al servicio de autenticación pasando las credenciales
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log(response);
        // Si la respuesta es exitosa, redirige al dashboard
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error(error);
        alert('Usuario o contraseña incorrectos');
      }
    );
  }
}

