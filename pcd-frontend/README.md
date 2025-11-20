## EQualy Frontend (Next.js)

Frontend simples e acessível para o backend Projeto-PI. Estilo aplicado via classes do Tailwind diretamente nos componentes, seguindo a cor roxa `#755fe3`.

### Pré-requisitos

- Node 18+
- Backend rodando em `http://localhost:3333` (ou ajuste o `.env.local`).

### Configuração

1. Copie o arquivo de exemplo de variáveis:

```bash
cp .env.local.example .env.local
```

2. Ajuste `NEXT_PUBLIC_API_URL` no `.env.local` se necessário (padrão: `http://localhost:3333/api`).

### Rodando em desenvolvimento

```bash
pnpm dev
# ou
npm run dev
```

Abra http://localhost:3000

### Páginas principais

- `/` Landing com CTA para candidatos e empresas
- `/login` Login
- `/cadastro/pcd` Cadastro de candidato PCD
- `/vagas` Lista de vagas
- `/vagas/[id]` Detalhe da vaga e botão de candidatura (PCD logado)
- `/dashboard` Painel do PCD (candidaturas e upload de currículo)

### Notas

- Upload de currículo usa o endpoint `POST /api/pcd/:id/curriculo` com o campo `curriculo` (PDF). O ID do PCD é salvo após o cadastro e também pode ser inferido após a primeira candidatura.
- Sem estilos customizados no CSS: toda estilização está em classes Tailwind dentro dos componentes.
