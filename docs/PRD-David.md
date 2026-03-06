# PRD - Sistema de Gestão de Acesso a Câmeras de Segurança

## 1. Visão Geral

### 1.1 Resumo Executivo
Plataforma digital que permite à empresa de segurança gerenciar assinaturas e acesso a torres de câmeras de vigilância instaladas em ruas e estabelecimentos. O sistema automatiza cobrança, controle de acesso e visualização de câmeras através de aplicativo mobile e web.

### 1.2 Problema
- **Gestão manual** de pagamentos e controle de acesso é trabalhosa e propensa a erros
- **Inadimplência** dificulta sustentabilidade do negócio
- **Falta de controle** sobre quem tem acesso ativo às câmeras
- **Alto custo operacional** para ativar/desativar acessos manualmente
- **Dificuldade de escala** sem automação

### 1.3 Solução
Aplicativo que automatiza todo o ciclo: assinatura → pagamento → acesso às câmeras, com:
- Cobrança recorrente automatizada
- Controle de acesso em tempo real baseado em status de pagamento
- Visualização de câmeras por localização
- Painel administrativo para gestão completa

### 1.4 Objetivos do Produto
- Reduzir inadimplência em 60% nos primeiros 6 meses
- Automatizar 95% das operações de gestão de acesso
- Permitir escala para 100+ torres sem aumento proporcional de equipe
- Aumentar receita recorrente em 40% no primeiro ano
- Oferecer experiência de usuário superior aos concorrentes

---

## 2. Stakeholders

### 2.1 Equipe do Produto
- **Product Owner**: [Nome]
- **Tech Lead**: [Nome]
- **Designer UX/UI**: [Nome]
- **Desenvolvedores**: [Times]

### 2.2 Stakeholders Externos
- **Empresa de Segurança**: Cliente principal, dono das torres
- **Assinantes**: Pessoas físicas e jurídicas que pagam pelo acesso
- **Equipe de Instalação**: Responsáveis pela infraestrutura física

---

## 3. Personas

### 3.1 Persona Primária: Morador Preocupado
**Nome**: Carlos, 42 anos  
**Ocupação**: Comerciante  
**Contexto**: Mora em bairro residencial com histórico de furtos  
**Motivações**:
- Aumentar segurança da família
- Monitorar movimento na rua
- Sentir-se mais seguro ao sair de casa

**Dores**:
- Medo de assaltos e furtos
- Falta de policiamento efetivo
- Não quer investir em sistema próprio caro

**Comportamento**:
- Usa smartphone diariamente
- Participa de grupo de WhatsApp da vizinhança
- Disposto a pagar mensalidade acessível por segurança

### 3.2 Persona Secundária: Gestor Empresarial
**Nome**: Mariana, 35 anos  
**Ocupação**: Gerente de facilities de rede de lojas  
**Contexto**: Gerencia 15 lojas em diferentes bairros  
**Motivações**:
- Reduzir perdas e vandalismo
- Complementar segurança patrimonial
- Ter evidências em caso de incidentes

**Dores**:
- Custo alto de segurança privada tradicional
- Necessidade de múltiplos fornecedores
- Dificuldade de gestão centralizada

**Comportamento**:
- Precisa de relatórios e métricas
- Quer controle centralizado
- Valoriza suporte técnico responsivo

### 3.3 Persona Admin: Gestor da Empresa de Segurança
**Nome**: Roberto, 38 anos  
**Ocupação**: Dono da empresa de segurança  
**Contexto**: Expandindo modelo de negócio com torres  
**Motivações**:
- Escalar negócio de forma sustentável
- Reduzir custos operacionais
- Aumentar previsibilidade de receita

**Dores**:
- Gestão manual consome muito tempo
- Inadimplência afeta fluxo de caixa
- Dificuldade de expandir sem contratar mais gente

**Comportamento**:
- Precisa de dashboard de gestão
- Quer métricas financeiras claras
- Valoriza automação

---

## 4. Requisitos Funcionais

### 4.1 Módulo de Autenticação e Cadastro

#### RF-001: Cadastro de Usuário
**Prioridade**: Alta  
**Descrição**: Usuário pode criar conta no aplicativo via Logto.io

**Critérios de Aceitação**:
- Integração com Logto SDK (React Native)
- Campos obrigatórios: nome completo, CPF/CNPJ, email, telefone, senha
- Validação de CPF/CNPJ
- Validação de email (formato e confirmação via código)
- Senha com mínimo 8 caracteres, incluindo letra e número
- Termos de uso e política de privacidade devem ser aceitos
- Confirmação por email (código de 4-6 dígitos) via Logto
- Customização de UI do Logto com logo e cores da marca

#### RF-002: Login
**Prioridade**: Alta  
**Descrição**: Usuário autenticado pode acessar o sistema via Logto.io

