import React from "react";
import { useSelector } from "react-redux";
import { useGetQuestionsQuery } from "./redux/api";

const App = () => {
  const selectedLanguage = useSelector((state) => state.quiz.selectedLanguage);
  const { data: questions, error, isLoading } = useGetQuestionsQuery(selectedLanguage);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;

  return (
    <ul>
      {questions.map((q) => (
        <li key={q.id}>{q.text}</li>
      ))}
    </ul>
  );
};

export default App;