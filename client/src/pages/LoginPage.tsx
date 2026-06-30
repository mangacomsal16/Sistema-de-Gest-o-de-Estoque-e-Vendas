import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, LogIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../services/api';

// Credenciais de demonstração já preenchidas para acesso imediato.
export function LoginPage() {
  const [email, setEmail] = useState('admin@estoque.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(getApiError(err, 'Não foi possível entrar.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel de marca */}
      <div className="relative hidden flex-col justify-between bg-sidebar p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-400">
            <Boxes size={22} />
          </div>
          <span className="text-lg font-semibold">Estoque &amp; Vendas</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Gestão completa do seu negócio em um só lugar.</h2>
          <p className="mt-4 max-w-md text-slate-400">
            Controle de estoque, registro de vendas e indicadores em tempo real — pensado para pequenas e médias empresas.
          </p>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} Estoque &amp; Vendas</p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-card">
          <h1 className="text-2xl font-bold text-slate-800">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-slate-500">Entre para acessar o painel.</p>

          <div className="mt-6 grid gap-4">
            <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <Button loading={loading} onClick={handleSubmit} className="w-full">
              <LogIn size={17} /> Entrar
            </Button>
          </div>

          <div className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <b className="text-slate-600">Acesso de demonstração</b>
            <br />
            admin@estoque.com · admin123
          </div>
        </div>
      </div>
    </div>
  );
}
