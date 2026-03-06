# Design System — Grade App v2 (MVP)

> **Objetivo**: Especificação visual completa e replicável para o MVP do Grade App.
> **Plataforma**: Mobile (iOS & Android) — React Native / Expo
> **Tema padrão**: Dark Mode
> **Fonte**: Inter (Google Fonts)

---

## 🎨 Design Tokens

### Cores

**Dark Theme (Padrão)**

| Token | Hex | Uso |
|-------|-----|-----|
| `background` | `#0F0F13` | Fundo principal de todas as telas |
| `surface` | `#1C1C24` | Cards, containers, itens de lista |
| `surface-elevated` | `#262630` | Bottom sheets, modais, menus |
| `border` | `#32323E` | Bordas de inputs, divisores, separadores |
| `text-primary` | `#F2F2F7` | Texto principal, títulos |
| `text-secondary` | `#8E8E93` | Subtítulos, labels, horários |
| `text-tertiary` | `#56566A` | Placeholders, dicas, texto desabilitado |

**Accent & Status Colors**

| Token | Hex | Uso |
|-------|-----|-----|
| `accent` | `#7C6AF4` | Botões primários, tab ativa, links, ações principais |
| `accent-soft` | `rgba(124, 106, 244, 0.15)` | Background sutil de elementos selecionados |
| `success` | `#34C78B` | Tarefa concluída, confirmações |
| `warning` | `#FFB84D` | Prazo próximo (3 dias ou menos) |
| `danger` | `#FF5C5C` | Atrasado, erros, ação de excluir |

**Paleta de Cores das Matérias** (atribuição na criação)

```
1. #FF6B6B  (Coral)
2. #7C6AF4  (Roxo)
3. #34C78B  (Verde)
4. #FFB84D  (Amarelo)
5. #5B9BF5  (Azul)
6. #F472B6  (Rosa)
7. #2DD4BF  (Turquesa)
8. #FB923C  (Laranja)
```

---

### Tipografia

Todas as fontes usam a família **Inter**.

| Token | Tamanho | Peso | Line Height | Uso |
|-------|---------|------|-------------|-----|
| `heading-xl` | 28px | Bold (700) | 36px | Saudação na Home ("Olá, Lucas") |
| `heading-lg` | 24px | Bold (700) | 32px | Títulos de telas (Notas, Tarefas, Config) |
| `heading-md` | 20px | SemiBold (600) | 28px | Nome da matéria no card, títulos de seção |
| `heading-sm` | 17px | SemiBold (600) | 24px | Subtítulos menores |
| `body` | 16px | Regular (400) | 24px | Texto de anotações, conteúdo principal |
| `body-sm` | 14px | Regular (400) | 20px | Horários, informações secundárias |
| `caption` | 12px | Medium (500) | 16px | Tags, timestamps, labels de dias da semana |
| `button` | 16px | SemiBold (600) | 24px | Texto de botões |

---

### Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | 4px | Gaps mínimos entre badges/chips |
| `sm` | 8px | Espaço entre ícone e texto, padding interno pequeno |
| `md` | 16px | Padding principal de cards e containers |
| `lg` | 24px | Espaço entre seções, margens horizontais de tela |
| `xl` | 32px | Espaço entre grupos de conteúdo |
| `2xl` | 48px | Padding top de telas, espaço grande |

---

### Bordas e Raios

| Token | Valor |
|-------|-------|
| `radius-sm` | 8px |
| `radius-md` | 12px |
| `radius-lg` | 16px |
| `radius-xl` | 20px |
| `radius-full` | 999px |

---

## 📱 Layout Global

### Safe Areas
- Respeitar SafeAreaView do dispositivo em todas as telas
- Padding horizontal das telas: `lg` (24px)
- Padding top do conteúdo: `2xl` (48px) dentro da SafeArea

