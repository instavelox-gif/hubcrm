import { GoogleGenAI, Modality, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';

export interface Ad {
  title: string;
  description?: string;
  type?: string;
}

export interface Lead {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewsCount?: number;
  category?: string;
  details?: string;
  email?: string;
  linkedin?: string;
  cnpj?: string;
  cnpjLocation?: string;
  isLocationMatch?: boolean;
  adminName?: string;
  partnerInstagram?: string;
  partnerLinkedin?: string;
  googleAdsStatus?: string;
  advertiserName?: string;
  activeAds?: Ad[];
  gmbAnalysis?: string;
  websiteAnalysis?: string;
  source: 'google_maps' | 'google_search';
}

export const prospectLeadsFromMaps = async (query: string, location: string): Promise<Lead[]> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Encontre leads de negócios para "${query}" em "${location}". 
  Extraia o nome, endereço, telefone, website (se disponível), avaliação, quantidade de avaliações e categoria de cada local.
  Retorne os dados estritamente no formato de um array JSON, sem blocos de código markdown ou texto adicional.
  Exemplo: [{"name": "Empresa A", "address": "Rua X", "phone": "123", "website": "www.a.com", "rating": 4.5, "reviewsCount": 100, "category": "Academia"}]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        // responseMimeType: "application/json" is NOT supported with googleMaps
      },
    });

    const text = response.text || '[]';
    // Clean up potential markdown blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const leadsData = JSON.parse(jsonStr);
    
    return Array.isArray(leadsData) ? leadsData.map((l: any, index: number) => ({
      ...l,
      id: `maps-${index}-${Date.now()}`,
      source: 'google_maps'
    })) : [];
  } catch (error) {
    console.error("Error prospecting from Maps:", error);
    return [];
  }
};

export const enrichLeadWithSearch = async (lead: Lead): Promise<Lead> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Pesquise informações detalhadas sobre a empresa/profissional "${lead.name}" localizada em "${lead.address}".
  
  TAREFAS ESPECÍFICAS:
  1. Tente encontrar o CNPJ oficial da empresa.
  2. Verifique se a localização registrada no CNPJ (Cidade/Estado) coincide com o endereço fornecido: "${lead.address}".
  3. Encontre o LinkedIn da empresa, e-mail de contato e website oficial.
  4. Encontre o nome do Sócio Proprietário ou Administrador da empresa.
  5. Tente encontrar o Instagram e o LinkedIn pessoal deste Sócio Proprietário.
  6. PESQUISA DE ANÚNCIOS (CRÍTICO): 
     - Pesquise no Google Ads Transparency Center pelo domínio "${lead.website || lead.name}" ou pelo nome da empresa.
     - Identifique o nome do ANUNCIANTE (ex: "ORLANDO BARASUOL JUNIOR").
     - Liste os títulos e descrições EXATOS dos anúncios ativos (ex: "Aposente-se sem dor de cabeça", "Benefícios do INSS").
     - Se encontrar anúncios, defina googleAdsStatus como "Ativo".
  7. Como um Analista Sênior de Marketing Digital, avalie o Perfil de Empresa no Google (Google Meu Negócio) desta empresa (baseado em avaliações, fotos, completude) e também o Site deles.
  8. Resuma as descobertas no campo "details".
  
  Se os dados de localização do CNPJ baterem com o endereço fornecido, defina "isLocationMatch" como true.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            details: { type: Type.STRING, description: "Resumo das informações encontradas" },
            email: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            website: { type: Type.STRING },
            cnpj: { type: Type.STRING, description: "Número do CNPJ encontrado" },
            cnpjLocation: { type: Type.STRING, description: "Localização (Cidade/Estado) registrada no CNPJ" },
            isLocationMatch: { type: Type.BOOLEAN, description: "Se a localização do CNPJ bate com o endereço do lead" },
            adminName: { type: Type.STRING, description: "Nome do sócio proprietário ou administrador" },
            partnerInstagram: { type: Type.STRING, description: "Instagram pessoal do sócio proprietário" },
            partnerLinkedin: { type: Type.STRING, description: "LinkedIn pessoal do sócio proprietário" },
            googleAdsStatus: { type: Type.STRING, description: "Status de anúncios no Google (ex: Ativo, Inativo, Não encontrado)" },
            advertiserName: { type: Type.STRING, description: "Nome do anunciante verificado no Google Ads (ex: ORLANDO BARASUOL JUNIOR)" },
            activeAds: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Título principal do anúncio" },
                  description: { type: Type.STRING, description: "Descrição ou corpo do anúncio" },
                  type: { type: Type.STRING, description: "Tipo do anúncio (ex: Pesquisa, Display, Vídeo)" }
                }
              },
              description: "Lista de anúncios ativos encontrados" 
            },
            gmbAnalysis: { type: Type.STRING, description: "Análise sênior do Perfil Google Meu Negócio" },
            websiteAnalysis: { type: Type.STRING, description: "Análise sênior do Website da empresa" },
          }
        }
      },
    });

    const enrichment = JSON.parse(response.text || '{}');
    return {
      ...lead,
      details: enrichment.details || lead.details,
      website: enrichment.website || lead.website,
      email: enrichment.email || lead.email,
      linkedin: enrichment.linkedin || lead.linkedin,
      cnpj: enrichment.cnpj || lead.cnpj,
      cnpjLocation: enrichment.cnpjLocation || lead.cnpjLocation,
      isLocationMatch: enrichment.isLocationMatch ?? lead.isLocationMatch,
      adminName: enrichment.adminName || lead.adminName,
      partnerInstagram: enrichment.partnerInstagram || lead.partnerInstagram,
      partnerLinkedin: enrichment.partnerLinkedin || lead.partnerLinkedin,
      googleAdsStatus: enrichment.googleAdsStatus || lead.googleAdsStatus,
      advertiserName: enrichment.advertiserName || lead.advertiserName,
      activeAds: enrichment.activeAds || lead.activeAds,
      gmbAnalysis: enrichment.gmbAnalysis || lead.gmbAnalysis,
      websiteAnalysis: enrichment.websiteAnalysis || lead.websiteAnalysis,
    };
  } catch (error) {
    console.error("Error enriching lead:", error);
    return lead;
  }
};
