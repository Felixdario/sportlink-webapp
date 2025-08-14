import axios from "axios";

const api = axios.create({
  baseURL: "https://sportlink-api.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adicionar interceptors para debug
api.interceptors.request.use(request => {
  console.log('Requisição axios:', request.method?.toUpperCase(), request.url);
  console.log('Headers:', request.headers);
  console.log('Dados:', request.data);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Resposta axios:', response.status);
    console.log('Dados da resposta:', response.data);
    return response;
  },
  error => {
    console.log('Erro axios:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados do erro:', error.response.data);
      console.log('Headers da resposta:', error.response.headers);
    }
    return Promise.reject(error);
  }
);

// Interface para competição
export interface CompeticaoParams {
  nome: string;
  descricao?: string;
  esporte: string;
  categoria: string;
  formato: string;
  dataInicio: string;
  dataFim?: string;
  dataLimiteInscricao: string;
  local: string;
  endereco: string;
  latitude?: number | null;
  longitude?: number | null;
  vagas: number;
  minParticipantes: number;
  premio?: string;
  taxaInscricao?: string;
  regras?: string[];
  requisitos?: string[];
  isPublica?: boolean;
  inscricoesAutomaticas?: boolean;
  permitirEquipes?: boolean;
  tamanhoEquipe?: number | null;
  organizador_id: number;
}

export async function register({ nome, email, senha }: { nome: string; email: string; senha: string }) {
  const response = await api.post("usuarios/", { nome, email, senha });
  return response.data;
}

export async function login({ email, senha }: { email: string; senha: string }) {
  const response = await api.post("usuarios/login/", { email, senha });
  return response.data;
}

export async function createCourt({
  nome,
  preco,
  descricao,
  endereco,
  dono_id,
  esportes_ids,
  comodidades,
}: {
  nome: string;
  preco: string;
  descricao: string;
  endereco: string;
  dono_id: number;
  esportes_ids: number[];
  comodidades: string;
}) {
  try {
    // Construir parâmetros para enviar como query params
    const params = {
      nome,
      preco,
      descricao,
      endereco,
      dono_id: dono_id.toString(),
      esportes_ids: esportes_ids.map(id => id.toString()),
      comodidades,
    };
    
    console.log('Enviando dados para API como query params:', params);
    
    // Usando axios com params para colocar os dados na URL como query parameters
    const response = await api.post("quadras/", null, {
      params: params,
      headers: {
        'Accept': 'application/json, text/plain, */*',
      }
    });
    
    return response.data;
  } catch (error: any) {
    // Log detalhado do erro
    console.error('Erro detalhado da API:', error.response?.data);
    console.error('Status do erro:', error.response?.status);
    console.error('Headers da resposta:', error.response?.headers);
    console.error('Erro completo:', error);
    throw error;
  }
}

export async function createCompeticao(competicao: CompeticaoParams) {
  try {
    // Converter para query params
    const params: Record<string, string | string[]> = {};
    
    // Adicionar campos básicos
    params.nome = competicao.nome;
    if (competicao.descricao) params.descricao = competicao.descricao;
    params.esporte = competicao.esporte;
    params.categoria = competicao.categoria;
    params.formato = competicao.formato;
    params.dataInicio = competicao.dataInicio;
    if (competicao.dataFim) params.dataFim = competicao.dataFim;
    params.dataLimiteInscricao = competicao.dataLimiteInscricao;
    params.local = competicao.local;
    params.endereco = competicao.endereco;
    
    // Coordenadas opcionais
    if (competicao.latitude !== undefined && competicao.latitude !== null) {
      params.latitude = competicao.latitude.toString();
    }
    if (competicao.longitude !== undefined && competicao.longitude !== null) {
      params.longitude = competicao.longitude.toString();
    }
    
    // Campos numéricos
    params.vagas = competicao.vagas.toString();
    params.minParticipantes = competicao.minParticipantes.toString();
    params.organizador_id = competicao.organizador_id.toString();
    
    // Campos opcionais
    if (competicao.premio) params.premio = competicao.premio;
    if (competicao.taxaInscricao) params.taxaInscricao = competicao.taxaInscricao;
    
    // Booleanos
    if (competicao.isPublica !== undefined) params.isPublica = competicao.isPublica.toString();
    if (competicao.inscricoesAutomaticas !== undefined) params.inscricoesAutomaticas = competicao.inscricoesAutomaticas.toString();
    if (competicao.permitirEquipes !== undefined) params.permitirEquipes = competicao.permitirEquipes.toString();
    
    // Campos de array 
    if (competicao.regras && competicao.regras.length > 0) {
      params.regras = competicao.regras;
    }
    
    if (competicao.requisitos && competicao.requisitos.length > 0) {
      params.requisitos = competicao.requisitos;
    }
    
    // Tamanho da equipe
    if (competicao.permitirEquipes && competicao.tamanhoEquipe) {
      params.tamanhoEquipe = competicao.tamanhoEquipe.toString();
    }
    
    console.log('Enviando dados de competição como query params:', params);
    
    const response = await api.post("competicoes/", null, {
      params: params,
      headers: {
        'Accept': 'application/json, text/plain, */*',
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar competição:', error.response?.data);
    console.error('Status do erro:', error.response?.status);
    throw error;
  }
}

export default api;
