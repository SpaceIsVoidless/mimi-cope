import React, { useState } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import ReactMarkdown from 'react-markdown';
import Scene from '../components/3d/Scene';
import '../styles/DashboardPage.css'; // Corrected the path assuming CSS is in the same folder

const API_URL = 'http://localhost:5001/api/ai/generate-scene';

const DashboardPage = () => {
  const [prompt, setPrompt] = useState('a table with an apple on it');
  const [sceneData, setSceneData] = useState({ objects: [], relationships: [], sequence: [] });
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleGenerateScene = async () => {
    console.log(`--- NEW REQUEST ---`);
    console.log(`Step 1: Sending prompt to backend: "${prompt}"`);
    setIsLoading(true);
    setError(null);
    setCurrentStep(0);
    try {
      const response = await axios.post(API_URL, { prompt });
      console.log("Step 2: Received raw response from backend:", response.data);

      const { sceneGraph, explanation } = response.data;
      
      if (sceneGraph && sceneGraph.objects) {
        console.log("Step 3: Valid SceneGraph received. Setting state.", sceneGraph);
        setSceneData(sceneGraph);
      } else {
        throw new Error("Backend response missing a valid 'sceneGraph'.");
      }

      if (explanation) {
        console.log("Step 4: Explanation received.", explanation);
        setExplanation(explanation);
      }

    } catch (err) {
      console.error("Step FAIL: An error occurred while fetching from the backend.", err);
      setError('Failed to generate scene. Please check the console for details.');
    }
    setIsLoading(false);
  };

  const handleNextStep = () => {
    if (sceneData.sequence && currentStep < sceneData.sequence.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="left-panel">
        
        {/* --- THIS IS THE CORRECTED SECTION --- */}
        <div className="prompt-controls">
          <h3>Enter a concept to visualize:</h3>
          <textarea
 style={{ maxWidth: "400px", width: "100%" }}            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'the water cycle' or 'a car at a traffic light'"
          />
          <button onClick={handleGenerateScene} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Visualize'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>
        {/* --- END OF CORRECTION --- */}

        <div className="explanation-panel">
          <h3>Simple Explanation</h3>
          <div className="explanation-content " style={{textAlign : 'left'}}>
            <ReactMarkdown>{explanation || 'The AI-generated explanation will appear here.'}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="main-content">
        <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
          <Scene data={sceneData} currentStep={currentStep} />
        </Canvas>
        
        {sceneData.sequence && sceneData.sequence.length > 0 && (
          <div className="animation-ui">
            <p>Step {currentStep}/{sceneData.sequence.length}: {currentStep > 0 ? sceneData.sequence[currentStep - 1].label : 'Initial Scene'}</p>
            <button onClick={handlePrevStep} disabled={currentStep <= 1}>Prev</button>
            <button onClick={handleNextStep} disabled={currentStep >= sceneData.sequence.length}>Next</button>
          </div>
        )}
      </div>

      <div className="right-sidebar">
        <h3>Chat Copilot</h3>
        <div className="chat-content">
          <p>(Chat functionality will be implemented here)</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;