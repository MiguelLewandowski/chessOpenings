# ♟️ **ChessOpenings**

Uma plataforma educacional de xadrez inspirada no Duolingo, que utiliza gamificação para ensinar aberturas de xadrez de forma interativa e personalizada.

---

## 🎯 **Status do Projeto**

**Versão:** 3.3.3 - **MVP Funcional**

✅ **Interface de usuário** com trilhas interativas  
✅ **Sistema de exercícios** (Passivos, Interativos, Quiz)  
✅ **Gamificação básica** com progresso e conquistas  
✅ **Interface administrativa** para gestão de conteúdo  
✅ **Tabuleiro interativo** com validação em tempo real  
✅ **Design responsivo** mobile-first  

### **🚧 Funcionalidades Planejadas**
- 🔄 **Backend** para persistência de dados
- 🎯 **Quiz de estilo** para personalização do aprendizado
- 👤 **Jogadores modelo** e arquétipos de estilo
- 📊 **Analytics avançados** de progresso
- 🎮 **Gamificação expandida** com ranking e desafios

---

## �️ **Backend**

- **Banco**: PostgreSQL com **Prisma ORM**
- **API**: Rotas do App Router (`src/app/api/*`)
- **Seeders**: `prisma/seed.ts`
- **Docker**: `docker-compose.yml` com serviços `db` e `web`

### **Modelos**
- `Abertura`, `Licao`, `Exercicio` com relações e `onDelete: Cascade`
- Progresso: `AberturaProgress`, `LicaoProgress` e `User` padrão `default`

### **Endpoints**
- `GET/POST /api/aberturas`
- `GET/PUT/DELETE /api/aberturas/:id`
- `GET/POST /api/licoes` (`?aberturaId=` opcional)
- `GET/PUT/DELETE /api/licoes/:id`
- `GET/POST /api/exercicios` (`?licaoId=` opcional)
- `GET/PUT/DELETE /api/exercicios/:id`
- `POST /api/progress/aberturas`, `DELETE /api/progress/aberturas?aberturaId=`
- `POST /api/progress/licoes`, `DELETE /api/progress/licoes?licaoId=`

### **Migração de Persistência**
- Hooks `useAberturas`, `useLicoes`, `useExercicios` agora consomem a API.
- `useUserProgress` mantém estado local para UX e sincroniza progresso com a API.

---

## � **Tecnologias**

- **Next.js 15** com TypeScript (App Router em `src/app`)
- **React 19** e **React DOM 19**
- **Zustand** (estado global com persistência)
- **TailwindCSS 4** (estilização)
- **Chess.js** (validação de regras)
- **React Chessboard** (tabuleiro interativo)
- **Lucide React** (ícones)

---

## ⚡ **Início Rápido**

```bash
# Clone e instale
git clone <repository-url>
cd chess-openings
npm install

# Desenvolvimento
npm run dev

# Produção
npm run build
npm run start
```

### **Com Docker**

```bash
cp .env.example .env
docker-compose up --build
```

App: `http://localhost:3000` • Banco: `localhost:5432` (usuário `postgres`, senha `postgres`, db `chessopenings`).

### **Banco e Prisma**

```bash
# Gerar client
npm run prisma:generate
# Migrações em dev
npm run db:migrate
# Aplicar migrações em prod
npm run db:deploy
# Seed
npm run db:seed
```

Conteúdo seedado: 15 lições × 5 exercícios para a Abertura Italiana, com FEN derivada via `chess.js`.

### FEN e Exercícios
- Passivos: usam `posicaoInicial` em FEN e sequência de lances SAN; ao reproduzir, o cliente deriva a FEN de cada passo quando ausente.
- Interativos: `posicaoInicial` em FEN e `movimentoCorreto` em SAN; validação e atualização do tabuleiro por `chess.js`.
- Quiz: `posicaoInicial` em FEN, opções SAN e preview do lance selecionado com `chess.js`.

#### **Windows – Falhas ao baixar engines do Prisma**
- Se ocorrer erro 500 ao baixar binários (instabilidade do CDN), use:
  - PowerShell: `setx PRISMA_CLIENT_ENGINE_TYPE binary` e reinicie o terminal
  - Git Bash: `export PRISMA_CLIENT_ENGINE_TYPE=binary`
- O projeto já força `binary` no script (`npm run prisma:generate`).
- Alternativa: `docker-compose up --build` gera client, aplica schema e faz seed dentro do container.

### **Acesso às Interfaces**

- **Interface Principal**: `http://localhost:3000`
  - Galeria de aberturas com filtros
  - Trilhas de lições interativas
  - Sistema de exercícios gamificado
  
- **Interface Admin**: `http://localhost:3000/admin`
  - Dashboard com estatísticas
  - Gestão de aberturas, lições e exercícios
  - Ferramentas de backup/debug

---

## 🏗️ **Arquitetura**

