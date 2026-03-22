import React from 'react';
import Card from '../../ui/Card';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { Icons } from '../../icons';
import { AIAgent } from '../../../types';

interface ActionsTabProps {
  agent: AIAgent;
  onUpdate: (updates: Partial<AIAgent>) => void;
}

const ActionsTab: React.FC<ActionsTabProps> = ({ agent, onUpdate }) => {
  const handleActionToggle = (action: keyof AIAgent['actions'], checked: boolean) => {
    onUpdate({
      actions: { ...agent.actions, [action]: checked }
    });
  };

  const actionList = [
    { id: 'sendMessage', label: 'Enviar Mensagem', icon: Icons.MessageSquare, description: 'Permite que o agente envie mensagens diretamente ao cliente.' },
    { id: 'createLead', label: 'Criar Lead', icon: Icons.Plus, description: 'Cria automaticamente um novo lead quando um contato é qualificado.' },
    { id: 'updateFunnel', label: 'Atualizar Etapa do Funil', icon: Icons.Funnel, description: 'Move o lead para a próxima etapa baseada na conversa.' },
    { id: 'webhook', label: 'Disparar Webhook', icon: Icons.Settings, description: 'Envia dados para sistemas externos via requisição HTTP.' },
    { id: 'automation', label: 'Acionar Automação', icon: Icons.AIAgent, description: 'Inicia fluxos de automação pré-configurados.' },
    { id: 'transferToHuman', label: 'Transferir para Humano', icon: Icons.User, description: 'Notifica um atendente real quando o agente não consegue resolver.' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Ações do Agente</h3>
        <p className="text-sm text-brand-text-secondary mb-6">Defina o que este agente tem permissão para fazer durante uma interação.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actionList.map((action) => (
            <div key={action.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-brand-border hover:border-brand-yellow transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-brand-border flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-brand-yellow-dark" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-text-primary">{action.label}</h4>
                  <p className="text-xs text-brand-text-secondary mt-1">{action.description}</p>
                </div>
              </div>
              <ToggleSwitch
                initialChecked={agent.actions[action.id as keyof AIAgent['actions']]}
                onChange={(checked) => handleActionToggle(action.id as keyof AIAgent['actions'], checked)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Memória e Contexto Dinâmico</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              O agente tem acesso automático à <strong>Memória Curta</strong> (conversa atual) e <strong>Memória Longa</strong> (histórico do cliente).
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-text-secondary">Variáveis Disponíveis para o Agente</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['{{nome}}', '{{produto}}', '{{etapa_funil}}', '{{ultimo_contato}}', '{{valor_lead}}'].map((v) => (
                <span key={v} className="px-3 py-1 bg-gray-100 text-brand-text-primary text-xs font-mono rounded-full border border-brand-border">
                  {v}
                </span>
              ))}
            </div>
            <p className="text-xs text-brand-text-secondary mt-2 italic">
              Use estas variáveis nas regras de comportamento ou base de conhecimento.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ActionsTab;
