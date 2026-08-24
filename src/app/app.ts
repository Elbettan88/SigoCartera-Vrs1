import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common'; // <-- Importación necesaria para usar *ngIf en Standalone
import { SidebarComponent } from './components/sidebar/sidebar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, SidebarComponent, NgIf] // <-- Asegúrate de incluir NgIf aquí
})
export class AppComponent {
  title = 'SigoCarteraApp';
  mostrarSidebar: boolean = true;

  constructor(private router: Router) {
    // Escucha cada vez que termina una navegación en el ERP
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL actual es '/login' o la raíz '', oculta el Sidebar
      this.mostrarSidebar = !(event.url === '/login' || event.url === '/' || event.urlAfterRedirects === '/login');
    });
  }
}
