import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import './QuestionDetail.css';

const QuestionDetail = () => {
  const { languageId, typeId, questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [solved, setSolved] = useState(false);

  // Map to display proper names
  const languages = {
    c: 'C Programming',
    python: 'Python'
  };

  // Mock data for questions
  const mockQuestions = {
    c: {
      '1': {
        id: 1,
        title: 'Implement a Stack using Arrays',
        difficulty: 'Medium',
        description: `Design a Stack data structure that supports the following operations: push, pop, top, and is_empty.
        
A stack follows the Last-In-First-Out (LIFO) principle, where elements are added and removed from the same end, called the top.

Implement the Stack class:
- push(x): Adds element x to the top of the stack.
- pop(): Removes and returns the element from the top of the stack.
- top(): Returns the element at the top of the stack without removing it.
- is_empty(): Returns true if the stack is empty, false otherwise.`,
        constraints: `- You may only use array operations.
- All operations should have O(1) time complexity.
- The stack can hold a maximum of 100 elements.`,
        input_example: `push(1)
push(2)
top()
pop()
is_empty()`,
        output_example: `2
2
false`,
        initialCode: `#include <stdio.h>

#define MAX_SIZE 100

typedef struct {
    int data[MAX_SIZE];
    int top;
} Stack;

// Initialize the stack
void initialize(Stack *stack) {
    // Your code here
}

// Push element onto stack
void push(Stack *stack, int x) {
    // Your code here
}

// Pop element from stack
int pop(Stack *stack) {
    // Your code here
    return -1;  // placeholder
}

// Return the top element without removing it
int top(Stack *stack) {
    // Your code here
    return -1;  // placeholder
}

// Check if stack is empty
int is_empty(Stack *stack) {
    // Your code here
    return 1;  // placeholder
}

int main() {
    Stack stack;
    initialize(&stack);
    
    push(&stack, 1);
    push(&stack, 2);
    
    printf("%d\\n", top(&stack));
    printf("%d\\n", pop(&stack));
    printf("%s\\n", is_empty(&stack) ? "true" : "false");
    
    return 0;
}`,
        expectedOutput: `2
2
false`
      },
      // More C questions...
    },
    python: {
      '10': {
        id: 10,
        title: 'Create a Web Scraper',
        difficulty: 'Medium',
        description: `Create a simple web scraper function that can extract all link URLs from a given HTML string.

The function should take a string of HTML as input and return a list of all URLs found in href attributes of anchor tags (<a>).`,
        constraints: `- You don't need to make actual web requests
- You can assume the HTML is well-formed
- Return an empty list if no links are found
- You may use regular expressions`,
        input_example: `<html><body><a href="https://example.com">Link 1</a><a href="https://test.org/page">Link 2</a></body></html>`,
        output_example: `["https://example.com", "https://test.org/page"]`,
        initialCode: `def extract_links(html):
    # Your code here
    return []

# Test the function
html = '<html><body><a href="https://example.com">Link 1</a><a href="https://test.org/page">Link 2</a></body></html>'
links = extract_links(html)
print(links)`,
        expectedOutput: `['https://example.com', 'https://test.org/page']`
      },
      // More Python questions...
    }
  };

  useEffect(() => {
    // In a real app, this would be an API call to fetch the question
    const mockQuestion = mockQuestions[languageId] && mockQuestions[languageId][questionId];
    if (mockQuestion) {
      setQuestion(mockQuestion);
    } else {
      // Redirect to questions list if question not found
      navigate(`/questions/${languageId}/${typeId}`);
    }
  }, [languageId, typeId, questionId, navigate]);

  const handleSubmitSuccess = () => {
    setSolved(true);
    // In a real app, we would save this to the user's profile
  };

  if (!question) {
    return (
      <div className="question-detail-container">
        <div className="loading">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="question-detail-container">
      <nav className="question-detail-nav">
        <button onClick={() => navigate(`/questions/${languageId}/${typeId}`)} className="back-button">
          ← Back to Questions
        </button>
        <h1>{question.title}</h1>
        <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
          {question.difficulty}
        </span>
      </nav>

      <div className="question-detail-content">
        <div className="question-panel">
          <div className="question-description">
            <h2>Problem Description</h2>
            <pre>{question.description}</pre>
          </div>

          <div className="question-io">
            <div className="example-section">
              <h3>Example Input</h3>
              <pre>{question.input_example}</pre>
            </div>
            
            <div className="example-section">
              <h3>Example Output</h3>
              <pre>{question.output_example}</pre>
            </div>
          </div>

          <div className="question-constraints">
            <h3>Constraints</h3>
            <pre>{question.constraints}</pre>
          </div>

          {solved && (
            <div className="solved-badge">
              <i className="fas fa-check-circle"></i> Problem Solved!
            </div>
          )}
        </div>

        <div className="editor-panel">
          <h2>Your Solution</h2>
          <CodeEditor 
            language={languageId} 
            initialCode={question.initialCode}
            expectedOutput={question.expectedOutput}
            onSubmitSuccess={handleSubmitSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail; 