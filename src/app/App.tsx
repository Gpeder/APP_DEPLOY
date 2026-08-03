import { Estrutura } from "@/components/layout/estrutura";
import { Toaster } from "@/components/ui/sonner";
import { ProvedorAplicativos } from "@/providers/provedor-aplicativos";
import { ProvedorPublicacoes } from "@/providers/provedor-publicacoes";
import { Aplicativos } from "@/pages/aplicativos";
import { Configuracoes } from "@/pages/configuracoes";
import { Fila } from "@/pages/fila";
import { Historico } from "@/pages/historico";
import { NovaPublicacao } from "@/pages/nova-publicacao";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <ProvedorAplicativos>
      <ProvedorPublicacoes>
        <BrowserRouter>
          <Routes>
            <Route element={<Estrutura />}>
              <Route index element={<Navigate to="/fila" replace />} />
              <Route path="historico" element={<Historico />} />
              <Route path="fila" element={<Fila />} />
              <Route path="nova-publicacao" element={<NovaPublicacao />} />
              <Route path="aplicativos" element={<Aplicativos />} />
              <Route path="configuracoes" element={<Configuracoes />} />

              <Route path="*" element={<Navigate to="/fila" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <Toaster />
      </ProvedorPublicacoes>
    </ProvedorAplicativos>
  );
}

export default App;
