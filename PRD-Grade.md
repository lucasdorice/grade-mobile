# PRD - Grade: Diário de Bordo Acadêmico Inteligente

> **Versão**: 1.2 — MVP Definido
> **Data**: 01 de Março de 2026
> **Autor**: Lucas Dorice + Anti (AI)
> **Plataforma**: Mobile (iOS & Android)

## 1. Visão Geral

### 1.1 Resumo Executivo
O **Grade** é um diário de bordo digital focado na produtividade acadêmica. Centraliza a rotina universitária conectando a grade de horários com anotações ricas, blocos de código e controle de prazos em um único app mobile.

### 1.2 Problema
- **Desorganização** de conteúdos fragmentados entre caderno, fotos do quadro e WhatsApp
- **Perda de contexto** — anotações soltas sem vínculo com a aula
- **Esquecimento de prazos** — entregas se perdem ao longo do semestre
- **Tempo ocioso** — trajeto no transporte não é aproveitado para revisão

### 1.3 Solução
App mobile que integra: grade de aulas → anotações ricas com código → links e referências → gestão de prazos, com:
- Timeline diária baseada na grade de horários
- Cards de Aula com editor rico, syntax highlighting e links
- Hub de Tarefas com prazos, status e notificações
- Experiência offline-first pensada para uso em deslocamento

### 1.4 Objetivos do MVP
- Validar a proposta de valor com 10-20 estudantes
- Provar que a integração grade + anotações + prazos é útil
- Coletar feedback para priorizar a v2

---

## 2. Stakeholders

### 2.1 Equipe do Produto
- **Product Owner**: Lucas Dorice
- **Tech Lead**: [Nome]
- **Designer UX/UI**: [Nome]
- **Desenvolvedores**: [Times]

### 2.2 Stakeholders Externos
- **Estudantes universitários**: Usuários finais
- **Professores**: Fonte indireta de conteúdo
- **Instituições de ensino (FIAP)**: Contexto acadêmico e validação

---

## 3. Personas

### 3.1 Persona Primária: Estudante de Tecnologia
**Nome**: Gabriel, 21 anos
**Ocupação**: Estudante de ADS (FIAP), 6 matérias/semestre

**Motivações**: Organizar anotações com código em um lugar, não perder prazos, revisar no metrô
**Dores**: Anotações espalhadas, snippets perdidos, prazos descobertos em cima da hora
**Comportamento**: Mobile-first, prefere dark mode, pensa em código

### 3.2 Persona Secundária: Universitário Generalista
**Nome**: Camila, 23 anos
**Ocupação**: Estudante de Engenharia com matérias de programação

**Motivações**: Ferramenta simples, lembretes de entregas, separar por matéria
**Dores**: Notion complexo no mobile, esquece tarefas verbais, quer "abrir → anotar → fechar"
**Comportamento**: Usa Apple Notes/Keep, valoriza visual limpo

---

## 4. Escopo do MVP — O que ENTRA vs. O que FICA PRA DEPOIS

### ✅ ENTRA no MVP

| # | Funcionalidade | Justificativa |
|---|---------------|---------------|
| 1 | **CRUD da Grade Semestral + Múltiplos Semestres** | Fundação do app + acesso ao histórico |
| 2 | **Wizard de Onboarding** | Primeira impressão guiada e profissional |
| 3 | **Timeline Diária** | Ver "o que tenho hoje" |
| 4 | **Card da Aula — Editor Rico** | Anotações com negrito, listas e imagens |
| 5 | **Card da Aula — Bloco de Código** | Diferencial-chave para estudantes de TI |
| 6 | **Card da Aula — Links & Referências** | Centralizar materiais do professor |
| 7 | **Hub de Tarefas (CRUD + status)** | Controle de prazos é dor principal |
| 8 | **Notificações Push de Prazos** | Garantir que prazos não passem batido |
| 9 | **Dark Mode** | Padrão para público de TI |

### ❌ FICA PRA DEPOIS (v2+)

