import { useState } from "react";
import { ImageOff, Menu, PanelLeft, X } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { linksNavegacao } from "@/config/navegacao";

export function Estrutura() {
  const localizacao = useLocation();
  const [menuMovelAberto, definirMenuMovelAberto] = useState(false);
  const [barraLateralRecolhida, definirBarraLateralRecolhida] = useState(false);
  const [falhaLogo, definirFalhaLogo] = useState(false);

  const nomePaginaAtual =
    linksNavegacao.find((link) => link.to === localizacao.pathname)?.label ??
    "Publicações";

  return (
    <div className={`shell ${barraLateralRecolhida ? "sidebar-collapsed" : ""}`}>
      {menuMovelAberto && (
        <div
          className="sidebar-backdrop"
          onClick={() => definirMenuMovelAberto(false)}
        />
      )}

      {/*colocar a logo da empresa depois */}
      <aside className={`sidebar ${menuMovelAberto ? "sidebar-open" : ""}`}>
        <div className="brand">
          {falhaLogo ? (
            <span className="brand-icon" title="Logo indisponível">
              <ImageOff size={20} />
            </span>
          ) : (
            <img
              src="/logo-empresa.png"
              alt="Logo da empresa"
              className="brand-icon store-logo"
              onError={() => definirFalhaLogo(true)}
            />
          )}

          <div>
            <strong>Publicações</strong>
            <span>Google Play e App Store</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => definirMenuMovelAberto(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav>
          {linksNavegacao.map(({ to, label, icon: Icone }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => definirMenuMovelAberto(false)}
              title={barraLateralRecolhida ? label : undefined}
            >
              <Icone size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <div className="topbar">
          <button
            className="menu-button"
            onClick={() => definirMenuMovelAberto(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <button
            className="sidebar-toggle"
            onClick={() => definirBarraLateralRecolhida((atual) => !atual)}
            aria-label={
              barraLateralRecolhida
                ? "Expandir menu lateral"
                : "Recolher menu lateral"
            }
            aria-expanded={!barraLateralRecolhida}
            title={barraLateralRecolhida ? "Expandir menu" : "Recolher menu"}
          >
            <PanelLeft size={18} />
          </button>
          <div className="crumb">{nomePaginaAtual}</div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
