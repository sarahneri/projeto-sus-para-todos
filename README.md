# SUS Para Todos - Sistema de Agendamento de Consultas

Sistema de agendamento de consultas e exames médicos para os hospitais de São Caetano do Sul.

## 📋 Requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **PostgreSQL** (versão 14 ou superior) - [Download](https://www.postgresql.org/download/)
- **Git** (opcional, para clonar o repositório) - [Download](https://git-scm.com/)

## 🚀 Instalação e Configuração

### 1. Baixar o Projeto

**Opção A - Com Git:**
```bash
git clone <url-do-repositorio>
cd sus-para-todos
```

**Opção B - Download Manual:**
- Baixe o projeto como ZIP
- Extraia em uma pasta de sua preferência
- Abra o terminal/prompt nessa pasta

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Banco de Dados

#### No Windows:
1. Abra o pgAdmin ou prompt do PostgreSQL
2. Crie um novo banco de dados:
```sql
CREATE DATABASE sus_para_todos;
```

#### No Linux/macOS:
```bash
sudo -u postgres psql
CREATE DATABASE sus_para_todos;
\q
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Banco de Dados
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/sus_para_todos

# Sessão (gere uma string aleatória segura)
SESSION_SECRET=sua_chave_secreta_aqui_muito_longa_e_aleatoria

# OpenAI (Opcional - para gerar imagens com IA)
OPENAI_API_KEY=sk-seu-token-aqui
```

**Exemplo para Windows (usuário padrão postgres):**
```env
DATABASE_URL=postgresql://postgres:senha123@localhost:5432/sus_para_todos
SESSION_SECRET=minha-chave-super-secreta-123456789
```

**Exemplo para Linux/macOS:**
```env
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/sus_para_todos
SESSION_SECRET=minha-chave-super-secreta-123456789
```

### 5. Criar Tabelas no Banco de Dados

```bash
npm run db:push
```

Este comando criará automaticamente todas as tabelas necessárias (hospitals, specialties, appointments, news).

### 6. Popular Dados Iniciais (Opcional)

Se quiser adicionar dados de exemplo, você pode usar o seguinte SQL:

```sql
-- Inserir hospitais
INSERT INTO hospitals (id, name, address, phone) VALUES
('3794464a-2e7b-4342-b69e-f42a144860a8', 'Hospital Municipal de São Caetano', 'Rua Principal, 123', '(11) 4000-0000'),
('f8e9a5b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'UPA Central', 'Av. Central, 456', '(11) 4000-1111');

-- Inserir especialidades
INSERT INTO specialties (id, name) VALUES
('965f979f-e56e-4adc-9ef4-b8e751db8d5d', 'Cardiologia'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Ortopedia'),
('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Pediatria');
```

## ▶️ Executar o Projeto

### Modo Desenvolvimento (recomendado)

```bash
npm run dev
```

O servidor iniciará em: **http://localhost:5000**

### Modo Produção

```bash
npm run build
npm start
```

## 🌐 Acessar o Sistema

1. Abra seu navegador (Chrome, Firefox, Edge, Safari)
2. Acesse: **http://localhost:5000**
3. Você verá a tela de login do sistema

## 📱 Compatibilidade

O sistema funciona em:
- ✅ **Windows** (10, 11)
- ✅ **Linux** (Ubuntu, Debian, Fedora, etc.)
- ✅ **macOS** (Catalina ou superior)

E pode ser acessado por:
- 🖥️ Computadores (todos os navegadores modernos)
- 📱 Smartphones (iOS Safari, Android Chrome)
- 📲 Tablets (iPad, Android)

## 🛠️ Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Executar versão de produção
npm start

# Atualizar estrutura do banco de dados
npm run db:push

# Atualizar estrutura do banco (forçar)
npm run db:push --force
```

## 📂 Estrutura do Projeto

```
sus-para-todos/
├── client/              # Frontend React
│   └── src/
│       ├── components/  # Componentes reutilizáveis
│       ├── pages/       # Páginas da aplicação
│       └── lib/         # Utilitários
├── server/              # Backend Express
│   ├── routes.ts        # Rotas da API
│   └── storage.ts       # Camada de dados
├── shared/              # Código compartilhado
│   └── schema.ts        # Schemas do banco de dados
└── .env                 # Variáveis de ambiente (você cria)
```

## 🔧 Solução de Problemas

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme usuário e senha no arquivo `.env`
- Verifique se o banco `sus_para_todos` foi criado

### Porta 5000 já em uso
Edite o arquivo `server/index.ts` e altere a porta:
```typescript
const PORT = process.env.PORT || 3000; // mude de 5000 para 3000
```

### Erro ao instalar dependências
```bash
# Limpe o cache do npm
npm cache clean --force
# Tente novamente
npm install
```

## 📧 Suporte

Para dúvidas ou problemas:
- Verifique se todos os requisitos estão instalados
- Confirme que o arquivo `.env` está configurado corretamente
- Certifique-se de que o PostgreSQL está rodando

## 📄 Licença

Sistema desenvolvido para São Caetano do Sul - Todos os direitos reservados.