| Funcionalidade | Motivo do corte |
|---------------|-----------------|
| Radar de Termos (glossário) | Nice-to-have, pode anotar no resumo |
| Busca full-text | Complexidade técnica alta (FTS5), pouco dado no MVP |
| Exportação/backup JSON | Baixo risco de perda com poucas semanas de uso |
| Biometria/lock do app | Dados acadêmicos não são sensíveis, prejudica quick capture |
| Criação automática de Card | Background tasks são complexos no mobile |

---

## 5. Requisitos Funcionais (MVP)

### 5.1 Módulo de Onboarding

#### RF-001: Wizard de Primeiro Uso
**Prioridade**: Must Have
**Descrição**: Sequência guiada para configurar o app no primeiro uso

**Critérios de Aceitação**:
- Tela 1: Boas-vindas + proposta de valor (com ilustração)
- Tela 2: "Qual seu nome?" — input de texto
- Tela 3: "Vamos montar sua grade!" — formulário de disciplinas (pode adicionar várias)
- Tela 4: Preview da grade semanal montada → botão "Começar!"
- Indicador de progresso (dots/stepper)
- Opção de pular e configurar depois
- Só aparece na primeira vez (flag persistida)

### 5.2 Módulo de Gestão da Grade

#### RF-002: Gestão de Semestres
**Prioridade**: Must Have
**Descrição**: CRUD de semestres com suporte a histórico

**Critérios de Aceitação**:
- Criar semestre: nome (ex: "2026.1"), data início/fim
- Definir semestre ativo (apenas 1 ativo por vez)
- Visualizar semestres anteriores e seus Cards (somente leitura)
- Excluir semestre (com confirmação — deleta disciplinas, cards e tarefas associadas)

#### RF-003: Cadastro de Disciplinas
**Prioridade**: Must Have
**Descrição**: CRUD de disciplinas dentro do semestre ativo

**Critérios de Aceitação**:
- Adicionar disciplina: nome, dia(s) da semana, horário início/fim, professor (opcional)
- Editar e excluir disciplina
- Cor automática atribuída (paleta pré-definida)
- Disciplinas vinculadas ao semestre ativo

#### RF-004: Timeline Diária
**Prioridade**: Must Have
**Descrição**: Tela inicial mostrando as aulas do dia em ordem cronológica

**Critérios de Aceitação**:
- Lista vertical com cards das aulas do dia atual
- Cada card exibe: nome da disciplina, horário, cor, indicador se já tem anotação
- Toque no card → abre o Card da Aula
- Navegação entre dias (anterior/próximo) via swipe ou setas
- Estado vazio amigável para dias sem aula

### 5.3 Módulo de Card da Aula

#### RF-005: Card da Aula
**Prioridade**: Must Have
**Descrição**: Tela de registro vinculada a uma aula em uma data específica

**Critérios de Aceitação**:
- Header: nome da disciplina, data, horário
- Três seções via tabs: **Anotações** · **Código** · **Links**
- Criação manual: tocar no card da timeline cria/abre o registro daquele dia
- Um Card por aula por dia
- Salvamento automático ao sair

#### RF-006: Seção de Anotações (Editor Rico)
**Prioridade**: Must Have
**Descrição**: Editor de texto rico para anotações da aula

**Critérios de Aceitação**:
- Formatação: **negrito**, *itálico*, listas (bullet e numerada), headings
- Inserção de imagens (câmera ou galeria — foto do quadro/slide)
- Placeholder: "O que foi discutido na aula de hoje?"
- Salvamento automático (debounced)
- Sem limite de caracteres

#### RF-007: Seção de Código (Syntax Highlighting)
**Prioridade**: Must Have
**Descrição**: Blocos de código com highlight

**Critérios de Aceitação**:
- Botão "Adicionar bloco de código"
- Seletor de linguagem: JavaScript, HTML, CSS, Python, Java
- Área de input para o código (monospace font)
- Visualização com syntax highlighting (tema escuro)
- Botão copiar com feedback visual
- Múltiplos blocos por Card, com título opcional
- Excluir bloco individual

#### RF-008: Seção de Links & Referências
**Prioridade**: Must Have
**Descrição**: Mapeamento de links e materiais da aula

