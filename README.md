# Sistema de Gestão de Estoque e Vendas

Aplicação full-stack para controle de estoque e registro de vendas, pensada como um MVP
real para pequenas e médias empresas. Inclui dashboard com indicadores, CRUD completo de
produtos com busca/filtro/paginação, registro de vendas com baixa automática de estoque e
histórico.

## Stack

| Camada      | Tecnologia                                              |
|-------------|---------------------------------------------------------|
| Frontend    | React + TypeScript + Vite, Tailwind CSS, Recharts       |
| Estado      | TanStack Query (dados de servidor) + Context API (auth) |
| Backend     | Node.js + Express + TypeScript                          |
| Banco       | PostgreSQL                                              |
| ORM         | Prisma                                                  |
| Autenticação| JWT + bcrypt                                            |

## Estrutura

```
estoque-vendas/
├── client/                 # Aplicação React
│   └── src/
│       ├── components/      # UI, layout e componentes de cada módulo
│       ├── pages/           # Login, Dashboard, Produtos, Vendas
│       ├── services/        # Camada de acesso à API (axios)
│       ├── hooks/           # Hooks de dados (TanStack Query)
│       ├── context/         # Autenticação e notificações
│       ├── lib/             # Formatação, query client, helpers
│       └── types/           # Tipos compartilhados
└── server/                 # API Express
    ├── prisma/             # schema.prisma + seed
    └── src/
        ├── controllers/    # Recebem a requisição e validam (Zod)
        ├── services/       # Regras de negócio + acesso ao banco
        ├── routes/         # Definição das rotas
        ├── middleware/     # Auth, validação, tratamento de erros
        ├── config/         # Variáveis de ambiente
        ├── lib/            # Instância do Prisma
        └── utils/          # AppError, asyncHandler
```

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+ (ou Docker, para subir o banco com um comando)

## Como rodar

### 1. Banco de dados

Com Docker (recomendado):

```bash
docker compose up -d
```

Sem Docker: crie um banco `estoque_vendas` no seu PostgreSQL e ajuste a `DATABASE_URL`
em `server/.env`.

### 2. Backend

```bash
cd server
cp .env.example .env        # ajuste as variáveis se necessário
npm install
npm run prisma:migrate      # cria as tabelas
npm run prisma:seed         # popula categorias, produtos e vendas de exemplo
npm run dev                 # API em http://localhost:4000
```

### 3. Frontend

```bash
cd client
npm install
npm run dev                 # app em http://localhost:5173
```

> Atalho: a partir da raiz, após instalar as dependências de cada pacote, você pode usar
> `npm run db:setup` (migrate + seed) e `npm run dev` (sobe API e frontend juntos).

### 4. Acesso

Abra http://localhost:5173. As credenciais de demonstração já vêm preenchidas:

```
E-mail: admin@estoque.com
Senha:  admin123
```

## Por que a interface já nasce completa

O seed do banco gera 6 categorias, 24 produtos (com casos de estoque baixo e esgotado) e
dezenas de vendas distribuídas nos últimos 14 dias. Assim, no primeiro acesso o dashboard
já exibe faturamento, gráficos preenchidos, indicadores de estoque, últimas vendas e a
tabela de produtos populada — sem depender de nenhuma interação inicial.

## API (resumo)

| Método | Rota                  | Descrição                                  |
|--------|-----------------------|--------------------------------------------|
| POST   | `/api/auth/login`     | Autenticação (retorna token JWT)           |
| GET    | `/api/auth/me`        | Dados do usuário autenticado               |
| GET    | `/api/dashboard/stats`| Indicadores e dados dos gráficos           |
| GET    | `/api/products`       | Lista com busca, filtro e paginação        |
| POST   | `/api/products`       | Cria produto                               |
| PUT    | `/api/products/:id`   | Atualiza produto                           |
| DELETE | `/api/products/:id`   | Remove (lógico) produto                     |
| GET    | `/api/categories`     | Lista categorias                           |
| GET    | `/api/sales`          | Histórico paginado de vendas               |
| POST   | `/api/sales`          | Registra venda (baixa de estoque atômica)  |

Todas as rotas, exceto o login, exigem o header `Authorization: Bearer <token>`.

## Decisões de arquitetura

- **Camadas no backend**: `routes → controllers → services`. Controllers cuidam de
  validação (Zod) e resposta HTTP; services concentram a regra de negócio e o acesso ao
  banco, ficando fáceis de testar e reaproveitar.
- **Vendas transacionais**: a criação de venda roda dentro de `prisma.$transaction`,
  validando e dando baixa no estoque de forma atômica — sem risco de vender além do
  disponível.
- **Remoção lógica de produtos**: produtos são desativados (`active = false`) em vez de
  apagados, preservando a integridade do histórico de vendas.
- **Estado no frontend**: TanStack Query cuida de cache, revalidação e estados de
  carregamento; mutações invalidam as queries afetadas, mantendo dashboard, produtos e
  vendas sempre sincronizados.
