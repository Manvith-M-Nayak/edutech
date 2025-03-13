import React, { useState } from 'react';
import './CodeEditor.css';

const CodeEditor = ({ language, initialCode, expectedOutput, onSubmitSuccess }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('');

  const getLanguageLabel = () => {
    return language === 'c' ? 'C' : 'Python';
  };

  const getCodeTemplate = () => {
    if (language === 'c') {
      return `#include <stdio.h>\n\nint main() {\n    // Your code here\n    \n    return 0;\n}`;
    } else {
      return `# Python solution\n\ndef main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()`;
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const runCode = () => {
    setIsRunning(true);
    setStatus('Running...');
    
    // Simulate code execution with a timeout
    setTimeout(() => {
      // This is a mock implementation - in a real app, you would send the code
      // to a backend service that would compile and run it
      const simulatedOutput = simulateCodeExecution(code);
      setOutput(simulatedOutput);
      setIsRunning(false);
      
      if (simulatedOutput.trim() === expectedOutput.trim()) {
        setStatus('✓ Success! Your solution produces the correct output.');
        if (onSubmitSuccess) onSubmitSuccess();
      } else {
        setStatus('✗ Output doesn\'t match the expected result. Try again!');
      }
    }, 1500);
  };

  const simulateCodeExecution = (sourceCode) => {
    // This is a mock function that pretends to run the code
    // In a real app, this would be handled by a backend service
    
    // For demo purposes, we'll just check if the code contains certain patterns
    // and return a predetermined output based on the language
    
    if (language === 'c') {
      if (sourceCode.includes('printf') && sourceCode.includes('main()')) {
        return expectedOutput;
      } else {
        return "Compilation error or incorrect output";
      }
    } else if (language === 'python') {
      if (sourceCode.includes('print') && sourceCode.includes('main()')) {
        return expectedOutput;
      } else {
        return "Execution error or incorrect output";
      }
    }
    
    return "Unknown language or execution error";
  };

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <span className="language-label">{getLanguageLabel()}</span>
        <button 
          className="run-button" 
          onClick={runCode} 
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="editor-main">
        <textarea
          className="code-input"
          value={code || getCodeTemplate()}
          onChange={handleCodeChange}
          placeholder={`Write your ${getLanguageLabel()} code here...`}
          disabled={isRunning}
        />
      </div>

      <div className="output-container">
        <div className="output-header">
          <h3>Output</h3>
        </div>
        <pre className="output-area">{output || 'Your code output will appear here...'}</pre>
      </div>

      {status && (
        <div className={`status-message ${status.includes('✓') ? 'success' : status.includes('✗') ? 'error' : ''}`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default CodeEditor; 