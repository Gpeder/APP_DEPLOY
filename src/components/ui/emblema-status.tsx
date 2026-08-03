import { CircleAlert, CircleCheck } from "lucide-react";
import type { StatusHistorico } from "@/types";

const configuracaoStatusHistorico = {
  success: { label: "Concluído", icon: CircleCheck },
  failed: { label: "Com erro", icon: CircleAlert },
} satisfies Record<
  StatusHistorico,
  { label: string; icon: typeof CircleCheck }
>;

export function EmblemaStatus({ status }: { status: StatusHistorico }) {
  const configuracao = configuracaoStatusHistorico[status];
  const Icone = configuracao.icon;

  return (
    <span className={`badge status-${status}`}>
      <Icone size={13} />
      {configuracao.label}
    </span>
  );
}
