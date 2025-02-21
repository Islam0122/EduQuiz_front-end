import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetQuestionByIdQuery } from "../../redux/questionsApi";
import { useGetGroupByIdQuery } from "../../redux/groupApi";
import { useGetStudentByIdQuery } from "../../redux/studentApi";
import NoImg from "../Questions/questions-icons/no-img.svg";
import { MdOutlineQuiz } from "react-icons/md";
import { FaUsers, FaRandom, FaUserGraduate, FaEdit, FaListUl } from "react-icons/fa";
import "./Quiz.scss";

const Quiz = () => {
  const { groupId, questionId, mode, studentId } = useParams();
  const navigate = useNavigate();

  const { data: questionData, isLoading: isQuestionLoading } = useGetQuestionByIdQuery(questionId);
  const { data: group, isLoading: isGroupLoading } = useGetGroupByIdQuery(groupId);
  const { data: student, isLoading: isStudentLoading } = useGetStudentByIdQuery(studentId, { skip: !studentId });

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
  };

  const nextQuestion = () => {
    setIsAnswerChecked(false);
    setSelectedAnswer(null);
    // Здесь можно обновить логическую часть для перехода к следующему вопросу
  };

  const finishQuiz = () => {
    setShowResults(true);
  };

  const displayResults = () => {
    // Логика для отображения результатов викторины
    return (
        <div className="results">
          <h3>Результаты викторины:</h3>
          <p>Правильных ответов: {randomQuestion.correct_answer === selectedAnswer ? 1 : 0}</p>
        </div>
    );
  };

  return (
      <section className="quiz">
        <div className="container">
          <div className="quiz__header">
            <h2>
              <MdOutlineQuiz style={{ color: "#ff9800", marginRight: "8px" }} />
              Тема вопроса: <span className="question-name">{questionData?.name || "Загрузка..."}</span>
            </h2>

            <h4>
              <FaEdit style={{ marginRight: '8px', color: '#FFD700' }} />
              Сложность: {questionData?.difficulty_label || "Не указана"}
            </h4>

            <h4>
              <FaListUl style={{ marginRight: '8px', color: '#3498db' }} />
              Описание: {questionData?.description || "Нет описания"}
            </h4>

            <h4>
              <FaUsers style={{ color: "#2196f3", marginRight: "8px" }} />
              Группа: {isGroupLoading ? "Загрузка..." : group?.name || "Неизвестная группа"}
            </h4>

            {mode === "random" ? (
                <h4>
                  <FaRandom style={{ color: "#4caf50", marginRight: "8px" }} />
                  Режим: Рандомный студент - {randomStudent ? randomStudent.full_name : "Выбор..."}
                </h4>
            ) : (
                <h4>
                  <FaUserGraduate style={{ color: "#f44336", marginRight: "8px" }} />
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
                    <img src={randomQuestion.image || NoImg} alt="Изображение вопроса" className="question_image" />
                    <div className="options">
                      <p><strong>Варианты:</strong></p>
                      <div className="option">
                        <input
                            type="radio"
                            id="optionA"
                            name="answer"
                            value="A"
                            onChange={handleAnswer}
                            className="option-radio"
                            disabled={isAnswerChecked}
                        />
                        <span className="option-text">A: {randomQuestion.option_a}</span>
                      </div>

                      <div className="option">
                        <input
                            type="radio"
                            id="optionB"
                            name="answer"
                            value="B"
                            onChange={handleAnswer}
                            className="option-radio"
                            disabled={isAnswerChecked}
                        />
                        <span className="option-text">B: {randomQuestion.option_b}</span>
                      </div>

                      <div className="option">
                        <input
                            type="radio"
                            id="optionC"
                            name="answer"
                            value="C"
                            onChange={handleAnswer}
                            className="option-radio"
                            disabled={isAnswerChecked}
                        />
                        <span className="option-text">C: {randomQuestion.option_c}</span>
                      </div>

                      <div className="option">
                        <input
                            type="radio"
                            id="optionD"
                            name="answer"
                            value="D"
                            onChange={handleAnswer}
                            className="option-radio"
                            disabled={isAnswerChecked}
                        />
                        <span className="option-text">D: {randomQuestion.option_d}</span>
                      </div>
                    </div>

                    {isAnswerChecked && (
                        <div className="answer-feedback">
                          <p>
                            <strong>Правильный ответ:</strong> {randomQuestion.correct_answer}
                          </p>
                          <p>
                            <strong>Ваш ответ:</strong> {selectedAnswer}
                          </p>
                        </div>
                    )}

                    <div className="buttons">
                      <button onClick={checkAnswer} disabled={isAnswerChecked}>Проверить ответ</button>
                      <button onClick={nextQuestion}>Следующий вопрос</button>
                      <button onClick={finishQuiz}>Закончить викторину</button>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="status-message loading">
                  <p>Нет доступных вопросов</p>
                </div>
            )}
          </div>

          {showResults && displayResults()}
        </div>
      </section>
  );
};

export default Quiz;