**Critérios de Aceitação**:
- Adicionar link: título, URL, tag opcional ("documentação", "tutorial", "exercício")
- Preview básico do link (título + favicon quando online)
- Abertura do link no navegador externo com um toque
- Editar e excluir link
- Detecção automática de URL quando colada

### 5.4 Módulo Hub de Tarefas

#### RF-009: CRUD de Tarefas
**Prioridade**: Must Have
**Descrição**: Criar, editar, concluir e excluir tarefas

**Critérios de Aceitação**:
- Campos: título (obrigatório), disciplina (dropdown), data de entrega (date picker)
- Status: `A fazer` ↔ `Concluída` (toggle simples)
- Editar e excluir tarefa
- Criação a partir do Hub (tarefa avulsa)

#### RF-010: Lista de Tarefas
**Prioridade**: Must Have
**Descrição**: Visualização de todas as tarefas

**Critérios de Aceitação**:
- Lista ordenada por data de entrega (mais próxima primeiro)
- Indicador visual de tarefa atrasada (data vencida + status "A fazer")
- Separação visual: pendentes no topo, concluídas embaixo (colapsável)
- Estado vazio amigável

#### RF-011: Notificações de Prazos
**Prioridade**: Must Have
**Descrição**: Push notifications locais para lembrar de prazos

**Critérios de Aceitação**:
- Notificação 1 dia antes do prazo
- Notificação no dia do prazo (manhã)
- Permissão de notificação solicitada no onboarding
- Ao tocar na notificação → abre o Hub de Tarefas

### 5.5 Configurações

#### RF-012: Configurações Básicas
**Prioridade**: Must Have
**Descrição**: Configurações do app

**Critérios de Aceitação**:
- Nome do estudante (editável)
- Toggle dark/light mode
- Gestão de semestres (criar, alternar, visualizar histórico)
- Sobre o app (versão)

---

## 6. Requisitos Não-Funcionais (MVP)

### 6.1 Performance
- **RNF-001**: Abertura do app em < 2 segundos
- **RNF-002**: Transição entre telas < 300ms
- **RNF-003**: Salvamento automático sem lag no editor

### 6.2 Disponibilidade
- **RNF-004**: App 100% funcional offline (offline-first, dados locais)
- **RNF-005**: Crash-free rate ≥ 99%

### 6.3 Usabilidade
- **RNF-006**: Operação confortável com uma mão
- **RNF-007**: Dark mode como tema padrão
- **RNF-008**: Quick capture: máximo 2 toques para começar a anotar

### 6.4 Compatibilidade
- **RNF-009**: iOS 15+
- **RNF-010**: Android 10+

---

## 7. User Stories (MVP)

### 7.1 Épico: Onboarding

**US-001**: Como novo usuário, quero ser guiado na configuração inicial para começar a usar o app rapidamente
**Prioridade**: Must Have · **Estimativa**: 5 pontos
**Critérios**:
- [ ] Sequência de telas com boas-vindas, nome, grade
- [ ] Preview da grade montada
- [ ] Opção de pular

### 7.2 Épico: Grade e Timeline

**US-002**: Como estudante, quero cadastrar minhas disciplinas e semestres para organizar minha rotina
**Prioridade**: Must Have · **Estimativa**: 8 pontos
**Critérios**:
- [ ] CRUD de semestres e disciplinas
- [ ] Navegar entre semestres (ativo + histórico)

**US-003**: Como estudante, quero ver as aulas do dia ao abrir o app
**Prioridade**: Must Have · **Estimativa**: 5 pontos
**Critérios**:
- [ ] Timeline do dia com cards de cada aula
- [ ] Navegar entre dias
- [ ] Indicador se a aula já tem anotação

### 7.3 Épico: Anotações

**US-004**: Como estudante, quero anotar com formatação durante a aula, incluindo fotos do quadro
**Prioridade**: Must Have · **Estimativa**: 8 pontos
**Critérios**:
- [ ] Editor rico (negrito, itálico, listas, headings)
- [ ] Inserção de imagem (câmera/galeria)
- [ ] Salvamento automático

**US-005**: Como estudante de programação, quero salvar código com syntax highlighting
**Prioridade**: Must Have · **Estimativa**: 8 pontos
**Critérios**:
- [ ] Bloco de código com seleção de linguagem
- [ ] Syntax highlighting + botão copiar
- [ ] Múltiplos blocos por Card

**US-006**: Como estudante, quero salvar links do professor para acessá-los facilmente
**Prioridade**: Must Have · **Estimativa**: 5 pontos
**Critérios**:
- [ ] Adicionar link com título, URL e tag
- [ ] Abrir no navegador com um toque

### 7.4 Épico: Tarefas

**US-007**: Como estudante, quero registrar entregas com prazos para não esquecer
**Prioridade**: Must Have · **Estimativa**: 5 pontos
**Critérios**:
- [ ] CRUD de tarefas com título, disciplina, data
- [ ] Marcar como concluída
- [ ] Indicador de atraso

**US-008**: Como estudante, quero receber lembretes de prazos no celular
**Prioridade**: Must Have · **Estimativa**: 5 pontos
**Critérios**:
- [ ] Push notification 1 dia antes e no dia
- [ ] Toque na notificação abre o Hub

---

## 8. Fluxos de Usuário (MVP)

### 8.1 Fluxo: Primeiro Uso (Wizard)

```
1. Abre o app pela primeira vez
2. Tela de boas-vindas: proposta de valor + ilustração
3. "Qual seu nome?" → digita nome
4. "Vamos montar sua grade!" → adiciona disciplinas
5. Preview da grade semanal
6. "Tudo pronto! 🎓" → vai para Timeline do dia
```

### 8.2 Fluxo: Anotar na Aula

```
1. Abre o app → Timeline do dia
2. Toca na aula atual
3. Card abre na aba "Anotações"
4. Escreve com formatação (negrito, listas)
5. Tira foto do quadro → imagem inserida
6. Alterna para aba "Código"
7. Adiciona bloco → seleciona JavaScript → cola snippet
8. Alterna para aba "Links"
9. Cola URL do material do professor
10. Sai do Card → tudo salvo automaticamente
```

### 8.3 Fluxo: Registrar e Acompanhar Tarefa

```
1. Vai ao Hub de Tarefas (tab)
2. Toca "+" → preenche título, disciplina, data
3. Salva → aparece na lista
4. 1 dia antes → recebe push notification
5. Conclui → marca como feita
```

---

## 9. Arquitetura Técnica (MVP)

### 9.1 Componentes

