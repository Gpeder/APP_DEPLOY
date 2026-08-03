import { LogoLoja } from "@/components/ui/logo-loja";
import {
  rotulosStatusPlataforma,
  rotulosStatusPublicacao,
} from "@/config/rotulos-status";
import type {
  StatusPlataformaPublicacao,
  StatusPublicacao,
} from "@/types";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  RefreshCw,
} from "lucide-react";

export function EmblemaStatusPublicacao({
  status,
}: {
  status: StatusPublicacao;
}) {
  const Icone =
    status === "success"
      ? CheckCircle2
      : status === "failed"
        ? AlertTriangle
        : status === "waiting"
          ? Clock3
          : RefreshCw;

  return (
    <span className={`publication-status publication-status-${status}`}>
      <Icone
        size={13}
        className={
          status === "publishing" || status === "partial" ? "spin" : ""
        }
      />
      {rotulosStatusPublicacao[status]}
    </span>
  );
}

export function ProgressoPlataforma({
  nome,
  loja,
  status,
  progresso,
}: {
  nome: string;
  loja: "google" | "apple";
  status: StatusPlataformaPublicacao;
  progresso: number;
}) {
  const mostrarProgresso =
    status === "publishing" || status === "building" || status === "review";

  return (
    <div className={`queue-platform queue-platform-${status}`}>
      <span className="queue-platform-icon">
        <LogoLoja loja={loja} tamanho={17} />
      </span>
      <div className="queue-platform-copy">
        <strong>{nome}</strong>
        <small>{rotulosStatusPlataforma[status]}</small>
      </div>
      <div className="queue-platform-progress">
        <span>
          {status === "published"
            ? "100%"
            : mostrarProgresso
              ? `${progresso}%`
              : "—"}
        </span>
        <div className="platform-progress-track">
          <i style={{ width: `${progresso}%` }} />
        </div>
      </div>
    </div>
  );
}
