import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    useGetTypingTextQuery,
    useGetTypingByIdQuery,
    useGetTypingTimersQuery,
    useGetTypingCategoriesQuery
} from '../../redux/TypingApi';
import "./Typing.scss";
import { FiClock, FiTag, FiZap, FiCheckCircle, FiPlay, FiPause, FiRefreshCcw } from 'react-icons/fi';
import Select from 'react-select';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { createGlobalStyle } from "styled-components";

const GlobalCodeStyles = createGlobalStyle`
    .syntax-highlighter {
        background-color: #1e1e1e;
        border-radius: 28px;
        padding: 20px;
        position: relative;
    }

    .current-char {
        background-color: #4CAF50;
        color: white;
        border-radius: 3px;
        padding: 0 2px;
    }

    .correct {
        color: #4CAF50;
    }

    .error {
        color: #FF5252;
        text-decoration: underline;
    }

    .keyboard {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .keyboard-row {
        display: flex;
        justify-content: center;
        margin-bottom: 5px;
    }

    .key {
        padding: 10px;
        margin: 2px;
        border: 1px solid #4CAF50;
        border-radius: 5px;
        cursor: pointer;
        user-select: none;
    }

    .key.highlight {
        background-color: #4CAF50;
        color: white;
    }

    .buttons {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-bottom: 20px;
    }

    .buttons button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .buttons button:hover {
        background-color: #45a049;
    }

    .buttons button:active {
        background-color: #388E3C;
    }

    .buttons h3 {
        margin: 0;
        padding: 10px 20px;
        background-color: #34495e;
        color: white;
        border-radius: 5px;
    }
`;

