import React, { useEffect, useState, useCallback } from "react";
import { evaluate, round } from "mathjs";

const numberButtons = [
  { id: "zero", label: "0" },
  { id: "one", label: "1" },
  { id: "two", label: "2" },
  { id: "three", label: "3" },
  { id: "four", label: "4" },
  { id: "five", label: "5" },
  { id: "six", label: "6" },
  { id: "seven", label: "7" },
  { id: "eight", label: "8" },
  { id: "nine", label: "9" },
];

const operators = [
  { id: "add", label: "+" },
  { id: "subtract", label: "-" },
  { id: "multiply", label: "*" },
  { id: "divide", label: "/" },
];

const isOperator = (char) => /[+\-*/]/.test(char);

const App = () => {
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");
  const [evaluated, setEvaluated] = useState(false);

  const getLastNumber = (expr) => {
    const parts = expr.split(/[\+\-\*\/]/);
    return parts[parts.length - 1];
  };

  const handleNumberClick = (value) => {
    if (evaluated) {
      setExpression(value);
      setDisplay(value);
      setEvaluated(false);
      return;
    }

    if (display === "0" && value === "0") return;

    if (isOperator(display)) {
      setDisplay(value);
      setExpression((prev) => prev + value);
    } else {
      if (display === "0") {
        setDisplay(value);
        setExpression((prev) => prev.slice(0, -1) + value);
      } else {
        setDisplay((prev) => prev + value);
        setExpression((prev) => prev + value);
      }
    }
  };

  const handleOperatorClick = (operator) => {
    if (evaluated) {
      setExpression(display + operator);
      setDisplay(operator);
      setEvaluated(false);
      return;
    }

    const lastChar = expression.slice(-1);

    if (isOperator(lastChar)) {
      if (operator === "-" && lastChar !== "-") {
        setExpression((prev) => prev + operator);
      } else {
        setExpression((prev) => prev.replace(/[+\-*/]+$/, operator));
      }
    } else {
      setExpression((prev) => prev + operator);
    }
    setDisplay(operator);
  };

  const handleDecimal = () => {
    if (evaluated) {
      setDisplay("0.");
      setExpression("0.");
      setEvaluated(false);
      return;
    }

    const lastNumber = getLastNumber(expression);

    if (!lastNumber.includes(".")) {
      setDisplay((prev) => prev + ".");
      setExpression((prev) => prev + ".");
    }
  };

  const handleEqual = () => {
    try {
      let result = evaluate(expression);
      result = round(result, 6);

      setDisplay(result.toString());
      setExpression(result.toString());
      setEvaluated(true);
    } catch {
      setDisplay("Error");
      setExpression("");
      setEvaluated(false);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setEvaluated(false);
  };

  const handleKeyDown = useCallback((e) => {
    const key = e.key;

    const keyMap = {
      0: "zero",
      1: "one",
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
      9: "nine",
      "+": "add",
      "-": "subtract",
      "*": "multiply",
      "/": "divide",
      "=": "equals",
      Enter: "equals",
      ".": "decimal",
      Backspace: "clear",
      c: "clear",
      C: "clear",
    };

    const buttonId = keyMap[key];
    if (buttonId) {
      const button = document.getElementById(buttonId);
      if (button) {
        button.classList.add("active");
        button.click();
        setTimeout(() => {
          button.classList.remove("active");
        }, 150);
      }
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const renderNumberButtons = () =>
    numberButtons.map(({ id, label }) => (
      <button
        key={id}
        id={id}
        onClick={() => handleNumberClick(label)}
        className={`number${id === "zero" ? " zero" : ""}`}
      >
        {label}
      </button>
    ));

  const renderOperatorButtons = () =>
    operators.map(({ id, label }) => (
      <button
        key={id}
        id={id}
        onClick={() => handleOperatorClick(label)}
        className="operator"
      >
        {label === "*" ? "×" : label}
      </button>
    ));

  return (
    <div id="calculator">
      <div id="display">{display}</div>

      <div className="button-grid">
        <button id="clear" onClick={handleClear} className="operator">
          AC
        </button>
        {/* Operators on top */}
        {renderOperatorButtons().slice(3)} {/* divide */}
        {renderOperatorButtons().slice(2, 3)} {/* multiply */}
        {renderOperatorButtons().slice(1, 2)} {/* subtract */}
        {/* Numbers 7 8 9 and add */}
        {renderNumberButtons().slice(6, 9)}
        {renderOperatorButtons().slice(0, 1)}
        {/* Numbers 4 5 6 */}
        {renderNumberButtons().slice(3, 6)}
        <div className="empty-cell"></div>
        {/* Numbers 1 2 3 */}
        {renderNumberButtons().slice(0, 3)}
        <div className="empty-cell"></div>
        {/* 0, decimal, equals */}
        {renderNumberButtons().slice(9)}
        <button id="decimal" onClick={handleDecimal} className="number">
          .
        </button>
        <button id="equals" onClick={handleEqual}>
          =
        </button>
        <div className="empty-cell"></div>
      </div>
    </div>
  );
};

export default App;
