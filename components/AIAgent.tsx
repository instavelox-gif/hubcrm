import React, { useState } from 'react';
import AgentHub from './AIAgent/AgentHub';
import AgentEditor from './AIAgent/AgentEditor';
import { AIAgent } from '../types';

const initialAgents: AIAgent[] = [
  {
    id: '1',
    name: 'Maria - Consultora de Vendas',
    status: 'Ativo',
    type: 'Vendas',
    identity: {
      role: 'Consultora de Vendas Especializada',
      objective: 'Qualificar leads e agendar demonstrações do produto.',
      tone: 'Consultivo e Amigável',
      style: 'Persuasivo e Empático'
    },
    behavior: {
      mustDo: ['Sempre perguntar o tamanho da empresa', 'Oferecer demonstração gratuita', 'Sempre ser cordial'],
      mustNotDo: ['Não falar sobre preço sem qualificação', 'Não prometer funcionalidades inexistentes'],
      strategies: ['Técnica de fechamento direto', 'Uso de gatilhos de escassez'],
      limits: ['Máximo de 3 perguntas por interação']
    },
    businessContext: {
      description: 'Lumen é a plataforma líder em gestão de relacionamento com o cliente para pequenas empresas.',
      products: 'Lumen Pro, Lumen Enterprise, Módulo de IA',
      targetAudience: 'Pequenos e médios empresários',
      differentials: 'Interface intuitiva, IA integrada, Suporte 24/7',
      commonObjections: 'Preço alto, Dificuldade de implementação'
    },
    training: {
      knowledgeBase: 'O Lumen foi fundado em 2020 com o objetivo de democratizar o acesso a ferramentas de vendas avançadas...',
      files: [{ name: 'manual_do_produto.pdf', type: 'pdf', size: '2.4MB' }],
      urls: ['https://lumencrm.com.br/sobre'],
      faq: [{ question: 'Tem integração com WhatsApp?', answer: 'Sim, temos integração nativa com WhatsApp Business API.' }]
    },
    config: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 1000,
      creativity: 0.5,
      priority: 'Regras'
    },
    actions: {
      sendMessage: true,
      createLead: true,
      updateFunnel: true,
      webhook: false,
      automation: true,
      transferToHuman: true
    },
    analytics: {
      interactions: 1240,
      responseRate: 98,
      conversionRate: 15,
      errors: 2
    }
  }
];

const AIAgentPlatform: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AIAgent | null>(null);

  const handleCreate = () => {
    const newAgent: AIAgent = {
      id: '',
      name: 'Novo Agente',
      status: 'Teste',
      type: 'Vendas',
      identity: { role: '', objective: '', tone: '', style: '' },
      behavior: { mustDo: [], mustNotDo: [], strategies: [], limits: [] },
      businessContext: { description: '', products: '', targetAudience: '', differentials: '', commonObjections: '' },
      training: { knowledgeBase: '', files: [], urls: [], faq: [] },
      config: { model: 'gpt-4o-mini', temperature: 0.7, maxTokens: 1000, creativity: 0.5, priority: 'Regras' },
      actions: { sendMessage: true, createLead: false, updateFunnel: false, webhook: false, automation: false, transferToHuman: true },
      analytics: { interactions: 0, responseRate: 0, conversionRate: 0, errors: 0 }
    };
    setCurrentAgent(newAgent);
    setIsEditing(true);
  };

  const handleEdit = (agent: AIAgent) => {
    setCurrentAgent(agent);
    setIsEditing(true);
  };

  const handleTest = (agent: AIAgent) => {
    setCurrentAgent(agent);
    setIsEditing(true);
  };

  const handleDuplicate = (agent: AIAgent) => {
    const duplicated = { ...agent, id: Date.now().toString(), name: `${agent.name} (Cópia)` };
    setAgents([...agents, duplicated]);
  };

  const handleSave = (agent: AIAgent) => {
    if (agent.id) {
      setAgents(agents.map(a => a.id === agent.id ? agent : a));
    } else {
      setAgents([...agents, { ...agent, id: Date.now().toString() }]);
    }
    setIsEditing(false);
    setCurrentAgent(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentAgent(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {isEditing && currentAgent ? (
        <AgentEditor 
          agent={currentAgent} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <AgentHub 
          agents={agents} 
          onEdit={handleEdit} 
          onTest={handleTest} 
          onCreate={handleCreate} 
          onDuplicate={handleDuplicate} 
        />
      )}
    </div>
  );
};

export default AIAgentPlatform;