**Critérios de Aceitação**:
- Login via email + senha (gerenciado pelo Logto)
- Opção "Lembrar-me" mantém sessão por 30 dias (refresh tokens do Logto)
- Recuperação de senha via email (fluxo do Logto)
- Biometria (digital/face) após primeiro login bem-sucedido (integração nativa do device)
- Mensagem clara de erro para credenciais inválidas
- Tokens JWT gerenciados pelo Logto (access token + refresh token)
- SSO com Google/Facebook (opcional, configurável no Logto)

#### RF-003: Perfil do Usuário
**Prioridade**: Média  
**Descrição**: Usuário pode visualizar e editar informações pessoais

**Critérios de Aceitação**:
- Visualizar dados cadastrais
- Editar: nome, telefone, foto de perfil
- Não pode editar: CPF/CNPJ, email (requer processo de verificação)
- Alterar senha com confirmação da senha atual

### 4.2 Módulo de Assinaturas e Pagamentos

#### RF-004: Catálogo de Torres Disponíveis
**Prioridade**: Alta  
**Descrição**: Usuário pode visualizar torres de câmeras disponíveis

**Critérios de Aceitação**:
- Listar torres por proximidade (geolocalização)
- Buscar por endereço/bairro
- Visualizar no mapa interativo
- Informações: localização, ângulo de cobertura, preço, status (disponível/indisponível)
- Filtros: por preço, por bairro, por status

#### RF-005: Assinar Acesso a Torre
**Prioridade**: Alta  
**Descrição**: Usuário pode assinar mensalmente uma ou mais torres

**Critérios de Aceitação**:
- Seleção de torre desejada
- Escolha do plano (mensal, trimestral, anual)
- Informar método de pagamento (cartão de crédito)
- Confirmação com resumo: torre, preço, data de cobrança
- Tokenização do cartão (não armazena dados sensíveis)
- Email de confirmação de assinatura

#### RF-006: Processamento de Pagamento Recorrente
**Prioridade**: Alta  
**Descrição**: Sistema cobra automaticamente mensalidade

**Critérios de Aceitação**:
- Tentativa de cobrança no dia do vencimento
- Retry automático em caso de falha (3 tentativas em 7 dias)
- Notificação ao usuário sobre cobrança bem-sucedida
- Notificação sobre falha na cobrança
- Suspensão de acesso após 3 falhas consecutivas
- Reativação automática ao regularizar pagamento

#### RF-007: Compra de Créditos (Alternativa)
**Prioridade**: Média  
**Descrição**: Usuário pode comprar créditos para acesso por tempo limitado

**Critérios de Aceitação**:
- Pacotes de créditos disponíveis (ex: 10h, 30h, 100h)
- Crédito válido por 90 dias
- Consumo por minuto de visualização
- Saldo visível no app
- Notificação quando créditos estão acabando (< 20%)
- Histórico de consumo

#### RF-008: Gestão de Assinaturas
**Prioridade**: Alta  
**Descrição**: Usuário pode gerenciar suas assinaturas ativas

**Critérios de Aceitação**:
- Visualizar todas assinaturas ativas
- Ver próxima data de cobrança
- Atualizar método de pagamento
- Cancelar assinatura (efeito ao fim do período pago)
- Reativar assinatura cancelada
- Histórico de faturas e pagamentos

### 4.3 Módulo de Visualização de Câmeras

#### RF-009: Acesso ao Feed de Câmera
**Prioridade**: Alta  
**Descrição**: Usuário com acesso ativo pode visualizar câmera em tempo real

**Critérios de Aceitação**:
- Verificação automática de status de pagamento
- Stream em tempo real com latência < 3 segundos
- Qualidade adaptativa conforme conexão (auto, alta, média, baixa)
- Controles: play/pause, fullscreen, captura de screenshot
- Indicador de latência e qualidade de stream
- Mensagem clara se acesso for negado (pagamento pendente)

#### RF-010: Múltiplas Câmeras
**Prioridade**: Média  
**Descrição**: Usuário com múltiplas assinaturas pode alternar entre câmeras

**Critérios de Aceitação**:
- Listar todas câmeras com acesso ativo
- Trocar de câmera sem sair da tela de visualização
- Indicador visual de qual câmera está sendo exibida
- Grid view opcional (até 4 câmeras simultâneas)

#### RF-011: Notificações de Movimento (Futuro)
**Prioridade**: Baixa  
**Descrição**: Sistema pode alertar sobre detecção de movimento

**Critérios de Aceitação**:
- Configuração de alertas por câmera
- Push notification em tempo real
- Filtros: horário, sensibilidade
- Histórico de alertas recebidos

#### RF-012: Gravações (Futuro)
**Prioridade**: Baixa  
**Descrição**: Acesso a gravações históricas

