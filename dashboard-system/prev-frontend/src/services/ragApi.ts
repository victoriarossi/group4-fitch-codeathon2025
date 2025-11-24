interface RAGQueryRequest {
  question: string;
  context?: {
    entityId?: string;
    filters?: Record<string, any>;
    chartType?: string;
  };
  includeNumericData?: boolean;
}

interface RAGQueryResponse {
  answer: string;
  sources: Array<{
    docId: number;
    title: string;
    docType: string;
    relevanceScore: number;
  }>;
  numericQueries?: Array<{
    description: string;
    results: any;
  }>;
  tokensUsed?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function queryRAG(request: RAGQueryRequest): Promise<RAGQueryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/rag/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `RAG query failed with status ${response.status}`);
  }

  return response.json();
}
