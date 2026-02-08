import React, { useState } from 'react';
import axios from 'axios';
// import './MLPredict.css';

const MLPredict = () => {
  const [inputText, setInputText] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('Please enter some text for prediction');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await axios.post('/api/predict', {
        input: inputText
      });

      if (response.data.success) {
        const newPrediction = {
          input: inputText,
          output: response.data.prediction,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setPrediction(newPrediction);
        setHistory(prev => [newPrediction, ...prev.slice(0, 4)]); // Keep last 5
      } else {
        setError('Prediction failed: ' + response.data.message);
      }
    } catch (err) {
      setError('Error connecting to prediction service');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (exampleText) => {
    setInputText(exampleText);
  };

  const examples = [
    "Analyze this customer feedback for sentiment...",
    "Predict the next quarter sales based on current trends...",
    "Classify this document as urgent or normal priority...",
    "Extract key entities from the following business text..."
  ];

  return (
    <div className="ml-predict-container">
      <div className="header-section">
        <h1>🤖 ML Prediction Service</h1>
        <p>Connect to machine learning models for text analysis and predictions</p>
      </div>

      <div className="content-grid">
        {/* Input Section */}
        <div className="input-section">
          <div className="input-card">
            <h3>Enter Text for Analysis</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text for ML prediction..."
                  rows="6"
                  disabled={loading}
                />
                <div className="char-count">
                  {inputText.length} characters
                </div>
              </div>

              <div className="example-buttons">
                <p>Try an example:</p>
                <div className="example-grid">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExample(example)}
                      className="example-btn"
                      disabled={loading}
                    >
                      Example {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="predict-btn"
                disabled={loading || !inputText.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : 'Get Prediction'}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          {/* Current Prediction */}
          {prediction && (
            <div className="result-card">
              <h3>📊 Prediction Result</h3>
              <div className="result-meta">
                <span className="timestamp">🕒 {prediction.timestamp}</span>
              </div>
              
              <div className="result-content">
                <div className="input-preview">
                  <strong>Input:</strong>
                  <p>{prediction.input.length > 100 
                    ? `${prediction.input.substring(0, 100)}...` 
                    : prediction.input}
                  </p>
                </div>
                
                <div className="prediction-output">
                  <strong>ML Output:</strong>
                  <pre>{JSON.stringify(prediction.output, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Prediction History */}
          {history.length > 0 && (
            <div className="history-card">
              <h4>📜 Recent Predictions</h4>
              <div className="history-list">
                {history.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-header">
                      <span className="history-time">{item.timestamp}</span>
                    </div>
                    <p className="history-input">
                      {item.input.length > 50 
                        ? `${item.input.substring(0, 50)}...` 
                        : item.input}
                    </p>
                    <div className="history-status">
                      <span className="status-badge success">Success</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!prediction && history.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🤖</div>
              <h4>No Predictions Yet</h4>
              <p>Enter text above to get your first ML prediction</p>
              <div className="ml-info">
                <p><strong>Connected to:</strong> https://ml-server.com/predict</p>
                <p><strong>Service:</strong> Text Analysis & Prediction</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLPredict;