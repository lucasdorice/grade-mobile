# Design System — Grade App (MVP)

> **Objetivo**: Especificação visual completa para geração de protótipos via IA.
> **Plataforma**: Mobile (iOS & Android) — React Native
> **Tema padrão**: Dark Mode

---

## 🎨 Design Tokens

### Cores

**Dark Theme (Padrão)**
| Token | Hex | Uso |
|-------|-----|-----|
| `background` | `#0D0D0F` | Fundo principal |
| `surface` | `#1A1A1F` | Cards, modais, containers |
| `surface-elevated` | `#242429` | Cards elevados, dropdowns |
| `border` | `#2E2E35` | Bordas, divisores |
| `text-primary` | `#F5F5F7` | Texto principal |
| `text-secondary` | `#8E8E93` | Texto auxiliar, labels |
| `text-tertiary` | `#636366` | Placeholders, dicas |

**Light Theme**
| Token | Hex | Uso |
|-------|-----|-----|
| `background` | `#F5F5F7` | Fundo principal |
| `surface` | `#FFFFFF` | Cards |
| `surface-elevated` | `#F0F0F2` | Cards elevados |
| `border` | `#E5E5EA` | Bordas |
| `text-primary` | `#1C1C1E` | Texto principal |
| `text-secondary` | `#8E8E93` | Texto auxiliar |
| `text-tertiary` | `#AEAEB2` | Placeholders |

**Accent Colors**
| Token | Hex | Uso |
|-------|-----|-----|
| `accent` | `#6C5CE7` | Botões primários, links, ações principais |
| `accent-light` | `#A29BFE` | Hover, estados ativos |
| `accent-bg` | `#6C5CE720` | Background sutil de elementos ativos |
| `success` | `#00B894` | Tarefas concluídas, confirmações |
| `warning` | `#FDCB6E` | Alertas, tarefas próximas do prazo |
| `danger` | `#FF6B6B` | Tarefas atrasadas, erros, excluir |
| `info` | `#74B9FF` | Informações, badges |

**Paleta de Cores das Disciplinas** (atribuição automática)
```
#FF6B6B (vermelho coral)
#6C5CE7 (roxo)
#00B894 (verde esmeralda)
#FDCB6E (amarelo)
#74B9FF (azul claro)
#FD79A8 (rosa)
#55E6C1 (turquesa)
#F19066 (laranja)
```

### Tipografia

| Estilo | Font | Tamanho | Peso | Uso |
|--------|------|---------|------|-----|
| `h1` | Inter | 28px | Bold (700) | Títulos de tela |
| `h2` | Inter | 22px | SemiBold (600) | Subtítulos, nome da disciplina |
| `h3` | Inter | 18px | SemiBold (600) | Títulos de seção |
| `body` | Inter | 16px | Regular (400) | Texto principal |
| `body-small` | Inter | 14px | Regular (400) | Texto secundário |
| `caption` | Inter | 12px | Medium (500) | Labels, tags, timestamps |
| `code` | JetBrains Mono | 14px | Regular (400) | Blocos de código |

### Espaçamento

| Token | Valor |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |

### Bordas e Sombras

| Token | Valor |
|-------|-------|
| `radius-sm` | 8px |
| `radius-md` | 12px |
| `radius-lg` | 16px |
| `radius-full` | 999px |
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.3)` (dark) |

---

## 📱 Telas do App

### Navegação Global

**Bottom Tab Bar** — 3 tabs, fixo na base
- Ícones: outline quando inativo, filled quando ativo
- Tab ativa: cor `accent` (#6C5CE7), badge para contadores
- Background: `surface` com borda top `border`

| Tab | Ícone | Label |
|-----|-------|-------|
| 1 | 📅 (calendar) | **Hoje** |
| 2 | ✅ (check-square) | **Tarefas** |
| 3 | ⚙️ (settings) | **Config** |

---

### TELA 1: Wizard de Onboarding (4 telas)

**Wizard 1/4 — Boas-vindas**
- Background: gradiente vertical `#0D0D0F` → `#1A1A2E`
- Centro: ilustração/ícone estilizado de uma grade de horários (abstrato, minimalista, tons de `accent`)
- Título: "Grade" — `h1`, bold, cor `text-primary`
- Subtítulo: "Sua rotina acadêmica no bolso. Anotações, código e prazos em um só lugar." — `body`, cor `text-secondary`
- Botão primário: "Começar" — pill shape, background `accent`, texto branco, full-width com padding horizontal `lg`
- Link discreto abaixo: "Pular e configurar depois" — `caption`, cor `text-tertiary`, underline

