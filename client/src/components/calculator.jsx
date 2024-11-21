import React, { useState } from 'react';
import './calculator.css'; // We’ll handle pop-up styling here

function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    setInput(input + value);
  };

  const handleEqual = () => {
    try {
      // Check for division by zero
      if (input.includes('/0')) {
        setResult('Error: Division by Zero');
        return;
      }
      setResult(eval(input)); // Use eval to calculate the expression (simple cases)
    } catch (error) {
      setResult('Error');
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="calculator-popup">
      <div className="calculator">
        <div className="display">
          <input type="text" value={input} readOnly />
          <h3>{result}</h3>
        </div>
        <div className="buttons">
          <button className="number" onClick={() => handleClick('1')}>1</button>
          <button className="number" onClick={() => handleClick('2')}>2</button>
          <button className="number" onClick={() => handleClick('3')}>3</button>
          <button className="symbol" onClick={() => handleClick('+')}>+</button>
          <button className="number" onClick={() => handleClick('4')}>4</button>
          <button className="number" onClick={() => handleClick('5')}>5</button>
          <button className="number" onClick={() => handleClick('6')}>6</button>
          <button className="symbol" onClick={() => handleClick('-')}>-</button>
          <button className="number" onClick={() => handleClick('7')}>7</button>
          <button className="number" onClick={() => handleClick('8')}>8</button>
          <button className="number" onClick={() => handleClick('9')}>9</button>
          <button className="symbol" onClick={() => handleClick('*')}>*</button>
          <button className="number" onClick={() => handleClick('0')}>0</button>
          <button className="number" onClick={() => handleClick('.')}>.</button>
          <button className="equal" onClick={() => handleEqual()}>=</button>
          <button className="symbol" onClick={() => handleClick('/')}>/</button>
          <button className="symbol" onClick={handleClear}>C</button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
