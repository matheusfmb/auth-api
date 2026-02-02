# Auth API 🔐

Este projeto é uma API robusta de autenticação e gerenciamento de usuários, desenvolvida com **Node.js** e **TypeScript**. O principal objetivo é servir como um portfólio técnico, demonstrando a aplicação de boas práticas de engenharia de software, como **Clean Architecture**, **SOLID** e design patterns.

## 🚀 Tecnologias e Ferramentas

O projeto utiliza uma stack moderna e robusta para garantir escalabilidade e manutenibilidade:

- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Node.js)
- **Framework Web:** [Express.js](https://expressjs.com/)
- **Arquitetura:** Clean Architecture (Camadas de Domínio, Caso de Uso, Infraestrutura e Apresentação)
- **Banco de Dados:**
  - Relacional: [PostgreSQL](https://www.postgresql.org/)
  - Cache/Sessão: [Redis](https://redis.io/)
- **Autenticação:** JWT (JSON Web Tokens)
- **Containerização:** [Docker](https://www.docker.com/) & Docker Compose
- **Testes:** [Jest](https://jestjs.io/)

## 🏗️ Estrutura do Projeto (Clean Architecture)

O código foi organizado seguindo os princípios da Clean Architecture para desacoplar as regras de negócio de frameworks e ferramentas externas:

- **src/main/core:** Contém as **Entidades** e **Casos de Uso** (Regras de negócio puras).
- **src/main/infra:** Implementações concretas de interfaces (Repositórios de Banco de Dados, Adaptadores de JWT, FileSystem, etc.).
- **src/main/presentation:** Camada de entrega (Controllers, Routers, Middlewares, Configurações HTTP).

## 📦 Como rodar o projeto

### Pré-requisitos
- Node.js (v14+)
- Docker e Docker Compose

### Passo a passo
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/auth-api.git
   cd auth-api
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie os serviços de infraestrutura (Banco de dados e Cache):**
   ```bash
   docker-compose -f docker-compose-db.yml up -d
   ```

4. **Execute a aplicação em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A API estará rodando em `http://localhost:8100` (ou a porta definida no seu `.env`).

5. **Para buildar e rodar com Docker (Aplicação completa):**
   ```bash
   docker-compose up -d
   ```

## 🧪 Testes

O projeto possui testes unitários configurados para o AuthMiddleware com Jest. Para executá-los:

```bash
npm run test
# ou
npm run test:watch
```

## 🛠️ Rotas Principais

A API expõe rotas para as seguintes funcionalidades:

- **Autenticação (`/auth`):**
  - `POST /login`: Autentica as credenciais do usuário e retorna um `accessToken` JWT e refreshToken nos cookies.

- **Usuários (`/users`):**
  - `POST /create`: Rota pública para registro de novos usuários no sistema.
  - `GET /:userID`: Rota protegida que retorna os dados de um usuário específico.
    - **Middleware de Autenticação:** Esta rota implementa o middleware que valida o token de acesso e, transparentemente, realiza o *refresh* do token caso necessário, garantindo segurança e fluidez na sessão.

## 🔍 Observabilidade e Segurança

- **Cookies e tokens:** Como o repositório é de portfólio, o `refreshToken` permanece com `secure: false` para facilitar os testes locais. Em produção, a configuração prevista inclui `secure: true`, `sameSite=strict` ou `sameSite=lax`  e política de rotação controlada.
- **Variáveis sensíveis:** Segredos e chaves JWT não estão versionados em `.env` por escolha deliberada. Em um ambiente real, os valores seriam injetados via variáveis de ambiente.

## 🗓️ Para Implementar

- **Observabilidade com OpenTelemetry:** Exportar métricas e traces (ex.: fluxo de `POST /auth/login` e `AuthMiddleware`) para facilitar troubleshooting e demonstrar rastreabilidade.
- **Rate limiting:** Adicionar um rate limiter baseado em Redis/`express-rate-limit` para proteger endpoints sensíveis contra brute force e abuso.

## 📝 Autor

Desenvolvido por **Matheus Barros**.

---
*Este projeto é destinado a fins de estudo e portfólio.*
