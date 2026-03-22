import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Icons } from '../icons';
import { AIAgent } from '../../types';

interface AgentHubProps {
  agents: AIAgent[];
  onEdit: (agent: AIAgent) => void;
  onTest: (agent: AIAgent) => void;
  onCreate: () => void;
  onDuplicate: (agent: AIAgent) => void;
}

const AgentHub: React.FC<AgentHubProps> = ({ agents, onEdit, onTest, onCreate, onDuplicate }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary">Seus Agentes</h2>
          <p className="text-brand-text-secondary">Gerencie e treine seus agentes de inteligência artificial.</p>
        </div>
        <Button variant="primary" onClick={onCreate} className="flex items-center gap-2">
          <Icons.Plus className="w-4 h-4" />
          Criar Novo Agente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                  <Icons.AIAgent className="w-6 h-6 text-brand-yellow-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-text-primary">{agent.name}</h3>
                  <p className="text-xs text-brand-text-secondary">{agent.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                agent.status === 'Ativo' ? 'bg-green-100 text-green-700' :
                agent.status === 'Pausado' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {agent.status}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary">Interações</span>
                <span className="font-medium text-brand-text-primary">{agent.analytics.interactions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-secondary">Conversão</span>
                <span className="font-medium text-brand-text-primary">{agent.analytics.conversionRate}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(agent)} className="w-full">
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={() => onTest(agent)} className="w-full">
                Testar
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDuplicate(agent)} className="w-full col-span-2">
                Duplicar
              </Button>
            </div>
          </Card>
        ))}
        
        {agents.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-brand-border">
            <Icons.AIAgent className="w-12 h-12 text-brand-text-secondary mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-brand-text-primary">Nenhum agente criado</h3>
            <p className="text-brand-text-secondary mb-6">Comece criando seu primeiro agente de IA personalizado.</p>
            <Button variant="primary" onClick={onCreate}>
              Criar Primeiro Agente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentHub;
