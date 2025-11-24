import { Router, Request, Response } from 'express';
import { ragService } from '../modules/rag/RAGService';
import { z } from 'zod';
import { RAGQueryRequest } from '../modules/rag/RAGService';

const router = Router();

// Validation schema
const ragQuerySchema = z.object({
  question: z.string().min(1),
  context: z
    .object({
      entityId: z.string().optional(),
      filters: z.record(z.any()).optional(),
      chartType: z.string().optional(),
    })
    .optional(),
  includeNumericData: z.boolean().optional(),
});

// POST /api/rag/query
router.post('/query', async (req: Request, res: Response): Promise<void> => {
  try {
    const request: RAGQueryRequest = ragQuerySchema.parse(req.body);
    const result = await ragService.answerQuestion(request);

    res.json(result);
  } catch (error) {
    console.error('Error processing RAG query:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.errors });
      return;
    }
    // Return more detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to process query',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
});

export default router;
