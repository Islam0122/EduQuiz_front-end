import "./Modal.scss";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetGroupByIdQuery, useGetGroupsQuery } from "../../../redux/groupApi";
import {useGetQuestionsQuery} from "../../../redux/questionsApi";

const Modal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { data: groups } = useGetGroupsQuery();
    const { data: topics } =   useGetQuestionsQuery();

    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedMode, setSelectedMode] = useState("random");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Загружаем студентов при выборе группы
    const { data: selectedGroupData } = useGetGroupByIdQuery(selectedGroup, { skip: !selectedGroup });
    const studentsInGroup = selectedGroupData?.students || [];

    // Загружаем вопросы при выборе темы
    const selectedTopicData = topics?.find(topic => topic.id === parseInt(selectedTopic));
    const questions = selectedTopicData?.questions || [];

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!selectedGroup || !selectedTopic || (selectedMode === "choose" && !selectedStudent)) {
            setErrorMessage("Пожалуйста, заполните все поля.");
            return;
        }

        // Выбираем случайный вопрос
        if (questions.length === 0) {
            setErrorMessage("В этой теме нет вопросов.");
            return;
        }
        // Переход на страницу викторины
        const quizUrl = `/quiz/${selectedGroup}/${selectedTopic}/${selectedMode}/${selectedMode === "choose" ? selectedStudent : ""}`;
        navigate(quizUrl);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <FaTimes size={20} color="#fff" />
                </button>
                <h2>Начать тестирование?</h2>

                {/* Выбор группы */}
                <div>
                    <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        <option value="">Выберите группу</option>
                        {groups?.map(group => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                    </select>
                </div>

                {/* Выбор темы */}
                <div>
                    <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                        <option value="">Выберите тему</option>
                        {topics?.map(topic => (
                            <option key={topic.id} value={topic.id}>{topic.name}</option>
                        ))}
                    </select>
                </div>

                {/* Выбор режима */}
                <div>
                    <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)}>
                        <option value="random">Рандомный студент</option>
                        <option value="choose">Выбрать студента</option>
                    </select>
                </div>
                {/* Выбор студента (появляется только если выбрана группа и режим "Выбрать студента") */}
                {selectedGroup && selectedMode === "choose" && (
                    <div>
                        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                            <option value="">Выберите студента</option>
                            {studentsInGroup.map(student => (
                                <option key={student.id} value={student.id}>{student.full_name}</option>
                            ))}
                        </select>
                    </div>
                )}


                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="modal-actions">
                    <button className="add-button" onClick={handleSubmit}>Начать тестирование</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
