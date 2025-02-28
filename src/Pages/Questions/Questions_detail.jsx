import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useGetQuestionByIdQuery, } from "../../redux/questionsApi";
import "./Questions_detail.scss";
import { FaQuestionCircle, FaEdit, FaListUl, FaTrash, FaTimes } from "react-icons/fa";
import NoImg from "./questions-icons/no-img.svg";
import {
    useCreateQuestionMutation,
    useDeleteQuestionMutation,
    useUpdateQuestionMutation
} from "../../redux/questionsDetailApi";
import './Questions.scss';
import {useSelector} from "react-redux";

const AddModal = ({ topic_id, closeModal, createQuestion }) => {
    const [formData, setFormData] = useState({
        topic: topic_id,
        text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("topic", formData.topic);
        data.append("text", formData.text);
        data.append("option_a", formData.option_a);
        data.append("option_b", formData.option_b);
        data.append("option_c", formData.option_c);
        data.append("option_d", formData.option_d);
        data.append("correct_answer", formData.correct_answer);
        if (formData.image) {
            data.append("image", formData.image);
        }

        await createQuestion(data);
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={closeModal}>
                    <FaTimes size={20} color="#fff" />
                </button>
                <h2>Добавить новый вопрос</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="text" value={formData.text} onChange={handleChange} placeholder="Введите текст вопроса" required />
                    <input type="text" name="option_a" value={formData.option_a} onChange={handleChange} placeholder="Ответ A" required />
                    <input type="text" name="option_b" value={formData.option_b} onChange={handleChange} placeholder="Ответ B" required />
                    <input type="text" name="option_c" value={formData.option_c} onChange={handleChange} placeholder="Ответ C" required />
                    <input type="text" name="option_d" value={formData.option_d} onChange={handleChange} placeholder="Ответ D" required />
                    <select name="correct_answer" value={formData.correct_answer} onChange={handleChange}>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>

                    {/* Поле для загрузки изображения */}
                    <input className="fileinput" type="file" accept="image/*" onChange={handleFileChange} />

                    <button type="submit" className="add-button">Добавить вопрос</button>
                </form>
            </div>
        </div>
    );
};


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

const EditModal = ({ closeModal, updateQuestion, question }) => {
    const [formData, setFormData] = useState({
        id: question?.id || "",
        text: question?.text || "",
        option_a: question?.option_a || "",
        option_b: question?.option_b || "",
        option_c: question?.option_c || "",
        option_d: question?.option_d || "",
        correct_answer: question?.correct_answer || "A",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("option_")) {
            setFormData({ ...formData, [name]: value.replace(/^[A-D]:\s*/, "") });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.id) {
            console.error("Ошибка: отсутствует ID вопроса!");
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        await updateQuestion({ id: formData.id, data });
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={closeModal}>
                    <FaTimes size={20} color="#fff" />
                </button>
                <h2>Редактирование вопроса</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="text" value={formData.text} onChange={handleChange} required />
                    <input type="text" name="option_a" value={formData.option_a} onChange={handleChange} required />
                    <input type="text" name="option_b" value={formData.option_b} onChange={handleChange} required />
                    <input type="text" name="option_c" value={formData.option_c} onChange={handleChange} required />
                    <input type="text" name="option_d" value={formData.option_d} onChange={handleChange} required />
                    <select name="correct_answer" value={formData.correct_answer} onChange={handleChange}>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                    <input className="fileinput" type="file" accept="image/*" onChange={handleFileChange} />
                    <button type="submit" className="add-button">Сохранить</button>
                </form>
            </div>
        </div>
    );
};

const QuestionItem = ({ question, onDelete, onEdit ,isAuthenticated }) => {
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
            {isAuthenticated && (
                <>
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
                </>
            )}

            </div>
    );
};

const QuestionsDetail = () => {
    const { id } = useParams();
    const { data: question, error, isLoading, refetch } = useGetQuestionByIdQuery(id);
    const [deleteQuestion] = useDeleteQuestionMutation();
    const [updateQuestion] = useUpdateQuestionMutation();
    const [createQuestion] = useCreateQuestionMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const isAuthenticated = useSelector((state) => !!state.auth?.token);



    const handleAddQuestion = (newQuestion) => {
        createQuestion(newQuestion)
            .then(() => {
                setAddModalOpen(false); // Закрываем модалку
                refetch(); // Перезагружаем данные после добавления вопроса
            })
            .catch((error) => {
                console.error("Ошибка при добавлении вопроса:", error);
            });
    };


    const handleDelete = async () => {
        if (selectedQuestion) {
            await deleteQuestion(selectedQuestion.id);
            setSelectedQuestion(null);
            setModalOpen(false);
            refetch();
        }
    };

    const handleEdit = (question) => {
        setSelectedQuestion(question);
        setEditModalOpen(true);
    };

    const handleUpdate = async (updatedQuestion) => {
        await updateQuestion(updatedQuestion);
        setEditModalOpen(false);
        refetch();
    };

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка при загрузке данных</p>;

    return (
        <section className="questions_detail">
            <div className="container">
                <div className="question_detail-info">
                    <h2>Тема вопроса: <span>{question?.name?.[0]?.toUpperCase() + question?.name?.slice(1) ?? "Без названия"}</span></h2>
                    <h4>Сложность: {question.difficulty_label}</h4>
                    <h4>Описание: {question.description || "Нет описания"}</h4>
                    <h4>Всего вопросов: {question.questions?.length ?? 0}</h4>
                </div>
                <div className="questions_detail-list">
                    <div className="title">
                        <h5>Вопросы</h5>
                        {isAuthenticated && (
                            <h5 onClick={() => setAddModalOpen(true)}>+ Добавить вопрос</h5>
                        )}
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
                                    onEdit={handleEdit}
                                    isAuthenticated={isAuthenticated}
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

            {editModalOpen && (
                <EditModal
                    closeModal={() => setEditModalOpen(false)}
                    updateQuestion={handleUpdate}
                    question={selectedQuestion}
                />
            )}
            {addModalOpen && (
                <AddModal
                    topic_id={id}
                    closeModal={() => setAddModalOpen(false)}
                    createQuestion={handleAddQuestion}
                />
            )}
        </section>
    );
};

export default QuestionsDetail;