```
┌──────────────────────────────────────┐
│            Grade App (MVP)           │
│           (iOS & Android)            │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────┐ ┌────────┐ ┌────────┐ │
│  │ Timeline  │ │  Hub   │ │Config. │ │
│  │  (Home)   │ │Tarefas │ │        │ │
│  └─────┬─────┘ └───┬────┘ └───┬────┘ │
│        └─────┬─────┘──────────┘      │
│              │                       │
│  ┌───────────▼─────────────────────┐ │
│  │     State (Zustand / Context)   │ │
│  └───────────┬─────────────────────┘ │
│              │                       │
│  ┌───────────▼─────────────────────┐ │
│  │      SQLite (expo-sqlite)       │ │
│  │  semesters · subjects · cards   │ │
│  │  snippets · links · tasks       │ │
│  └─────────────────────────────────┘ │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │   Notificações (expo-notif.)   │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Navegação: 3 tabs** → Hoje (Timeline) · Tarefas (Hub) · Config

### 9.2 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native + Expo |
| Linguagem | TypeScript |
| Navegação | React Navigation (bottom tabs + stack) |
| Estado | Zustand |
| Banco local | expo-sqlite |
| Editor rico | @10play/tentap-editor (Tiptap para RN) |
| Syntax Highlight | react-native-syntax-highlighter |
| Notificações | expo-notifications |
| Imagens | expo-image-picker |
| Tema | React Navigation themes (dark/light) |

---

## 10. Modelo de Dados (MVP)

### 10.1 Tabelas

**semesters**
```sql
id          INTEGER PRIMARY KEY AUTOINCREMENT
name        TEXT NOT NULL        -- "2026.1"
start_date  TEXT                 -- "2026-02-01"
end_date    TEXT                 -- "2026-06-30"
is_active   INTEGER DEFAULT 1   -- 0 ou 1
created_at  TEXT DEFAULT (datetime('now'))
```

**subjects**
```sql
id          INTEGER PRIMARY KEY AUTOINCREMENT
semester_id INTEGER NOT NULL REFERENCES semesters(id) ON DELETE CASCADE
name        TEXT NOT NULL
professor   TEXT
color       TEXT NOT NULL        -- "#FF6B6B"
created_at  TEXT DEFAULT (datetime('now'))
```

**schedules**
```sql
id          INTEGER PRIMARY KEY AUTOINCREMENT
subject_id  INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE
day_of_week INTEGER NOT NULL     -- 0=dom ... 6=sab
start_time  TEXT NOT NULL        -- "08:00"
end_time    TEXT NOT NULL        -- "09:40"
```

**cards**
```sql
id          INTEGER PRIMARY KEY AUTOINCREMENT
subject_id  INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE
date        TEXT NOT NULL        -- "2026-03-01"
notes       TEXT DEFAULT ''      -- conteúdo do editor rico (HTML/JSON)
created_at  TEXT DEFAULT (datetime('now'))
updated_at  TEXT DEFAULT (datetime('now'))
UNIQUE(subject_id, date)
```

**code_snippets**
```sql
id          INTEGER PRIMARY KEY AUTOINCREMENT
card_id     INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE
title       TEXT DEFAULT ''
language    TEXT NOT NULL
code        TEXT NOT NULL
sort_order  INTEGER DEFAULT 0
created_at  TEXT DEFAULT (datetime('now'))
```

**links**
```sql
id          INTEGER PRIMARY KEY AUTOINCREMENT
card_id     INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE
title       TEXT NOT NULL
url         TEXT NOT NULL
tag         TEXT DEFAULT ''
created_at  TEXT DEFAULT (datetime('now'))
```

**tasks**
```sql
id          INTEGER PRIMARY KEY AUTOINCREMENT
subject_id  INTEGER REFERENCES subjects(id) ON DELETE SET NULL
title       TEXT NOT NULL
due_date    TEXT
is_done     INTEGER DEFAULT 0
created_at  TEXT DEFAULT (datetime('now'))
completed_at TEXT
```

**settings**
```sql
key         TEXT PRIMARY KEY
value       TEXT NOT NULL
```

---

## 11. Segurança e Privacidade

### 11.1 Medidas (MVP)
- Todos os dados ficam **exclusivamente** no dispositivo
- Nenhum servidor, API ou conexão externa
- Sem coleta de dados, analytics ou telemetria

### 11.2 LGPD
- Dados inseridos voluntariamente pelo estudante
- Controle total do usuário (pode deletar tudo)
- Nenhum terceiro acessa os dados

---

## 12. Monetização

### MVP: 100% Gratuito
Foco total em validação. Nenhuma monetização.

### Futuro (se validado)
- Sync na nuvem: R$ 9,90/mês
- Exportação PDF dos Cards
- Temas visuais premium

---

## 13. Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| Cards criados/semana (por usuário) | ≥ 3 |
| Tarefas criadas/semana | ≥ 2 |
| Crash-free rate | ≥ 99% |
| Feedback qualitativo | ≥ 7/10 (média) |

**Como medir**: Entrevistas com beta testers + Google Forms + Sentry para crashes.

---

## 14. Roadmap

### 14.1 MVP (8 semanas)

**Semanas 1-2: Sprint 1 — Fundação + Onboarding + Grade**
- [ ] Setup: React Native + Expo + TypeScript + SQLite
- [ ] Navegação (3 tabs)
- [ ] Wizard de onboarding (4 telas)
- [ ] CRUD de semestres e disciplinas
- [ ] Timeline diária com navegação entre dias
- [ ] Dark/light mode

**Semanas 3-4: Sprint 2 — Card da Aula**
- [ ] Tela do Card com 3 tabs (Anotações · Código · Links)
- [ ] Editor rico (negrito, itálico, listas, headings, imagens)
- [ ] Blocos de código com syntax highlighting
- [ ] Seção de Links & Referências (CRUD + preview)

**Semanas 5-6: Sprint 3 — Hub de Tarefas + Notificações**
- [ ] CRUD de tarefas
- [ ] Lista com indicador de atraso
- [ ] Notificações push locais (1 dia antes + no dia)
- [ ] Tela de configurações

**Semanas 7-8: Sprint 4 — Polish + Beta**
- [ ] Navegação entre semestres (histórico read-only)
- [ ] Animações e transições
- [ ] Testes manuais e bugfixes
- [ ] **Beta com 10-20 estudantes** 🚀

### 14.2 v2 (pós-validação)
- [ ] Radar de Termos (glossário com status)
- [ ] Busca full-text
- [ ] Exportação/backup de dados
- [ ] Biometria/lock do app
- [ ] Criação automática de Card por horário
- [ ] Widgets (iOS/Android) com tarefas do dia
- [ ] Sync na nuvem

---

## 15. Riscos e Mitigações

### 15.1 Riscos Técnicos

| Risco | Prob. | Impacto | Mitigação |
|-------|:---:|:---:|-----------|
| Editor rico (Tiptap) pesado no RN | Média | Alto | Testar @10play/tentap-editor cedo, ter fallback para texto simples |
| Syntax highlighting pesado | Média | Médio | Lib leve, renderização lazy |
| Notificações no iOS/Android | Baixa | Médio | expo-notifications abstrai bem, testar em device real |

### 15.2 Riscos de Negócio

| Risco | Prob. | Impacto | Mitigação |
|-------|:---:|:---:|-----------|
| Estudantes preferem Notion | Alta | Alto | Diferencial: grade + código + mobile-first |
| MVP ainda complexo (12 RFs) | Média | Médio | Priorizar sprint a sprint, cortar se necessário |

### 15.3 Riscos Operacionais

| Risco | Prob. | Impacto | Mitigação |
|-------|:---:|:---:|-----------|
| Grade manual é chata | Alta | Médio | Wizard bem desenhado, poucos campos |
| Sem backup, risco de perda | Média | Alto | Comunicar limitação, priorizar na v2 |

---

## 16. Critérios de Sucesso

O MVP será **validado** se, após 2 semanas de beta:

1. **≥ 3 Cards criados/semana** por beta tester
2. **Feedback qualitativo ≥ 7/10**
3. **≥ 60% dos testers** dizem que usariam no dia a dia
4. **0 crashes bloqueantes** em uso normal
5. Beta testers identificam **3+ funcionalidades** que querem na v2

---

## 17. Apêndices

### 17.1 Glossário
- **Card da Aula**: Registro de anotações + código + links vinculado a uma aula em uma data
- **Hub de Tarefas**: Lista unificada de entregas e prazos
- **Timeline**: Visualização cronológica das aulas do dia
- **Snippet**: Bloco de código com syntax highlighting

### 17.2 Referências de Design

| Referência | O que absorver |
|------------|----------------|
| **Notion** | Blocos de código formatados, editor rico |
| **Google Keep** | Agilidade: abrir → capturar → fechar |
| **Todoist** | Gestão de prazos clara ("fazer hoje") |

### 17.3 Contatos
- **Product Owner**: Lucas Dorice — [email]

---

## 18. Histórico de Versões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-03-01 | Anti + Lucas | PRD completo inicial |
| 1.1 | 2026-03-01 | Anti + Lucas | Redução para MVP enxuto |
| 1.2 | 2026-03-01 | Anti + Lucas | MVP definido: +editor rico, +links, +notificações, +semestres, +wizard |

---

**Última atualização**: 01 de Março de 2026
**Status**: Aprovado para desenvolvimento
**Próxima revisão**: [Data]
