import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { Icons } from '../../icons';
import { AIAgent } from '../../../types';

interface RulesTabProps {
  agent: AIAgent;
  onUpdate: (updates: Partial<AIAgent>) => void;
}

const RulesTab: React.FC<RulesTabProps> = ({ agent, onUpdate }) => {
  const [newItem, setNewItem] = useState({ type: 'mustDo' as keyof AIAgent['behavior'], text: '' });

  const handleAddItem = () => {
    if (newItem.text.trim()) {
      onUpdate({
        behavior: {
          ...agent.behavior,
          [newItem.type]: [...agent.behavior[newItem.type], newItem.text.trim()]
        }
      });
      setNewItem({ ...newItem, text: '' });
    }
  };

  const handleRemoveItem = (type: keyof AIAgent['behavior'], index: number) => {
    onUpdate({
      behavior: {
        ...agent.behavior,
        [type]: agent.behavior[type].filter((_, i) => i !== index)
      }
    });
  };

  const renderSection = (title: string, type: keyof AIAgent['behavior'], placeholder: string, color: string) => (
    <Card className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-brand-text-primary">{title}</h3>
        <div className={`w-2 h-2 rounded-full ${color}`} />
      </div>
      <div className="flex gap-2 mb-4">
        <Input
          value={newItem.type === type ? newItem.text : ''}
          onChange={(e) => setNewItem({ type, text: e.target.value })}
          placeholder={placeholder}
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <Button variant="outline" onClick={handleAddItem}>
          <Icons.Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {agent.behavior[type].map((item, i) => (
          <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-brand-border group">
            <span className="text-sm text-brand-text-primary">{item}</span>
            <button
              onClick={() => handleRemoveItem(type, i)}
              className="text-brand-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
            >
              <Icons.Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
        {agent.behavior[type].length === 0 && (
          <p className="text-xs text-brand-text-secondary italic text-center py-4">Nenhuma regra definida.</p>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSection('O que o agente DEVE fazer', 'mustDo', 'Ex: Sempre tentar fechar a venda', 'bg-green-500')}
        {renderSection('O que o agente NÃO PODE fazer', 'mustNotDo', 'Ex: Não falar sobre preço sem qualificação', 'bg-red-500')}
        {renderSection('Estratégias Obrigatórias', 'strategies', 'Ex: Oferecer desconto no primeiro contato', 'bg-blue-500')}
        {renderSection('Limites e Restrições', 'limits', 'Ex: Máximo de 3 perguntas por vez', 'bg-yellow-500')}
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Configuração de IA Avançada</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-sm font-medium text-brand-text-secondary">Modelo de IA</label>
            <select
              value={agent.config.model}
              onChange={(e) => onUpdate({ config: { ...agent.config, model: e.target.value } })}
              className="mt-1 w-full bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-md focus:ring-brand-yellow focus:border-brand-yellow block p-2.5"
            >
              <option value="gpt-4o">GPT-4o (Mais inteligente)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (Mais rápido)</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-text-secondary">Temperatura ({agent.config.temperature})</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={agent.config.temperature}
              onChange={(e) => onUpdate({ config: { ...agent.config, temperature: parseFloat(e.target.value) } })}
              className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
            />
            <div className="flex justify-between text-[10px] text-brand-text-secondary mt-1">
              <span>Preciso</span>
              <span>Criativo</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-text-secondary">Prioridade de Resposta</label>
            <select
              value={agent.config.priority}
              onChange={(e) => onUpdate({ config: { ...agent.config, priority: e.target.value as any } })}
              className="mt-1 w-full bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-md focus:ring-brand-yellow focus:border-brand-yellow block p-2.5"
            >
              <option value="Regras">Seguir Regras</option>
              <option value="Conhecimento">Usar Conhecimento</option>
              <option value="Livre">Responder Livremente</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-text-secondary">Limite de Tokens</label>
            <Input
              type="number"
              value={agent.config.maxTokens}
              onChange={(e) => onUpdate({ config: { ...agent.config, maxTokens: parseInt(e.target.value) } })}
              className="mt-1"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RulesTab;
