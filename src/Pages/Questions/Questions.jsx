import React, {useEffect, useState} from 'react';
import './Questions.scss';
import { useGetQuestionsQuery, useCreateQuestionMutation, useDeleteQuestionMutation, useUpdateQuestionMutation } from '../../redux/questionsApi';
import { FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from './questions-icons/number1.svg';
import logo2 from './questions-icons/number2.svg';
import {useSelector} from "react-redux";


const Modal = ({ closeModal, createQuestion }) => {
  const [name, setName] = useState('');  // Для названия вопроса
  const [description, setDescription] = useState('');  // Для описания вопроса
  const [difficulty, setDifficulty] = useState('medium');  // Для сложности
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Все поля должны быть заполнены.');
      return;
    }

    try {
      await createQuestion({
        name,
        description,
        difficulty
      }).unwrap();
      closeModal();
    } catch (err) {
      console.error('Ошибка при создании вопроса:', err);
    }
  };

  return (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-button" onClick={closeModal}>
            <FaTimes size={20} color="#fff" />
          </button>
          <h2>Добавить новый вопрос</h2>
          <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Название вопроса"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <textarea
                placeholder="Введите описание вопроса"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Легкий</option>
              <option value="medium">Средний</option>
              <option value="hard">Сложный</option>
            </select>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="add-button">Добавить</button>
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
        <p  style={{color:"white"}}>Вы уверены, что хотите удалить вопрос: <b>{questionText}</b>?</p>
        <div className="modal-buttons">
          <button className="delete-button" onClick={deleteQuestion}>Удалить</button>
          <button className="cancel-button" onClick={closeModal}>Отмена</button>
        </div>
      </div>
    </div>
);


const EditModal = ({ closeModal, updateQuestion, question, refetch }) => {
  const [name, setName] = useState(question.name);
  const [description, setDescription] = useState(question.description);
  const [difficulty, setDifficulty] = useState(question.difficulty);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(question.name);
    setDescription(question.description);
    setDifficulty(question.difficulty);
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Все поля должны быть заполнены.");
      return;
    }

    try {
      await updateQuestion({
        id: question.id,
        name,
        description,
        difficulty
      }).unwrap();
      closeModal();
      refetch();
    } catch (err) {
      setError("Ошибка при изменении вопроса. Попробуйте снова.");
    }
  };

  return (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-button" onClick={closeModal}>
            <FaTimes size={20} color="#fff" />
          </button>
          <h2>Редактировать вопрос</h2>
          <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Название вопроса"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Введите описание вопроса"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Легкий</option>
              <option value="medium">Средний</option>
              <option value="hard">Сложный</option>
            </select>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="add-button">Сохранить</button>
          </form>
        </div>
      </div>
  );
};


const QuestionItem = ({ id, name, description, difficulty, onDelete, onEdit, isAuthenticated }) => {
  const navigate = useNavigate();

  return (
      <div onClick={() => navigate(`/questions/${id}`)} className="group-item">
        <img src={logo} alt="Логотип группы" />
        <h1>{name[0].toUpperCase() + name.slice(1)}</h1>

        {isAuthenticated && (
            <>
              <FaTrash
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id, name);
                  }}
              />
              <FaEdit
                  className="edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit({ id, name, description, difficulty });
                  }}
              />
            </>
        )}
      </div>
  );
};


const Questions = () => {
  const { data: questions, error, isLoading, refetch } = useGetQuestionsQuery();
  const [createQuestion] = useCreateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [updateQuestion] = useUpdateQuestionMutation();
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  const handleCreateQuestion = async (newQuestion) => {
    try {
      await createQuestion(newQuestion).unwrap();
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Ошибка при создании вопроса:', err);
    }
  };

  const handleDeleteClick = (id, text) => {
    setQuestionToDelete({ id, text });
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    try {
      await deleteQuestion(questionToDelete.id).unwrap();
      refetch();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Ошибка при удалении вопроса:', err);
    }
  };

  const handleEditClick = async (question) => {
    setQuestionToEdit(question);
    setIsEditModalOpen(true);
  };

  return (
      <section className="Groups">
        <div className="container">
          <h2 className="group-page-title">Вопросы</h2>
          <div className="groups">
            {isLoading ? (
                <div className="status-message loading">
                  <p>⏳ Загрузка вопросов...</p>
                </div>
            ) : error ? (
                <div className="status-message error">
                  <p>❌ Ошибка загрузки вопросов. Попробуйте еще раз.</p>
                </div>
            ) : questions?.length ? (
                questions.map((question) => (
                    <QuestionItem
                        key={question.id}
                        name={question.name}
                        description={question.description}
                        difficulty={question.difficulty}
                        id={question.id}
                        onDelete={handleDeleteClick}
                        onEdit={handleEditClick}
                        isAuthenticated={isAuthenticated}
                    />
                ))
            ) : (
                <div className="group-item add-group">
                  <img src={logo} alt="Логотип добавления" />
                  <h1>Вопросы отсутствуют</h1>
                </div>
            )}
            {isAuthenticated && (
                <div className="group-item add-group" onClick={() => setIsModalOpen(true)}>
                  <img src={logo2} alt="Логотип добавления" />
                  <h1>Добавить вопрос</h1>
                </div>
            )}
          </div>
        </div>

        {isModalOpen && <Modal closeModal={() => setIsModalOpen(false)} createQuestion={handleCreateQuestion} />}
        {isDeleteModalOpen && <ConfirmDeleteModal closeModal={() => setIsDeleteModalOpen(false)} deleteQuestion={confirmDeleteQuestion} questionText={questionToDelete?.text} />}
        {isEditModalOpen && <EditModal closeModal={() => setIsEditModalOpen(false)} updateQuestion={updateQuestion} question={questionToEdit} refetch={refetch} />}
      </section>
  );
};


export default Questions;
