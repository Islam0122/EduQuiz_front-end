import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetQuestionByIdQuery, } from "../../redux/questionsApi";
import "./Questions_detail.scss";
import { FaQuestionCircle, FaEdit, FaListUl, FaTrash, FaTimes } from "react-icons/fa";
import NoImg from "./questions-icons/no-img.svg";
import {useDeleteQuestionMutation} from "../../redux/questionsDetailApi";
import './Questions.scss';

const ConfirmDeleteModal = ({ closeModal, deleteQuestion, questionText }) => (
    <div className="modal-overlay">
        <div className="modal">
            <button className="close-button" onClick={closeModal}>
                <FaTimes size={20} color="#fff" />
            </button>
            <h2>Удалить вопрос?</h2>
            <p style={{ color: "white" }}>
                Вы уверены, что хотите удалить вопрос: <b>{questionText}</b>?
            </p>
            <div className="modal-buttons">
                <button className="delete-button" onClick={deleteQuestion}>Удалить</button>
                <button className="cancel-button" onClick={closeModal}>Отмена</button>
            </div>
        </div>
    </div>
);

const QuestionItem = ({ question, onDelete, onEdit }) => {
    return (
        <div className="question_card">
            <p><strong>Вопрос:</strong> <span>{question.text || "Без текста"}</span></p>
            <div className="question_content">
                <img
                    src={question.image ? question.image : NoImg}
                    alt="Изображение вопроса"
                    className="question_image"
                />
                <div className="options">
                    <p><strong>Варианты:</strong></p>
                    <p>A: {question.option_a || "—"}</p>
                    <p>B: {question.option_b || "—"}</p>
                    <p>C: {question.option_c || "—"}</p>
                    <p>D: {question.option_d || "—"}</p>
                </div>

            </div>
            <div className="icons">
                <FaTrash className="delete-icon" onClick={() => onDelete(question.id, question.text)} />
                <FaEdit className="edit-icon" onClick={() => onEdit(question)} />
            </div>
            <p><strong>Правильный ответ:</strong>
                <span>
                    {question.correct_answer && question[`option_${question.correct_answer.toLowerCase()}`]
                        ? `${question.correct_answer} - ${question[`option_${question.correct_answer.toLowerCase()}`]}`
                        : "Нет данных"}
                </span>
            </p>
        </div>
    );
};

const QuestionsDetail = () => {
    const { id } = useParams();
    const { data: question, error, isLoading, refetch } = useGetQuestionByIdQuery(id);
    const [deleteQuestion] = useDeleteQuestionMutation();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleDelete = async () => {
        if (selectedQuestion) {
            await deleteQuestion(selectedQuestion.id);
            setModalOpen(false);
            refetch();  // 🔥 Перезагружаем данные
        }
    };

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка при загрузке данных</p>;

    return (
        <section className="questions_detail">
            <div className="container">
                <div className="question_detail-info">
                    <h2>
                        Тема вопроса:{" "}
                        <span className="question-name">
                            {question?.name?.[0]?.toUpperCase() + question?.name?.slice(1) ?? "Без названия"}
                        </span>
                    </h2>
                    <h4>
                        <FaEdit style={{ marginRight: "8px", color: "#FFD700" }} />
                        Сложность: {question.difficulty_label}
                    </h4>
                    <h4>
                        <FaListUl style={{ marginRight: "8px", color: "#3498db" }} />
                        Описание: {question.description || "Нет описания"}
                    </h4>
                    <h4>
                        <FaListUl style={{ marginRight: "8px", color: "#3498db" }} />
                        Всего вопросов: {question.questions?.length ?? 0}
                    </h4>
                </div>
                <div className="questions_detail-list">
                    <div className="title">
                        <h5>Вопросы</h5>
                        <h5>+ Добавить вопрос</h5>
                    </div>
                    <div className="list">
                        {question.questions && question.questions.length > 0 ? (
                            question.questions.map((q, index) => (
                                <QuestionItem
                                    key={q.id || index}
                                    question={q}
                                    onDelete={(id, text) => {
                                        setSelectedQuestion({ id, text });
                                        setModalOpen(true);
                                    }}
                                    onEdit={(q) => console.log("Редактирование:", q)}
                                />
                            ))
                        ) : (
                            <p className="no-questions">Нет доступных вопросов</p>
                        )}
                    </div>
                </div>
            </div>

            {modalOpen && (
                <ConfirmDeleteModal
                    closeModal={() => setModalOpen(false)}
                    deleteQuestion={handleDelete}
                    questionText={selectedQuestion?.text}
                />
            )}
        </section>
    );
};

export default QuestionsDetail;
