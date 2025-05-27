# ChessOpenings

**ChessOpenings** é uma plataforma para jogadores de xadrez praticarem aberturas de maneira interativa e personalizada, inspirada no formato do Duolingo.

---

## 🧠 Objetivos

- Ensinar aberturas de xadrez com base no estilo do jogador.
- Tornar o aprendizado de xadrez divertido, visual e adaptativo.
- Criar uma rotina de estudos interativa para todos os níveis.

---

## 🚀 Tecnologias

- **Next.js** com **TypeScript**
- **TailwindCSS** (Mobile First)
- **Armazenamento local via JSON** (login, cadastro, lições, aberturas, exercícios, quiz)
- **Animações e tabuleiro interativo** com:
  - [`chessboard.js`](https://chessboardjs.com) ou [`react-chessboard`](https://www.npmjs.com/package/react-chessboard)
  - [`framer-motion`](https://www.framer.com/motion/)

---

## ✅ Boas Práticas

- Princípios: **SOLID**, **KISS**, **YAGNI**
- Separação clara de responsabilidades
- Componentes e funções pequenas e reutilizáveis
- Código limpo, modularizado e legível
- Comentários apenas quando a lógica for complexa
- UI/UX com padrão **2025**, moderna, responsiva e intuitiva
- Padrão de desenvolvimento sênior em Next.js/React

---

## 🧩 Funcionalidades do MVP

- Quiz de estilo para definir o arquétipo do jogador
- Sistema de recomendação de aberturas com base no resultado
- Trilhas de lições inspiradas no Duolingo (tema de xadrez)
- Lições interativas com tabuleiro
- Painel admin (baseado em JSON) para cadastro de:
  - Lições
  - Aberturas
  - Exercícios
  - Perguntas do quiz

---

## 📚 Tipos de Lições

1. **Introdução à abertura**: sequência inicial com explicações
2. **Reações do adversário**: respostas comuns e como lidar
3. **Árvore de possibilidades** da abertura
4. **Erros comuns** (do jogador e do oponente) e punições
5. **Exercícios diversos**:
   - Estrutura de peões no meio-jogo
   - Estrutura de peões no final de jogo
   - Identificação de planos
6. **Dois tipos principais de exercícios**:
   - **Visualização**: o usuário apenas avança os lances com explicações
   - **Interativo**: o usuário deve acertar o lance certo para progredir

> **Importante**: 
> Cada exercício terá feedback visual com framer-motion. Ao acertar, o sistema exibe um efeito verde e permite avançar.

---

## 🔄 Fluxo do Usuário

1. Acessa a **página inicial** com login/cadastro
2. Após autenticação, faz o **quiz de estilo**
3. Recebe o **arquétipo do jogador**, com:
   - Aberturas recomendadas
   - Jogadores famosos com mesmo perfil
4. Pode aceitar sugestão ou navegar pela **galeria de aberturas**
5. Escolhe uma abertura e entra na **trilha de lições**
6. A cada lição:
   - Pode assistir explicações ou resolver interativamente os exercícios

---

## 🎨 Identidade Visual

### Fontes

| Uso                      | Fonte              |
|--------------------------|--------------------|
| Títulos                  | Montserrat Bold    |
| Textos                   | Nunito Regular     |
| Gamificação/Interfaces   | Poppins SemiBold   |

### Paleta de Cores

| Categoria     | Nome         | Hex       | Uso                               |
|---------------|--------------|-----------|------------------------------------|
| **Primária**  | Preto        | #1C1C1E   | Texto principal, ícones            |
|               | Branco       | #FFFFFF   | Fundos, textos claros              |
|               | Azul Real    | #005FAD   | Botões principais, CTAs            |
| **Secundária**| Verde Claro  | #7ED957   | Feedback positivo, gamificação     |
|               | Cinza Médio  | #B3B3B3   | Texto secundário, ícones           |
|               | Cinza Escuro | #3C3C3C   | Fundos de seções, cards            |
| **Acento**    | Amarelo Ouro | #FFD700   | Medalhas, conquistas               |
|               | Vermelho     | #E63946   | Erros, notificações                |
| **BGs**       | Azul Claro   | #E1F5FF   | Telas de boas-vindas, destaques    |
|               | Cinza Claro  | #F5F5F5   | Fundos neutros, cartões            |

---

## 🛠 Painel Admin (JSON)

- **Quiz**: perguntas e respostas com pontuação por arquétipo
- **Aberturas**: nome, FENs, tipo, estilo (tático/posicional)
- **Lições**: tipo (visual/interativo), sequência de lances, explicações
- **Exercícios**: lances certos/errados, feedback, estrutura de peões, contexto do lance

---

## 📦 Estrutura de Arquivos Implementada

```
/src
  /app
    /admin                    # Área administrativa
      layout.tsx             # Layout da área admin
      page.tsx              # Dashboard principal
    layout.tsx              # Layout principal
    page.tsx               # Página inicial
    globals.css            # Estilos globais
  /components
    ChessDemo.tsx           # Demonstração interativa de xadrez
```

---

## 📝 Documentação

Para acompanhar o histórico de mudanças e desenvolvimento do projeto, consulte:
- [**CHANGELOG.md**](./CHANGELOG.md) - Histórico detalhado de versões e modificações

---

## 🧪 Observações Finais

- Interface deve funcionar perfeitamente no **mobile** (responsividade total).
- Toda lógica deve ser pensada para **manutenibilidade e escalabilidade**.
- Código deve refletir a qualidade de um **desenvolvedor sênior**.

---

> Projeto idealizado para revolucionar o ensino de aberturas no xadrez com um sistema divertido, educativo e altamente customizável