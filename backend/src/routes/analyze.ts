import { Router, Request, Response } from 'express';
import { analyzeContract } from '../services/gemini';
import { PRESETS } from '../lib/presets';

const router = Router();

/**
 * POST /api/analyze
 * Audits contract text or triggers instant preset analysis bypass
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, presetId } = req.body;

    // 1. Instant Preset Bypass (delivers immediate visual demo response)
    if (presetId) {
      console.log(`[LexGuard Backend] Instant bypass triggered for Preset ID: ${presetId}`);
      const preset = PRESETS.find((p) => p.id === presetId);
      if (preset) {
        return res.json(preset.analysis);
      }
      return res.status(404).json({ error: `Preset ID '${presetId}' not found.` });
    }

    const contractText = text || '';
    if (!contractText.trim()) {
      return res.status(400).json({ error: 'Contract text cannot be empty.' });
    }

    console.log(`[LexGuard Backend] Initiating analysis for text input (length: ${contractText.length} characters)...`);
    const analysisResult = await analyzeContract(contractText);
    console.log(`[LexGuard Backend] Analysis completed successfully.`);
    
    return res.json(analysisResult);

  } catch (error: any) {
    console.error('[LexGuard Backend] Error during contract auditing:', error);
    return res.status(500).json({ 
      error: `Failed to analyze contract. Technical details: ${error.message}` 
    });
  }
});

export default router;
