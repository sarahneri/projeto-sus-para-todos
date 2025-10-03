# SUS Para Todos - Sistema de Agendamento de Consultas

Sistema de agendamento de consultas e exames médicos para os hospitais de São Caetano do Sul.

## 📋 Requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **PostgreSQL** (versão 14 ou superior) - [Download](https://www.postgresql.org/download/)
- **Git** (opcional, para clonar o repositório) - [Download](https://git-scm.com/)

### Como Verificar se Já Tenho Instalado?

Abra o terminal (Windows: Prompt de Comando ou PowerShell, Mac/Linux: Terminal) e digite:

```bash
# Verificar Node.js
node --version
# Deve mostrar algo como: v18.x.x ou v20.x.x

# Verificar npm (gerenciador de pacotes do Node)
npm --version
# Deve mostrar algo como: 9.x.x ou 10.x.x

# Verificar PostgreSQL
psql --version
# Deve mostrar algo como: psql (PostgreSQL) 14.x ou superior
```

Se qualquer comando retornar erro "comando não encontrado", você precisa instalar o programa correspondente.

## 🚀 Instalação e Configuração

Siga todos os passos abaixo **na ordem**. Não pule nenhuma etapa!

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

No terminal, dentro da pasta do projeto, execute:

```bash
npm install
```

Este comando vai baixar todas as bibliotecas necessárias. **Aguarde até finalizar** (pode demorar alguns minutos).

Você verá muitas mensagens no terminal - isso é normal! Aguarde até aparecer uma mensagem como "added XXX packages".

### 3. Configurar Banco de Dados

#### 3.1. Iniciar o PostgreSQL

**No Windows:**
1. Abra o menu Iniciar e procure por "Services" (Serviços)
2. Procure por "PostgreSQL" na lista
3. Clique com botão direito e selecione "Start" (Iniciar)
4. Ou simplesmente abra o pgAdmin (ele iniciará o PostgreSQL automaticamente)

**No Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Para iniciar automaticamente
```

**No macOS:**
```bash
brew services start postgresql
```

#### 3.2. Criar o Banco de Dados

**Opção A - Usando pgAdmin (Mais Fácil - Windows):**
1. Abra o pgAdmin (ele foi instalado junto com o PostgreSQL)
2. Conecte-se ao servidor PostgreSQL (pode pedir senha)
3. Clique com botão direito em "Databases"
4. Selecione "Create" → "Database"
5. Digite o nome: `sus_para_todos`
6. Clique em "Save"

**Opção B - Usando Terminal:**

**No Windows (PowerShell ou CMD):**
```bash
# Se estiver usando a senha padrão do postgres
psql -U postgres
# Digite a senha quando solicitado

# Dentro do psql, digite:
CREATE DATABASE sus_para_todos;
# Pressione Enter

# Para sair:
\q
```

**No Linux/macOS:**
```bash
sudo -u postgres psql
CREATE DATABASE sus_para_todos;
\q
```

✅ **Como saber se deu certo?**
- No pgAdmin: você verá o banco "sus_para_todos" na lista de databases
- No terminal: após `CREATE DATABASE`, você verá a mensagem "CREATE DATABASE"

### 4. Configurar Variáveis de Ambiente

Este é um passo **MUITO IMPORTANTE**. Sem este arquivo, o sistema não funcionará!

#### 4.1. Criar o arquivo .env

**No Windows:**
1. Abra o Bloco de Notas (Notepad)
2. Copie o conteúdo abaixo
3. Vá em "Arquivo" → "Salvar Como"
4. Navegue até a pasta do projeto
5. Em "Nome do arquivo", digite: `.env` (com o ponto no início!)
6. Em "Tipo", selecione "Todos os arquivos (*.*)"
7. Clique em "Salvar"

**No Linux/macOS:**
```bash
# Na pasta do projeto, execute:
nano .env
# Cole o conteúdo abaixo, depois pressione Ctrl+X, Y, Enter para salvar
```

**Ou use qualquer editor de código (VS Code, Sublime, etc.):**
- Crie um novo arquivo chamado `.env` na pasta raiz do projeto
- Cole o conteúdo abaixo

#### 4.2. Conteúdo do arquivo .env

**⚠️ IMPORTANTE: Substitua os valores conforme sua configuração!**

```env
# Banco de Dados - MODIFIQUE com sua senha do PostgreSQL
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/sus_para_todos

# Sessão - MODIFIQUE para uma frase secreta qualquer
SESSION_SECRET=minha-frase-super-secreta-e-aleatoria-123456789

# OpenAI (Opcional - deixe comentado se não tiver)
# OPENAI_API_KEY=sk-seu-token-aqui
```

#### 4.3. Como preencher corretamente

**DATABASE_URL** - A URL de conexão com o banco:
- `postgres` = usuário padrão do PostgreSQL (geralmente não precisa mudar)
- `SUA_SENHA_AQUI` = **SUBSTITUA** pela senha que você definiu ao instalar o PostgreSQL
- `localhost:5432` = endereço e porta padrão (não mude)
- `sus_para_todos` = nome do banco que criamos (não mude)

**Exemplos reais:**
```env
# Se sua senha do PostgreSQL é "admin123":
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/sus_para_todos

# Se sua senha do PostgreSQL é "12345":
DATABASE_URL=postgresql://postgres:12345@localhost:5432/sus_para_todos

# Se você não colocou senha (não recomendado):
DATABASE_URL=postgresql://postgres@localhost:5432/sus_para_todos
```

**SESSION_SECRET** - Pode ser qualquer texto longo:
```env
SESSION_SECRET=qualquer-frase-longa-e-aleatoria-aqui-123xyz
```

✅ **Como saber se deu certo?**
- O arquivo `.env` deve estar na pasta raiz do projeto (mesma pasta do `package.json`)
- O arquivo deve começar com um ponto: `.env`
- No Windows Explorer, se não vir o arquivo, ative "Exibir arquivos ocultos"

### 5. Criar Tabelas no Banco de Dados

Agora vamos criar todas as tabelas automaticamente:

```bash
npm run db:push
```

**O que esse comando faz?**
- Cria automaticamente as tabelas: `users`, `hospitals`, `specialties`, `appointments`, `news`, `sessions`
- Configura relacionamentos entre as tabelas
- Define chaves primárias e estrangeiras

**Mensagens que você verá:**
```
✓ Pulling schema from database...
✓ Changes detected in database schema
✓ Applying changes...
✓ Done!
```

✅ **Como saber se deu certo?**
- No terminal, você verá "Done!" sem erros
- No pgAdmin, ao expandir o banco "sus_para_todos" → "Schemas" → "public" → "Tables", você verá várias tabelas

⚠️ **Se der erro:**
```bash
# Tente forçar a sincronização:
npm run db:push --force
```

### 6. Popular Dados Iniciais (Recomendado)

O sistema já vem com 5 hospitais de São Caetano do Sul cadastrados. Mas se precisar adicionar mais dados, você pode:

**Opção 1 - Pelo Sistema (Mais Fácil):**
- Depois de iniciar o sistema, você pode cadastrar hospitais, especialidades e notícias pela interface

**Opção 2 - SQL Direto (Para desenvolvedores):**

Abra o pgAdmin ou terminal psql e execute:

```sql
-- Inserir especialidades médicas
INSERT INTO specialties (id, name) VALUES
('965f979f-e56e-4adc-9ef4-b8e751db8d5d', 'Cardiologia'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Ortopedia'),
('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Pediatria'),
('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Clínica Geral'),
('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'Oftalmologia');
```

## ▶️ Executar o Projeto

Agora sim! Vamos rodar o sistema!

### Passo 1: Abrir o Terminal

- **Windows**: Abra o PowerShell ou Prompt de Comando na pasta do projeto
- **Mac/Linux**: Abra o Terminal na pasta do projeto

### Passo 2: Executar em Modo Desenvolvimento

```bash
npm run dev
```

**O que você verá no terminal:**
```
> sus-para-todos@1.0.0 dev
> tsx watch server/index.ts

VITE v5.x.x ready in XXX ms
➜ Local:   http://localhost:5000/
➜ Network: use --host to expose

Server running on http://localhost:5000
Database connected successfully
```

✅ **Isso significa que tudo funcionou!**

### Passo 3: Abrir no Navegador

1. Abra seu navegador preferido (Chrome, Firefox, Edge, Safari)
2. Na barra de endereços, digite: `http://localhost:5000`
3. Pressione Enter

**Primeira vez:**
- Você verá a tela de **Login**
- Clique em **"Criar conta"** para fazer seu cadastro
- Preencha: Nome, E-mail e Senha (mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial)
- Após criar a conta, você será redirecionado para a página inicial

## 🌐 Usando o Sistema Pela Primeira Vez

### 1. Criar sua Conta

- Na tela de login, clique em **"Criar conta"**
- Preencha seus dados
- A senha deve ter:
  - ✓ Mínimo 8 caracteres
  - ✓ Pelo menos uma letra maiúscula (A-Z)
  - ✓ Pelo menos uma letra minúscula (a-z)
  - ✓ Pelo menos um número (0-9)
  - ✓ Pelo menos um caractere especial (!@#$%^&*)

### 2. Navegar pelo Sistema

Após fazer login, você terá acesso a:

- **🏠 Home** - Página inicial com informações do sistema
- **📅 Agendar** - Fazer novo agendamento de consulta ou exame
- **📋 Meus Agendamentos** - Ver, editar ou cancelar seus agendamentos
- **👤 Meu Perfil** - Editar suas informações pessoais
- **📰 Notícias** - Ler notícias sobre saúde

### 3. Fazer um Agendamento

1. Clique em **"Agendar"** ou **"Começar Agendamento"**
2. Selecione o **hospital**
3. Escolha a **especialidade** médica
4. Escolha o **tipo** (Consulta ou Exame)
5. Selecione a **data** e **hora**
6. Preencha os **dados do paciente**
7. Clique em **"Confirmar Agendamento"**

### 4. Parar o Servidor

Para parar o sistema:
- No terminal onde está rodando, pressione **Ctrl + C**
- Digite **Y** se perguntar
- Ou simplesmente feche o terminal

Para rodar novamente:
```bash
npm run dev
```

## 🚀 Modo Produção (Opcional)

Para rodar em modo produção (mais rápido, mas sem hot reload):

```bash
# Compilar o projeto
npm run build

# Executar a versão compilada
npm start
```

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

## 🔧 Solução de Problemas Comuns

### ❌ Erro: "comando não encontrado" (node, npm, psql)

**Problema:** Você não tem o Node.js ou PostgreSQL instalado.

**Solução:**
1. Instale o Node.js em: https://nodejs.org/ (versão LTS recomendada)
2. Instale o PostgreSQL em: https://www.postgresql.org/download/
3. Após instalar, **feche e abra o terminal novamente**
4. Tente os comandos novamente

---

### ❌ Erro: "Cannot connect to database" ou "ECONNREFUSED"

**Problema:** O PostgreSQL não está rodando ou a senha está incorreta.

**Soluções:**

**1. Verifique se o PostgreSQL está rodando:**

Windows:
```bash
# Abra o PowerShell como Administrador e execute:
Get-Service -Name postgresql*
# Se estiver "Stopped", inicie com:
Start-Service postgresql*
```

Linux:
```bash
sudo systemctl status postgresql
# Se não estiver rodando:
sudo systemctl start postgresql
```

macOS:
```bash
brew services list
# Se não estiver rodando:
brew services start postgresql
```

**2. Verifique a senha no arquivo `.env`:**
- Abra o arquivo `.env`
- Confirme que a senha em `DATABASE_URL` está correta
- Se não lembra a senha, você pode redefinir (veja seção "Redefinir senha do PostgreSQL" abaixo)

**3. Verifique se o banco existe:**
```bash
# Conecte ao PostgreSQL:
psql -U postgres

# Liste os bancos:
\l

# Se não ver "sus_para_todos", crie:
CREATE DATABASE sus_para_todos;

# Saia:
\q
```

---

### ❌ Erro: "Port 5000 is already in use"

**Problema:** Outra aplicação está usando a porta 5000.

**Solução 1 - Parar a aplicação que está usando a porta:**

Windows:
```bash
# Encontre o processo:
netstat -ano | findstr :5000
# Anote o PID e finalize:
taskkill /PID <numero_do_pid> /F
```

Linux/macOS:
```bash
# Encontre e finalize o processo:
lsof -ti:5000 | xargs kill -9
```

**Solução 2 - Usar outra porta:**
1. Crie/edite o arquivo `.env`
2. Adicione: `PORT=3000` (ou qualquer porta disponível)
3. Execute novamente: `npm run dev`
4. Acesse: http://localhost:3000

---

### ❌ Erro ao executar "npm install"

**Problema:** Cache corrompido ou problemas de rede.

**Solução:**
```bash
# 1. Limpe o cache
npm cache clean --force

# 2. Delete a pasta node_modules (se existir)
# Windows:
rmdir /s /q node_modules
# Linux/macOS:
rm -rf node_modules

# 3. Delete o arquivo package-lock.json
# Windows:
del package-lock.json
# Linux/macOS:
rm package-lock.json

# 4. Tente instalar novamente
npm install
```

---

### ❌ Erro: "Cannot find module" ou "Module not found"

**Problema:** Dependências não foram instaladas corretamente.

**Solução:**
```bash
# Reinstale as dependências
npm install

# Se não funcionar, force a reinstalação completa:
rm -rf node_modules package-lock.json  # Linux/macOS
rmdir /s /q node_modules && del package-lock.json  # Windows
npm install
```

---

### ❌ Página em branco ou erro 404

**Problema:** O servidor não está rodando ou você está acessando o endereço errado.

**Solução:**
1. Verifique se o terminal mostra "Server running on http://localhost:5000"
2. Acesse exatamente: `http://localhost:5000` (não esqueça o `http://`)
3. Se mudou a porta, use a porta correta
4. Limpe o cache do navegador (Ctrl+Shift+Delete)

---

### ❌ Erro: "npm: command not found" (Linux/macOS)

**Problema:** O Node.js foi instalado mas o PATH não foi atualizado.

**Solução:**
```bash
# Verifique onde o node está instalado:
which node

# Se não mostrar nada, reinstale o Node.js
# Ou adicione ao PATH:
export PATH=$PATH:/usr/local/bin

# Para tornar permanente, adicione ao ~/.bashrc ou ~/.zshrc
echo 'export PATH=$PATH:/usr/local/bin' >> ~/.bashrc
source ~/.bashrc
```

---

### 🔑 Redefinir Senha do PostgreSQL

**Windows:**
1. Localize o arquivo `pg_hba.conf` (geralmente em `C:\Program Files\PostgreSQL\14\data\`)
2. Abra como Administrador
3. Mude todas as linhas com `md5` para `trust`
4. Salve e reinicie o serviço PostgreSQL
5. Conecte sem senha: `psql -U postgres`
6. Altere a senha: `ALTER USER postgres PASSWORD 'nova_senha';`
7. Reverta o `pg_hba.conf` (mude `trust` de volta para `md5`)
8. Reinicie o PostgreSQL novamente

**Linux/macOS:**
```bash
sudo -u postgres psql
ALTER USER postgres PASSWORD 'nova_senha';
\q
```

---

### 📞 Ainda com Problemas?

Se nenhuma solução acima funcionou:

1. **Verifique os logs de erro no terminal** - Copie a mensagem de erro completa
2. **Teste cada requisito individualmente:**
   ```bash
   node --version    # Deve mostrar v18.x.x ou superior
   npm --version     # Deve mostrar 9.x.x ou superior
   psql --version    # Deve mostrar PostgreSQL 14.x ou superior
   ```
3. **Verifique o arquivo `.env`:**
   - Está na pasta raiz do projeto?
   - A senha do PostgreSQL está correta?
   - Não tem espaços extras ou caracteres estranhos?

4. **Tente executar passo a passo:**
   ```bash
   # 1. Teste a conexão com o banco
   psql -U postgres -d sus_para_todos
   # Se conectar, está ok! Digite \q para sair
   
   # 2. Teste o db:push
   npm run db:push
   # Deve mostrar "Done!" sem erros
   
   # 3. Execute o projeto
   npm run dev
   ```

## 📧 Suporte

Para dúvidas ou problemas:
- Verifique se todos os requisitos estão instalados
- Confirme que o arquivo `.env` está configurado corretamente
- Certifique-se de que o PostgreSQL está rodando

## 📄 Licença

Sistema desenvolvido para São Caetano do Sul - Todos os direitos reservados.
