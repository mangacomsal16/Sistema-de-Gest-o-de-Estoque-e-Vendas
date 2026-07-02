import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Boxes, LogIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../services/api';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-white lg:flex"
      >
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-400 shadow-glow">
            <Boxes size={22} />
          </div>
          <span className="font-display text-lg font-bold">Estoque &amp; Vendas</span>
        </div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-3xl font-bold leading-tight"
          >
            Gestão completa do seu negócio em um só lugar.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 max-w-md text-slate-400"
          >
            Controle de estoque, registro de vendas e indicadores em tempo real — pensado para pequenas e médias empresas.
          </motion.p>
          <motion.img
            src="/media/login-hero.png"
            alt=""
            className="mt-8 h-56 w-56 object-contain opacity-90"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.9, scale: 1, y: [0, -12, 0] }}
            transition={{ opacity: { duration: 0.8, delay: 0.4 }, scale: { duration: 0.8, delay: 0.4 }, y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 } }}
          />
        </div>

        <p className="relative z-10 text-xs text-slate-500">© {new Date().getFullYear()} Estoque &amp; Vendas</p>
      </motion.div>

      {/* Formulário */}
      <div className="flex items-center justify-center bg-slate-100/60 p-6 dark:bg-transparent">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="glass w-full max-w-sm rounded-2xl bg-white/80 p-8 shadow-pop dark:bg-slate-900/70"
        >
          <motion.h1 variants={item} className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
            Bem-vindo de volta
          </motion.h1>
          <motion.p variants={item} className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Entre para acessar o painel.
          </motion.p>

          <div className="mt-6 grid gap-4">
            <motion.div variants={item}>
              <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </motion.div>
            <motion.div variants={item}>
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </motion.div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10"
              >
                {error}
              </motion.p>
            )}
            <motion.div variants={item}>
              <Button loading={loading} onClick={handleSubmit} className="w-full">
                <LogIn size={17} /> Entrar
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
