# 🤝 Equaly - Plataforma de Inclusão Digital para PCD

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Sobre o Projeto

**Equaly** é uma plataforma inovadora desenvolvida para conectar **Pessoas com Deficiência (PCD)** com oportunidades de emprego, eliminando barreiras de acessibilidade e promovendo inclusão genuína no mercado de trabalho.

O projeto vai muito além de um simples portal de vagas: implementa recursos avançados de **acessibilidade**, permite que empresas mapeiem e identifiquem barreiras no ambiente de trabalho, e oferece um espaço seguro e preparado para que PCDs possam desenvolver sua carreira profissional.

### 🎯 Missão

Transformar o acesso ao mercado de trabalho para pessoas com deficiência, criando uma ponte entre talentos e oportunidades inclusivas.

### ✨ Diferenciais

- 🔍 **Mapeamento de Barreiras**: Empresas identificam e documentam limitações de acessibilidade
- ♿ **Acessibilidade em Primeiro Lugar**: Interface totalmente acessível com barra de ferramentas inclusiva
- 📄 **Gestão de Candidaturas**: Sistema completo de aplicação e acompanhamento de vagas
- 🏢 **Perfil Empresarial**: Empresas mostram seu compromisso com inclusão
- 👤 **Perfil do PCD**: Destaque de competências, experiências e necessidades de acessibilidade
- 📤 **Upload de Currículos**: Armazenamento seguro e organizado de documentos

---

## 🏗️ Arquitetura

```
Equaly/
├── BackEnd/              # API REST com Node.js + Express + Prisma
├── pcd-frontend/         # Interface com Next.js + React + Tailwind CSS
├── docker-compose.yml    # Configuração de produção
└── docker-compose.dev.yml # Ambiente de desenvolvimento
```

### Stack Tecnológico

#### 🔧 Backend

- **Node.js 20** - Runtime JavaScript escalável
- **Express 5** - Framework web minimalista
- **Prisma 6** - ORM type-safe para TypeScript
- **PostgreSQL 16** - Banco de dados robusto
- **JWT** - Autenticação segura

#### 💻 Frontend

- **Next.js 16** - Framework React com SSR
- **React 19** - UI library moderna
- **Tailwind CSS** - Estilização utilitária
- **TypeScript** - Tipagem estática

#### 🐳 DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração local

---

## 🚀 Como Começar

### 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Git

### 🏃 Quickstart

```bash
# Clone o repositório
git clone https://github.com/RaFaSMK/PI-Equaly.git
cd PI-Equaly

# Modo Desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up -d

# Modo Produção
docker-compose up -d --build
```

Acessar a aplicação:

- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:3333/api
- 🗄️ **Database**: localhost:5432

### 📚 Documentação de Desenvolvimento

```bash
# Ver status dos containers
docker-compose ps

# Acessar shell do backend
docker exec -it pcd-backend-dev sh

# Executar migrations
docker exec -it pcd-backend-dev npx prisma migrate dev

# Ver logs em tempo real
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 📊 Módulos Principais

### 🔐 Autenticação

- Login e registro de usuários
- Autenticação com JWT
- Diferenciação de perfis (PCD, Empresa, Admin)

### 👤 Perfil PCD

- Gerenciamento de informações pessoais
- Upload de foto e currículo
- Documentação de necessidades de acessibilidade
- Histórico de candidaturas

### 🏢 Perfil Empresa

- Cadastro e validação com CNPJ
- Publicação de vagas com detalhes de acessibilidade
- Identificação de barreiras arquitetônicas
- Gerenciamento de candidatos

### 💼 Gestão de Vagas

- Criação de oportunidades inclusivas
- Detalhe de requisitos e acessibilidades oferecidas
- Sistema de candidatura integrado
- Acompanhamento de candidatos

### ♿ Recursos de Acessibilidade

- Tipos de deficiências categorizadas
- Barreiras de acessibilidade mapeadas
- Acessibilidades disponíveis documentadas
- Barra de acessibilidade na interface (contraste, zoom, etc.)

---

## 💾 Banco de Dados

Estrutura bem definida com Prisma para:

- Usuários e autenticação
- Empresas e vagas
- Candidaturas e histórico
- Barreiras e acessibilidades
- Upload de arquivos

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Para começar:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT - veja detalhes na documentação.

---

## 🙌 Agradecimentos

Desenvolvido com ❤️ para promover inclusão digital e igualdade de oportunidades.

Acredita na importância de tecnologia acessível? Conecte-se comigo no LinkedIn e vamos transformar vidas juntos!

---

## 📞 Contato

- 💼 [LinkedIn](https://linkedin.com)
- 🐙 [GitHub](https://github.com/RaFaSMK/PI-Equaly)
- 📧 Entre em contato para parcerias e dúvidas

---

**Equaly**: Porque inclusão não é opcional, é fundamental.