### Bottom Tab Bar
- Height: 64px (+ safe area bottom)
- Background: `surface` (#1C1C24)
- Borda top: 1px solid `border` (#32323E)
- 4 tabs igualmente distribuídas
- Ícone: 24x24px
  - Inativo: `text-tertiary` (#56566A)
  - Ativo: `accent` (#7C6AF4)
- Label abaixo do ícone: `caption` (12px), mesma cor do ícone
- Tab ativa tem dot indicator abaixo do ícone (4px diameter, `accent`)

| Tab | Label | Ícone (sugestão Ionicons) |
|-----|-------|---------------------------|
| 1 | Hoje | `today-outline` / `today` |
| 2 | Notas | `document-text-outline` / `document-text` |
| 3 | Tarefas | `calendar-outline` / `calendar` |
| 4 | Config | `settings-outline` / `settings` |

---

## 📱 Telas

---

### TELA 1: Onboarding — Boas-vindas

**Propósito**: Primeira tela ao abrir o app pela primeira vez.

**Layout**:
- Fundo: gradiente vertical de `#0F0F13` (topo) → `#1A1A2E` (base)
- Conteúdo centralizado verticalmente

**Elementos** (de cima para baixo, centralizados):
1. **Ícone/Logo**: Ícone de graduação (🎓) ou livro estilizado, 80x80px, cor `accent`
2. **Espaço**: 24px
3. **Título**: "Grade" — `heading-xl` (28px, Bold), cor `text-primary`
4. **Espaço**: 8px
5. **Subtítulo**: "Organize suas aulas, anotações e prazos em um só lugar." — `body` (16px, Regular), cor `text-secondary`, text-align center, max-width 280px
6. **Espaço**: 48px
7. **Botão "Começar"**: 
   - Full width (com padding horizontal 24px)
   - Height: 56px
   - Background: `accent` (#7C6AF4)
   - Texto: "Começar" — `button` (16px, SemiBold), cor `#FFFFFF`
   - Border radius: `radius-lg` (16px)

---

### TELA 2: Onboarding — Nome

**Propósito**: Capturar o nome do estudante.

**Layout**:
- Fundo: `background` (#0F0F13)
- Stepper no topo: 3 dots (esta é 1/3)

**Elementos**:
1. **Stepper**: 3 dots horizontais, centralizados
   - Cada dot: 8px diameter
   - Dot ativo: `accent` (#7C6AF4)
   - Dots inativos: `border` (#32323E)
   - Espaço entre dots: 8px
2. **Espaço**: 48px
3. **Título**: "Como podemos te chamar?" — `heading-lg` (24px, Bold), cor `text-primary`, text-align center
4. **Espaço**: 32px
5. **Input de nome**:
   - Full width (padding horizontal  24px)
   - Height: 56px
   - Background: `surface` (#1C1C24)
   - Border: 1.5px solid `border` (#32323E)
   - Border on focus: 1.5px solid `accent` (#7C6AF4)
   - Border radius: `radius-md` (12px)
   - Padding horizontal interno: 16px
   - Placeholder: "Seu nome" — `body` (16px), cor `text-tertiary`
   - Texto digitado: `body` (16px), cor `text-primary`
6. **Espaço**: 32px
7. **Botão "Próximo"**:
   - Mesmo estilo do botão "Começar" da Tela 1
   - Disabled state: opacity 0.4, não responde a toque
   - Habilitado quando input não está vazio
8. **Botão "Voltar"** (texto):
   - Centralizado abaixo do botão principal
   - Texto: "Voltar" — `body-sm` (14px), cor `text-secondary`
   - Sem background

---

### TELA 3: Onboarding — Cadastrar Matérias

**Propósito**: Cadastrar disciplinas com dias e horários.

**Layout**:
- Fundo: `background`
- Stepper: 2/3

**Elementos**:
1. **Stepper**: dot 2 ativo
2. **Espaço**: 32px
3. **Título**: "Monte sua grade" — `heading-lg`, cor `text-primary`
4. **Subtítulo**: "Adicione suas matérias do semestre" — `body-sm`, cor `text-secondary`
5. **Espaço**: 24px
6. **Lista de matérias adicionadas** (ScrollView vertical):
   - Cada item é um card:
     - Background: `surface` (#1C1C24)
     - Border radius: `radius-md` (12px)
     - Padding: 16px
     - Margin bottom: 12px
     - Layout: Row
       - **Bolinha de cor**: 12px diameter, border-radius full, cor da matéria
       - **Espaço horizontal**: 12px
       - **Coluna**:
         - Nome da matéria — `heading-sm` (17px, SemiBold), cor `text-primary`
         - Dias e horários — `body-sm` (14px), cor `text-secondary` (ex: "Seg, Qua · 08:00 - 09:40")
     - **Botão deletar** (lado direito): ícone de lixeira, 20x20, cor `danger` (#FF5C5C)
7. **Botão "Adicionar matéria"**:
   - Card com borda dashed (2px, cor `border`)
   - Background: transparente
   - Border radius: `radius-md` (12px)
   - Height: 56px
   - Conteúdo centralizado: ícone "+" (20px, cor `text-tertiary`) + texto "Adicionar matéria" (`body-sm`, cor `text-tertiary`)
   - Gap entre ícone e texto: 8px
8. **Espaço flexível**
9. **Botão "Próximo"**: mesmo estilo, disabled se nenhuma matéria adicionada
10. **Botão "Voltar"**: texto

**Modal/Tela de Adicionar Matéria** (abre ao tocar "Adicionar matéria"):
- Fundo: `surface-elevated` (#262630)
- Padding: 24px

Campos:
1. **Nome da matéria** (obrigatório):
   - Input idêntico ao da Tela 2
   - Placeholder: "Ex: Cálculo I"
2. **Espaço**: 16px
3. **Seletor de cor**:
   - Label: "Cor" — `body-sm`, cor `text-secondary`
   - Row de 8 bolinhas (as cores da paleta)
   - Cada bolinha: 32px, border-radius full
   - Selecionada: borda 2px solid `#FFFFFF`
   - Não selecionada: sem borda
   - Gap entre bolinhas: 12px
4. **Espaço**: 16px
5. **Dias da semana**:
   - Label: "Dias" — `body-sm`, cor `text-secondary`
   - Row de chips toggle: Seg · Ter · Qua · Qui · Sex · Sáb
   - Cada chip:
     - Height: 40px, min-width: 48px
     - Border radius: `radius-sm` (8px)
     - Inativo: background `surface` (#1C1C24), texto `text-secondary`, borda 1px `border`
     - Ativo: background `accent-soft`, texto `accent`, borda 1px `accent`
   - Gap: 8px
   - Permitir seleção múltipla
6. **Espaço**: 16px
7. **Horários**:
   - Label: "Horário" — `body-sm`, cor `text-secondary`
   - Row com 2 inputs:
     - "Início" — time picker, formato HH:MM
     - "Fim" — time picker, formato HH:MM
     - Separados por texto "até" (`body-sm`, `text-tertiary`)
   - Cada input: background `surface`, border 1px `border`, radius `radius-sm`, height 48px, width ~120px
8. **Espaço**: 24px
9. **Botão "Salvar matéria"**:
   - Estilo do botão principal (accent, full-width, 56px height)
   - Disabled até nome + pelo menos 1 dia + horários estarem preenchidos

---

### TELA 4: Onboarding — Grade Pronta

**Propósito**: Confirmação da grade do aluno.

**Layout**:
- Fundo: `background`
- Stepper: 3/3

**Elementos**:
1. **Stepper**: dot 3 ativo
2. **Espaço**: 32px
3. **Título**: "Sua grade está pronta! 🎓" — `heading-lg`, cor `text-primary`, text-align center
4. **Subtítulo**: "Aqui está um resumo das suas aulas" — `body-sm`, cor `text-secondary`, text-align center
5. **Espaço**: 24px
6. **Mini-grade visual**:
   - Card com background `surface`, radius `radius-lg` (16px), padding 16px
   - Grid de 6 colunas (header vazio + Seg a Sex)
   - Header row: labels dos dias — `caption` (12px, Medium), cor `text-secondary`
   - Eixo Y: faixas de horário (labels `caption`, cor `text-tertiary`)
   - Cada bloco de matéria: background = cor da matéria com opacity 0.2, borda left 3px cor da matéria sólida, radius 4px
   - Nome abreviado dentro do bloco: `caption`, cor da matéria (sólida)
7. **Espaço**: 32px
8. **Botão "Começar a usar!"**:
   - Estilo do botão principal
   - Texto: "Começar a usar! 🚀"

---

### TELA 5: Hoje (Home — Tab Principal)

**Propósito**: Mostrar as aulas do dia atual.

**Header**:
- Padding top: `2xl` (48px)
- **Saudação**: "Olá, {nome} 👋" — `heading-xl` (28px, Bold), cor `text-primary`
- **Espaço**: 4px
- **Data**: "Quinta, 5 de Março" — `body-sm` (14px), cor `text-secondary`
- **Espaço**: 24px

**Lista de aulas do dia** (ScrollView vertical):
- Cada **AulaCard**:
  - Background: `surface` (#1C1C24)
  - Border radius: `radius-md` (12px)
  - Padding: 16px
  - Margin bottom: 12px
  - Layout: Row
    - **Barra vertical**: width 4px, height 100%, border-radius full, cor da matéria
    - **Espaço horizontal**: 14px
    - **Coluna** (flex: 1):
      - **Nome da matéria**: `heading-md` (20px, SemiBold), cor `text-primary`
      - **Espaço vertical**: 4px
      - **Horário**: "08:00 – 09:40" — `body-sm` (14px), cor `text-secondary`, com ícone de relógio (16px, `text-tertiary`) à esquerda, gap 6px
      - **Espaço vertical**: 8px
      - **Badge**:
        - Se tem anotação: background `success` com opacity 0.15, texto "📝 Anotado" (`caption`, cor `success`)
        - Se não tem: background `surface-elevated`, texto "Sem anotação" (`caption`, cor `text-tertiary`)
        - Padding horizontal: 10px, padding vertical: 4px, border-radius full
  - **Toque**: toda a área é clicável, navega para a Sessão de Aula

**Estado Vazio** (dia sem aulas):
- Centralizado na tela
- Emoji: "🎉" — tamanho 48px
- **Espaço**: 16px
- **Título**: "Nenhuma aula hoje!" — `heading-md`, cor `text-secondary`
- **Espaço**: 8px
- **Subtítulo**: "Aproveite para revisar ou descansar" — `body-sm`, cor `text-tertiary`

---

### TELA 6: Sessão de Aula (Stack Screen — ao clicar em uma aula)

**Propósito**: Anotar sobre a aula daquele dia e criar tarefas.

**Header** (Stack navigation header customizado):
- Background: `background`
- **Botão voltar**: ícone chevron-back (24px, cor `text-primary`)
- **Título**: nome da matéria — `heading-md` (20px, SemiBold), com bolinha de cor (10px) à esquerda, gap 8px
- **Subtítulo**: "05 de Março · 08:00 – 09:40" — `caption` (12px), cor `text-secondary`

**Segmented Control** (abaixo do header):
- Background: `surface` (#1C1C24)
- Border radius: `radius-md` (12px)
- Height: 44px
- Padding: 4px
- 2 segmentos: **Anotações** | **Tarefas**
- Segmento ativo:
  - Background: `accent-soft` (rgba(124,106,244,0.15))
  - Texto: `accent` (#7C6AF4), `body-sm` (14px, SemiBold)
  - Border radius: `radius-sm` (8px)
- Segmento inativo:
  - Background: transparente
  - Texto: `text-tertiary` (#56566A), `body-sm` (14px, Regular)

#### Segmento "Anotações"

- **Área de texto** (ocupa todo o espaço disponível):
  - Background: `background` (#0F0F13)
  - Padding: `md` (16px)
  - Placeholder: "O que foi discutido na aula de hoje?" — `body` (16px), cor `text-tertiary`
  - Texto digitado: `body` (16px, Regular), cor `text-primary`
  - Multiline, auto-expanding height
  - TextInput sem borda, "naked"
  - O texto é **plain text** simples (sem formatação rica neste MVP)

#### Segmento "Tarefas"

- **Botão "Nova tarefa"** (topo):
  - Full width
  - Height: 48px
  - Background: transparente
  - Border: 1.5px dashed `border` (#32323E)
  - Border radius: `radius-md` (12px)
  - Conteúdo: "+" (20px) + "Nova tarefa" (`body-sm`), cor `text-tertiary`
  - Gap: 8px

- **Lista de tarefas desta sessão** (abaixo do botão):
  - Cada **TaskItem**:
    - Background: `surface`
    - Border radius: `radius-md` (12px)
    - Padding: 14px 16px
    - Margin bottom: 8px
    - Layout: Row
      - **Checkbox circular**: 22px diameter
        - Não concluída: borda 2px `border`, fundo transparente
        - Concluída: fundo `success` (#34C78B), ícone check branco (12px)
      - **Espaço horizontal**: 12px
      - **Coluna** (flex: 1):
        - **Descrição**: `body` (16px), cor `text-primary`
          - Se concluída: strikethrough, cor `text-tertiary`
        - **Data de entrega**: `caption` (12px), cor conforme status:
          - Atrasada: `danger`
          - Hoje: `warning`
          - Futura: `text-secondary`
          - Formato: "Entrega: 10 de Março"
      - **Botão deletar**: ícone trash (18px), cor `text-tertiary`, visível ao pressionar longo ou swipe

- **Modal "Nova Tarefa"**:
  - Fundo: `surface-elevated` (#262630)
  - Padding: 24px
  - Fields:
    1. Input "Descrição" — obrigatório, placeholder "O que precisa entregar?"
    2. Date picker "Data de entrega" — label acima, format "DD/MM/AAAA"
    3. Botão "Salvar" — accent, full-width, 56px height

---

### TELA 7: Todas as Notas (Tab "Notas")

**Propósito**: Ver todas as anotações de todas as matérias.

**Header**:
- **Título**: "Notas" — `heading-lg` (24px, Bold), cor `text-primary`
- **Espaço**: 16px
- **Barra de busca**:
  - Full width
  - Height: 48px
  - Background: `surface` (#1C1C24)
  - Border radius: `radius-md` (12px)
  - Ícone de busca (20px, `text-tertiary`) à esquerda, padding-left 14px
  - Placeholder: "Buscar nas anotações..." — `body-sm`, cor `text-tertiary`
  - Padding do texto: left 40px (após ícone)

**Filtro por matéria** (abaixo da busca):
- Row horizontal, ScrollView horizontal
- Chips de cada matéria:
  - Chip "Todas": sempre primeiro
     - Ativo: background `accent-soft`, texto `accent`
  - Chips das matérias: bolinha de cor (8px) + nome
    - Ativo: background cor da matéria com 15% opacity, texto cor da matéria
    - Inativo: background `surface`, texto `text-secondary`, borda 1px `border`
  - Height: 36px, padding horizontal 14px, border-radius full, gap 8px

**Lista de notas** (agrupadas por matéria ou por data — flat list):
- Cada **NoteCard**:
  - Background: `surface` (#1C1C24)
  - Border radius: `radius-md` (12px)
  - Padding: 16px
  - Margin bottom: 12px
  - Layout:
    - **Row topo**:
      - Bolinha de cor da matéria (10px) + nome da matéria (`caption`, cor da matéria) + "·" + data (`caption`, `text-secondary`)
    - **Espaço**: 8px
    - **Preview do conteúdo**: primeiras 2-3 linhas do texto — `body-sm` (14px), cor `text-primary`, numberOfLines={3}
  - **Toque**: navega para a Sessão de Aula daquela nota

**Estado Vazio**:
- Emoji: "📝" (48px)
- "Nenhuma anotação ainda" — `heading-md`, `text-secondary`
- "Suas anotações aparecerão aqui" — `body-sm`, `text-tertiary`

---

### TELA 8: Tarefas (Tab "Tarefas") — Visão Calendário

**Propósito**: Ver todas as tarefas com prazos em formato de calendário.

**Header**:
- **Título**: "Tarefas" — `heading-lg`, cor `text-primary`
- **Badge**: count de pendentes — pill shape, background `danger`, texto branco, `caption`, padding 4px 10px

**Calendário** (seção superior):
- **Navegação do mês**: "Março 2026" com setas ◀ ▶
  - Texto: `heading-sm` (17px, SemiBold), cor `text-primary`
  - Setas: 24px, cor `text-secondary`
- **Grid do calendário**:
  - Background: `surface` (#1C1C24)
  - Border radius: `radius-lg` (16px)
  - Padding: 16px
  - 7 colunas (Dom Seg Ter Qua Qui Sex Sáb)
  - Header: `caption`, cor `text-tertiary`
  - Células dos dias:
    - Tamanho: 40x40px, border-radius full
    - Normal: texto `body-sm`, cor `text-primary`
    - Hoje: borda 2px `accent`, texto `accent`
    - Dia com tarefa: dot de 6px abaixo do número, cor `accent` (pendente) ou `success` (concluída) ou `danger` (atrasada)
    - Dia selecionado: background `accent`, texto branco
    - Outro mês: cor `text-tertiary`

**Lista de tarefas do dia selecionado** (seção inferior):
- Label: "10 de Março" — `heading-sm`, cor `text-secondary`
- Cada **TaskItem**:
  - Mesmo componente da Tela 6 (Sessão de Aula → Segmento Tarefas)
  - Adicional: chip da matéria (bolinha + nome, `caption`, cor da matéria) ao lado da data
- Se nenhuma tarefa no dia: "Nenhuma tarefa neste dia" — `body-sm`, `text-tertiary`, centralizado

**Estado Vazio Global** (sem nenhuma tarefa):
- Emoji: "✅" (48px)
- "Nenhuma tarefa pendente!" — `heading-md`, `text-secondary`
- "Tarefas criadas nas aulas aparecerão aqui" — `body-sm`, `text-tertiary`

---

### TELA 9: Configurações (Tab "Config")

**Propósito**: Gerenciar perfil, matérias e informações do app.

**Header**:
- **Título**: "Configurações" — `heading-lg`, cor `text-primary`

**Conteúdo** (ScrollView):

**Seção "Perfil"**:
- Card com background `surface`, radius `radius-lg` (16px), padding 20px
- Layout: Row
  - **Avatar**: 48px diameter, border-radius full, background `accent`, texto iniciais (ex: "LD") em branco, `heading-sm` (17px, Bold)
  - **Espaço horizontal**: 16px
  - **Coluna**:
    - Nome — `heading-md` (20px, SemiBold), cor `text-primary`
    - "Toque para editar" — `caption`, cor `text-tertiary`
  - Toque → abre modal de edição de nome (input + botão salvar)

**Espaço**: 24px

**Seção "Grade"**:
- Label da seção: "GRADE" — `caption` (12px, Medium), cor `text-tertiary`, letter-spacing 1px, margin-bottom 8px
- Card com background `surface`, radius `radius-lg`, divisor entre itens (1px solid `border`)
- Item 1 — "Gerenciar matérias":
  - Layout: Row, height 56px, padding horizontal 16px
  - Ícone à esquerda: book (20px, `accent`)
  - Texto: "Gerenciar matérias" — `body` (16px), cor `text-primary`
  - Chevron à direita: chevron-forward (20px, `text-tertiary`)
  - Toque → navega para tela de gerenciamento (lista de matérias com editar/excluir/adicionar)

**Espaço**: 24px

**Seção "Sobre"**:
- Label: "SOBRE" — mesmo estilo de label de seção
- Card com background `surface`, radius `radius-lg`
- Item 1: "Versão" — `body`, valor "1.0.0 MVP" — `body-sm`, `text-secondary`
- Item 2: "Feito com 💜 por Lucas Dorice" — `body-sm`, cor `text-tertiary`

---

### TELA 10: Gerenciar Matérias (Stack Screen via Config)

**Propósito**: CRUD de matérias.

**Header Stack**:
- Botão voltar + título "Matérias" — `heading-lg`

**Lista de matérias**:
- Cada item:
  - Background: `surface`, radius `radius-md`, padding 16px, margin-bottom 12px
  - Layout: Row
    - Bolinha de cor (14px)
    - Espaço: 14px
    - Coluna:
      - Nome — `heading-sm`, cor `text-primary`
      - Dias e horário — `body-sm`, cor `text-secondary`
    - Botão editar: ícone pencil (20px, `text-secondary`) — abre modal de edição
    - Botão excluir: ícone trash (20px, `danger`)

**Botão "Adicionar matéria"**: mesma aparência da Tela 3 (card dashed)

---

## 🧩 Componentes Reutilizáveis

| Componente | Descrição | Props principais |
|------------|-----------|-----------------|
| `AulaCard` | Card de aula para tela "Hoje" | color, name, time, hasNotes |
| `TaskItem` | Item de tarefa com checkbox | description, dueDate, isCompleted, courseColor, courseName |
| `NoteCard` | Preview de anotação | courseName, courseColor, date, contentPreview |
| `SubjectChip` | Chip de matéria (bolinha + nome) | name, color, active |
| `EmptyState` | Estado vazio (emoji + título + subtítulo) | emoji, title, subtitle |
| `PrimaryButton` | Botão principal accent | label, onPress, disabled |
| `DashedButton` | Botão com borda pontilhada | label, onPress |
| `StepperDots` | Indicador de etapa do onboarding | totalSteps, currentStep |
| `DayChip` | Chip de dia da semana (toggle) | label, active, onToggle |
| `ColorPicker` | Seletor de cor (row de bolinhas) | selectedColor, onSelect |

---

## 📐 Mapa de Navegação

```
                    ┌──────────────┐
                    │  Primeiro    │
                    │  Acesso?     │
                    └──────┬───────┘
                           │ Sim
              ┌────────────▼─────────────┐
              │   ONBOARDING (Stack)     │
              │  1. Boas-vindas          │
              │  2. Nome                 │
              │  3. Cadastrar Matérias   │
              │  4. Grade Pronta         │
              └────────────┬─────────────┘
                           │
          ┌────────────────▼────────────────┐
          │         BOTTOM TAB BAR          │
          ├────────┬─────────┬──────────────┤
          │        │         │              │
     ┌────▼───┐ ┌──▼──┐ ┌───▼────┐ ┌──────▼──┐
     │  HOJE  │ │NOTAS│ │TAREFAS │ │ CONFIG  │
     │(Tab 1) │ │(T 2)│ │(Tab 3) │ │ (Tab 4) │
     └────┬───┘ └─────┘ └────────┘ └────┬────┘
          │                              │
     ┌────▼────┐                   ┌─────▼──────┐
     │ Sessão  │                   │ Gerenciar  │
     │ de Aula │                   │  Matérias  │
     │ (Stack) │                   │  (Stack)   │
     └─────────┘                   └────────────┘
```

---

## ⚠️ Notas para Implementação

1. **Texto simples**: Nas anotações, usar TextInput plain text. Sem rich text editor no MVP.
2. **Calendário**: Usar `react-native-calendars` ou implementação customizada do grid.
3. **Navegação**: Expo Router com Tab layout + Stack para telas internas.
4. **Persistência**: Todas as operações são locais (SQLite via expo-sqlite).
5. **Ícones**: Usar `@expo/vector-icons` (Ionicons).
6. **Fonte Inter**: Carregar via `expo-font` ou `@expo-google-fonts/inter`.
7. **Sem animações complexas**: Transições padrão do React Navigation são suficientes para o MVP.
