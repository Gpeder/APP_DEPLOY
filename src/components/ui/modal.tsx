import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Modal({
  aoFechar,
  idTitulo,
  children,
  className,
}: {
  aoFechar: () => void;
  idTitulo: string;
  children: ReactNode;
  className?: string;
}) {
  const referenciaModal = useRef<HTMLDivElement>(null);
  const referenciaAoFechar = useRef(aoFechar);

  useEffect(() => {
    referenciaAoFechar.current = aoFechar;
  }, [aoFechar]);

  useEffect(() => {
    const elementoComFoco = document.activeElement as HTMLElement | null;
    referenciaModal.current?.focus();

    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") referenciaAoFechar.current();
    };

    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener("keydown", fecharComEscape);
      elementoComFoco?.focus();
    };
  }, []);

  return (
    <div className="modal-backdrop" onMouseDown={aoFechar}>
      <div
        ref={referenciaModal}
        className={cn("modal", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
