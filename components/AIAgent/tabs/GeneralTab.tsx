import React from 'react';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import { AIAgent, AgentType } from '../../../types';

interface GeneralTabProps {
  agent: AIAgent;
  onUpdate: (updates: Partial<AIAgent>) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ agent, onUpdate }) => {
  const handleIdentityChange = (field: keyof AIAgent['identity'], value: string) => {
    onUpdate({
      identity: { ...agent.identity, [field]: value }
    });
  };

  const handleBusinessContextChange = (field: keyof AIAgent['businessContext'], value: string) => {
    onUpdate({
      businessContext: { ...agent.businessContext, [field]: value }
    });
  };

  const agentTypes: AgentType[] = ['Vendas', 'Suporte', 'Cobrança', 'SDR', 'Outro'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Identidade do Agente</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Nome do Agente</label>
              <Input
                value={agent.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="Ex: Maria, Assistente de Vendas"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Função / Tipo</label>
              <select
                value={agent.type}
                onChange={(e) => onUpdate({ type: e.target.value as AgentType })}
                className="mt-1 w-full bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-md focus:ring-brand-yellow focus:border-brand-yellow block p-2.5"
              >
                {agentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Objetivo Principal</label>
              <textarea
                value={agent.identity.objective}
                onChange={(e) => handleIdentityChange('objective', e.target.value)}
                placeholder="Qual o principal objetivo deste agente?"
                className="mt-1 w-full bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-md focus:ring-brand-yellow focus:border-brand-yellow block p-2.5 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-brand-text-secondary">Tom de Voz</label>
                <Input
                  value={agent.identity.tone}
                  onChange={(e) => handleIdentityChange('tone', e.target.value)}
                  placeholder="Ex: Formal, Consultivo"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-text-secondary">Estilo de Comunicação</label>
                <Input
                  value={agent.identity.style}
                  onChange={(e) => handleIdentityChange('style', e.target.value)}
                  placeholder="Ex: Direto, Empático"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Contexto do Negócio</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Descrição da Empresa</label>
              <textarea
                value={agent.businessContext.description}
                onChange={(e) => handleBusinessContextChange('description', e.target.value)}
                placeholder="O que sua empresa faz?"
                className="mt-1 w-full bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-md focus:ring-brand-yellow focus:border-brand-yellow block p-2.5 min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Produtos ou Serviços</label>
              <textarea
                value={agent.businessContext.products}
                onChange={(e) => handleBusinessContextChange('products', e.target.value)}
                placeholder="Liste seus principais produtos/serviços"
                className="mt-1 w-full bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-md focus:ring-brand-yellow focus:border-brand-yellow block p-2.5 min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Público-alvo</label>
              <Input
                value={agent.businessContext.targetAudience}
                onChange={(e) => handleBusinessContextChange('targetAudience', e.target.value)}
                placeholder="Quem é o seu cliente ideal?"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-secondary">Diferenciais</label>
              <textarea
                value={agent.businessContext.differentials}
                onChange={(e) => handleBusinessContextChange('differentials', e.target.value)}
                placeholder="Por que escolher sua empresa?"
                className="mt-1 w-full bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-md focus:ring-brand-yellow focus:border-brand-yellow block p-2.5 min-h-[80px]"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GeneralTab;
