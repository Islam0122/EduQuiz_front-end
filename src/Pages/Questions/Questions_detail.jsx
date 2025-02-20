import React from "react";
import { useParams } from "react-router-dom";
import {useGetQuestionByIdQuery} from "../../redux/questionsApi";
import "./Questions_detail.scss"
import { FaQuestionCircle, FaEdit, FaListUl } from 'react-icons/fa'; // Импорт нужных иконок
import NoImg from './questions-icons/no-img.svg';

const QuestionsDetail = () => {
    const { id } = useParams();
    const { data: question, error, isLoading } = useGetQuestionByIdQuery(id);

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка при загрузке данных</p>;

    return (
        <section className="questions_detail">
            <div className="container">
                <div className="question_detail-info">
                    <h2>
                        Тема вопроса: <span className="question-name">{question.name[0].toUpperCase() + question.name.slice(1)}</span>
                    </h2>
                    <h4>
                        <FaEdit style={{ marginRight: '8px', color: '#FFD700' }} />
                        Сложность: {question.difficulty_label}
                    </h4>
                    <h4>
                        <FaListUl style={{ marginRight: '8px', color: '#3498db' }} />
                        Описание: {question.description || "Нет описания"}
                    </h4>
                    <h4>
                        <FaListUl style={{ marginRight: '8px', color: '#3498db' }} />
                        Всего вопросов: {question.questions_count}
                    </h4>
                </div>
                <div className="questions_detail-list">
                    <div className="title">
                        <h5>Вопросы</h5>
                        <h5>+ Добавить вопрос</h5>
                    </div>
                    <div className="list">
                        {question.questions.length > 0 ? (
                            question.questions.map((q) => (
                                <div key={q.id} className="question_card">
                                    <p><strong>Вопрос:</strong> <span>{q.text}</span> </p>
                                    <div className="question_content">
                                        <img src={q.image ? q.image : NoImg} alt="Изображение вопроса" className="question_image"/>
                                        <div className="options">
                                            <p><strong>Варианты:</strong></p>
                                            <p>A: {q.option_a}</p>
                                            <p>B: {q.option_b}</p>
                                            <p>C: {q.option_c}</p>
                                            <p>D: {q.option_d}</p>
                                        </div>
                                    </div>
                                    <p><strong>Правильный ответ:</strong><span>
                                                            {q.correct_answer} - {q[`option_${q.correct_answer.toLowerCase()}`]}
                                    </span></p>
                                </div>
                                ))
                            ) : (
                                <p>Нет доступных вопросов</p>
                            )}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default QuestionsDetail;
