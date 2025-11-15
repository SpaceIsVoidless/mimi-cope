const aiService = require('../services/aiService');

const generateScene = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // We will add retry logic around this call later
    const result = await aiService.generateSceneJson(prompt);
    res.json(result);
  } catch (error) {
    console.error('Error in AI Controller:', error);
    res.status(500).json({ error: 'Failed to generate scene from AI.' });
  }
};

module.exports = { generateScene };