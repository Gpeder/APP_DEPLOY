export type FormularioAplicativo = {
  nome: string;
  urlRepositorio: string;
  branch: string;
};

export const formularioAplicativoVazio: FormularioAplicativo = {
  nome: "",
  urlRepositorio: "",
  branch: "",
};