const Typing = () => {
    const { data: timers } = useGetTypingTimersQuery();
    const { data: categories } = useGetTypingCategoriesQuery();

    const [selectedCategory, setSelectedCategory] = useState(categories?.[0]?.id || 1);
    const { data: texts, isLoading, error } = useGetTypingTextQuery(selectedCategory, {
        skip: !selectedCategory,
    });

    const [selectedTextId, setSelectedTextId] = useState(null);
    const { data: selectedText } = useGetTypingByIdQuery(selectedTextId, {
        skip: !selectedTextId,
    });

    const [selectedTimer, setSelectedTimer] = useState(timers?.[0]?.seconds || 30);
    const [timeLeft, setTimeLeft] = useState(selectedTimer);
    const [currentText, setCurrentText] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [isKeyHandled, setIsKeyHandled] = useState(false);
    const [mode, setMode] = useState('practice'); // 'practice' или 'test'

    const inputRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (texts?.length > 0) {
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            setSelectedTextId(randomText.id);
            setCurrentText(randomText.text_content);
            setCursorPosition(0);
            setErrors(0);
            setStartTime(Date.now());
            setTimeLeft(selectedTimer);
            setIsTyping(false);
        } else {
            setSelectedTextId(null);
            setCurrentText('');
        }
    }, [texts, selectedTimer]);

    useEffect(() => {
        if (isTyping && timeLeft > 0 && mode === 'test') {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (timeLeft === 0 && mode === 'test') {
            setIsTyping(false);
        }
    }, [isTyping, timeLeft, mode]);

    const handleKeyDown = useCallback((e) => {
        if (isKeyHandled) return;

        // Отключаем стандартное поведение пробела (скролл вниз)
        if (e.key === ' ') {
            e.preventDefault();
        }

        // Игнорируем специальные клавиши
        if (e.key.length > 1 || e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }

        if (!isTyping) setIsTyping(true);
        if (cursorPosition >= currentText.length) return;

        const expectedChar = currentText[cursorPosition];
        const pressedChar = e.key;

        setIsKeyHandled(true);

        if (pressedChar === expectedChar) {
            setCurrentText((prev) => prev.slice(0, cursorPosition) + prev.slice(cursorPosition + 1));
            setCursorPosition((prev) => prev + 1);
        } else {
            setErrors((prev) => prev + 1);
        }

        const timeElapsed = (Date.now() - startTime) / 60000;
        const wordsTyped = (cursorPosition + 1) / 5;
        setWpm(Math.floor(wordsTyped / timeElapsed));

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => setIsKeyHandled(false), 50);
    }, [currentText, cursorPosition, startTime, isTyping, isKeyHandled]);

    useEffect(() => {
        const handleKeyPress = (e) => handleKeyDown(e);
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyDown]);

    const formatTime = useCallback((seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, []);

    const handleTimerChange = useCallback((selectedOption) => {
        setSelectedTimer(selectedOption.value);
        setTimeLeft(selectedOption.value);
    }, []);

    const handleCategoryChange = useCallback((selectedOption) => {
        setSelectedCategory(selectedOption.value);
    }, []);

    const restartSession = () => {
        if (texts?.length > 0) {
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            setCurrentText(randomText.text_content);
        }
        setCursorPosition(0);
        setErrors(0);
        setStartTime(Date.now());
        setTimeLeft(selectedTimer);
        setIsTyping(false);
    };

    const toggleMode = () => {
        setMode((prev) => (prev === 'practice' ? 'test' : 'practice'));
        restartSession();
    };

    const timerOptions = useMemo(() => timers?.map((timer) => ({
        value: timer.seconds,
        label: `${timer.seconds} секунд`,
    })) || [], [timers]);

    const categoryOptions = useMemo(() => categories?.map((category) => ({
        value: category.id,
        label: category.name,
    })) || [], [categories]);

    const customStyles = useMemo(() => ({
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '2px solid #4CAF50',
            borderRadius: '0',
            boxShadow: 'none',
            fontSize: '16px',
            color: 'white',
            minWidth: '200px',
            cursor: 'pointer',
            transition: 'border-color 0.3s ease',
            '&:hover': {
                borderBottomColor: '#81C784',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4CAF50' : '#0d1117',
            color: 'white',
            fontSize: '16px',
            padding: '10px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            '&:hover': {
                backgroundColor: '#388E3C',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#0d1117',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        }),
        menuList: (provided) => ({
            ...provided,
            padding: '0',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9E9E9E',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#4CAF50',
            transition: 'color 0.3s ease',
            '&:hover': {
                color: '#81C784',
            },
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
    }), []);

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error.message}</p>;

    return (
        <div className="Typing">
            <GlobalCodeStyles />
            <div className="container">
                <div className="typing-header">
                    <div className="settings-time">
                        <label className="timer-label">
                            <FiClock className="clock-icon" aria-label="Выбери время" /> Выбери время:
                        </label>
                        <Select
                            options={timerOptions}
                            styles={customStyles}
                            value={timerOptions.find((option) => option.value === selectedTimer)}
                            onChange={handleTimerChange}
                            placeholder="Выберите время"
                        />
                    </div>

                    <div className="settings-category-text">
                        <label className="category-label">
                            <FiTag aria-label="Категория" /> Категория:
                        </label>
                        <Select
                            options={categoryOptions}
                            styles={customStyles}
                            value={categoryOptions.find((option) => option.value === selectedCategory)}
                            onChange={handleCategoryChange}
                            placeholder="Выберите категорию"
                        />
                    </div>
                    <div className="stats">
                        <p><FiZap aria-label="Скорость" /> Скорость: <span>{wpm} зн/мин</span></p>
                    </div>
                    <div className="stats">
                        <p><FiCheckCircle
                            aria-label="Точность" /> Точность: <span>{((cursorPosition - errors) / cursorPosition * 100 || 0).toFixed(0)}%</span>
                        </p>
                    </div>
                </div>

                <div className="Time">
                    <h3>{formatTime(timeLeft)}</h3>
                </div>

                <div className="text">
                    {currentText ? (
                        <>
                            <h3>TEXT - {selectedText?.category?.name}</h3>
                            <div style={{ position: 'relative' }}>
                                <SyntaxHighlighter
                                language={(selectedText?.category?.name || "javascript").toLowerCase()}
                                style={dracula}
                                className="syntax-highlighter"
                                showLineNumbers={true}
                                lineNumberStyle={{ color: '#6e7681', marginRight: '20px' }}
                            >
                                {currentText.slice(cursorPosition)}
                            </SyntaxHighlighter>
                            </div>
                        </>
                    ) : (
                        <p>Нет текстов для этой категории</p>
                    )}
                </div>

                <div className="keyboard">
                    <div className="buttons">
                        <div>
                            <button onClick={restartSession}><FiRefreshCcw /> Перезапустить</button>
                            <button onClick={toggleMode}>
                                {mode === 'practice' ? <FiPlay /> : <FiPause />}
                                {mode === 'practice' ? 'Тест' : 'Практика'}
                            </button>
                            <h3>Ошибки: {errors}</h3>
                        </div>
                    </div>
                    <Keyboard nextChar={currentText[cursorPosition]}/>
                </div>
            </div>
        </div>
    );
};

const Keyboard = ({ nextChar }) => {
    const keys = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '←'],
        ['TAB', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['CAPS', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'ENTER'],
        ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',<', '.>', '/?', 'SHIFT'],
        ['SPACE']
    ];

    return (
        <div className="keyboard">
            {keys.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map((key) => (
                        <div
                            key={key}
                            className={`key ${key === nextChar ? 'highlight' : ''} ${key === 'SPACE' ? 'space-key' : ''}`}
                        >
                            {key === 'SPACE' ? ' ' : key}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Typing;