import React, {useState, useEffect, useMemo} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {useGetQuestionByIdQuery} from "../../redux/questionsApi";
import {useGetGroupByIdQuery} from "../../redux/groupApi";
import {useGetStudentByIdQuery} from "../../redux/studentApi";
import NoImg from "../Questions/questions-icons/no-img.svg";
import {MdOutlineQuiz} from "react-icons/md";
import {FaUsers, FaRandom, FaUserGraduate, FaEdit, FaListUl, FaCheckCircle, FaArrowLeft} from "react-icons/fa";
import "./Quiz.scss";

const Quiz = () => {
    const {groupId, questionId, mode, studentId} = useParams();
    const {data: questionData, isLoading: isQuestionLoading} = useGetQuestionByIdQuery(questionId);
    const {data: group, isLoading: isGroupLoading} = useGetGroupByIdQuery(groupId);
    const {data: student, isLoading: isStudentLoading} = useGetStudentByIdQuery(studentId, {skip: !studentId});
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);  // Статус проверки ответа
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);   // Статус правильности ответа (true, false или null)
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false); // Состояние для отображения правильного ответа

    // Выбор случайного студента
    const randomStudent = useMemo(() => {
        if (mode === "random" && group?.students?.length > 0) {
            const randomIndex = Math.floor(Math.random() * group.students.length);
            return group.students[randomIndex];
        }
        return null;
    }, [mode, group]);

    // Выбор случайного вопроса
    const randomQuestion = useMemo(() => {
        if (questionData?.questions?.length > 0) {
            const randomIndex = Math.floor(Math.random() * questionData.questions.length);
            return questionData.questions[randomIndex];
        }
        return null;
    }, [questionData]);

    const handleAnswer = (event) => {
        const answer = event.target.value;
        setSelectedAnswer(answer);
    };

    const checkAnswer = () => {
        setIsAnswerChecked(true);
        if (selectedAnswer === randomQuestion.correct_answer) {
            setIsCorrectAnswer(true);
        } else {
            setIsCorrectAnswer(false);
        }
    };

    const revealCorrectAnswer = () => {
        setIsAnswerRevealed(true);
    };

    return (
        <section className="quiz">
            <div className="container">
                <div className="quiz__header">
                    <h2>
                        <MdOutlineQuiz style={{color: "#ff9800", marginRight: "8px"}}/>
                        Тема вопроса: <span className="question-name">{questionData?.name || "Загрузка..."}</span>
                    </h2>

                    <h4>
                        <FaEdit style={{marginRight: '8px', color: '#FFD700'}}/>
                        Сложность: {questionData?.difficulty_label || "Не указана"}
                    </h4>

                    <h4>
                        <FaListUl style={{marginRight: '8px', color: '#3498db'}}/>
                        Описание: {questionData?.description || "Нет описания"}
                    </h4>

                    <h4>
                        <FaUsers style={{color: "#2196f3", marginRight: "8px"}}/>
                        Группа: {isGroupLoading ? "Загрузка..." : group?.name || "Неизвестная группа"}
                    </h4>

                    {mode === "random" ? (
                        <h4>
                            <FaRandom style={{color: "#4caf50", marginRight: "8px"}}/>
                            Режим: Рандомный студент - {randomStudent ? randomStudent.full_name : "Выбор..."}
                        </h4>
                    ) : (
                        <h4>
                            <FaUserGraduate style={{color: "#f44336", marginRight: "8px"}}/>
                            Студент: {isStudentLoading ? "Загрузка..." : student?.full_name || "Неизвестный студент"}
                        </h4>
                    )}
                </div>
                <div className="quiz__content">
                    {isQuestionLoading ? (
                        <div className="status-message loading">
                            <p>⏳ Загрузка вопросов...</p>
                        </div>
                    ) : randomQuestion ? (
                        <div className="question_card">
                            <p><strong>Вопрос:</strong> <span>{randomQuestion.text}</span></p>
                            <div className="question_content">
                                <img src={randomQuestion.image || NoImg} alt="Изображение вопроса"
                                     className="question_image"/>
                                <div className="options">
                                    <p><strong>Варианты:</strong></p>
                                    {["A", "B", "C", "D"].map((option) => (
                                        <div className="option" key={option}>
                                            <input
                                                type="radio"
                                                id={`option${option}`}
                                                name="answer"
                                                value={option}
                                                onChange={handleAnswer}
                                                className={`option-radio ${isAnswerChecked ? (option === randomQuestion.correct_answer ? "correct" : (option === selectedAnswer ? "incorrect" : "")) : ""}`}
                                                disabled={isAnswerChecked}
                                            />
                                            <span className="option-text">
                                                {option}: {randomQuestion[`option_${option.toLowerCase()}`]}
                                            </span>
                                            {isAnswerChecked && selectedAnswer === option && (
                                                <div
                                                    className={`answer-feedback ${option === randomQuestion.correct_answer ? "correct" : "incorrect"}`}>
                                                    {option === randomQuestion.correct_answer ? "Правильно!" : "Неправильно!"}
                                                </div>
                                            )}
                                            {/* Показ правильного ответа, если кнопка нажата */}
                                            {isAnswerRevealed && option === randomQuestion.correct_answer && (
                                                <div className="answer-feedback  aa correct">
                                                    <FaArrowLeft className="icon" style={{ color: 'green', marginRight: '4px' }} />
                                                    <span className="text">Правильный ответ</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="buttons">
                                        {!isAnswerChecked ? (
                                        <button
                                            className="check-answer-button"
                                            onClick={checkAnswer}
                                            disabled={!selectedAnswer}  // Делаем кнопку активной только если выбран ответ
                                        >
                                            Проверить ответ
                                        </button>
                                    ) : isAnswerChecked && !isCorrectAnswer && !isAnswerRevealed ? (
                                        <button className="reveal-answer-button" onClick={revealCorrectAnswer}>
                                            Посмотреть правильный ответ
                                        </button>
                                    ) : null}



                                        <button
                                            className="next-question-button"
                                            onClick={() => window.location.reload()}
                                        >
                                            Следующий вопрос
                                        </button>
                                        <Link to="/">
                                            <button>
                                                Вернуться на главную
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="status-message loading">
                            <p>Нет доступных вопросов</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Quiz;
