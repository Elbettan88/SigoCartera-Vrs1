import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html', // 🚀 CORREGIDO: Apunta al nombre real de tu archivo plano
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  usuarioNombre = 'Usuario Activo';

  constructor(private router: Router) {}

  ngOnInit() {
    this.actualizarIdentidadUsuario();
  }

  actualizarIdentidadUsuario() {
    const nombreGuardado = localStorage.getItem('sigo_usuario_nombre');
    if (nombreGuardado) {
      this.usuarioNombre = nombreGuardado;
    }
  }

  mostrarSidebar(): boolean {
    return this.router.url !== '/login' && localStorage.getItem('sigo_sesion_activa') === 'true';
  }

  ejecutarCerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión en SigoCartera?')) {
      localStorage.removeItem('sigo_sesion_activa');
      localStorage.removeItem('sigo_usuario_nombre');
      this.router.navigate(['/login']);
    }
  }
}