### **Sistema de Dados**
```
localStorage
├── aberturas[]           # Aberturas com movimentos
├── licoes[]             # Lições conceituais  
├── exercicios[]         # Exercícios práticos (3 tipos)
└── userProgress         # Progresso do usuário (Zustand)
```

### **Tipos de Exercícios**
- **🎬 Passivos**: Demonstração automática de sequências
- **🎯 Interativos**: Encontrar o lance correto no tabuleiro
- **🧩 Quiz**: Múltipla escolha com explicações

### **Estrutura Principal**
```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── aberturas/
│   │   ├── page.tsx               # Galeria de aberturas
│   │   └── [id]/
│   │       ├── trilha/page.tsx    # Trilha de lições
│   │       └── licao/[licaoId]/page.tsx # Execução
│   └── admin/                     # Interface administrativa
├── components/
│   ├── licao/                     # Players de exercícios
│   └── admin/                     # Componentes admin
├── hooks/                         # Estado e lógica
└── types/                         # Definições TypeScript
```

---

## 🎮 **Funcionalidades**

### **Interface do Usuário**
- **Galeria de Aberturas**: Grid responsivo com filtros avançados
- **Trilhas Interativas**: Progresso visual com desbloqueio sequencial
- **Exercícios Funcionais**: Tabuleiro interativo com feedback em tempo real
- **Gamificação**: Pontos, streaks, conquistas e progresso persistente

### **Sistema Administrativo**
- **CRUD Completo**: Gestão de aberturas, lições e exercícios
- **Preview em Tempo Real**: Validação FEN com Chess.js
- **Backup/Restore**: Ferramentas de dados JSON
- **Debug Tools**: Visualização do localStorage

### **Gamificação**
- **Progresso Persistente**: Zustand + localStorage
- **Sistema de Pontos**: Baseado em performance
- **Streaks Visuais**: Lições consecutivas
- **Desbloqueio Sequencial**: Trilhas progressivas

---

## 🎨 **Design System**

### **Cores Principais**
- **Primária**: Azul (`blue-600`) - Botões e CTAs
- **Sucesso**: Verde (`green-600`) - Progresso e feedback positivo
- **Streak**: Laranja (`orange-500`) - Conquistas e streaks
- **Neutro**: Cinza - Textos e backgrounds

### **Componentes**
- Cards com gradientes suaves
- Bordas arredondadas consistentes
- Microinterações intuitivas
- Estados visuais claros
- Design mobile-first

---

## 📊 **Fluxo de Usuário**

1. **Entrada**: Landing page → Galeria de aberturas
2. **Seleção**: Escolha da abertura → Trilha de lições
3. **Aprendizado**: Execução de exercícios → Feedback em tempo real
4. **Progressão**: Pontos e streaks → Desbloqueio automático

---

## 🛠️ **Desenvolvimento**

### **Comandos Úteis**
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Executar build
npm run lint         # Verificar código
```

### **Padrões de Código**
- **TypeScript 100%** - Tipagem completa
- **Hooks Zustand** - Estado global
- **Componentes funcionais** - React moderno
- **Mobile-first** - Design responsivo
- **Validação Chess.js** - Movimentos e posições

### **Estrutura de Hooks**
- `useAberturas` - Gestão de aberturas
- `useLicoes` - Gestão de lições
- `useExercicios` - Gestão de exercícios
- `useUserProgress` - Progresso global (Zustand)
- `useLicaoProgress` - Progresso de lição individual


---

## 🚀 **Como Usar**

### **Para Estudantes**
1. Acesse a galeria de aberturas
2. Escolha uma abertura para estudar
3. Complete a trilha de lições em sequência
4. Ganhe pontos e conquistas
5. Acompanhe seu progresso visual

### **Para Administradores**
1. Acesse `/admin` para gestão
2. Use "Popular Exemplos" para dados iniciais
3. Gerencie aberturas, lições e exercícios
4. Monitore estatísticas no dashboard
5. Use ferramentas de backup quando necessário

---

## 🎯 **Funcionalidades Técnicas**

### **Validação em Tempo Real**
- Posições FEN validadas com Chess.js
- Movimentos verificados automaticamente
- Preview de tabuleiro instantâneo

### **Estado Persistente**
- Progresso salvo automaticamente
- Sincronização entre componentes
- Backup e restore de dados

### **Interface Responsiva**
- Mobile-first design
- Breakpoints otimizados
- Microinterações suaves

---

## 📈 **Estatísticas**

- **80+ componentes** React funcionais
- **5 hooks customizados** para estado
- **3 tipos de exercícios** interativos
- **100% TypeScript** com tipagem completa
- **Design responsivo** mobile-first
- **MVP funcional** pronto para validação

**Status**: MVP Funcional  
**Versão**: 3.3.3

*ChessOpenings - Aprenda • Conquiste • Domine* ♟️
