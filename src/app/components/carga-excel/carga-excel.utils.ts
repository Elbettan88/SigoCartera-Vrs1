import * as XLSX from 'xlsx';
import { ClientePadre, MarcaHijo, Factura } from '../dashboard/dashboard.interfaces';

export function procesarArchivoExcelSigo(archivo: File): Promise<ClientePadre[]> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();

    // 1. Leer el archivo binario de Excel
    lector.onload = (e: any) => {
      try {
        const datosBinarios = e.target.result;
        const libro = XLSX.read(datosBinarios, { type: 'binary' });
        const nombreHoja = libro.SheetNames[0];
        const hoja = libro.Sheets[nombreHoja];
        
        // 2. Convertir la hoja a una matriz de objetos JSON planos
        const filas: any[] = XLSX.utils.sheet_to_json(hoja);
        
        // Cargar lo que ya tenemos guardado en memoria para no duplicar/sobreescribir
        const memoria = localStorage.getItem('sigo_cartera_dinamica');
        const carteraActual: ClientePadre[] = memoria ? JSON.parse(memoria) : [];

        // 3. Mapear cada fila del Excel a la estructura jerárquica de SigoCartera
        for (const fila of filas) {
          const nitPadre = String(fila['NIT'] || fila['nit'] || '').trim();
          const razonSocial = String(fila['CLIENTE'] || fila['cliente'] || '').trim();
          const nombreMarca = String(fila['MARCA'] || fila['marca'] || '').trim();
          const noFactura = String(fila['FACTURA'] || fila['factura'] || '').trim().toUpperCase();
          const montoFactura = parseFloat(fila['MONTO'] || fila['monto'] || '0');
          const monedaFactura = String(fila['MONEDA'] || fila['moneda'] || 'GTQ').trim().toUpperCase() as 'GTQ' | 'USD';
          const fechaEmision = String(fila['FECHA'] || fila['fecha'] || '2026-08-01').trim();

          if (!nitPadre || !noFactura || montoFactura <= 0) continue; // Saltar filas inválidas

          // Buscar o crear el Cliente Padre (NIT)
          let cliente = carteraActual.find(c => c.nit === nitPadre);
          if (!cliente) {
            cliente = { nit: nitPadre, razon_social: razonSocial || 'Empresa NIT ' + nitPadre, expandido: true, marcas: [] };
            carteraActual.push(cliente);
          }

          // Buscar o crear la Marca Hijo
          let marca = cliente.marcas.find(m => m.nombre_marca.toLowerCase() === nombreMarca.toLowerCase());
          if (!marca) {
            const correlativoHijo = 'M-' + String(cliente.marcas.length + 1).padStart(3, '0');
            marca = { codigo_hijo: correlativoHijo, nombre_marca: nombreMarca || 'Genérica', expandido: false, facturas: [] };
            cliente.marcas.push(marca);
          }

          // Validar que la factura no haya sido cargada previamente
          const facturaExiste = marca.facturas.some(f => f.no_factura === noFactura);
          if (!facturaExiste) {
            marca.facturas.push({
              no_factura: noFactura,
              fecha_emision: fechaEmision,
              moneda: monedaFactura === 'USD' ? 'USD' : 'GTQ',
              monto: montoFactura
            });
          }
        }

        // 4. Guardar los resultados consolidados de vuelta en el almacenamiento local
        localStorage.setItem('sigo_cartera_dinamica', JSON.stringify(carteraActual));
        resolve(carteraActual);

      } catch (error) {
        reject('Error al procesar el mapeo del archivo Excel: ' + error);
      }
    };

    lector.onerror = () => reject('No se pudo leer el archivo físico.');
    lector.readAsBinaryString(archivo);
  });
}
