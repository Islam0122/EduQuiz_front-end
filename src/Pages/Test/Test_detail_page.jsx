import React, { useEffect, useState, useRef } from "react";
import { useGetQuestionByIdQuery } from "../../redux/questionsApi";
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateResultMutation, useSendOtpMutation, useVerifyOtpMutation } from "../../redux/test_results";
import "../Questions/Questions_detail.scss";
import NoImg from "../Questions/questions-icons/no-img.svg";
import "./Test_detail_page.scss";
import { FaArrowLeft, FaCheckCircle, FaEnvelope, FaExclamationCircle, FaRegSmileBeam, FaUser } from "react-icons/fa";

const botToken = "7928285404:AAFPDogQ1zHS6H7b9dGUmZir0bKHM91U5Ok";
const chatId = "-1002274955554";
const TOTAL_QUESTIONS = 10;

const getRandomQuestions = (questions, count = TOTAL_QUESTIONS) => {
    if (!questions || questions.length <= count) return questions;
    return [...questions].sort(() => Math.random() - 0.5).slice(0, count);
};

const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => savedCallback.current();
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

const QuestionItem = ({ randomQuestion, handleAnswerChange, userAnswers, isTestFinished }) => {
    const isAnswerCorrect = (answer) => answer === randomQuestion.correct_answer;
    const userAnswer = userAnswers[randomQuestion.id];
    const isSkipped = isTestFinished && !userAnswer;

    const getAnswerClass = (answer) => {
        if (!isTestFinished) return "";
        const isSelected = userAnswer === answer;
        return isSelected ? (isAnswerCorrect(answer) ? "correct-answer" : "incorrect-answer") : "";
    };

    return (
        <div className="question_card">
            <p><strong>Вопрос:</strong> <span>{randomQuestion.text}</span></p>
            <div className="question_content">
                <img src={randomQuestion.image || NoImg} alt="Изображение вопроса" className="image" />
                <div className="options">
                    <p><strong>Варианты ответов:</strong></p>
                    {"ABCD".split("").map((option) => {
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
                                    className={`option-radio ${isTestFinished && isSelected ? (isAnswerCorrect(option) ? "correct" : "incorrect") : ""}`}
                                    checked={isSelected}
                                    onChange={() => !isTestFinished && handleAnswerChange(randomQuestion.id, option)}
                                    disabled={isTestFinished}
                                />
                                <span className="option-text">
                                    {option}: {optionText}
                                </span>
                            </div>
                        );
                    })}
                    {isTestFinished && isSkipped && (
                        <div className="answer-feedback skipped">
                            <FaExclamationCircle className="icon" /> Вы пропустили этот вопрос!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const OtpVerification = ({ email, isOtpVerified, setIsOtpVerified, timeLeft, setTimeLeft }) => {
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [lastOtpSentTime, setLastOtpSentTime] = useState(null);

    const [sendOtp] = useSendOtpMutation();
    const [verifyOtp] = useVerifyOtpMutation();

    const handleSendOtp = async () => {
        try {
            await sendOtp(email).unwrap();
            setIsOtpSent(true);
            setOtpError("");
            setLastOtpSentTime(Date.now());
            setTimeLeft(60);
        } catch (error) {
            setOtpError("Ошибка при отправке OTP. Пожалуйста, попробуйте снова.");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setOtpError("Пожалуйста, введите OTP.");
            return;
        }

        try {
            await verifyOtp({ email, code: otp }).unwrap();
            setIsOtpVerified(true);
            setOtpError("");
        } catch (error) {
            setOtpError("Неверный OTP. Пожалуйста, проверьте и попробуйте снова.");
        }
    };

    return (
        <div >
            <h2>Введите OTP:</h2>
            <div>
                <input
                    type="text"
                    placeholder="Введите 6-значный код"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    style={{ width: "600px"}}
                />
                <button
                    onClick={handleVerifyOtp}
                    className="verify-otp-button"
                    style={{ width: "250px"}}
                >
                    Подтвердить OTP
                </button>
                <button
                    onClick={handleSendOtp}
                    className="resend-otp-button"
                    disabled={timeLeft > 0}
                    style={{ width: "250px"}}
                >
                    Отправить повторно {timeLeft > 0 && `(${timeLeft} сек)`}
                </button>
            </div>
        {otpError && <p className="error-message">{otpError}</p>}
        </div>
    );
};

const TestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: question, error, isLoading, refetch } = useGetQuestionByIdQuery(id);
    const [email, setEmail] = useState(localStorage.getItem('email') || "");
    const [name, setName] = useState(localStorage.getItem('name') || "");
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState(JSON.parse(localStorage.getItem('userAnswers')) || {});
    const [testFinished, setTestFinished] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [isOtpVerified, setIsOtpVerified] = useState(localStorage.getItem('isOtpVerified') === 'true' || false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const [createResult] = useCreateResultMutation();

    useInterval(() => {
        if (timeLeft > 0) {
            setTimeLeft(timeLeft - 1);
        }
    }, 1000);

    useEffect(() => {
        if (question?.questions) {
            setRandomQuestions(getRandomQuestions(question.questions, TOTAL_QUESTIONS));
        }
    }, [question]);

    useEffect(() => {
        localStorage.setItem('email', email);
        localStorage.setItem('name', name);
    }, [email, name]);

    useEffect(() => {
        localStorage.setItem('isOtpVerified', isOtpVerified.toString());
    }, [isOtpVerified]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    const validateName = (name) => /^[a-zA-Zа-яА-Я\s]{2,}$/.test(String(name));

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
    };

    const sendTestResultToTelegram = async (name, email, correctAnswersCount, totalQuestions) => {
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

🔔 Пожалуйста, обратите внимание на новый результат теста!

🚀 Поздравляем с завершением теста!
`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: chatId, text: message }),
            });
            const result = await response.json();
            if (result.ok) console.log("Результат успешно отправлен!");
            else console.log("Ошибка при отправке результата.");
        } catch (error) {
            console.log("Произошла ошибка при отправке: " + error.message);
        }
    };

    const handleFinishTest = async () => {
        if (!validateName(name)) {
            setNameError("Пожалуйста, введите корректное имя (минимум 2 символа, только буквы и пробелы).");
            return;
        }
        setNameError("");

        if (!validateEmail(email)) {
            setEmailError("Пожалуйста, введите корректный email.");
            return;
        }
        setEmailError("");

        if (!isOtpVerified) {
            setShowOtpInput(true);
            return;
        }

        const correctCount = randomQuestions.reduce((acc, q) => acc + (userAnswers[q.id] === q.correct_answer ? 1 : 0), 0);
        setCorrectAnswersCount(correctCount);
        setTestFinished(true);

        localStorage.setItem("testFinished", true);
        localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
        localStorage.setItem("correctAnswersCount", correctCount);

        sendTestResultToTelegram(name, email, correctCount, randomQuestions.length);

        setIsSaving(true);
        setSaveError(null);

        try {
            const result = await createResult({
                topic: id,
                name: name,
                email: email,
                score: correctCount,
                total_questions: randomQuestions.length,
                correct_answers: correctCount,
                wrong_answers: randomQuestions.length - correctCount,
                percentage: ((correctCount / randomQuestions.length) * 100).toFixed(2),
            }).unwrap();
            console.log("Результат успешно сохранен:", result);
        } catch (error) {
            console.error("Ошибка при сохранении результата:", error);
            setSaveError("Ошибка при сохранении результата. Пожалуйста, попробуйте снова.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRestartTest = () => {
        setUserAnswers({});
        setTestFinished(false);
        setCorrectAnswersCount(0);
        setEmailError("");
        setNameError("");
        localStorage.removeItem('userAnswers');
    };

    const handleClearEverything = () => {
        setUserAnswers({});
        setTestFinished(false);
        setCorrectAnswersCount(0);
        setEmail("");
        setName("");
        setEmailError("");
        setNameError("");
        localStorage.removeItem('userAnswers');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('testFinished');
        localStorage.removeItem('correctAnswersCount');
        localStorage.removeItem('isOtpVerified');
    };

    const handleNewTest = () => {
        if (question?.questions) {
            setRandomQuestions(getRandomQuestions(question.questions, TOTAL_QUESTIONS));
        }
        setUserAnswers({});
        setTestFinished(false);
        setCorrectAnswersCount(0);
        setEmailError("");
        setNameError("");
        localStorage.removeItem('userAnswers');
        localStorage.removeItem('testFinished');
        localStorage.removeItem('correctAnswersCount');
    };

    const handleGoBack = () => navigate('/test');

    const isTestComplete = () => name && email && randomQuestions.every((q) => userAnswers[q.id]);

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
                            {nameError && <p className="error-message">{nameError}</p>}
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
                            {emailError && <p className="error-message">{emailError}</p>}
                        </div>
                        {showOtpInput && !isOtpVerified && (
                            <OtpVerification
                                email={email}
                                isOtpVerified={isOtpVerified}
                                setIsOtpVerified={setIsOtpVerified}
                                timeLeft={timeLeft}
                                setTimeLeft={setTimeLeft}
                            />
                        )}
                    </div>

                    <div className="test-button">
                        <button
                            onClick={handleFinishTest}
                            className="finish-button"
                            disabled={!isTestComplete()}
                        >
                            Завершить тест
                        </button>

                        {testFinished && (
                            <div className="skipped-questions">
                                {randomQuestions.some(q => !userAnswers[q.id]) && (
                                    <>
                                        <h3>❗ Вы пропустили следующие вопросы:</h3>
                                        <ul>
                                            {randomQuestions
                                                .filter(q => !userAnswers[q.id])
                                                .map((q) => (
                                                    <li key={q.id}>{q.text}</li>
                                                ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}

                        <button onClick={handleClearEverything} className="clear-everything">Начать заново</button>
                        <button onClick={handleNewTest} className="new-test">Новый тест</button>
                        <button onClick={handleGoBack} className="back">Вернуться к списку</button>
                    </div>

                    {testFinished && (
                        <div className="test-result">
                            <h3>Результаты теста:</h3>

                            <p>
                                <FaCheckCircle style={{ color: 'green' }} /> Правильных
                                ответов: {correctAnswersCount} из {randomQuestions.length}
                            </p>

                            <p>
                                <FaCheckCircle style={{ color: 'green' }} /> Процент правильных
                                ответов: {(correctAnswersCount / randomQuestions.length) * 100}%
                            </p>
                            <p className="motivation-message">
                                {correctAnswersCount / randomQuestions.length >= 0.8
                                    ? <span><FaCheckCircle /> Отлично! Ты настоящий эксперт! <FaCheckCircle /></span>
                                    : correctAnswersCount / randomQuestions.length >= 0.5
                                        ? <span><FaRegSmileBeam /> Хорошо! Есть к чему стремиться. <FaRegSmileBeam /></span>
                                        : <span><FaExclamationCircle /> Не расстраивайся! Ты можешь лучше, продолжай учиться! <FaExclamationCircle /></span>}
                            </p>
                            <button
                                onClick={handleRestartTest}
                                className="restart"
                                disabled={!testFinished}
                            >
                                Перезапустить
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
};

export default TestDetailPage;