**Critérios de Aceitação**:
- Disponível apenas em planos premium
- Retenção de 7/30 dias conforme plano
- Busca por data e hora
- Download de clips (marcação d'água)

### 4.4 Módulo Administrativo (Empresa de Segurança)

#### RF-013: Dashboard Gerencial
**Prioridade**: Alta  
**Descrição**: Painel com métricas chave do negócio

**Critérios de Aceitação**:
- MRR (Monthly Recurring Revenue)
- Número de assinantes ativos vs. cancelados
- Taxa de churn mensal
- Taxa de inadimplência
- Receita por torre
- Gráficos de evolução temporal

#### RF-014: Gestão de Torres
**Prioridade**: Alta  
**Descrição**: CRUD de torres de câmeras

**Critérios de Aceitação**:
- Cadastrar nova torre: localização (GPS), endereço, ângulo de cobertura, preço mensal
- Editar informações de torre existente
- Ativar/desativar torre (disponibilidade)
- Excluir torre (com validação de assinaturas ativas)
- Upload de imagem de referência da área coberta
- Status da câmera: online/offline

#### RF-015: Gestão de Assinantes
**Prioridade**: Alta  
**Descrição**: Visualizar e gerenciar base de clientes

**Critérios de Aceitação**:
- Listar todos assinantes com filtros (status, torre, inadimplência)
- Buscar por nome, CPF, email
- Visualizar detalhes: assinaturas ativas, histórico de pagamentos
- Conceder acesso temporário manual (cortesia)
- Suspender/reativar assinatura manualmente
- Exportar relatórios em CSV/Excel

#### RF-016: Gestão Financeira
**Prioridade**: Alta  
**Descrição**: Controle de receitas e inadimplência

**Critérios de Aceitação**:
- Relatório de cobranças do mês
- Detalhamento de pagamentos bem-sucedidos
- Lista de inadimplentes com dias de atraso
- Ações em lote: enviar lembrete, suspender acesso
- Conciliação com gateway de pagamento
- Relatórios para contabilidade

#### RF-017: Configurações do Sistema
**Prioridade**: Média  
**Descrição**: Configurar parâmetros gerais

**Critérios de Aceitação**:
- Definir preços padrão por torre
- Configurar tentativas de cobrança e intervalos
- Customizar mensagens de notificação
- Configurar políticas de cancelamento e reembolso
- Gerenciar usuários admin (adicionar, remover, permissões)

---

## 5. Requisitos Não-Funcionais

### 5.1 Performance
- **RNF-001**: Tempo de carregamento da lista de torres < 2 segundos
- **RNF-002**: Latência do stream de vídeo < 3 segundos em 4G
- **RNF-003**: App deve funcionar com conexões de no mínimo 1 Mbps
- **RNF-004**: Suportar 1000 usuários simultâneos visualizando câmeras

### 5.2 Disponibilidade
- **RNF-005**: Uptime de 99.5% (máximo 3.6 horas de downtime/mês)
- **RNF-006**: Sistema de pagamentos deve ter redundância
- **RNF-007**: Monitoramento 24/7 de status das câmeras

### 5.3 Segurança
- **RNF-008**: Criptografia TLS 1.3 para todas comunicações
- **RNF-009**: Autenticação JWT com refresh tokens
- **RNF-010**: Dados de pagamento em conformidade com PCI-DSS (via gateway)
- **RNF-011**: Senhas armazenadas com bcrypt (custo mínimo 12)
- **RNF-012**: Rate limiting para prevenir ataques DDoS
- **RNF-013**: Logs de acesso às câmeras para auditoria

### 5.4 Privacidade e Compliance
- **RNF-014**: Conformidade com LGPD
- **RNF-015**: Termo de consentimento explícito para coleta de dados
- **RNF-016**: Direito ao esquecimento implementado (exclusão de dados)
- **RNF-017**: Política de retenção de vídeos definida e comunicada
- **RNF-018**: DPO (Data Protection Officer) designado

### 5.5 Usabilidade
- **RNF-019**: Interface intuitiva, usuário consegue visualizar câmera em < 3 cliques
- **RNF-020**: Suporte a modo claro/escuro
- **RNF-021**: Acessibilidade WCAG 2.1 nível AA
- **RNF-022**: Fontes responsivas e legíveis (mínimo 16px)

### 5.6 Compatibilidade
- **RNF-023**: App iOS compatível com iOS 14+
- **RNF-024**: App Android compatível com Android 8.0+
- **RNF-025**: Web app compatível com Chrome, Firefox, Safari, Edge (2 versões anteriores)
- **RNF-026**: Responsivo para tablets e desktops

### 5.7 Escalabilidade
- **RNF-027**: Arquitetura de microserviços para escala horizontal
- **RNF-028**: Banco de dados preparado para sharding
- **RNF-029**: CDN para distribuição de conteúdo estático
- **RNF-030**: Auto-scaling baseado em métricas (CPU, memória, requisições)

---

## 6. User Stories

### 6.1 Épico: Onboarding de Usuário

**US-001**: Como novo usuário, quero criar uma conta facilmente para começar a usar o serviço  
**Prioridade**: Must Have  
**Estimativa**: 5 pontos  
**Critérios**:
- [ ] Formulário de cadastro intuitivo
- [ ] Validações em tempo real
- [ ] Email de confirmação enviado
- [ ] Redirecionamento para escolha de torre após confirmação

**US-002**: Como usuário, quero fazer login de forma segura e rápida para acessar minhas câmeras  
**Prioridade**: Must Have  
**Estimativa**: 3 pontos  
**Critérios**:
- [ ] Login com email e senha
- [ ] Opção de biometria após primeiro login
- [ ] Recuperação de senha funcional

### 6.2 Épico: Descoberta e Assinatura

**US-003**: Como morador, quero ver no mapa quais torres estão disponíveis próximas à minha casa para escolher a mais adequada  
**Prioridade**: Must Have  
**Estimativa**: 8 pontos  
**Critérios**:
- [ ] Mapa interativo com pins de torres
- [ ] Filtro por distância
- [ ] Visualização de área de cobertura
- [ ] Informações detalhadas ao clicar na torre

**US-004**: Como usuário, quero assinar uma torre de forma simples para garantir acesso às câmeras  
**Prioridade**: Must Have  
**Estimativa**: 13 pontos  
**Critérios**:
- [ ] Seleção de plano (mensal/trimestral/anual)
- [ ] Cadastro de cartão de crédito seguro
- [ ] Confirmação clara do que será cobrado
- [ ] Acesso imediato após pagamento aprovado

**US-005**: Como empresário, quero assinar múltiplas torres de uma vez para cobrir todas minhas lojas  
**Prioridade**: Should Have  
**Estimativa**: 8 pontos  
**Critérios**:
- [ ] Seleção múltipla de torres
- [ ] Desconto progressivo para múltiplas assinaturas
- [ ] Checkout com resumo consolidado
- [ ] Fatura única para todas assinaturas

### 6.3 Épico: Uso do Serviço

**US-006**: Como assinante, quero visualizar o feed da câmera em tempo real para monitorar minha rua  
**Prioridade**: Must Have  
**Estimativa**: 13 pontos  
**Critérios**:
- [ ] Stream com latência < 3 segundos
- [ ] Controles de qualidade e fullscreen
- [ ] Indicador de conexão e latência
- [ ] Funciona em 4G e WiFi

**US-007**: Como usuário, quero capturar screenshots do que estou vendo para ter registro de eventos  
**Prioridade**: Should Have  
**Estimativa**: 5 pontos  
**Critérios**:
- [ ] Botão de captura visível
- [ ] Screenshot salva na galeria do dispositivo
- [ ] Marca d'água com data/hora e localização
- [ ] Notificação de sucesso

**US-008**: Como assinante de múltiplas câmeras, quero alternar entre elas facilmente para monitorar diferentes locais  
**Prioridade**: Should Have  
**Estimativa**: 5 pontos  
**Critérios**:
- [ ] Lista rápida de câmeras disponíveis
- [ ] Troca sem perder buffer de vídeo
- [ ] Indicador visual de qual está ativa

### 6.4 Épico: Gestão de Conta

**US-009**: Como assinante, quero gerenciar minhas assinaturas para ter controle sobre meus gastos  
**Prioridade**: Must Have  
**Estimativa**: 8 pontos  
**Critérios**:
- [ ] Visualizar todas assinaturas ativas
- [ ] Ver valor total mensal
- [ ] Pausar ou cancelar assinatura
- [ ] Histórico de pagamentos

**US-010**: Como usuário, quero atualizar meu método de pagamento para evitar interrupção do serviço  
**Prioridade**: Must Have  
**Estimativa**: 5 pontos  
**Critérios**:
- [ ] Adicionar novo cartão
- [ ] Remover cartão antigo
- [ ] Definir cartão padrão
- [ ] Validação de cartão válido

**US-011**: Como usuário, quero ser notificado antes da cobrança para me preparar financeiramente  
**Prioridade**: Should Have  
**Estimativa**: 3 pontos  
**Critérios**:
- [ ] Notificação 3 dias antes
- [ ] Email com detalhes da cobrança
- [ ] Link direto para atualizar pagamento se necessário

### 6.5 Épico: Administração (Empresa)

**US-012**: Como gestor da empresa, quero visualizar dashboard com métricas chave para tomar decisões estratégicas  
**Prioridade**: Must Have  
**Estimativa**: 13 pontos  
**Critérios**:
- [ ] MRR, churn, inadimplência visíveis
- [ ] Gráficos de evolução temporal
- [ ] Exportação de relatórios
- [ ] Atualização em tempo real

**US-013**: Como admin, quero cadastrar novas torres rapidamente para expandir cobertura  
**Prioridade**: Must Have  
**Estimativa**: 8 pontos  
**Critérios**:
- [ ] Formulário com campos essenciais
- [ ] Seleção de localização no mapa
- [ ] Upload de imagem de cobertura
- [ ] Ativação imediata ou agendada

**US-014**: Como admin, quero gerenciar inadimplentes de forma eficiente para reduzir perdas  
**Prioridade**: Must Have  
**Estimativa**: 8 pontos  
**Critérios**:
- [ ] Lista de inadimplentes ordenada por dias
- [ ] Ações em lote (enviar lembrete, suspender)
- [ ] Histórico de tentativas de cobrança
- [ ] Reativação automática ao pagar

---

## 7. Fluxos de Usuário

### 7.1 Fluxo: Novo Usuário → Primeira Visualização

```
1. Usuário baixa app
2. Tela de boas-vindas com benefícios
3. Clicar "Criar conta"
4. Preencher: nome, CPF, email, telefone, senha
5. Aceitar termos e política
6. Receber email de confirmação
7. Clicar no link do email
8. Conta ativada → redirecionado ao app
9. Tutorial rápido (opcional, pode pular)
10. Visualizar mapa com torres disponíveis
11. Selecionar torre próxima
12. Ver detalhes: localização, preço, cobertura
13. Clicar "Assinar"
14. Escolher plano (mensal selecionado por padrão)
15. Inserir dados do cartão
16. Confirmar assinatura
17. Processamento do pagamento (loader)
18. Pagamento aprovado → acesso liberado
19. Notificação: "Acesso liberado! Toque para visualizar"
20. Clicar na notificação
21. Tela de visualização da câmera carrega
22. Stream iniciado → usuário está assistindo
```

### 7.2 Fluxo: Usuário Inadimplente → Reativação

```
1. Sistema tenta cobrar no dia do vencimento → falha
2. Email automático: "Falha no pagamento, atualize seu método"
3. Usuário não toma ação
4. Dia 3: Retry 1 → falha
5. Push notification: "Ação necessária: problema no pagamento"
6. Dia 5: Retry 2 → falha
7. Email: "Última tentativa em 2 dias, acesso será suspenso"
8. Dia 7: Retry 3 → falha
9. Acesso suspenso automaticamente
10. Push notification: "Acesso suspenso por falta de pagamento"
11. Usuário abre app
12. Tela de aviso: "Seu acesso está suspenso. Regularize agora"
13. Botão: "Atualizar pagamento"
14. Usuário cadastra novo cartão
15. Sistema tenta nova cobrança → sucesso
16. Acesso reativado imediatamente
17. Email: "Pagamento confirmado! Acesso reativado"
18. Usuário volta a visualizar câmeras normalmente
```

### 7.3 Fluxo: Admin Cadastra Nova Torre

```
1. Admin faz login no painel web
2. Menu: "Torres" → "Cadastrar Nova"
3. Formulário exibido:
   - Nome da torre (ex: "Torre Rua das Flores")
   - Endereço completo
   - Localização GPS (pode clicar no mapa ou inserir coordenadas)
   - Ângulo de cobertura (campo numérico em graus)
   - Preço mensal (R$)
   - Upload de imagem da área coberta
4. Admin preenche todos campos
5. Clica em mapa para definir localização exata
6. Upload de foto mostrando a rua/área
7. Revisar dados no preview
8. Toggle: "Disponibilizar imediatamente?" (Sim/Não)
9. Clicar "Cadastrar Torre"
10. Validação dos campos
11. Torre criada com sucesso
12. Toast: "Torre cadastrada! Já está disponível no app"
13. Redirecionado para lista de torres
14. Nova torre aparece na lista
15. App mobile atualiza lista em tempo real
16. Usuários já podem ver e assinar a nova torre
```

---

## 8. Arquitetura Técnica (High-Level)

### 8.1 Componentes

```
┌─────────────────┐
│   Mobile App    │
│  (iOS/Android)  │
└────────┬────────┘
         │
         ├─── REST API
         │
┌────────▼────────┐      ┌──────────────┐
│   API Gateway   │◄────►│  Web Admin   │
│   (Node.js)     │      │  (React/Next)│
└────────┬────────┘      └──────────────┘
         │
         │         ┌──────────────────┐
         ├────────►│   Logto.io       │ ⭐ Auth Service
         │         │ (OAuth 2.0/OIDC) │
         │         └──────────────────┘
         │
    ┌────┴────┬────────────┬──────────┐
    │         │            │          │
┌───▼───┐ ┌──▼──┐ ┌───────▼─────┐ ┌──▼────────┐
│ User  │ │Sub  │ │  Payment    │ │  Camera   │
│Service│ │Svc  │ │  Service    │ │  Service  │
└───┬───┘ └─────┘ └──────┬──────┘ └─────┬─────┘
    │                     │               │
    │         ┌───────────▼───────┐       │
    │         │  Payment Gateway  │       │
    │         │  (Stripe/Iugu)    │       │
    │         └───────────────────┘       │
    │                                     │
┌───▼─────────────────────────────────────▼───┐
│           Database (PostgreSQL)              │
│  - Users, Subscriptions, Payments, Towers   │
└──────────────────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   Video Streaming       │
        │ (WebRTC/HLS/Cloudflare) │
        └─────────────────────────┘
```

**Fluxo de Autenticação com Logto:**
1. App → Logto: Inicia login/cadastro (OAuth)
2. Logto: Autentica usuário (email, social, biometria)
3. Logto → App: Retorna tokens (access + refresh)
4. App → API Gateway: Requisições com access token
5. API Gateway: Valida token com Logto
6. API Gateway → Services: Processa requisição autenticada

### 8.2 Stack Tecnológica Recomendada

**Mobile**
- React Native ou Flutter (cross-platform)
- State Management: Redux Toolkit / Zustand
- Streaming: react-native-webrtc ou VLC

**Backend**
- Node.js + NestJS (TypeScript)
- PostgreSQL (dados relacionais)
- Redis (cache, sessões)
- Message Queue: RabbitMQ / AWS SQS

**Autenticação** ⭐ NOVO
- **Logto.io** (OAuth 2.0 / OIDC)
- Plan: Free → Pro ($24/mês) conforme crescimento
- Features: Email/senha, Social logins, MFA, Biometria
- SDKs: React Native, Web (Next.js)

**Streaming**
- WebRTC para baixa latência
- HLS como fallback
- Cloudflare Stream ou AWS Kinesis Video Streams

**Pagamentos**
- Stripe (internacional)
- Iugu ou Pagar.me (Brasil)

**Infraestrutura**
- AWS / Google Cloud / Azure
- Docker + Kubernetes
- CI/CD: GitHub Actions ou GitLab CI
- Monitoring: Datadog / New Relic

**Admin Panel**
- Next.js + TypeScript
- UI: shadcn/ui, Tailwind CSS
- Charts: Recharts ou ApexCharts

---

## 9. Modelo de Dados (Simplificado)

### 9.1 Tabelas Principais

**users**
```sql
id: UUID (PK)
email: VARCHAR UNIQUE
password_hash: VARCHAR
full_name: VARCHAR
cpf_cnpj: VARCHAR UNIQUE
phone: VARCHAR
avatar_url: VARCHAR
created_at: TIMESTAMP
updated_at: TIMESTAMP
status: ENUM (active, suspended, deleted)
```

**towers**
```sql
id: UUID (PK)
name: VARCHAR
address: TEXT
latitude: DECIMAL
longitude: DECIMAL
coverage_angle: INTEGER
monthly_price: DECIMAL
image_url: VARCHAR
is_active: BOOLEAN
camera_status: ENUM (online, offline)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**subscriptions**
```sql
id: UUID (PK)
user_id: UUID (FK → users)
tower_id: UUID (FK → towers)
plan_type: ENUM (monthly, quarterly, annual)
status: ENUM (active, paused, cancelled, suspended)
current_period_start: TIMESTAMP
current_period_end: TIMESTAMP
created_at: TIMESTAMP
cancelled_at: TIMESTAMP
```

**payments**
```sql
id: UUID (PK)
subscription_id: UUID (FK → subscriptions)
amount: DECIMAL
status: ENUM (pending, succeeded, failed, refunded)
payment_method: VARCHAR (last 4 digits)
gateway_transaction_id: VARCHAR
charged_at: TIMESTAMP
failure_reason: TEXT
retry_count: INTEGER
```

**access_logs**
```sql
id: UUID (PK)
user_id: UUID (FK → users)
tower_id: UUID (FK → towers)
action: ENUM (view_started, view_ended, screenshot)
timestamp: TIMESTAMP
duration_seconds: INTEGER
```

---

## 10. Segurança e Privacidade

### 10.1 Medidas de Segurança

**Autenticação**
- JWT com refresh tokens (access token: 15min, refresh: 7 dias)
- Biometria local no device
- Rate limiting: 5 tentativas de login / 15 min

**Dados Sensíveis**
- Dados de pagamento NUNCA armazenados (tokenização via gateway)
- Senhas com bcrypt (cost factor 12)
- Criptografia em trânsito (TLS 1.3)
- Criptografia em repouso para campos sensíveis (CPF, telefone)

**Acesso às Câmeras**
- Validação de assinatura ativa em cada requisição de stream
- Tokens temporários para stream (válidos por 5 min, renováveis)
- Watermark com user_id em screenshots
- Logs de todos acessos para auditoria

**API**
- CORS configurado
- Rate limiting por endpoint
- Input validation e sanitization
- OWASP Top 10 compliance

### 10.2 LGPD Compliance

**Consentimento**
- Termo de uso e política de privacidade explícitos no cadastro
- Consentimento específico para geolocalização
- Opt-in para comunicações de marketing

**Direitos do Titular**
- Portal para solicitar dados pessoais (exportação JSON)
- Exclusão de conta e dados (direito ao esquecimento)
- Retificação de dados
- Portabilidade de dados

**Retenção**
- Dados de usuários ativos: indefinido (enquanto houver relacionamento)
- Logs de acesso: 6 meses
- Dados de usuários inativos (sem assinatura há 2+ anos): anonimização
- Após exclusão de conta: 30 dias para backup, depois remoção permanente

**DPO**
- Email: dpo@empresaseguranca.com.br
- Responsável por atender solicitações e fiscalizar compliance

---

## 11. Monetização

### 11.1 Modelos de Preço

**Plano Individual (Morador)**
- Mensal: R$ 29,90/mês por torre
- Trimestral: R$ 79,90 (economia de 11%)
- Anual: R$ 299,90 (economia de 17%)

**Plano Empresarial**
- 1-5 torres: R$ 25/torre/mês
- 6-15 torres: R$ 22/torre/mês
- 16+ torres: R$ 19/torre/mês
- Funcionalidades extras: API, relatórios customizados

**Sistema de Créditos**
- 10 horas: R$ 15
- 50 horas: R$ 60 (economia de 20%)
- 100 horas: R$ 100 (economia de 33%)

**Extras (Futuro)**
- Gravação 7 dias: +R$ 9,90/mês
- Gravação 30 dias: +R$ 19,90/mês
- Notificações inteligentes: +R$ 4,90/mês

### 11.2 Estratégias de Crescimento

- **Trial Gratuito**: 7 dias de acesso grátis (requer cartão)
- **Programa de Indicação**: Indicou amigo que assinou? 1 mês grátis
- **Desconto por Antecipação**: Pague anual à vista, ganhe 2 meses
- **Parcerias**: Imobiliárias, condomínios (comissão por venda)

---

## 12. Métricas de Sucesso

### 12.1 KPIs do Produto

**Aquisição**
- Número de downloads/mês
- Taxa de conversão (download → cadastro): meta 40%
- Taxa de ativação (cadastro → primeira assinatura): meta 25%
- CAC (Custo de Aquisição de Cliente): < R$ 50

**Engajamento**
- DAU (Daily Active Users)
- Tempo médio de visualização por sessão: meta 15min
- Frequência de uso (sessões/semana): meta 4x
- Taxa de screenshot: meta 20% dos usuários

**Retenção**
- Churn mensal: meta < 5%
- MRR (Monthly Recurring Revenue)
- LTV (Lifetime Value): meta R$ 500
- NPS (Net Promoter Score): meta > 50

**Financeiro**
- MRR growth rate: meta 15%/mês
- Taxa de inadimplência: meta < 3%
- ARPU (Average Revenue Per User): meta R$ 35
- Taxa de recuperação de churn: meta 15%

**Operacional**
- Uptime das câmeras: meta 98%
- Tempo de suporte até resolução: meta < 24h
- Taxa de sucesso no primeiro pagamento: meta 95%

### 12.2 Ferramentas de Analytics

- **Mixpanel / Amplitude**: comportamento do usuário, funis
- **Google Analytics**: aquisição, demografia
- **Stripe Dashboard**: métricas financeiras
- **Sentry**: monitoramento de erros
- **Hotjar**: heatmaps e session recordings (web admin)

---

## 13. Roadmap

### 13.1 MVP (3 meses) - Must Have

**Mês 1: Fundação**
- [x] Definição de requisitos e PRD
- [ ] Design UI/UX de telas principais
- [ ] Setup de infraestrutura (servidores, DB, CI/CD)
- [ ] **Setup Logto.io**: Criar conta, configurar aplicação, customizar branding
- [ ] **Integração Logto SDK**: React Native + Web Admin
- [ ] CRUD de torres (admin)

**Mês 2: Core Features**
- [ ] Sistema de pagamentos (integração Stripe/Iugu)
- [ ] Gestão de assinaturas
- [ ] Listagem de torres no mapa
- [ ] Integração com câmeras (streaming básico)
- [ ] Controle de acesso baseado em pagamento

**Mês 3: Polish & Launch**
- [ ] Dashboard admin com métricas básicas
- [ ] Notificações (email e push)
- [ ] Testes de carga e segurança
- [ ] Beta testing com 20 usuários
- [ ] Ajustes e bugfixes
- [ ] **Launch do MVP** 🚀

### 13.2 Fase 2 (3-6 meses) - Should Have

- [ ] Sistema de créditos como alternativa
- [ ] Visualização de múltiplas câmeras simultâneas
- [ ] Captura de screenshots
- [ ] Planos empresariais com desconto
- [ ] Melhorias de UX baseadas em feedback
- [ ] App para tablet
- [ ] Suporte a múltiplos idiomas (EN, ES)

### 13.3 Fase 3 (6-12 meses) - Nice to Have

- [ ] Gravações históricas (7 e 30 dias)
- [ ] Detecção de movimento com IA
- [ ] Notificações inteligentes
- [ ] API pública para integrações
- [ ] Programa de afiliados
- [ ] App para Apple TV / Android TV
- [ ] Reconhecimento de placas de veículos
- [ ] Integração com central de alarmes

---

## 14. Riscos e Mitigações

### 14.0 Custos Operacionais Mensais (Estimativa)

| Serviço | Uso Inicial (0-500 usuários) | Crescimento (500-5k usuários) | Escala (5k-50k usuários) |
|---------|------------------------------|-------------------------------|--------------------------|
| **Logto.io (Auth)** | $0 (Free tier) | $24-50/mês (Pro) | $50-200/mês |
| **Stripe/Iugu** | 2.9% + R$0,39/transação | 2.9% + R$0,39/transação | 2.9% + R$0,39/transação |
| **Cloudflare Stream** | ~$1/1000min assistidos | ~$5-20/mês | ~$50-200/mês |
| **AWS/Hosting** | $50-100/mês | $150-300/mês | $500-1000/mês |
| **Total Estimado** | **$50-100/mês** | **$180-370/mês** | **$600-1400/mês** |

**Nota sobre Logto**: Começa grátis até 5k MAU. Pro plan ($24/mês) inclui features essenciais. Custos escalam conforme uso de tokens (logins + autorizações).

### 14.1 Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Latência alta no streaming | Alta | Alto | CDN, servidor edge, WebRTC otimizado |
| Downtime das câmeras | Média | Alto | Monitoramento 24/7, redundância, alertas |
| Escalabilidade do vídeo | Alta | Médio | Arquitetura cloud-native, auto-scaling |
| Falhas no gateway de pagamento | Baixa | Alto | Múltiplos gateways, retry inteligente |
| Ataques DDoS | Média | Alto | Cloudflare, rate limiting, WAF |
| **Dependência Logto.io** ⭐ | Baixa | Médio | **Plano B: Self-host (open-source) ou migração Auth0** |

### 14.2 Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Baixa adoção inicial | Média | Alto | Marketing focado, trial gratuito, parcerias |
| Alta taxa de churn | Média | Alto | Onboarding excelente, suporte rápido, NPS |
| Concorrência de players grandes | Baixa | Médio | Foco em nicho local, atendimento personalizado |
| Problemas legais (LGPD) | Baixa | Alto | Advogado especializado, DPO, compliance desde o início |
| Custos de infraestrutura > receita | Média | Alto | Pricing adequado, otimização de recursos, monitoramento de custos |

### 14.3 Riscos Operacionais

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Vandalizaação de torres | Média | Médio | Seguro, design anti-vandalismo, backup de hardware |
| Suporte sobrecarregado | Alta | Médio | FAQ robusto, chatbot, hire gradual |
| Inadimplência alta | Média | Alto | Comunicação clara, notificações preventivas, análise de crédito |

---

## 15. Critérios de Sucesso do Projeto

O projeto será considerado bem-sucedido se, após 6 meses do lançamento:

1. **100+ assinaturas ativas** (validação de product-market fit)
2. **MRR de R$ 3.000+** (sustentabilidade financeira básica)
3. **Churn < 8%** (retenção aceitável para fase inicial)
4. **NPS > 40** (satisfação dos early adopters)
5. **Taxa de inadimplência < 5%** (processos de cobrança eficazes)
6. **Uptime do sistema > 99%** (confiabilidade técnica)
7. **Tempo médio de resolução de suporte < 48h** (qualidade de atendimento)

---

## 16. Apêndices

### 16.1 Glossário

- **MRR**: Monthly Recurring Revenue (receita recorrente mensal)
- **Churn**: Taxa de cancelamento de assinaturas
- **LTV**: Lifetime Value (valor vitalício do cliente)
- **CAC**: Customer Acquisition Cost (custo para adquirir cliente)
- **ARPU**: Average Revenue Per User (receita média por usuário)
- **NPS**: Net Promoter Score (métrica de satisfação)
- **DAU**: Daily Active Users (usuários ativos diários)
- **LGPD**: Lei Geral de Proteção de Dados
- **DPO**: Data Protection Officer (encarregado de dados)

### 16.2 Referências

- [Stripe Billing Docs](https://stripe.com/docs/billing)
- [WebRTC Best Practices](https://webrtc.org/getting-started/overview)
- [LGPD - Lei 13.709/2018](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [React Native Video Streaming](https://github.com/react-native-video/react-native-video)
- [AWS Kinesis Video Streams](https://aws.amazon.com/kinesis/video-streams/)
- [Logto.io Documentation](https://docs.logto.io/) ⭐
- [Logto React Native SDK](https://docs.logto.io/sdk/react-native/) ⭐

### 16.3 Contatos

- **Product Owner**: [nome@email.com]
- **Tech Lead**: [nome@email.com]
- **Designer**: [nome@email.com]
- **Dono da Empresa de Segurança**: [nome@email.com]

---

## 17. Histórico de Versões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2025-01-28 | Claude | Criação inicial do PRD |
| | | | |

---

**Última atualização**: 28 de Janeiro de 2025  
**Status**: Em Revisão  
**Próxima revisão**: [Data]
