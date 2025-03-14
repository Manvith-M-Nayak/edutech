import React, { useState } from "react";
import "./LanguageSelection.css";
import { Link } from "react-router-dom";

const competencyMatrices = {
  Python: [
    ["Syntax Knowledge", "Limited to basic Python syntax (e.g., print, loops). Struggles with indentation rules.", "Understands fundamental constructs like loops, functions, and conditionals.", "Comfortable with advanced constructs like list comprehensions, decorators, and context managers.", "Can write highly optimized code using idiomatic Python features and patterns.", "Understands Python internals, such as how the interpreter handles memory and the Global Interpreter Lock."],
    ["Data Structures", "Uses lists and dictionaries for everything without understanding their time complexities.", "Knows and uses lists, sets, tuples, and dictionaries appropriately.", "Can implement and optimize custom data structures (e.g., linked lists, trees).", "Familiar with collections and heapq libraries for advanced needs.", "Designs domain-specific data structures or extends Python's built-in structures for high performance."],
    ["Algorithms", "Struggles with basic sorting and searching algorithms.", "Understands and implements simple algorithms like Bubble Sort and Linear Search.", "Comfortable with recursion and divide-and-conquer algorithms like Merge Sort and Quick Sort.", "Proficient in dynamic programming and advanced graph algorithms like Dijkstra's and A*.", "Designs and optimizes complex algorithms for large-scale systems and parallel computing."],
    ["Object-Oriented Programming", "Rarely uses classes or uses them incorrectly (e.g., confusing class and instance variables).", "Knows how to define and use classes with instance and class methods.", "Applies OOP concepts like inheritance, polymorphism, and encapsulation effectively.", "Designs reusable, scalable, and testable class hierarchies.", "Implements metaclasses and leverages Python’s dynamic nature to create flexible, advanced solutions."],
    ["Error Handling", "Ignores exceptions or handles errors with pass.", "Uses try and except blocks to handle exceptions.", "Writes meaningful error messages and understands the exception hierarchy.", "Implements robust error-handling strategies, including custom exceptions and graceful recovery.", "Designs error-resilient systems that gracefully degrade and log detailed diagnostics for debugging."],
    ["Frameworks", "Unfamiliar with any Python frameworks.", "Knows about Flask and Django but struggles with practical use.", "Can build simple applications using frameworks.", "Proficient in optimizing and structuring large-scale applications.", "Designs and contributes to advanced framework optimizations."]
  ],
  C: [
    ["Syntax Knowledge", "Limited to basic C syntax (e.g., printf, loops). Struggles with pointers and memory management.", "Understands fundamental constructs like functions, arrays, and pointers.", "Comfortable with structs, unions, and function pointers.", "Can write highly optimized code using macros and inline functions.", "Understands C internals, such as how memory management works and how the compiler optimizes code."],
    ["Data Structures", "Uses arrays for most tasks, limited understanding of linked lists and stacks.", "Knows and uses arrays, linked lists, stacks, and queues.", "Can implement and optimize custom data structures like trees and hash tables.", "Familiar with advanced data structures like AVL trees, heaps, and graphs.", "Designs domain-specific data structures or extends existing ones for specialized tasks."],
    ["Algorithms", "Basic understanding of sorting (Bubble Sort) and searching (Linear Search).", "Can implement basic algorithms like Binary Search, Selection Sort, and Insertion Sort.", "Comfortable with Divide and Conquer techniques and greedy algorithms.", "Proficient in dynamic programming and advanced graph algorithms (Dijkstra, Floyd-Warshall).", "Designs complex algorithms for specific problems, including parallel and distributed algorithms."],
    ["Memory Management", "Limited to basic malloc and free usage. Often leads to memory leaks.", "Understands pointers and can use dynamic memory allocation effectively.", "Comfortable managing memory for complex data structures (trees, graphs).", "Uses custom memory management techniques like memory pools and slab allocation.", "Mastery of low-level memory management and optimization for performance-critical systems."],
    ["Error Handling", "Ignores errors or fails to check return values.", "Uses error codes and checks return values from functions.", "Implements structured error handling using errno and perror.", "Develops robust error-handling strategies, including logging and failover mechanisms.", "Designs error-resilient systems with thorough fault tolerance and debugging capabilities."],
    ["Concurrency and Parallelism", "No understanding of multithreading or parallelism.", "Can use basic POSIX threads for simple tasks.", "Familiar with synchronization primitives like mutexes and semaphores.", "Implements multi-threaded programs using efficient synchronization and lock-free algorithms.", "Designs and optimizes parallel algorithms using advanced techniques like OpenMP or MPI."],
  ],
};

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  return (
    <div className="language-selection-container">
      <h2>Select a Language</h2>
      <div className="language-buttons">
        {Object.keys(competencyMatrices).map((language) => (
          <button key={language} onClick={() => setSelectedLanguage(language)}>
            {language}
          </button>
        ))}
      </div>
      {selectedLanguage && (
        <div>
          <h3>{selectedLanguage} Programmer Competency Matrix</h3>
          <table>
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Level 0</th>
                <th>Level 1</th>
                <th>Level 2</th>
                <th>Level 3</th>
                <th>Level 4</th>
              </tr>
            </thead>
            <tbody>
              {competencyMatrices[selectedLanguage].map((row, index) => (
                <tr key={index}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/questions" className="questions-button">
        Go to Questions
      </Link>
    </div>
  );
};

export default LanguageSelection;
