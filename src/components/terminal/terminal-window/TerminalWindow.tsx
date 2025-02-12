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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<Array<string>>([])
  const [historyDisplay, setHistoryDisplay] = useState<Array<string>>([])
  const [historyIndex, setHistoryIndex] = useState<number>(1);
  const userIdentifier: string = "des@ml-linux:/$ ";

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
            setHistoryDisplay([]);
          }
          // if blank enter, show on display history but don't store in history
          else if (inputValue === "") {
            setHistoryDisplay([...historyDisplay, inputValue]);
          }
          else {
            setHistoryIndex(history.length + 1);
            setHistory([...history, inputValue]);
            setHistoryDisplay([...historyDisplay, inputValue]);
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
          else if (e.ctrlKey) {
            inputRef.current.value = '';
            setHistoryDisplay([...historyDisplay, `${inputValue}^C`]);
            inputRef.current.scrollIntoView({behavior: "smooth"});
            e.preventDefault();
          }
        }

        // if pushing up arrow to cycle up history order
        else if (e.key === 'ArrowDown') {
          if (historyIndex < history.length) {
            setHistoryIndex(historyIndex + 1); // Move to more recent history
          }
          e.preventDefault();
        }

        // if pushing down arrow to cycle down history order
        else if (e.key === 'ArrowUp') {
          if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);  // most to less recent history
          }
          e.preventDefault();
        }

        // Ensure user cannot delete user identifier
        else if (cursorPos <= userIdentifier.length) {
          if (e.key === "Backspace" || e.key === "Delete") {
            if (selectEnd <= userIdentifier.length) {
              e.preventDefault();
            }
          }

          // Reset cursor to start of input field
          inputRef.current.selectionStart = userIdentifier.length;
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

  // Re-renders input field with history when cycling up/down arrows
  useEffect(() => {
    if (inputRef.current) {
      if (historyIndex >= history.length) {
        inputRef.current.value = userIdentifier;
      }
      else {
          inputRef.current.value = `${userIdentifier}${history[historyIndex]}`;
      }
    }
  }, [historyIndex]);

  return (
    <div className="terminal">
      {historyDisplay.map(history => (
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