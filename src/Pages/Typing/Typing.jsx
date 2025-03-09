import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    useGetTypingTextQuery,
    useGetTypingByIdQuery,
    useGetTypingTimersQuery,
    useGetTypingCategoriesQuery
} from '../../redux/TypingApi';
import "./Typing.scss";
import { FiClock, FiTag, FiZap, FiCheckCircle } from 'react-icons/fi';
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

    .syntax-highlighter .token.keyword {
        color: #9b59b6 !important;
    }

    .syntax-highlighter .token.string {
        color: #8e44ad !important;
    }

    .syntax-highlighter .token.variable {
        color: #f39c12 !important;
    }

    .syntax-highlighter .token.comment {
        color: #7f8c8d !important;
    }

    .syntax-highlighter .linenumber {
        color: #6e7681 !important; /* Цвет номеров строк */
        user-select: none; /* Запрет выделения номеров строк */
        padding-right: 20px !important; /* Отступ справа */
        text-align: right !important; /* Выравнивание по правому краю */
    }

    .current-char {
        background-color: #4CAF50; /* Подсветка текущего символа */
        color: white;
        border-radius: 3px;
        padding: 0 2px;
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
    const [currentText, setCurrentText] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);

    // Ref для отслеживания фокуса
    const inputRef = useRef(null);

    useEffect(() => {
        if (texts?.length > 0) {
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            setSelectedTextId(randomText.id);
            setCurrentText(randomText.text_content);
            setCursorPosition(0);
            setErrors(0);
            setStartTime(Date.now());
        } else {
            setSelectedTextId(null);
            setCurrentText('');
        }
    }, [texts]);

    const handleKeyDown = useCallback((e) => {
        if (cursorPosition >= currentText.length) return;

        const expectedChar = currentText[cursorPosition];
        const pressedChar = e.key;

        if (pressedChar === expectedChar) {
            setCursorPosition((prev) => prev + 1);
        } else {
            setErrors((prev) => prev + 1);
        }

        // Calculate WPM
        const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
        const wordsTyped = (cursorPosition + 1) / 5; // assuming 5 characters per word
        setWpm(Math.floor(wordsTyped / timeElapsed));
    }, [currentText, cursorPosition, startTime]);

    useEffect(() => {
        // Устанавливаем фокус на компонент при монтировании
        if (inputRef.current) {
            inputRef.current.focus();
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const formatTime = useCallback((seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, []);

    const handleTimerChange = useCallback((selectedOption) => {
        setSelectedTimer(selectedOption.value);
    }, []);

    const handleCategoryChange = useCallback((selectedOption) => {
        setSelectedCategory(selectedOption.value);
    }, []);

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
            borderBottom: '2px solid #4CAF50', // Подчеркивание
            borderRadius: '0', // Убираем скругления
            boxShadow: 'none',
            fontSize: '16px',
            color: 'white',
            minWidth: '200px',
            cursor: 'pointer',
            transition: 'border-color 0.3s ease', // Плавное изменение цвета подчеркивания
            '&:hover': {
                borderBottomColor: '#81C784', // Мягкий зеленый при наведении
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4CAF50' : '#0d1117', // Фон для выбранного и обычного элемента
            color: 'white',
            fontSize: '16px',
            padding: '10px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease', // Плавное изменение фона
            '&:hover': {
                backgroundColor: '#388E3C', // Мягкий зеленый при наведении
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
            color: '#9E9E9E', // Серый цвет для плейсхолдера
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#4CAF50', // Цвет стрелки
            transition: 'color 0.3s ease', // Плавное изменение цвета
            '&:hover': {
                color: '#81C784', // Мягкий зеленый при наведении
            },
        }),
        indicatorSeparator: () => ({
            display: 'none', // Убираем разделитель
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
                    <h3>{formatTime(selectedTimer)}</h3>
                </div>

                <div className="text" >
                    {currentText ? (
                        <>
                            <h3>TEXT - {selectedText?.category?.name}</h3>
                            <SyntaxHighlighter
                                language={(selectedText?.category?.name || "javascript").toLowerCase()}
                                style={dracula}
                                className="syntax-highlighter"
                                showLineNumbers={true} // Включаем нумерацию строк
                                lineNumberStyle={{ color: '#6e7681', marginRight: '20px' }} // Стили для номеров строк
                            >
                                {currentText.slice(cursorPosition)}
                            </SyntaxHighlighter>
                        </>
                    ) : (
                        <p>Нет текстов для этой категории</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Typing;