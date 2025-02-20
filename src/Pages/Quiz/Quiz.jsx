import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetQuestionByIdQuery } from "../../redux/questionsApi";
import { useGetGroupByIdQuery } from "../../redux/groupApi";
import { useGetStudentByIdQuery } from "../../redux/studentApi";
import NoImg from "../Questions/questions-icons/no-img.svg";
import { MdOutlineQuiz } from "react-icons/md";
import {FaUsers, FaRandom, FaUserGraduate, FaEdit, FaListUl} from "react-icons/fa";
import "./Quiz.scss"

const Quiz = () => {
  const { groupId, questionId, mode, studentId } = useParams();
  const navigate = useNavigate();

  const { data: questionData, isLoading: isQuestionLoading } = useGetQuestionByIdQuery(questionId);
  const { data: group, isLoading: isGroupLoading } = useGetGroupByIdQuery(groupId);
  const { data: student, isLoading: isStudentLoading } = useGetStudentByIdQuery(studentId, { skip: !studentId });

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
    const selectedAnswer = event.target.value;
    console.log("Выбран ответ:", selectedAnswer);
    // Можно здесь проверить правильность ответа и обработать выбор.
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
                      <div>
                        <p><strong>Варианты:</strong></p>

                        <div className="option">
                          <input
                              type="radio"
                              id="optionA"
                              name="answer"
                              value="A"
                              onChange={handleAnswer}
                              className="option-radio"
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
                          />
                          <span className="option-text">D: {randomQuestion.option_d}</span>


                        </div>
                      </div>
                      <div>
                        <button>number 1</button>
                        <button>number 2</button>
                        <button>number 3</button>
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
      // <div className="container">
      //   <h2>Викторина</h2>
      //   <p>Группа: {isGroupLoading ? "Загрузка..." : group?.name || "Неизвестная группа"}</p>
      //
      //   {mode === "random" ? (
      //       <p>Режим: Рандомный студент - {randomStudent ? randomStudent.full_name : "Выбор..."}</p>
      //   ) : (
      //       <p>Студент: {isStudentLoading ? "Загрузка..." : student?.full_name || "Неизвестный студент"}</p>
      //   )}
      //
      //   {isQuestionLoading ? (
      //       <p>Загрузка вопросов...</p>
      //   ) : randomQuestion ? (
      //       <div className="question_card">
      //         <p><strong>Вопрос:</strong> <span>{randomQuestion.text}</span></p>
      //         <div className="question_content">
      //           <img src={randomQuestion.image || NoImg} alt="Изображение вопроса" className="question_image" />
      //           <div className="options">
      //             <p><strong>Варианты:</strong></p>
      //             <p>A: {randomQuestion.option_a}</p>
      //             <p>B: {randomQuestion.option_b}</p>
      //             <p>C: {randomQuestion.option_c}</p>
      //             <p>D: {randomQuestion.option_d}</p>
      //           </div>
      //         </div>
      //         {randomQuestion.correct_answer ? (
      //             <p>
      //               <strong>Правильный ответ:</strong>
      //               <span> {randomQuestion.correct_answer} - {randomQuestion[`option_${randomQuestion.correct_answer.toLowerCase()}`] || "Неизвестно"}</span>
      //             </p>
      //         ) : (
      //             <p><strong>Правильный ответ:</strong> Не указан</p>
      //         )}
      //       </div>
      //   ) : (
      //       <p>Нет доступных вопросов</p>
      //   )}
      //
      //   <button className="exit-button" onClick={() => navigate("/")}>Вернуться</button>
      // </div>
  );
};

export default Quiz;
