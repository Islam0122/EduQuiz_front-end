import React, { useState, useRef, useEffect } from "react";
import { useGetTypingTextQuery } from "../../redux/typingApi";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./Typing.scss";

const Typing = () => {
  const { data, isLoading, error } = useGetTypingTextQuery();
  const typingText = data && data.length > 0 ? data[Math.floor(Math.random() * data.length)]?.text_content : ""; // Random text  

  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [completed, setCompleted] = useState(false);
  const keyboard = useRef(null);

  useEffect(() => {
    if (typingText) {
      // Reset the typing state when typingText changes
      setInput("");
      setCurrentIndex(0);
      setMistakes(0);
      setStartTime(null);
      setCompleted(false);
      keyboard.current?.clearInput();
    }
  }, [typingText]);

  const getAccuracy = () => {
    if (currentIndex + mistakes === 0) return "100.00"; // Prevent divide by zero
    return ((currentIndex / (currentIndex + mistakes)) * 100).toFixed(2);
  };

  const getSpeed = () => {
    if (!startTime || currentIndex === 0) return "0.00"; // Avoid calculating speed if no time elapsed or no progress
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    return ((currentIndex / 5) / elapsedMinutes).toFixed(2);
  };

  const handleKeyPress = (key) => {
    if (!startTime) setStartTime(Date.now()); // Start timer on first key press
    if (completed) return; // Prevent further input once typing is completed

    if (key === "{bksp}") {
      // Handle backspace key press
      if (currentIndex > 0) {
        setInput((prev) => prev.slice(0, -1));
        setCurrentIndex((prev) => prev - 1);
      }
      return;
    }

    if (currentIndex >= typingText.length) {
      setCompleted(true); // Mark as completed when text is fully typed
      return;
    }

    if (key === typingText[currentIndex]) {
      // Correct key press
      setInput((prev) => prev + key);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Incorrect key press
      setMistakes((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handlePhysicalKeyboard = (event) => {
      // Handle physical keyboard key presses
      if (event.key.length === 1 || event.key === "Backspace") {
        handleKeyPress(event.key === "Backspace" ? "{bksp}" : event.key);
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyboard);
    return () => window.removeEventListener("keydown", handlePhysicalKeyboard);
  }, [currentIndex, typingText, completed]);

  let content;
  if (isLoading) {
    content = <p>Загрузка...</p>;
  } else if (error) {
    content = <p>Ошибка при загрузке текста</p>;
  } else {
    content = (
      <div className="typing-content">
        <div className="typing-text" style={{ color: "white" }}>
          {typingText.split("").map((char, index) => {
            let className = "";
            if (index < currentIndex) {
              // Check if character was typed correctly or incorrectly
              className = char === input[index] ? "correct" : "incorrect";
            } else if (index === currentIndex) {
              className = "current"; // Highlight current character
            }
            return (
              <span key={index} className={className}>
                {char}
              </span>
            );
          })}
        </div>
        <div className="stats">
          <p>Скорость: {getSpeed()} WPM | Точность: {getAccuracy()}%</p>
          <p>Ошибки: {mistakes}</p>
        </div>
        <Keyboard
          keyboardRef={(r) => (keyboard.current = r)}
          theme="hg-theme-default myTheme1"
          layoutName="default"
          onKeyPress={handleKeyPress}
          display={{ "{shift}": "Shift", "{lock}": "CapsLock", "{enter}": "Enter", "{bksp}": "⌫" }}
        />
      </div>
    );
  }

  return <section className="typing-container">{content}</section>;
};

export default Typing;