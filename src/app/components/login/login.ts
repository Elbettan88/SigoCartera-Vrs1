import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Necesario para capturar datos en formularios Standalone

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [FormsModule] // <-- Añade FormsModule aquí
})
export class LoginComponent {
  // Variables vinculadas al formulario
  perfil: string = 'admin';
  usuario: string = '';
  contrasena: string = '';

  constructor(private router: Router) {}

  // Función que se ejecuta al enviar el formulario
  onLogin() {
    // Validación local simulada
    if (this.usuario === 'admin_local' && this.contrasena === 'admin123') {
      alert('¡Acceso concedido al sistema local!');
      this.router.navigate(['/dashboard']); // <-- Redirección al Dashboard
    } else {
      alert('Credenciales incorrectas de prueba. Use: admin_local / admin123');
    }
  }
}
