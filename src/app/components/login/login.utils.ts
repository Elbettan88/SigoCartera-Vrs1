export function ejecutarValidacionLogin(usuario: string, contrasena: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Simulamos una verificación de credenciales (Próximamente conectada a PHP)
    const usuarioValido = 'admin@sigocartera.com';
    const contrasenaValida = 'Sigo2026*';

    if (!usuario.trim() || !contrasena.trim()) {
      reject('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (usuario.toLowerCase() === usuarioValido && contrasena === contrasenaValida) {
      // Guardamos una bandera en la memoria del navegador para saber que ya inició sesión
      localStorage.setItem('sigo_sesion_activa', 'true');
      localStorage.setItem('sigo_usuario_nombre', 'Administrador General');
      resolve(true);
    } else {
      reject('Credenciales incorrectas. Verifique su usuario o contraseña.');
    }
  });
}