**Wizard 2/4 — Nome do Estudante**
- Stepper/dots no topo: 4 dots, segundo ativo (#6C5CE7)
- Título: "Como podemos te chamar?" — `h2`, centralizado
- Input field: grande, centralizado, placeholder "Seu nome", borda `border`, focus borda `accent`
- Botão "Próximo" — full-width, `accent`, disabled até digitar algo
- Botão "Voltar" — texto, `text-secondary`

**Wizard 3/4 — Montar a Grade**
- Stepper: terceiro dot ativo
- Título: "Monte sua grade" — `h2`
- Subtítulo: "Adicione suas disciplinas do semestre" — `body-small`, `text-secondary`
- Lista de disciplinas adicionadas: cada item mostra cor (bolinha), nome, dia/horário — fundo `surface`, radius `md`
- Botão "+" para adicionar: card pontilhado, cor `text-tertiary`, "Adicionar disciplina"
- **Bottom sheet ao tocar "+":**
  - Input: Nome da disciplina (obrigatório)
  - Input: Professor (opcional)
  - Seletores: Dia(s) da semana (chips toggle, podem selecionar múltiplos)
  - Time pickers: Horário início / fim
  - Botão "Salvar" — `accent`
- Botão "Próximo" no rodapé

**Wizard 4/4 — Preview + Conclusão**
- Stepper: quarto dot ativo
- Título: "Sua grade está pronta! 🎓" — `h2`
- Preview: mini-grade semanal (grid de 5 colunas seg-sex, linhas por horário)
  - Cada bloco mostra a cor da disciplina + nome abreviado
  - Horários no eixo Y (labels `caption`)
  - Dias no eixo X (labels `caption`)
- Botão "Começar a usar!" — `accent`, full-width, com ícone de rocket 🚀
- Confetti ou micro-animação ao tocar

---

### TELA 2: Timeline Diária (Tab "Hoje") — Tela Principal

**Header**
- Saudação: "Olá, Lucas 👋" — `h2`, cor `text-primary`
- Data: "Sábado, 1 de Março" — `body-small`, cor `text-secondary`
- Navegação de data: `< Ontem · Hoje · Amanhã >` — setas + label, swipe para navegar

**Conteúdo**
- Lista vertical de cards de aula, ordenados por horário
- Cada **Aula Card**:
  - Barra vertical de cor da disciplina na esquerda (4px, cor da disciplina, radius full)
  - Nome da disciplina — `h3`, cor `text-primary`
  - Professor — `caption`, cor `text-tertiary`
  - Horário: "08:00 – 09:40" — `body-small`, cor `text-secondary`
  - Badge indicador: "📝 Anotado" (se tem conteúdo, cor `success`) ou "Sem anotação" (`text-tertiary`)
  - Background: `surface`, radius `md`, padding `md`
  - Toque → navega para o Card da Aula

**Estado Vazio** (dia sem aulas)
- Ilustração minimalista (estudante relaxando)
- "Nenhuma aula hoje 🎉" — `h3`, `text-secondary`
- "Aproveite para revisar ou descansar" — `body-small`, `text-tertiary`

---

### TELA 3: Card da Aula (Stack Screen)

**Header**
- Botão voltar (←)
- Título: nome da disciplina — `h2`, com bolinha de cor
- Subtítulo: "01 de Março · 08:00 – 09:40" — `caption`, `text-secondary`

**Tab Bar interna** (3 tabs, horizontal, abaixo do header)
- Tabs: **Anotações** · **Código** · **Links**
- Tab ativa: texto `accent`, underline animado
- Tab inativa: texto `text-tertiary`

#### Tab "Anotações"
- Editor rico full-screen
- Toolbar flutuante no topo do teclado (ou fixa abaixo das tabs):
  - Botões: **B** (bold), *I* (italic), lista bullet, lista numerada, heading, foto 📷
  - Ícones em `text-secondary`, ativo em `accent`
- Área de texto: fundo `background`, texto `text-primary`, placeholder "O que foi discutido na aula de hoje?"
- Imagens inseridas: inline, com radius `sm`, max-width 100%, toque para ampliar

#### Tab "Código"
- **Botão "＋ Novo bloco de código"** — outline, cor `accent`, radius `md`, full-width
- Lista de blocos de código já adicionados:
  - Cada bloco:
    - Header do bloco: título (se houver, `body-small`, `text-secondary`) + badge da linguagem ("JavaScript", chip com fundo `accent-bg`, texto `accent`) + botão 🗑️ (excluir, `danger`)
    - Área de código: fundo `#1E1E2E` (VSCode-like), padding `md`, radius `md`, monospace font
    - Syntax highlighting aplicado (tema escuro, estilo Monokai/Dracula)
    - Botão copiar: ícone 📋 no canto superior direito do bloco, tooltip "Copiado!" ao tocar
- **Bottom sheet ao criar bloco:**
  - Input: Título (opcional), placeholder "ex: Componente de login"
  - Seletor de linguagem: chips horizontais (JavaScript · HTML · CSS · Python · Java)
  - Área de código: textarea com font monospace, fundo `#1E1E2E`
  - Botão "Adicionar" — `accent`

#### Tab "Links"
- **Botão "＋ Adicionar link"** — outline, cor `accent`, radius `md`, full-width
- Lista de links salvos:
  - Cada link:
    - Favicon (16x16, círculo) à esquerda
    - Título — `body`, `text-primary`
    - URL truncada — `caption`, `text-tertiary`
    - Tag chip (se houver) — fundo `accent-bg`, texto `accent`, `caption`
    - Ícone de link externo → à direita
    - Swipe para excluir (fundo `danger`)
- **Bottom sheet ao adicionar:**
  - Input: URL (obrigatório), placeholder "https://..."
  - Input: Título (auto-preenche se online), placeholder "Título do link"
  - Seletor de tag: chips horizontais (documentação · tutorial · exercício · outro)
  - Botão "Salvar" — `accent`

- **Estado vazio:** "Nenhum link salvo. Adicione referências e materiais da aula." — `body-small`, `text-tertiary`, ícone de link

---

### TELA 4: Hub de Tarefas (Tab "Tarefas")

**Header**
- Título: "Tarefas" — `h1`
- Contador: "3 pendentes" — badge pill, fundo `danger`, texto branco

**FAB (Floating Action Button)**
- Posição: canto inferior direito (acima da tab bar)
- Ícone: + (plus)
- Fundo: `accent`, sombra, circular (56px)

**Lista de Tarefas Pendentes**
- Seção: "Pendentes" — `h3`, `text-secondary`
- Cada tarefa:
  - Checkbox circular à esquerda (vazio = `border`, checked = `success` com ícone ✓)
  - Título — `body`, `text-primary`
  - Linha 2: nome da disciplina (chip com cor da disciplina) + data de entrega (`caption`, `text-secondary`)
  - Se atrasada: data de entrega em `danger`, com ícone ⚠️
  - Se hoje: data em `warning`
  - Se futura: data em `text-secondary`
  - Swipe left → excluir (fundo `danger`)
  - Toque no checkbox → marca como concluída (animação de check)
  - Toque no texto → editar

**Lista de Tarefas Concluídas** (colapsável)
- Seção: "Concluídas (5)" — `h3`, `text-tertiary`, ícone chevron para expandir/colapsar
- Itens: checkbox checked, título com strikethrough, opacidade 0.5

**Bottom Sheet — Nova Tarefa / Editar Tarefa**
- Input: Título (obrigatório), placeholder "O que precisa entregar?"
- Dropdown: Disciplina (lista de disciplinas cadastradas + opção "Sem disciplina")
- Date Picker: Data de entrega (opcional)
- Botão "Salvar" — `accent`, full-width

**Estado Vazio**
- Ilustração minimalista
- "Nenhuma tarefa pendente 🎉" — `h3`, `text-secondary`
- "Toque no + para adicionar uma entrega" — `body-small`, `text-tertiary`

---

### TELA 5: Configurações (Tab "Config")

**Header**
- Título: "Configurações" — `h1`

**Seções** (agrupadas em cards `surface`)

**Seção "Perfil"**
- Avatar circular com iniciais (fundo `accent`, texto branco, 48px)
- Nome do estudante — `h3`, toque para editar (inline ou bottom sheet)

**Seção "Aparência"**
- "Tema" — toggle switch entre 🌙 Escuro / ☀️ Claro
- Label + switch no mesmo row

**Seção "Grade"**
- "Semestre Ativo" — mostra nome do semestre (ex: "2026.1"), toque → lista de semestres
- "Gerenciar Disciplinas" — toque → tela de CRUD de disciplinas
- "Novo Semestre" — ícone +

**Lista de Semestres** (modal ou tela stack)
- Cada semestre: nome + período + badge "Ativo" (se for o ativo)
- Toque no semestre → muda para ele (se ativo) ou visualiza histórico (read-only)
- Botão criar novo semestre

**Seção "Sobre"**
- "Versão" — `body`, "1.0.0 MVP" `text-secondary`
- "Feito com 💜 por Lucas Dorice"

---

## 🔔 Notificações Push

**Lembrete — 1 dia antes**
- Título: "📅 Entrega amanhã"
- Corpo: "Challenge 3 — Mobile Dev vence amanhã"
- Ação ao tocar → abre Hub de Tarefas

**Lembrete — No dia**
- Título: "⚠️ Entrega hoje!"
- Corpo: "Challenge 3 — Mobile Dev vence hoje"
- Ação ao tocar → abre Hub de Tarefas

---

## 🧩 Componentes Reutilizáveis

### SubjectChip
- Bolinha de cor (8px, radius full) + nome da disciplina
- Fundo: cor da disciplina com 15% opacidade
- Texto: `caption`, cor da disciplina

### AulaCard
- Barra vertical de cor (4px) + infos da aula
- Fundo `surface`, radius `md`, padding `md`
- Estados: com anotação / sem anotação

### TaskItem
- Checkbox + título + chips (disciplina, data)
- Estados: pendente / atrasada / concluída

### CodeBlock
- Header (título + linguagem + copiar + excluir)
- Corpo com syntax highlight, fundo `#1E1E2E`

### LinkItem
- Favicon + título + URL + tag
- Swipe-to-delete

### EmptyState
- Ilustração + título + subtítulo
- Centralizado, padding `2xl`

### BottomSheet
- Handle bar no topo (40px width, 4px height, `border`, radius full)
- Fundo `surface-elevated`
- Animação slide up + backdrop blur

### FAB (Floating Action Button)
- Circular (56px), fundo `accent`, sombra
- Ícone + (plus), branco
- Posição: bottom-right, 16px acima da tab bar

---

## 🔄 Animações e Transições

| Elemento | Animação |
|----------|----------|
| Tab switch | Underline slide horizontal (200ms ease) |
| Card da Aula (abrir) | Slide in from right (300ms) |
| Bottom Sheet | Slide up + fade backdrop (250ms) |
| Checkbox (concluir tarefa) | Scale bounce + check draw (300ms) |
| Copiar código | Tooltip "Copiado!" fade in/out (1.5s) |
| Wizard (próximo) | Crossfade entre telas (300ms) |
| Confetti (wizard final) | Partículas de confete 2s |
| Swipe to delete | Slide left reveal red bg + trash icon |
| FAB press | Scale down 0.9 → 1.0 (150ms) |

---

## 📐 Mapa de Telas (Fluxo de Navegação)

```
                    ┌──────────────┐
                    │   Splash /   │
                    │  First Open  │
                    └──────┬───────┘
                           │
              ┌────────────▼─────────────┐
              │   WIZARD DE ONBOARDING   │
              │  1. Boas-vindas          │
              │  2. Nome                 │
              │  3. Montar Grade         │
              │  4. Preview + Começar    │
              └────────────┬─────────────┘
                           │
          ┌────────────────▼────────────────┐
          │         BOTTOM TAB BAR          │
          ├─────────┬──────────┬────────────┤
          │         │          │            │
     ┌────▼────┐ ┌──▼───┐ ┌───▼──────┐    │
     │  HOJE   │ │TAREFAS│ │  CONFIG  │    │
     │Timeline │ │ Hub   │ │          │    │
     └────┬────┘ └──┬───┘ └───┬──────┘    │
          │         │         │            │
     ┌────▼────┐ ┌──▼─────┐ ┌▼──────────┐ │
     │ Card da │ │ Nova / │ │ Gerenciar │ │
     │  Aula   │ │ Editar │ │ Semestres │ │
     │(stack)  │ │ Tarefa │ │ / Matérias│ │
     │         │ │(sheet) │ │  (stack)  │ │
     │ Tabs:   │ └────────┘ └───────────┘ │
     │ ·Notas  │                          │
     │ ·Código │                          │
     │ ·Links  │                          │
     └─────────┘                          │
                                          │
          └────────────────────────────────┘
```