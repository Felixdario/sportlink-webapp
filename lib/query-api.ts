// Implementação correta usando query parameters

export async function createCourtWithQueryParams({
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
    // Construir a URL com query parameters
    const params = new URLSearchParams();
    params.append('nome', nome);
    params.append('preco', preco);
    params.append('descricao', descricao);
    params.append('endereco', endereco);
    params.append('dono_id', dono_id.toString());
    
    // Para arrays, adicionar multiple valores com o mesmo nome
    esportes_ids.forEach(id => {
      params.append('esportes_ids', id.toString());
    });
    
    params.append('comodidades', comodidades);
    
    const url = `https://sportlink-api.onrender.com/quadras/?${params.toString()}`;
    console.log('Tentando com query params. URL completa:', url);
    
    // Enviar sem body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na resposta query params:', response.status, errorData);
      throw new Error(`Erro ${response.status}: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar com query params:', error);
    throw error;
  }
}
