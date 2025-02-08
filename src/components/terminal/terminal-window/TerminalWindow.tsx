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
  const userIdentifier: string = "des@ml-linux"

  const [history, setHistory] = useState<Array<string>>([])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputRef.current) {
        const inputValue = inputRef.current.value;
        console.log(inputValue);

        if (inputValue === "clear") {
          setHistory([]);
        }
        else {
          setHistory([...history, inputValue]);
        }
        inputRef.current.value = '';
      }
    }

    else if (e.ctrlKey && e.key === "c") {
      if (inputRef.current) {
        const inputValue = inputRef.current.value;
        console.log(inputValue);
        inputRef.current.value = '';
        setHistory([...history, "^C"]);
        inputRef.current.scrollIntoView({behavior: "smooth"});
        e.preventDefault()
      }
    }
  };

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
        <p className="terminal-history-line">{userIdentifier}:/$ {history}</p>
      ))}
      <span className="terminal-input">
        <text className="terminal-input-name">{userIdentifier}:/$ </text>
        <input className="terminal-input-text" ref={inputRef} onKeyDown={onKeyDown}></input>
      </span>
    </div>
  )
}

export default TerminalWindow;