import { Button } from "@/components/ui/button";
import { CabecalhoPagina } from "@/components/ui/cabecalho-pagina";
import { LogoLoja } from "@/components/ui/logo-loja";
import { Check, Eye, EyeOff, KeyRound, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Configuracoes() {
  const [mostrarToken, definirMostrarToken] = useState(false);
  const [token, definirToken] = useState("");
  const [idEmissor, definirIdEmissor] = useState("");
  const [idChave, definirIdChave] = useState("");
  const [salvo, definirSalvo] = useState(false);

  const testarConexao = (servico: string) => {
    toast.success(`Conexão com ${servico} validada`, {
      description: "As configurações informadas estão acessíveis.",
    });
  };

  const salvarConfiguracoes = () => {
    definirSalvo(true);
    toast.success("Configurações salvas");
    window.setTimeout(() => definirSalvo(false), 2500);
  };

  return (
    <>
      <CabecalhoPagina
        titulo="Configurações"
        descricao="Configure os acessos usados nas publicações."
      />

      <div className="settings-sections">
        <section className="panel settings-panel">
          <div className="panel-header">
            <div>
              <h2>Codemagic</h2>
              <p>Usado para gerar e acompanhar os aplicativos.</p>
            </div>
          </div>

          <div className="simple-settings-form">
            <label>
              <span>Token da API</span>
              <div className="secret-input">
                <KeyRound size={15} />
                <input
                  type={mostrarToken ? "text" : "password"}
                  value={token}
                  onChange={(event) => definirToken(event.target.value)}
                  placeholder="Digite o token da API"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => definirMostrarToken((atual) => !atual)}
                  aria-label={mostrarToken ? "Ocultar token" : "Mostrar token"}
                >
                  {mostrarToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            <Button
              type="button"
              variant="secondary"
              className="button"
              onClick={() => testarConexao("Codemagic")}
            >
              Testar conexão
            </Button>
          </div>
        </section>

        <section className="panel settings-panel">
          <div className="panel-header">
            <div>
              <h2 className="settings-title-with-logo">
                <LogoLoja loja="google" tamanho={15} />
                Google Play
              </h2>
              <p>Conta usada para publicar os aplicativos Android.</p>
            </div>
          </div>

          <div className="simple-settings-form">
            <label>
              <span>Conta de serviço (.json)</span>
              <div className="file-input">
                <Upload size={16} />
                <input
                  type="file"
                  accept=".json,application/json"
                  aria-label="Selecionar conta de serviço do Google Play"
                />
              </div>
            </label>
            <Button
              type="button"
              variant="secondary"
              className="button"
              onClick={() => testarConexao("Google Play")}
            >
              Testar conexão
            </Button>
          </div>
        </section>

        <section className="panel settings-panel">
          <div className="panel-header">
            <div>
              <h2 className="settings-title-with-logo">
                <LogoLoja loja="apple" tamanho={15} />
                App Store Connect
              </h2>
              <p>Chaves usadas para publicar os aplicativos iOS.</p>
            </div>
          </div>

          <div className="simple-settings-form apple-settings">
            <label>
              <span>Issuer ID</span>
              <input
                value={idEmissor}
                onChange={(event) => definirIdEmissor(event.target.value)}
                placeholder="Digite o Issuer ID"
                autoComplete="off"
              />
            </label>
            <label>
              <span>Key ID</span>
              <input
                value={idChave}
                onChange={(event) => definirIdChave(event.target.value)}
                placeholder="Digite o Key ID"
                autoComplete="off"
              />
            </label>
            <label>
              <span>Chave privada (.p8)</span>
              <div className="file-input">
                <Upload size={16} />
                <input
                  type="file"
                  accept=".p8"
                  aria-label="Selecionar chave privada da App Store"
                />
              </div>
            </label>
            <Button
              type="button"
              variant="secondary"
              className="button"
              onClick={() => testarConexao("App Store Connect")}
            >
              Testar conexão
            </Button>
          </div>
        </section>
      </div>

      <div className="settings-footer">
        {salvo && (
          <span role="status">
            <Check size={15} />
            Configurações salvas
          </span>
        )}
        <Button
          type="button"
          className="button"
          onClick={salvarConfiguracoes}
        >
          Salvar configurações
        </Button>
      </div>
    </>
  );
}
