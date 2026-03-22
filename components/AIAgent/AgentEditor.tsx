import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Icons } from '../icons';
import { AIAgent } from '../../types';
import GeneralTab from './tabs/GeneralTab';
import TrainingTab from './tabs/TrainingTab';
import RulesTab from './tabs/RulesTab';
import ActionsTab from './tabs/ActionsTab';
import TestTab from './tabs/TestTab';

interface AgentEditorProps {
  agent: AIAgent;
  onSave: (agent: AIAgent) => void;
  onCancel: () => void;
}

type EditorTab = 'Geral' | 'Treinamento' | 'Regras' | 'Ações' | 'Teste';

const AgentEditor: React.FC<AgentEditorProps> = ({ agent: initialAgent, onSave, onCancel }) => {
  const [agent, setAgent] = useState<AIAgent>(initialAgent);
  const [activeTab, setActiveTab] = useState<EditorTab>('Geral');

  const handleUpdate = (updates: Partial<AIAgent>) => {
    setAgent((prev) => ({ ...prev, ...updates }));
  };

  const tabs: EditorTab[] = ['Geral', 'Treinamento', 'Regras', 'Ações', 'Teste'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Geral':
        return <GeneralTab agent={agent} onUpdate={handleUpdate} />;
      case 'Treinamento':
        return <TrainingTab agent={agent} onUpdate={handleUpdate} />;
      case 'Regras':
        return <RulesTab agent={agent} onUpdate={handleUpdate} />;
      case 'Ações':
        return <ActionsTab agent={agent} onUpdate={handleUpdate} />;
      case 'Teste':
        return <TestTab agent={agent} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <Icons.ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">
              {agent.id ? `Editar: ${agent.name}` : 'Novo Agente'}
            </h2>
            <p className="text-brand-text-secondary">Configure a identidade, comportamento e conhecimento do seu agente.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button variant="primary" onClick={() => onSave(agent)}>Salvar Agente</Button>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-brand-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 text-sm font-medium transition-all relative ${
              activeTab === tab
                ? 'text-brand-yellow-dark'
                : 'text-brand-text-secondary hover:text-brand-text-primary'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow-dark" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AgentEditor;
