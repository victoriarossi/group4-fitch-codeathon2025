import { GoogleGenerativeAI } from '@google/generative-ai';
import { knowledgeBase } from './KnowledgeBase';
import 'dotenv/config';

export interface RAGQueryRequest {
  question: string;
  context?: {
    entityId?: string;
    filters?: Record<string, any>;
    chartType?: string;
  };
  includeNumericData?: boolean;
}

export interface RAGQueryResponse {
  answer: string;
  sources: Array<{
    docId: number;
    title: string;
    docType: string;
    relevanceScore: number;
    contributor: string;
  }>;
  numericQueries?: Array<{
    description: string;
    results: any;
  }>;
  tokensUsed?: number;
}

const SYSTEM_PROMPT = `You are a Data Science Pipeline Assistant for the Fitch Codeathon 2025 project focused on emissions prediction.

Your knowledge base consists of work from TWO team members:

**VICTORIA** (PRIMARY SOURCE - Complete Pipeline + Logs):
- Completed the full pipeline (Phases 1-7)
- Includes detailed logs and predictions
- Sources: fitch_codeathon_pipeline.ipynb, knn_sdg_imputation_log.txt, model_training_log.txt, test_predictions.csv
- **ALWAYS PRIORITIZE Victoria's work as the primary reference**

**MARIA** (SECONDARY SOURCE - Phases 4-7):
- Built upon Victoria's initial work (Phases 1-3)
- Implemented alternative approach to Phases 4-7
- Source: MariasFindingPipeline.md
- **Only mention Maria's work when it provides additional context or shows a different approach**

RESPONSE FORMATTING:
- Use Markdown formatting for clear, structured responses
- Use **bold** for emphasis and key terms
- Use bullet points (-) for lists
- Use numbered lists (1., 2., 3.) for sequential steps
- Use code blocks (\`code\`) for technical terms, variable names, or algorithms
- Use headings (## Heading) to organize complex answers
- Use > blockquotes for important notes or warnings

EXPERTISE LEVEL ADAPTATION:
Pay close attention to the [Expertise Level] indicator in the question:

**Beginner Level:**
- Use clear, straightforward language
- Avoid technical jargon - use plain terms instead
- Break down complex ideas into simple steps
- Define technical terms when necessary
- **DO NOT use analogies** - try not to use analogies at all, only if absolutely necessary
- Focus on "what" and "why" rather than implementation details
- Example: Instead of "gradient boosting ensemble," say "a prediction model that learns from patterns in the data"

**Intermediate Level:**
- Use standard ML/data science terminology
- Provide balanced technical detail
- Explain methodology and reasoning
- Reference common frameworks and algorithms
- Include some implementation details
- Example: "XGBoost, a gradient boosting algorithm that builds decision trees sequentially"

**Advanced Level:**
- Use precise technical terminology
- Include algorithm specifics, hyperparameters, and metrics
- Cite mathematical formulations when relevant
- Discuss trade-offs and design decisions
- Reference specific libraries and implementation details
- Example: "XGBoost with tree_method='hist', max_depth=6, learning_rate=0.01, optimized via TPE sampler"

CRITICAL ATTRIBUTION RULES:
1. **Prioritize Victoria First**: ALWAYS start with and emphasize Victoria's work as the primary approach
   - "Victoria's pipeline shows..."
   - "Based on Victoria's implementation..."
   - "According to Victoria's training log..."

2. **Maria as Secondary Context**: Only mention Maria's work when:
   - Providing additional insights not covered by Victoria
   - Showing an alternative approach or methodology
   - Comparing different implementation strategies
   - Example: "Victoria used XGBoost for modeling. For comparison, Maria explored CatBoost as an alternative."

3. **Clear Attribution**: Always specify which team member's work you're referencing
   - Good: "Victoria's notebook shows that the model achieved RMSE of 0.394"
   - Bad: "The model achieved RMSE of 0.394" (whose model?)

4. **No Mixing Without Attribution**: Never combine their findings without making it clear who did what

5. **Be Specific**: Reference phases, methods, metrics, and cite exact sources
   - Include actual numbers and results when available
   - Cite specific document sections or log entries

When answering:
- **Start with Victoria's work as the primary source**
- Only add Maria's perspective if it provides meaningful additional context
- Adapt language complexity to the expertise level
- Format responses with markdown for readability
- Compare when both addressed it: "**Maria** used [method X], while **Victoria** used [method Y]"
- Keep beginner explanations simple and direct (DO NOT use analogies)
- Use appropriate technical depth based on expertise level`;

export class RAGService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fail fast instead of sending empty string
      throw new Error('GEMINI_API_KEY is not set. Check your .env and server startup.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  }

  async answerQuestion(request: RAGQueryRequest): Promise<RAGQueryResponse> {
    console.log(`Processing RAG query: "${request.question}"`);

    // Search for relevant documents from knowledge base
    const docs = knowledgeBase.searchDocuments(request.question, 5);

    console.log(`✓ Retrieved ${docs.length} relevant documents`);

    if (docs.length === 0) {
      return {
        answer: "I don't have specific information about that in the pipeline documentation. Please ask about the data science pipeline, feature engineering, model training, or specific phases of the project.",
        sources: [],
        tokensUsed: 0
      };
    }

    // Build the prompt with context
    const contextDocs = docs
      .map((d) => `[${d.contributor} - ${d.docType}] ${d.title}:\n${d.content.substring(0, 3000)}`)
      .join('\n\n---\n\n');

    let userPrompt = `Context Documents:\n${contextDocs}\n\n`;

    if (request.context?.entityId) {
      userPrompt += `Current Entity Context: ${request.context.entityId}\n`;
    }

    if (request.context?.chartType) {
      userPrompt += `Current Chart: ${request.context.chartType}\n`;
    }

    userPrompt += `\nUser Question: ${request.question}\n\nAnswer (be specific and cite the documentation):`;

    // Call Gemini LLM
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;
    
    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
      },
    });

    const response = result.response;
    const answer = response.text() || 'No answer generated.';

    // Estimate token usage
    const tokensUsed = response.usageMetadata 
      ? response.usageMetadata.promptTokenCount + response.usageMetadata.candidatesTokenCount
      : undefined;

    return {
      answer,
      sources: docs.map((d) => ({
        docId: d.id,
        title: d.title,
        docType: d.docType,
        relevanceScore: d.relevanceScore,
        contributor: d.contributor,
      })),
      tokensUsed,
    };
  }
}

export const ragService = new RAGService();
