import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { Icons } from '../../icons';
import { AIAgent } from '../../../types';

interface TrainingTabProps {
  agent: AIAgent;
  onUpdate: (updates: Partial<AIAgent>) => void;
}

const TrainingTab: React.FC<TrainingTabProps> = ({ agent, onUpdate }) => {
  const [newUrl, setNewUrl] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const handleAddUrl = () => {
    if (newUrl.trim()) {
      onUpdate({
        training: { ...agent.training, urls: [...agent.training.urls, newUrl.trim()] }
      });
      setNewUrl('');
    }
  };

  const handleAddFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      onUpdate({
        training: { ...agent.training, faq: [...agent.training.faq, newFaq] }
      });
      setNewFaq({ question: '', answer: '' });
    }
  };

  const handleRemoveUrl = (index: number) => {
    onUpdate({
      training: { ...agent.training, urls: agent.training.urls.filter((_, i) => i !== index) }
    });
  };

  const handleRemoveFaq = (index: number) => {
    onUpdate({
      training: { ...agent.training, faq: agent.training.faq.filter((_, i) => i !== index) }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-brand-text-primary">Base de Conhecimento</h3>
            <span className="text-xs text-brand-text-secondary">Texto livre</span>
          </div>
          <textarea
            value={agent.training.knowledgeBase}
            onChange={(e) => onUpdate({ training: { ...agent.training, knowledgeBase: e.target.value } })}
            placeholder="Insira aqui as informações que o agente deve saber sobre seu negócio, produtos, processos, etc."
            className="w-full bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-md focus:ring-brand-yellow focus:border-brand-yellow block p-2.5 min-h-[300px]"
          />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Arquivos de Treinamento</h3>
          <div className="border-2 border-dashed border-brand-border rounded-xl p-8 text-center hover:border-brand-yellow transition-colors cursor-pointer">
            <Icons.Upload className="w-10 h-10 text-brand-text-secondary mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium text-brand-text-primary">Arraste arquivos ou clique para fazer upload</p>
            <p className="text-xs text-brand-text-secondary mt-1">PDF, DOC, TXT (Máx 10MB)</p>
          </div>
          <div className="mt-4 space-y-2">
            {agent.training.files.map((file, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-brand-border">
                <div className="flex items-center gap-3">
                  <Icons.FileText className="w-5 h-5 text-brand-yellow-dark" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-primary">{file.name}</p>
                    <p className="text-xs text-brand-text-secondary">{file.size}</p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <Icons.Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Importar por URL</h3>
          <div className="flex gap-2 mb-4">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://suaempresa.com.br/sobre"
              className="flex-1"
            />
            <Button variant="primary" onClick={handleAddUrl}>Importar</Button>
          </div>
          <div className="space-y-2">
            {agent.training.urls.map((url, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-brand-border">
                <span className="text-sm text-brand-text-primary truncate max-w-[80%]">{url}</span>
                <button onClick={() => handleRemoveUrl(i)} className="text-brand-text-secondary hover:text-red-500">
                  <Icons.Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-brand-text-primary mb-4">FAQ Estruturado</h3>
          <div className="space-y-3 mb-4">
            <Input
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              placeholder="Pergunta comum do cliente"
            />
            <textarea
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              placeholder="Resposta ideal do agente"
              className="w-full bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-md focus:ring-brand-yellow focus:border-brand-yellow block p-2.5 min-h-[80px]"
            />
            <Button variant="outline" onClick={handleAddFaq} className="w-full">Adicionar ao FAQ</Button>
          </div>
          <div className="space-y-3">
            {agent.training.faq.map((item, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-brand-border relative group">
                <p className="text-sm font-bold text-brand-text-primary pr-6">{item.question}</p>
                <p className="text-sm text-brand-text-secondary mt-1">{item.answer}</p>
                <button
                  onClick={() => handleRemoveFaq(i)}
                  className="absolute top-3 right-3 text-brand-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                >
                  <Icons.Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrainingTab;
