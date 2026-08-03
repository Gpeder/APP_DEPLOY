import {
  History,
  ListOrdered,
  Rocket,
  Settings,
  Smartphone,
} from "lucide-react";

export const linksNavegacao = [
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/fila", label: "Fila", icon: ListOrdered },
  { to: "/nova-publicacao", label: "Nova publicação", icon: Rocket },
  { to: "/aplicativos", label: "Aplicativos", icon: Smartphone },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];
