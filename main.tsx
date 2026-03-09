import { useState, useCallback, useEffect } from 'react';
import { Button } from './components/Button';
import { Display } from './components/Display';

function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [operator, setOperator] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setWaitingForOperand(false);
    setOperator(null);
    setPreviousValue(null);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const inputPercent = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setExpression(`${inputValue} ${nextOperator}`);
    } else if (operator) {
      const currentValue = previousValue;
      let result: number;

      switch (operator) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          result = inputValue;
      }

      setDisplay(String(result));
      setPreviousValue(result);
      setExpression(`${result} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  }, [display, operator, previousValue]);

  const calculate = useCallback(() => {
    if (operator === null || previousValue === null) {
      return;
    }

    const inputValue = parseFloat(display);
    let result: number;

    switch (operator) {
      case '+':
        result = previousValue + inputValue;
        break;
      case '-':
        result = previousValue - inputValue;
        break;
      case '×':
        result = previousValue * inputValue;
        break;
      case '÷':
        result = inputValue !== 0 ? previousValue / inputValue : 0;
        break;
      default:
        result = inputValue;
    }

    setExpression(`${previousValue} ${operator} ${inputValue} =`);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [display, operator, previousValue]);

  const handleButtonClick = useCallback((value: string) => {
    switch (value) {
      case 'C':
        clearAll();
        break;
      case 'CE':
        clearEntry();
        break;
      case '±':
        toggleSign();
        break;
      case '%':
        inputPercent();
        break;
      case '.':
        inputDecimal();
        break;
      case '=':
        calculate();
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        performOperation(value);
        break;
      default:
        inputDigit(value);
    }
  }, [clearAll, clearEntry, toggleSign, inputPercent, inputDecimal, calculate, performOperation, inputDigit]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      if (key >= '0' && key <= '9') {
        handleButtonClick(key);
      } else if (key === '.') {
        handleButtonClick('.');
      } else if (key === '+') {
        handleButtonClick('+');
      } else if (key === '-') {
        handleButtonClick('-');
      } else if (key === '*') {
        handleButtonClick('×');
      } else if (key === '/') {
        e.preventDefault();
        handleButtonClick('÷');
      } else if (key === 'Enter' || key === '=') {
        handleButtonClick('=');
      } else if (key === 'Escape') {
        handleButtonClick('C');
      } else if (key === 'Backspace') {
        handleButtonClick('CE');
      } else if (key === '%') {
        handleButtonClick('%');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButtonClick]);

  const buttons = [
    { value: 'C', variant: 'function' as const },
    { value: 'CE', variant: 'function' as const },
    { value: '%', variant: 'function' as const },
    { value: '÷', variant: 'operator' as const },
    { value: '7', variant: 'number' as const },
    { value: '8', variant: 'number' as const },
    { value: '9', variant: 'number' as const },
    { value: '×', variant: 'operator' as const },
    { value: '4', variant: 'number' as const },
    { value: '5', variant: 'number' as const },
    { value: '6', variant: 'number' as const },
    { value: '-', variant: 'operator' as const },
    { value: '1', variant: 'number' as const },
    { value: '2', variant: 'number' as const },
    { value: '3', variant: 'number' as const },
    { value: '+', variant: 'operator' as const },
    { value: '±', variant: 'function' as const },
    { value: '0', variant: 'number' as const },
    { value: '.', variant: 'number' as const },
    { value: '=', variant: 'equals' as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Calculator Container */}
        <div className="bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-gray-400 text-sm font-medium">Calculadora</span>
            <div className="w-16"></div>
          </div>

          {/* Display */}
          <Display value={display} expression={expression} />

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((btn) => (
              <Button
                key={btn.value}
                value={btn.value}
                variant={btn.variant}
                onClick={handleButtonClick}
                className="h-16"
              />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 text-center text-gray-500 text-xs">
            Usa el teclado para ingresar valores
          </div>
        </div>

        {/* Electron Ready Badge */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm border border-blue-500/30">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Lista para Electron
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
