import { useState } from "react";
import {
  Command,
  History,
  ListOrdered,
  Menu,
  PanelLeft,
  Rocket,
  Settings,
  Smartphone,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navigationLinks = [
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/fila", label: "Fila", icon: ListOrdered },
  { to: "/nova-publicacao", label: "Nova publicação", icon: Rocket },
  { to: "/aplicativos", label: "Aplicativos", icon: Smartphone },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const currentPageName =
    navigationLinks.find((link) => link.to === location.pathname)?.label ??
    "Publicações";

  return (
    <div className={`shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {isMobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-icon">
            <Command size={20} />
          </span>
          <div>
            <strong>Publicações</strong>
            <span>Google Play e App Store</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav>
          {navigationLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
              title={isSidebarCollapsed ? label : undefined}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <div className="topbar">
          <button
            className="menu-button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarCollapsed((current) => !current)}
            aria-label={
              isSidebarCollapsed
                ? "Expandir menu lateral"
                : "Recolher menu lateral"
            }
            aria-expanded={!isSidebarCollapsed}
            title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <PanelLeft size={18} />
          </button>
          <div className="crumb">{currentPageName}</div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
