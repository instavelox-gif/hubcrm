export enum View {
  Dashboard = 'Dashboard',
  AIAgent = 'Agente de IA',
  Conversas = 'Conversas',
  Appointments = 'Agendamentos',
  Prospecting = 'Prospectar',
  Contacts = 'Contatos',
  Connection = 'Conexão',
  Settings = 'Configurações',
  SalesAutomation = 'Automação'
}

export interface User {
  id: string;
  name: string;
  type: 'ADMIN' | 'USER';
  status: boolean;
}

export type AgentStatus = 'Ativo' | 'Pausado' | 'Teste';
export type AgentType = 'Vendas' | 'Suporte' | 'Cobrança' | 'SDR' | 'Outro';

export interface AIAgent {
  id: string;
  name: string;
  status: AgentStatus;
  type: AgentType;
  identity: {
    role: string;
    objective: string;
    tone: string;
    style: string;
  };
  behavior: {
    mustDo: string[];
    mustNotDo: string[];
    strategies: string[];
    limits: string[];
  };
  businessContext: {
    description: string;
    products: string;
    targetAudience: string;
    differentials: string;
    commonObjections: string;
  };
  training: {
    knowledgeBase: string;
    files: { name: string; type: string; size: string }[];
    urls: string[];
    faq: { question: string; answer: string }[];
  };
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
    creativity: number;
    priority: 'Regras' | 'Conhecimento' | 'Livre';
  };
  actions: {
    sendMessage: boolean;
    createLead: boolean;
    updateFunnel: boolean;
    webhook: boolean;
    automation: boolean;
    transferToHuman: boolean;
  };
  analytics: {
    interactions: number;
    responseRate: number;
    conversionRate: number;
    errors: number;
  };
}
