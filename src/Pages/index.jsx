import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../store/slices/quizSlice";

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state) => state.quiz.selectedLanguage);

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
  };

  return (
    <div>
      <h2>Выбранный язык: {selectedLanguage}</h2>
      <button onClick={() => handleLanguageChange("javascript")}>JavaScript</button>
      <button onClick={() => handleLanguageChange("python")}>Python</button>
      <button onClick={() => handleLanguageChange("c++")}>C++</button>
    </div>
  );
};

export default LanguageSelector;