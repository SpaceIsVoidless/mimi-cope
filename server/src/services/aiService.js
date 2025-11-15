const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const getStage1Prompt = (userInput) => `
  You are an expert educator for a K-12 student with neurodivergent needs.
  A user wants to understand: "${userInput}".
  Your task is to write a simple, clear, and concise explanation using Markdown.
  Use short sentences, simple analogies, and bullet points or numbered lists if it helps.
  This explanation will be shown to the user and will be used to generate a 3D visualization.
`;

const getStage2Prompt = (explanation, userInput) => `
  Based on the user's original request "${userInput}" and the following simple explanation, generate a structured JSON Scene Graph for our 3D renderer.
  Your ONLY output must be a single JSON object.

  Explanation:
  ---
  ${explanation}
  ---

  ### SECTION 1: VISUALIZING PHYSICAL OBJECTS & SCENES
  This is your priority for prompts like "a car", "a snowman", "a table with an apple on it".

  - **DECOMPOSITION:** You MUST break down complex objects into simpler component shapes. A 'car' is a box with cylinder wheels. A 'table' is a box with cylinder legs.
  - **PARENTING:** Use the 'parent' property to connect parts. The 'position' of a child is relative to its parent's center.
  - **PROPERTIES:** Every object needs: id, shape, color, position, size, label, and showLabel.
  - **SIZE:** The 'size' property MUST ALWAYS be an array of three numbers: [width, height, depth].
  - **ROTATION:** Use 'rotation' [x, y, z] in degrees for orientation.
  - **LABELS:** For composite objects, set 'showLabel': true ONLY for the main parent object.

  ### SECTION 2: VISUALIZING ABSTRACT CONCEPTS & PROCESSES
  Use this for prompts like "supply and demand" or "the water cycle".

  - **SYMBOLIZE:** Represent abstract concepts as simple shapes.
  - **RELATE:** Use the "relationships" array for non-sequential connections. A relationship needs: 'from', 'to', 'type', and 'label'.
  - **SEQUENCE:** For processes, create a "sequence" array. Each step needs: "step", "label", "targetId", "action", and "params".
  - **ACTION:** Must be one of: 'move', 'rotate', 'scale', 'changeColor', 'appear', 'disappear'.
  - For 'appear'/'disappear', set the object's initial "visible" property to false.
`;


const generateSceneJson = async (userInput) => {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // --- STAGE 1: Generate the simple text explanation ---
      console.log(`AI Service (Attempt ${attempt}): Starting Stage 1 - Generating Explanation...`);
      const stage1Prompt = getStage1Prompt(userInput);
      const explanationResult = await model.generateContent(stage1Prompt);
      const explanation = explanationResult.response.text();
      console.log(`AI Service (Attempt ${attempt}): Stage 1 Complete.`);

      // --- STAGE 2: Generate the Scene Graph from the explanation ---
      console.log(`AI Service (Attempt ${attempt}): Starting Stage 2 - Generating Scene Graph...`);
      const stage2Prompt = getStage2Prompt(explanation, userInput);
      const sceneGraphResult = await model.generateContent(stage2Prompt);
      let jsonText = sceneGraphResult.response.text();
      
      const startIndex = jsonText.indexOf('{');
      const endIndex = jsonText.lastIndexOf('}');
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("AI did not return valid JSON for the scene graph.");
      }
      jsonText = jsonText.substring(startIndex, endIndex + 1);
      const sceneGraph = JSON.parse(jsonText);
      console.log(`AI Service (Attempt ${attempt}): Stage 2 Complete. Success!`);

      return { explanation, sceneGraph };

    } catch (error) {
      lastError = error;
      console.error(`AI Service (Attempt ${attempt}) failed:`, error.message);
      if (attempt < maxRetries && error.message.includes('503')) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw lastError; // A non-retryable error occurred
      }
    }
  }
  throw lastError; // All retries failed
};

module.exports = { generateSceneJson };