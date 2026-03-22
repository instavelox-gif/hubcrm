import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Icons } from '../../icons';
import { AIAgent } from '../../../types';

interface TestTabProps {
  agent: AIAgent;
}

const TestTab: React.FC<TestTabProps> = ({ agent }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string; logs?: string[] }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        role: 'agent' as const,
        text: `Olá! Eu sou o ${agent.name}. Como posso te ajudar hoje com ${agent.type}?`,
        logs: [
          'Buscando conhecimento semântico...',
          'Conhecimento encontrado: "Produtos e Serviços"',
          'Aplicando regra: "Sempre tentar fechar venda"',
          'Decisão: Oferecer demonstração gratuita'
        ]
      };
      setMessages((prev) => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-20rem)]">
      <div className="lg:col-span-2 flex flex-col h-full">
        <Card className="flex-1 flex flex-col h-full p-0 overflow-hidden">
          <div className="p-4 border-b border-brand-border bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                <Icons.AIAgent className="w-5 h-5 text-brand-yellow-dark" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-text-primary">{agent.name}</h4>
                <p className="text-[10px] text-green-500 font-medium">Simulador Ativo</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setMessages([])}>Reiniciar</Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-bg">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Icons.MessageSquare className="w-12 h-12 mb-2" />
                <p className="text-sm">Inicie uma conversa para testar o comportamento do agente.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-yellow text-brand-text-primary rounded-tr-none' 
                    : 'bg-white text-brand-text-primary border border-brand-border rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-brand-border rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-brand-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Teste o agente aqui..."
                className="flex-1 bg-gray-50 border border-brand-border text-brand-text-primary text-sm rounded-full px-4 focus:ring-brand-yellow focus:border-brand-yellow outline-none"
              />
              <Button variant="primary" size="sm" onClick={handleSend} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                <Icons.Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6 flex flex-col h-full">
        <Card className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b border-brand-border bg-gray-50">
            <h4 className="text-sm font-bold text-brand-text-primary flex items-center gap-2">
              <Icons.Settings className="w-4 h-4" />
              Logs de Decisão
            </h4>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 font-mono text-[10px]">
            {messages.filter(m => m.role === 'agent').map((msg, i) => (
              <div key={i} className="space-y-1 border-b border-gray-800 pb-2 last:border-0">
                <p className="text-brand-yellow-dark"># Turno {i + 1}</p>
                {msg.logs?.map((log, j) => (
                  <p key={j} className="text-gray-400">
                    <span className="text-green-500">[{new Date().toLocaleTimeString()}]</span> {log}
                  </p>
                ))}
              </div>
            ))}
            {messages.filter(m => m.role === 'agent').length === 0 && (
              <p className="text-gray-600 italic">Aguardando interações para gerar logs...</p>
            )}
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-bold text-brand-text-primary mb-3">Métricas de Teste</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-brand-border">
              <p className="text-[10px] text-brand-text-secondary uppercase font-bold">Tempo de Resposta</p>
              <p className="text-lg font-bold text-brand-text-primary">1.5s</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-brand-border">
              <p className="text-[10px] text-brand-text-secondary uppercase font-bold">Tokens Usados</p>
              <p className="text-lg font-bold text-brand-text-primary">142</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestTab;
