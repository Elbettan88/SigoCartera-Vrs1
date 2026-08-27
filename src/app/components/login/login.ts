import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ejecutarValidacionLogin } from './login.utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html' // Apuntando al nombre plano de tu archivo
})
export class LoginComponent {
  campoUsuario = '';
  campoContrasena = '';
  mensajeError = '';
  cargando = false;

  constructor(private router: Router) {
    // Si el usuario ya tiene sesión activa, lo mandamos directo al dashboard
    if (localStorage.getItem('sigo_sesion_activa') === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  intentarIniciarSesion() {
    this.cargando = true;
    this.mensajeError = '';

    ejecutarValidacionLogin(this.campoUsuario, this.campoContrasena)
      .then(() => {
        this.cargando = false;
        // Redirigir al Dashboard de forma inmediata al autenticarse
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        this.cargando = false;
        this.mensajeError = error;
      });
  }
}
