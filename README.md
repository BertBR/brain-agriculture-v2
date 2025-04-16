# 🌾 API de Produtores Rurais

API RESTful desenvolvida com **NestJS**, **PostgreSQL** e **Prisma** para gerenciar o cadastro de produtores rurais, suas propriedades e culturas plantadas

---

## 📋 Funcionalidades

- Cadastro, edição e exclusão de **produtores rurais**
- Registro de **fazendas** associadas aos produtores
- Validação de **CPF/CNPJ**
- Cadastro de **culturas por safra**
- Regras de negócio robustas:
  - Soma da **área agricultável + vegetação** não pode ultrapassar a **área total**
  - Produtor pode ter **várias propriedades**
  - Propriedade pode conter **várias culturas por safra**

---

## 🛠️ Tecnologias

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Docker + Docker Compose](https://www.docker.com/)
- [Jest](https://jestjs.io/) para testes
- [Swagger/OpenAPI](https://swagger.io/specification/) para documentação da API

---

## 📦 Instalação e uso

### 🐳 Usando Docker

```bash
# Build e start dos containers
docker-compose up --build
```

### Acesso

- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Banco de dados: PostgreSQL disponível em `localhost:5432`

---

## 🔎 Endpoints principais

> Para ver todos os endpoints, acesse o Swagger.

- `GET /producers` – Lista todos os produtores
- `POST /producers` – Cria um novo produtor
- `PUT /producers/:id` – Atualiza um produtor
- `DELETE /producers/:id` – Remove um produtor

---

## ✅ Regras de negócio implementadas

- 🔒 Validação de CPF ou CNPJ conforme formato e dígito verificador
- 🧠 Garantia de integridade nas áreas da fazenda
- 🧩 Relacionamento entre produtor ➜ fazendas ➜ culturas
- 📈 Dados agregados por estado, uso do solo e tipo de cultura

---

## 🧪 Testes

```bash
# Executar testes unitários e de integração
npm run test
```

- Testes escritos com **Jest**
- Cobertura de testes em regras de negócio e validações
- Mock de dados para ambientes de teste

---

## 📊 Observabilidade

- Logs estruturados via `Logger` do NestJS
- Controle de exceções com filtros personalizados
- Validações com mensagens claras usando `class-validator`

---

## 📁 Estrutura do Projeto

```bash
src/
├── producers/        # Módulo de produtores
├── farms/            # Módulo de propriedades
├── crops/            # Módulo de culturas/safras
├── common/           # Validadores, utils, middlewares
└── main.ts           # Bootstrap da aplicação
```

---

## 📃 Documentação

- 📄 OpenAPI disponível via Swagger: `http://localhost:3000/api`
- ✍️ API Contracts definidos por DTOs com `class-validator`

---

## ☁️ Implantação (opcional)

> A aplicação pode ser facilmente implantada em serviços como **Render**, **Railway**, **Fly.io**, **Heroku**, etc.
Live demo: https://brain-agriculture-v2.fly.dev/api/docs

---

## 📌 Requisitos

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 13+
- Prisma CLI

---

## 🤝 Contribuições

Sinta-se à vontade para abrir issues, pull requests ou sugestões de melhoria!

---

## 📄 Licença

Projeto desenvolvido para fins educacionais seguindo os princípios de **Clean Code**, **KISS** e **SOLID**.

---