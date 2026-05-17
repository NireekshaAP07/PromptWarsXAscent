import { Router, Request, Response } from 'express';
import { chatWithCopilot } from '../services/gemini';

const router = Router();

/**
 * POST /api/chat
 * Contextual chat assistant to answer doubts regarding documents or general law
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { query, contractText, history } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query text cannot be empty.' });
    }

    console.log(`[LexGuard Backend] Initiating AI Assistant query (length: ${query.length} characters)...`);
    const reply = await chatWithCopilot(query, contractText || null, history || []);
    console.log(`[LexGuard Backend] AI Assistant query resolved successfully.`);
    
    return res.json({ reply });

  } catch (error: any) {
    console.error('[LexGuard Backend] Error in AI Assistant chat endpoint:', error);
    return res.status(500).json({ 
      error: `Failed to fetch response from Copilot. Technical details: ${error.message}` 
    });
  }
});

export default router;
