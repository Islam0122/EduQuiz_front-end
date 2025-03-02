import React from 'react';
import "../Questions/Questions.scss"
import logo from '../Questions/questions-icons/number1.svg';
import {
    useGetQuestionsQuery
} from "../../redux/questionsApi";
import { useNavigate } from "react-router-dom";

const TestItem = ({ id, name }) => {
  const navigate = useNavigate();
  return (
      <div onClick={() => navigate(`/test/${id}`)} className="group-item">
        <img src={logo} alt="Логотип группы" />
        <h1>{name[0].toUpperCase() + name.slice(1)}</h1>
      </div>
  );
};

const TestListPage = () => {
  const { data: questions, error, isLoading, refetch } = useGetQuestionsQuery();

  return (
      <section className="Groups">
        <div className="container">
          <h2 className="group-page-title">Тесты</h2>
          <div className="groups">
            {isLoading ? (
                <div className="status-message loading">
                  <p>⏳ Загрузка тестов...</p>
                </div>
            ) : error ? (
                <div className="status-message error">
                  <p>❌ Ошибка загрузки тестов. Попробуйте еще раз.</p>
                  <button onClick={refetch} className="retry-button">Попробовать снова</button>
                </div>
            ) : questions?.length ? (
                questions.map((question) => (
                    <TestItem
                        key={question.id}
                        name={question.name}
                        id={question.id}
                    />
                ))
            ) : (
                <div className="group-item add-group">
                  <img src={logo} alt="Логотип " />
                  <h1>Тесты отсутствуют</h1>
                </div>
            )}
          </div>
        </div>
      </section>
  );
};

export default TestListPage;
