export interface Factura {
  no_factura: string;
  fecha_emision: string;
  moneda: 'GTQ' | 'USD';
  monto: number;
}

export interface MarcaHijo {
  codigo_hijo: string;
  nombre_marca: string;
  expandido: boolean;
  facturas: Factura[];
}

export interface ClientePadre {
  nit: string;
  razon_social: string;
  expandido: boolean;
  marcas: MarcaHijo[];
}
