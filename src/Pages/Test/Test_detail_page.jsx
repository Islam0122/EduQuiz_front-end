import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import { useGetQuestionByIdQuery } from "../../redux/questionsApi";
import "../Questions/Questions_detail.scss";
import NoImg from "../Questions/questions-icons/no-img.svg";
import "../Questions/Questions.scss";
import "./Test_detail_page.scss"
import {FaArrowLeft, FaCheckCircle, FaEnvelope, FaExclamationCircle, FaRegSmileBeam, FaUser} from "react-icons/fa";
const botToken = "7928285404:AAFPDogQ1zHS6H7b9dGUmZir0bKHM91U5Ok";
const chatId = "-1002274955554";

const getRandomQuestions = (questions, count = 10) => {
    if (!questions || questions.length <= count) return questions;
    return [...questions].sort(() => Math.random() - 0.5).slice(0, count);
};

const QuestionItem = ({ randomQuestion, handleAnswerChange, userAnswers, isTestFinished }) => {
    const isAnswerCorrect = (answer) => answer === randomQuestion.correct_answer;
    const userAnswer = userAnswers[randomQuestion.id];

    const getAnswerClass = (answer) => {
        if (!isTestFinished) return "";
        const isSelected = userAnswer === answer;

        if (isSelected) {
            return isAnswerCorrect(answer) ? "correct-answer" : "incorrect-answer";
        }
        return "";
    };

    return (
        <div className="question_card">
            <p><strong>Вопрос:</strong> <span>{randomQuestion.text}</span></p>
            <div className="question_content">
                <img src={randomQuestion.image || NoImg} alt="Изображение вопроса" className="image"/>
                <div className="options">
                    <p><strong>Варианты:</strong></p>
                    {["A", "B", "C", "D"].map((option) => {
                        const optionText = randomQuestion[`option_${option.toLowerCase()}`];
                        const optionClass = getAnswerClass(option);
                        const isSelected = userAnswer === option;

                        return (
                            <div className={`option ${optionClass}`} key={option}>
                                <input
                                    type="radio"
                                    id={`option${option}`}
                                    name={`question-${randomQuestion.id}`}
                                    value={option}
                                    className={`option-radio ${isTestFinished && userAnswer === option ? (isAnswerCorrect(option) ? "correct" : "incorrect") : ""}`}                  checked={userAnswer === option}
                                    onChange={() => !isTestFinished && handleAnswerChange(randomQuestion.id, option)}
                                    disabled={isTestFinished}

                                />
                                <span className="option-text">
                  {option}: {optionText}
                </span>

                                {isTestFinished && isSelected && (
                                    <div
                                        className={`answer-feedback ${isAnswerCorrect(option) ? "correct" : "incorrect"}`}
                                    >
                                        {isAnswerCorrect(option) ? "Правильно!" : "Неправильно!"}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


const TestDetailPage = () => {
    const { id } = useParams();
    const { data: question, error, isLoading, refetch } = useGetQuestionByIdQuery(id);
    const [email, setEmail] = useState(localStorage.getItem('email') || "");
    const [name, setName] = useState(localStorage.getItem('name') || "");
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState(JSON.parse(localStorage.getItem('userAnswers')) || {});
    const [testFinished, setTestFinished] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    useEffect(() => {
        if (question?.questions) {
            const questions = getRandomQuestions(question.questions, 10);
            setRandomQuestions(questions);
        }
    }, [question]);

    useEffect(() => {
        localStorage.setItem('email', email);
        localStorage.setItem('name', name);
    }, [email, name]);

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const sendTestResultToTelegram = async (name, email, correctAnswersCount, totalQuestions, testName) => {
        const message = `
✨ Новый результат теста ✨

📧 Email: ${email}
👤 Имя: ${name}
📝 Тест: ${question?.name?.[0]?.toUpperCase() + question?.name?.slice(1)}
✅ Правильных ответов: ${correctAnswersCount} из ${totalQuestions}

🎯 Результат: ${((correctAnswersCount / totalQuestions) * 100).toFixed(2)}% 

💡 Подробности:
- Количество правильных ответов: ${correctAnswersCount}
- Всего вопросов: ${totalQuestions}

🔔Пожалуйста, обратите внимание на новый результат теста!

🚀 Поздравляем с завершением теста!
`;




    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const payload = {
            chat_id: chatId,
            text: message,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.ok) {
                console.log("Результат успешно отправлен!");
            } else {
                console.log("Ошибка при отправке результата.");
            }
        } catch (error) {
            console.log("Произошла ошибка при отправке: " + error.message);
        }
    };

    const handleFinishTest = () => {
        let correctCount = 0;
        randomQuestions.forEach((q) => {
            if (userAnswers[q.id] === q.correct_answer) {
                correctCount++;
            }
        });
        setCorrectAnswersCount(correctCount);
        setTestFinished(true);

        // Отправляем результат в Telegram
        sendTestResultToTelegram(name, email, correctCount, randomQuestions.length);
    };


    const isTestComplete = () => {
        return name && email && randomQuestions.every((q) => userAnswers[q.id]);
    };

    if (isLoading) return <p>⏳ Загрузка...</p>;

    if (error) {
        return (
            <div className="error-message">
                <p>❌ Ошибка при загрузке данных</p>
                <button onClick={refetch} className="retry-button">🔄 Попробовать снова</button>
            </div>
        );
    }

    return (
        <section className="questions_detail">
            <div className="container">
                <div className="question_detail-info">
                    <h2>Тест: <span>{question?.name?.[0]?.toUpperCase() + question?.name?.slice(1) || "Без названия"}</span></h2>
                    <h4>Сложность: {question?.difficulty_label || "Не указано"}</h4>
                    <h4>Описание: {question?.description || "Нет описания"}</h4>
                    <h4>Всего вопросов: {randomQuestions.length}</h4>
                </div>

                <div className="questions_detail-list">
                    <div className="list">
                        {randomQuestions.length > 0 ? (
                            randomQuestions.map((q) => (
                                <QuestionItem
                                    key={q.id}
                                    randomQuestion={q}
                                    handleAnswerChange={handleAnswerChange}
                                    userAnswers={userAnswers}
                                    isTestFinished={testFinished}
                                />
                            ))
                        ) : (
                            <p className="no-questions">Нет доступных вопросов</p>
                        )}
                    </div>

                    <div className="user-info">
                        <div>
                            <h2><FaUser /> Введите ваше имя:</h2>
                            <input
                                type="text"
                                placeholder="Введите ваше имя"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={testFinished}
                            />
                        </div>
                        <div>
                            <h2><FaEnvelope /> Введите ваш email:</h2>
                            <input
                                type="email"
                                placeholder="Введите ваш email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={testFinished}
                            />
                        </div>
                    </div>

                    {!testFinished && (
                        <button
                            onClick={handleFinishTest}
                            className="finish-button"
                            disabled={!isTestComplete()}
                        >
                            Завершить тест
                        </button>
                    )}

                    {testFinished && (
                        <div className="test-result">
                            <h3>Результаты теста:</h3>

                            <p>
                                <FaCheckCircle style={{color: 'green'}}/> Правильных
                                ответов: {correctAnswersCount} из {randomQuestions.length}
                            </p>

                            <p>
                                <FaCheckCircle style={{color: 'green'}}/> Процент правильных
                                ответов: {(correctAnswersCount / randomQuestions.length) * 100}%
                            </p>
                            <p className="motivation-message">
                                {correctAnswersCount / randomQuestions.length >= 0.8
                                    ? <span><FaCheckCircle/> Отлично! Ты настоящий эксперт! <FaCheckCircle/></span>
                                    : correctAnswersCount / randomQuestions.length >= 0.5
                                        ? <span><FaRegSmileBeam/> Хорошо! Есть к чему стремиться. <FaRegSmileBeam/></span>
                                        : <span><FaExclamationCircle/> Не расстраивайся! Ты можешь лучше, продолжай учиться! <FaExclamationCircle/></span>}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};


export default TestDetailPage;