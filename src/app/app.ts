import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent implements OnInit {
  usuarioNombre = 'Usuario Activo';
  monedaGlobal: 'GTQ' | 'USD' = 'GTQ';

  // Colección contable compartida en tiempo real hacia la vista del menú lateral
  carteraOriginal: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.actualizarIdentidadUsuario();
    this.cargarCarteraLocal();

    if (!localStorage.getItem('sigo_moneda_activa')) {
      localStorage.setItem('sigo_moneda_activa', 'GTQ');
    } else {
      this.monedaGlobal = localStorage.getItem('sigo_moneda_activa') as 'GTQ' | 'USD';
    }
  }

  actualizarIdentidadUsuario() {
    const nombreGuardado = localStorage.getItem('sigo_usuario_nombre');
    if (nombreGuardado) {
      this.usuarioNombre = nombreGuardado;
    }
  }

  cargarCarteraLocal() {
    this.carteraOriginal = [
      {
        nit: '814526-7',
        razon_social: 'Corporación Alimentos del Sur, S.A.',
        expandido: true,
        marcas: [
          {
            codigo_hijo: 'MARC-001',
            codigo_interno: 'INT-99',
            nombre_marca: 'Logística Central',
            expandido: true,
            facturas: [
              { no_factura: 'FAC-4501', moneda: 'GTQ', saldo: 15000.0, dias_vencidos: 12 },
              { no_factura: 'FAC-4502', moneda: 'GTQ', saldo: 8500.0, dias_vencidos: 45 },
              { no_factura: 'FAC-4503', moneda: 'USD', saldo: 2400.0, dias_vencidos: 135 },
            ],
          },
        ],
      },
      {
        nit: '334981-2',
        razon_social: 'Importadora Eléctrica, S.A.',
        expandido: false,
        marcas: [
          {
            codigo_hijo: 'MARC-002',
            codigo_interno: 'INT-44',
            nombre_marca: 'Mayoreo Departamental',
            expandido: false,
            facturas: [
              { no_factura: 'FAC-8890', moneda: 'GTQ', saldo: 34000.0, dias_vencidos: 75 },
              { no_factura: 'FAC-8891', moneda: 'USD', saldo: 1150.0, dias_vencidos: 5 },
            ],
          },
        ],
      },
    ];
  }

  cambiarMonedaGlobal(moneda: 'GTQ' | 'USD') {
    this.monedaGlobal = moneda;
    localStorage.setItem('sigo_moneda_activa', moneda);

    if (this.router.url !== '/dashboard') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  obtenerMontoCeldaMarca(marca: any, rango: string, moneda: string): number {
    let total = 0;
    if (!marca.facturas) return total;
    for (const fac of marca.facturas) {
      if (fac.moneda === moneda) {
        if (rango === 'total' || fac.dias_vencidos > 120) {
          total += fac.saldo || 0;
        }
      }
    }
    return total;
  }

  mostrarSidebar(): boolean {
    return this.router.url !== '/login' && localStorage.getItem('sigo_sesion_activa') === 'true';
  }

  ejecutarCerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión en SigoCartera?')) {
      localStorage.removeItem('sigo_sesion_activa');
      localStorage.removeItem('sigo_usuario_nombre');
      localStorage.removeItem('sigo_moneda_activa');
      this.router.navigate(['/login']);
    }
  }
}
