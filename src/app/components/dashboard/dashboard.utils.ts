import { ClientePadre, Factura, MarcaHijo } from './dashboard.interfaces';

// 🛠️ Modificación del NIT, Empresa o Marca Comercial
export function ejecutarEditarEstructura(cliente: ClientePadre, marca: MarcaHijo, guardarCallback: () => void) {
  const nuevoNit = prompt('Modificar NIT Padre:', cliente.nit);
  if (nuevoNit && nuevoNit.trim()) {
    cliente.nit = nuevoNit.trim();
  }

  const nuevaRazon = prompt('Modificar Razón Social / Empresa:', cliente.razon_social);
  if (nuevaRazon && nuevaRazon.trim()) {
    cliente.razon_social = nuevaRazon.trim();
  }

  const nuevaMarca = prompt('Modificar Nombre de la Marca:', marca.nombre_marca);
  if (nuevaMarca && nuevaMarca.trim()) {
    marca.nombre_marca = nuevaMarca.trim();
  }

  guardarCallback();
}

// 🛠️ Modificación del Correlativo de Factura o Saldo Vivo
export function ejecutarEditarFactura(factura: Factura, guardarCallback: () => void) {
  const nuevoNo = prompt('Modificar Número de Factura:', factura.no_factura);
  if (nuevoNo && nuevoNo.trim()) {
    factura.no_factura = nuevoNo.trim().toUpperCase();
  }

  const nuevoMontoStr = prompt('Modificar Monto Actual de la Deuda:', factura.monto.toString());
  if (nuevoMontoStr) {
    const valor = parseFloat(nuevoMontoStr);
    if (!isNaN(valor) && valor >= 0) {
      factura.monto = valor;
    } else {
      alert('Monto inválido.');
    }
  }

  guardarCallback();
}

// 🚪 Función para destruir la sesión activa y salir del sistema
export function ejecutarCerrarSesion(router: any) {
  if (confirm('¿Está seguro que desea cerrar sesión en SigoCartera?')) {
    localStorage.removeItem('sigo_sesion_activa');
    localStorage.removeItem('sigo_usuario_nombre');
    router.navigate(['/login']);
  }
}
