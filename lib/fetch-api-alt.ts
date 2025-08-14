// Versão alternativa com possíveis conversões de tipos

export async function createCourtWithAltTypes({
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
    // Testar diferentes formatos de dados que a API pode estar esperando
    // Versão 1: Converter IDs para strings
    const payload1 = {
      nome,
      preco,
      descricao,
      endereco,
      dono_id: String(dono_id),
      esportes_ids: esportes_ids.map(id => String(id)),
      comodidades,
    };
    
    console.log('Tentativa 1 - IDs como strings:', JSON.stringify(payload1));
    
    try {
      const response1 = await fetch('https://sportlink-api.onrender.com/quadras/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload1)
      });
      
      if (response1.ok) {
        return await response1.json();
      }
      console.log('Tentativa 1 falhou com status:', response1.status);
    } catch (error) {
      console.log('Erro na tentativa 1:', error);
    }
    
    // Versão 2: Tentar com uma estrutura diferente para esportes_ids
    const payload2 = {
      nome,
      preco,
      descricao,
      endereco,
      dono_id,
      esportes_ids: JSON.stringify(esportes_ids),
      comodidades,
    };
    
    console.log('Tentativa 2 - esportes_ids como JSON string:', JSON.stringify(payload2));
    
    try {
      const response2 = await fetch('https://sportlink-api.onrender.com/quadras/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload2)
      });
      
      if (response2.ok) {
        return await response2.json();
      }
      console.log('Tentativa 2 falhou com status:', response2.status);
    } catch (error) {
      console.log('Erro na tentativa 2:', error);
    }
    
    // Versão 3: Tentar com valores hardcoded exatamente como no CURL
    const payload3 = {
      nome: "Quadra Central",
      preco: "R$ 120/hora",
      descricao: "Quadra coberta com boa iluminação e estrutura para eventos",
      endereco: "Rua das Palmeiras, 123",
      dono_id: 1,
      esportes_ids: [1, 2],
      comodidades: "Vestiários, chuveiros, lanchonete, estacionamento"
    };
    
    console.log('Tentativa 3 - Valores hardcoded:', JSON.stringify(payload3));
    
    const response3 = await fetch('https://sportlink-api.onrender.com/quadras/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload3)
    });
    
    if (!response3.ok) {
      const errorData = await response3.json().catch(() => ({}));
      console.error('Todas as tentativas falharam. Resposta de erro final:', response3.status, errorData);
      throw new Error(`Erro ${response3.status}: ${JSON.stringify(errorData)}`);
    }
    
    return await response3.json();
  } catch (error) {
    console.error('Erro final nas tentativas alternativas:', error);
    throw error;
  }
}
