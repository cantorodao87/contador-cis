export type Trabajador = {
  id: string;
  nombre: string;
};

export type Peticion = {
  de: string;
  para: string;
  fecha: string;
  clave: string;
  permuta: boolean;
};