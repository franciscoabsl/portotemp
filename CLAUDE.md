# Portotemp

SaaS multi-tenant de gestão de aluguel por temporada.

## Repositório e Deploy

- **Repo:** `github.com/franciscoabsl/portotemp` (branch `main`)
- **Frontend:** `https://portotemp.franciscosouzalima.dev`
- **API:** `https://api.portotemp.franciscosouzalima.dev`
- **Monorepo:** `portotemp-api/` + `portotemp-web/`

---

## Stack

### Backend — `portotemp-api/`
- Java 21 + Spring Boot 3
- Spring Security + JWT
- Spring Data JPA + Hibernate
- PostgreSQL 16
- Flyway (migrações)
- Maven (`mvnw`)

### Frontend — `portotemp-web/`
- React + Vite
- Tailwind CSS v3
- Zustand (store)
- Axios (api/)
- React Router (routes/)

### Design System
- Fonte: **DM Sans**
- Primary: **teal** (`#0d9488`)
- Accent: **amber**

---

## Estrutura do Frontend

```
src/
├── api/          # chamadas HTTP (Axios)
├── assets/       # imagens, ícones
├── components/   # componentes reutilizáveis
├── hooks/        # custom hooks
├── layouts/      # layouts de página
├── pages/        # páginas por módulo
├── routes/       # definição de rotas
├── store/        # Zustand stores
└── utils/        # helpers e utilitários
```

---

## Banco de Dados — Tabelas

| Tabela | Descrição |
|---|---|
| `tenant` | Escritórios/clientes (multi-tenant) |
| `usuario` | Usuários do sistema com role |
| `imovel` | Imóveis cadastrados |
| `proprietario` | Proprietários dos imóveis |
| `prestador` | Prestadores de serviço (tenant-scoped, não por imóvel) |
| `reserva` | Reservas de hóspedes |
| `hospede` | Hóspedes das reservas |
| `cancelamento` | Cancelamentos de reservas |
| `limpeza` | Limpezas agendadas |
| `lavanderia` | Itens de lavanderia (opcional, lançamento manual) |
| `despesa` | Despesas por imóvel |
| `fechamento` | Fechamento mensal (competência = mês de checkout) |
| `fechamento_item` | Itens do fechamento |
| `template_mensagem` | Templates de mensagens WhatsApp |
| `audit_log` | Log de auditoria de ações |
| `flyway_schema_history` | Histórico de migrações |

### Regras de negócio importantes
- **Multi-tenant:** todo dado é isolado por `tenant_id`
- **Fechamento mensal:** competência é o mês de checkout (não de check-in); comissão calculada sobre bruto ou líquido por imóvel
- **Prestadores:** scoped por tenant, não por imóvel
- **Lavanderia:** opcional, lançamento manual (não automático)
- **Limpezas:** podem ser iniciadas automaticamente ou manualmente

---

## Módulos (v1)

1. **Imóveis** — cadastro e gestão de imóveis
2. **Proprietários** — cadastro de proprietários
3. **Prestadores** — fornecedores de serviço (faxina, manutenção, etc.)
4. **Reservas** — gestão de reservas e hóspedes
5. **Cancelamentos** — registro e controle de cancelamentos
6. **Limpezas** — agendamento e controle de limpezas
7. **Lavanderia** — lançamento manual de itens de lavanderia
8. **Despesas** — despesas por imóvel
9. **Fechamento Mensal** — fechamento financeiro por competência
10. **Calendário Limpeza PDF** — exportação em PDF
11. **Templates WhatsApp** — mensagens pré-configuradas
12. **Dashboard** — visão geral do negócio
13. **Usuários + Roles** — gestão de acesso
14. **Auditoria** — log de ações do sistema

---

## Variáveis de Ambiente (`.env.prod`)

```env
# Postgres
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

# Spring
SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
SPRING_JPA_HIBERNATE_DDL_AUTO=
JWT_SECRET=
CORS_ALLOWED_ORIGINS=
SPRING_FLYWAY_OUT_OF_ORDER=
```

> ⚠️ Nunca commitar o `.env.prod`. Criar manualmente na VPS após o primeiro clone.

---

## Usuários de acesso

| Email | Senha | Tenant | Role |
|---|---|---|---|
| `francisco@portotemp.com` | `123@Novidade` | Francisco Lima | ADMIN |
| `demo@portotemp.com` | `Demo@2024` | Demo Portotemp | ADMIN |

> O usuário `demo` está em um tenant isolado para testes e demonstrações.

---

## Comandos

### Backend
```bash
cd portotemp-api
./mvnw spring-boot:run                    # rodar localmente
./mvnw clean package -DskipTests          # build
./mvnw test                               # testes
```

### Frontend
```bash
cd portotemp-web
npm install
npm run dev                               # rodar localmente
npm run build                             # build produção
```

### Docker (produção)
```bash
cd ~/apps/sites/portotemp
docker compose -f docker-compose.prod.yml up -d --build   # subir
docker compose -f docker-compose.prod.yml down            # parar
docker logs portotemp_api -f --tail=100                   # logs API
docker logs portotemp_web -f --tail=100                   # logs Web
```

---

## CI/CD

- **Trigger:** push na branch `main`
- **Host alias VPS:** `github-portotemp`
- **Processo:** git pull → docker compose -f docker-compose.prod.yml up -d --build
- **Secrets:** `VPS_HOST`, `VPS_USER`, `SSH_PRIVATE_KEY`, `SSH_PORT`

---

## Próximos passos (v1 — em andamento)

- [ ] **Autenticação multi-tenant** — próximo passo prioritário
- [ ] Popular tenant Demo com dados fictícios para demonstração

---

## Convenções

- Commits por feature concluída
- Migrações Flyway para qualquer alteração no schema
- `SPRING_FLYWAY_OUT_OF_ORDER=true` habilitado em prod
- Nunca usar `ddl-auto=create` ou `update` em produção
- CORS configurado via `CORS_ALLOWED_ORIGINS` no `.env.prod`
