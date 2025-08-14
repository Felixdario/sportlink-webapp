// Funções de API usando fetch nativo ao invés de axios

export async function createCourtWithFetch({
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
    const payload = {
      nome,
      preco,
      descricao,
      endereco,
      dono_id,
      esportes_ids,
      comodidades,
    };
    
    console.log('Enviando dados via fetch:', JSON.stringify(payload));
    
    // Usar o formato exato do CURL
    const response = await fetch('https://sportlink-api.onrender.com/quadras/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'http://localhost:3000',
        'Referer': 'http://localhost:3000/',
      },
      body: JSON.stringify(payload)
    });
    
    // Se a resposta não for ok, lançamos um erro
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Resposta de erro:', response.status, errorData);
      throw new Error(`Erro ${response.status}: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao usar fetch:', error);
    throw error;
  }
}
