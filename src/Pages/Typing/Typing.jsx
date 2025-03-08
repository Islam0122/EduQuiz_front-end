import React, { useState } from 'react';
import {
    useGetTypingTextQuery,
    useGetTypingByIdQuery,
    useGetTypingTimersQuery,
    useGetTypingCategoriesQuery
} from '../../redux/TypingApi';
import "./Typing.scss"
import { FiClock, FiTag, FiZap, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Select from 'react-select';

const Typing = () => {
    const { data: texts, isLoading, error } = useGetTypingTextQuery();
    const { data: timers } = useGetTypingTimersQuery();
    const { data: categories } = useGetTypingCategoriesQuery();

    const [selectedTextId, setSelectedTextId] = useState(null);
    const [selectedTimer, setSelectedTimer] = useState(timers?.[0]?.seconds || 30);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { data: selectedText } = useGetTypingByIdQuery(selectedTextId, {
        skip: !selectedTextId,
    });

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error.message}</p>;

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleTimerChange = (selectedOption) => {
        setSelectedTimer(selectedOption.value);
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption.value);
    };

    const handleTextSelection = (id) => {
        setSelectedTextId(id);
    };

    // Преобразуем данные для React Select
    const timerOptions = timers?.map((timer) => ({
        value: timer.seconds,
        label: `${timer.seconds} секунд`,
    })) || [];

    const categoryOptions = categories?.map((category) => ({
        value: category.id,
        label: category.name,
    })) || [];

    // Стили для React Select
    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'transparent',
            border: 'none', // Убираем границу
            boxShadow: 'none',
            fontSize: '16px',
            color: 'white',
            minWidth: '200px',
            cursor: 'pointer',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4CAF50' : '#0d1117',
            color: 'white',
            fontSize: '16px',
            padding: '10px',
            cursor: 'pointer',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#0d1117',
        }),
        placeholder: (provided) => ({
            ...provided,
        }),
    };

    return (
        <div className="Typing">
            <div className="container">
                <div className="typing-header">
                    <div className="settings-time">
                        <label className="timer-label">
                            <FiClock  className="clock-icon" aria-label="Выбери время" /> Выбери время:
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
                        <p><FiZap aria-label="Скорость" /> Скорость: <span>0 зн/мин</span></p>
                    </div>
                    <div className="stats">
                        <p><FiCheckCircle aria-label="Точность" /> Точность: <span>100%</span></p>
                    </div>
                </div>

                <div className="Time">
                    <h3>{formatTime(selectedTimer)}</h3> {/* Форматируем время */}
                </div>

                <div className="text">
                    <h3>Текст:</h3>
                    <ul>
                        {texts?.map((text) => (
                            <li key={text.id} onClick={() => handleTextSelection(text.id)}>
                                {text.text_content}
                            </li>
                        ))}
                    </ul>
                    {selectedText ? <p>{selectedText.text_content}</p> : <p>Выберите текст</p>}
                </div>

                <div className="keyboard">
                    <p>Здесь будет клавиатура</p>
                </div>
            </div>
        </div>
    );
};

export default Typing;