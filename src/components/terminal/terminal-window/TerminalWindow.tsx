/**
 * TerminalWindow.tsx
 *
 * This component represents the terminal-window.
 *
 * Author: Desmond Stular
 * Date: February 2, 2025
 */
import React, {useEffect, useRef, useState} from "react";

const TerminalWindow = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState()

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputRef.current) {
        const inputValue = inputRef.current.value;
        console.log(inputValue);
        inputRef.current.value = '';
      }
    }

    else if (e.ctrlKey && e.key === "c") {
      if (inputRef.current) {
        const inputValue = inputRef.current.value;
        console.log(inputValue);
        inputRef.current.value = '^C';
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
    <div className="terminal-window">
      <input className="terminal-text" ref={inputRef} type="text" onKeyDown={onKeyDown}/>
    </div>
  )
}

export default TerminalWindow;