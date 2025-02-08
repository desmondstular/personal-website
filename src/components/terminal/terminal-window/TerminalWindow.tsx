/**
 * TerminalWindow.tsx
 *
 * This component represents the terminal-window.
 *
 * Author: Desmond Stular
 * Date: February 2, 2025
 */
import React, {useEffect, useRef, useState} from "react";
import "./terminal-window.css"

const TerminalWindow = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<Array<string>>([])
  const userIdentifier: string = "des@ml-linux:/$ ";

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      if (e.key === "Enter") {
        const inputValue = inputRef.current.value.split(userIdentifier)[1];

        console.log(inputValue)

        if (inputValue === "clear") {
          setHistory([]);
        } else {
          setHistory([...history, inputValue]);
        }
        inputRef.current.value = userIdentifier;
        inputRef.current.scrollIntoView({behavior: "smooth"})
        e.preventDefault()
      }

      else if (e.ctrlKey && e.key === "c") {
        const inputValue = inputRef.current.value;
        console.log(inputValue);
        inputRef.current.value = '';
        setHistory([...history, "^C"]);
        inputRef.current.scrollIntoView({behavior: "smooth"});
        e.preventDefault();
      }

      else if (e.key === "Backspace") {
        if (inputRef.current.value === userIdentifier) {
          e.preventDefault();
        }
      }
    }
  };

  // On first render, it populates the text field with the user identifier
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = userIdentifier;
    }
  });

  // Keep the text field in focus the entire time
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);

    return () => clearInterval(intervalId);

  }, []);

  return (
    <div className="terminal">
      {history.map(history => (
        <p className="terminal-history-line">{userIdentifier} {history}</p>
      ))}
      <div className="terminal-input">
        <input
          className="terminal-input-field"
          spellCheck="false"
          ref={inputRef}
          onKeyDown={onKeyDown}>
        </input>
      </div>
    </div>
  )
}

export default TerminalWindow;