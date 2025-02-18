import './Modal.scss';
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import {useGetGroupByIdQuery, useGetGroupsQuery} from "../../../redux/groupApi";
import {useGetQuestionsQuery} from "../../../redux/questionsApi";


const Modal = ({ isOpen, onClose }) => {
    const { data: groups, error: groupError, isLoading: groupLoading } = useGetGroupsQuery();
    const { data: questions, error: questionError, isLoading: questionLoading } = useGetQuestionsQuery();

    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [selectedMode, setSelectedMode] = useState("random"); // 'random' или 'choose'
    const [selectedStudent, setSelectedStudent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Получаем студентов только если выбрана группа
    const { data: selectedGroupData, error: groupByIdError, isLoading: groupByIdLoading } = useGetGroupByIdQuery(selectedGroup, { skip: !selectedGroup });

    const studentsInGroup = selectedGroupData?.students || [];

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!selectedGroup || !selectedQuestion || (selectedMode === "choose" && !selectedStudent)) {
            setErrorMessage("Пожалуйста, заполните все поля.");
            return;
        }

        console.log("Selected Group:", selectedGroup);
        console.log("Selected Question:", selectedQuestion);
        console.log("Selected Mode:", selectedMode);
        if (selectedMode === "choose") console.log("Selected Student:", selectedStudent);

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <FaTimes size={20} color="#fff" />
                </button>
                <h2>Готовы начать тестирование?</h2>

                {groupLoading ? (
                    <p>Загрузка групп...</p>
                ) : groupError ? (
                    <p>Ошибка загрузки групп: {groupError.message}</p>
                ) : (
                    <div>
                        <p>Выберите группу:</p>
                        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                            <option value="">Выберите группу</option>
                            {groups?.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {questionLoading ? (
                    <p>Загрузка вопросов...</p>
                ) : questionError ? (
                    <p>Ошибка загрузки вопросов: {questionError.message}</p>
                ) : (
                    <div>
                        <p>Выберите вопрос:</p>
                        <select value={selectedQuestion} onChange={(e) => setSelectedQuestion(e.target.value)}>
                            <option value="">Выберите вопрос</option>
                            {questions?.map(question => (
                                <option key={question.id} value={question.id}>{question.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <p>Выберите режим:</p>
                    <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)}>
                        <option value="random">Рандомный студент</option>
                        <option value="choose">Выбрать студента</option>
                    </select>
                </div>

                {selectedMode === "choose" && selectedGroup && (
                    groupByIdLoading ? (
                        <p>Загрузка студентов...</p>
                    ) : groupByIdError ? (
                        <p>Ошибка загрузки студентов: {groupByIdError.message}</p>
                    ) : (
                        <div>
                            <p>Выберите студента:</p>
                            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                                <option value="">Выберите студента</option>
                                {studentsInGroup.map(student => (
                                    <option key={student.id} value={student.id}>{student.full_name}</option>
                                ))}
                            </select>
                        </div>
                    )
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
