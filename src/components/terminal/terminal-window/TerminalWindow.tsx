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
      const cursorPos: number | null = inputRef.current.selectionStart;
      const selectEnd: number | null = inputRef.current.selectionEnd;
      const inputValue: string = inputRef.current.value.length === userIdentifier.length ? '' : inputRef.current.value.split(userIdentifier)[1];

      // If cursor position is not null
      if (cursorPos !== null && selectEnd !== null) {

        // If user hits enter key to input command
        if (e.key === "Enter") {

          // Clear history command
          if (inputValue === "clear") {
            setHistory([]);
          } else {
            setHistory([...history, inputValue]);
          }

          inputRef.current.value = userIdentifier;
          inputRef.current.scrollIntoView({behavior: "smooth"})
          e.preventDefault()
        }

        // if user enters ctrl key and c to end input line
        else if (e.ctrlKey && e.key === "c") {
          // If trying to copy text, copy and reset caret to selection end
          if (cursorPos !== selectEnd) {
            setTimeout(() => {
              if (inputRef.current !== null) {
                inputRef.current.selectionStart = inputRef.current.selectionEnd;
              }
            }, 0);
          }

          // If trying to send ctrl+c stop command
          else {
            inputRef.current.value = '';
            setHistory([...history, `${inputValue}^C`]);
            inputRef.current.scrollIntoView({behavior: "smooth"});
            e.preventDefault();
          }
        }

        // Ensure user cannot delete user identifier
        else if (e.key === "Backspace" || e.key === "Delete") {
          if (cursorPos <= userIdentifier.length) {
            if (selectEnd <= userIdentifier.length) {
              e.preventDefault();
            }

            // Reset cursor to start of input field
            inputRef.current.selectionStart = userIdentifier.length;
          }
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
        <textarea
          className="terminal-input-field"
          spellCheck="false"
          ref={inputRef}
          onKeyDown={onKeyDown}>

        </textarea>
      </div>
    </div>
  )
}

export default TerminalWindow;