import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { Icons } from './icons';
import { Lead, prospectLeadsFromMaps, enrichLeadWithSearch } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const LeadCard: React.FC<{ 
  lead: Lead; 
  onEnrich: (lead: Lead) => void; 
  isEnriching: boolean;
}> = ({ lead, onEnrich, isEnriching }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'socio' | 'analise' | 'ads'>('geral');

  const hasEnrichment = lead.cnpj || lead.adminName || lead.gmbAnalysis || lead.googleAdsStatus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow border-l-4 border-brand-yellow">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-brand-text-primary">{lead.name}</h3>
                <span className="px-2 py-0.5 bg-brand-yellow/10 text-brand-yellow-dark text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {lead.category || 'Negócio'}
                </span>
              </div>
              <p className="text-sm text-brand-text-secondary flex items-center">
                <Icons.Info className="w-3 h-3 mr-1" /> {lead.address}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-brand-text-secondary mt-2">
                {lead.phone && (
                  <span className="flex items-center">
                    <Icons.Phone className="w-3 h-3 mr-1" /> {lead.phone}
                  </span>
                )}
                {lead.rating && (
                  <span className="flex items-center text-brand-yellow-dark font-medium">
                    ★ {lead.rating} ({lead.reviewsCount || 0})
                  </span>
                )}
                {lead.website && (
                  <a 
                    href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <Icons.Plug className="w-3 h-3 mr-1" /> Website
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEnrich(lead)}
                disabled={isEnriching}
              >
                {isEnriching ? (
                  <Icons.Refresh className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Icons.AIAgent className="w-4 h-4 mr-2" />
                )}
                {isEnriching ? 'Enriquecendo...' : 'Enriquecer com IA'}
              </Button>
              <Button variant="success" size="sm">
                <Icons.Plus className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>

        {hasEnrichment && (
          <div className="border-t border-brand-border bg-gray-50/50">
            <div className="flex border-b border-brand-border px-4">
              <button 
                onClick={() => setActiveTab('geral')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'geral' ? 'border-brand-yellow text-brand-yellow-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Geral
              </button>
              <button 
                onClick={() => setActiveTab('socio')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'socio' ? 'border-brand-yellow text-brand-yellow-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Sócio & Redes
              </button>
              <button 
                onClick={() => setActiveTab('analise')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'analise' ? 'border-brand-yellow text-brand-yellow-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Análise Sênior
              </button>
              <button 
                onClick={() => setActiveTab('ads')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'ads' ? 'border-brand-yellow text-brand-yellow-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Google Ads
              </button>
            </div>

            <div className="p-4 min-h-[100px]">
              {activeTab === 'geral' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {lead.cnpj && (
                      <div className="px-2 py-1 bg-white rounded text-[11px] font-mono text-gray-700 border border-gray-200">
                        <span className="font-bold mr-1 text-brand-yellow-dark">CNPJ:</span> {lead.cnpj}
                      </div>
                    )}
                    {lead.email && (
                      <div className="px-2 py-1 bg-white rounded text-[11px] font-medium text-blue-600 border border-blue-100">
                        <span className="font-bold mr-1">E-MAIL:</span> {lead.email}
                      </div>
                    )}
                    {lead.isLocationMatch !== undefined && (
                      <div className={`flex items-center text-[11px] font-medium ${lead.isLocationMatch ? 'text-green-600' : 'text-red-500'}`}>
                        {lead.isLocationMatch ? (
                          <><Icons.Success className="w-3 h-3 mr-1" /> Endereço Confirmado</>
                        ) : (
                          <><Icons.Info className="w-3 h-3 mr-1" /> Divergência de Endereço ({lead.cnpjLocation})</>
                        )}
                      </div>
                    )}
                  </div>
                  {lead.details && (
                    <p className="text-xs text-brand-text-secondary italic leading-relaxed bg-white p-2 rounded border border-gray-100">
                      "{lead.details}"
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'socio' && (
                <div className="space-y-4">
                  {lead.adminName ? (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-brand-yellow/20">
                      <div>
                        <span className="text-[10px] font-bold text-brand-yellow-dark uppercase block mb-1">Sócio Proprietário</span>
                        <span className="text-sm font-bold text-brand-text-primary">{lead.adminName}</span>
                      </div>
                      <div className="flex gap-2">
                        {lead.partnerInstagram && (
                          <a href={lead.partnerInstagram.startsWith('http') ? lead.partnerInstagram : `https://instagram.com/${lead.partnerInstagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors">
                            <Icons.AIAgent className="w-4 h-4" />
                          </a>
                        )}
                        {lead.partnerLinkedin && (
                          <a href={lead.partnerLinkedin.startsWith('http') ? lead.partnerLinkedin : `https://linkedin.com/in/${lead.partnerLinkedin}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors">
                            <Icons.AIAgent className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">Informações de sócio não encontradas. Tente enriquecer o lead.</p>
                  )}
                </div>
              )}

              {activeTab === 'analise' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-blue-100">
                    <div className="flex items-center text-blue-800 font-bold text-[10px] uppercase mb-2">
                      <Icons.Info className="w-3 h-3 mr-1" /> Perfil Google
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {lead.gmbAnalysis || 'Análise não disponível.'}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-emerald-100">
                    <div className="flex items-center text-emerald-800 font-bold text-[10px] uppercase mb-2">
                      <Icons.Plug className="w-3 h-3 mr-1" /> Website
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {lead.websiteAnalysis || 'Análise não disponível.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'ads' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Status Google Ads</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.googleAdsStatus?.toLowerCase().includes('ativo') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {lead.googleAdsStatus || 'Não verificado'}
                      </span>
                    </div>
                    {lead.activeAds && lead.activeAds.length > 0 && (
                      <span className="text-[10px] font-bold text-brand-yellow-dark uppercase">{lead.activeAds.length} anúncios encontrados</span>
                    )}
                  </div>

                  {lead.activeAds && lead.activeAds.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {lead.activeAds.map((ad, idx) => (
                        <div key={idx} className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          {/* Ad Header/Image Placeholder */}
                          <div className="h-24 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold text-gray-500 border border-gray-200">
                              {ad.type || 'Anúncio'}
                            </div>
                            <div className="text-center p-4">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
                                {lead.name}
                              </p>
                              <div className="w-8 h-0.5 bg-brand-yellow mx-auto mt-1 opacity-50"></div>
                            </div>
                            {/* Subtle pattern background */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
                          </div>
                          
                          {/* Ad Content */}
                          <div className="p-3 flex-1 flex flex-col">
                            <h4 className="text-[12px] font-bold text-brand-text-primary mb-1 line-clamp-2 leading-tight">
                              {ad.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed mb-3 flex-1">
                              {ad.description}
                            </p>
                            
                            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-gray-400 uppercase truncate max-w-[120px]">
                                {lead.advertiserName || lead.name}
                              </span>
                              <span className="text-[9px] font-medium text-blue-600 flex items-center">
                                Verificado <Icons.Success className="w-2 h-2 ml-0.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-200">
                      <Icons.Refresh className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Nenhum anúncio ativo detectado recentemente.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

const Prospecting: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [enrichingId, setEnrichingId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || !location) return;

    setLoading(true);
    try {
      const results = await prospectLeadsFromMaps(query, location);
      setLeads(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrich = async (lead: Lead) => {
    setEnrichingId(lead.id);
    try {
      const enrichedLead = await enrichLeadWithSearch(lead);
      setLeads(prev => prev.map(l => l.id === lead.id ? enrichedLead : l));
    } catch (error) {
      console.error("Enrichment failed:", error);
    } finally {
      setEnrichingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center">
          <Icons.Prospecting className="w-6 h-6 text-brand-yellow-dark" />
        </div>
        <h1 className="text-3xl font-bold text-brand-text-primary">Prospectar Leads</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-secondary">O que você procura?</label>
            <Input 
              placeholder="Ex: Academias, Restaurantes, Clínicas..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-secondary">Onde?</label>
            <Input 
              placeholder="Ex: São Paulo, SP" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="h-[42px]">
            {loading ? (
              <Icons.Refresh className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Icons.Prospecting className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Buscando...' : 'Buscar Leads'}
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {leads.length > 0 ? (
            leads.map((lead) => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onEnrich={handleEnrich} 
                isEnriching={enrichingId === lead.id} 
              />
            ))
          ) : !loading && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-brand-border">
              <Icons.Prospecting className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-brand-text-secondary">Nenhum lead encontrado ainda.</p>
              <p className="text-sm text-gray-400">Use a busca acima para encontrar potenciais clientes no Google Maps.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Prospecting;
