import React, { useState, useEffect } from 'react';
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
    background-color: #1e1e1e; /* Темный фон */
    border-radius: 28px;
    padding: 20px;
  }
  .syntax-highlighter .token.keyword {
    color: #9b59b6 !important; /* Фиолетовый для ключевых слов */
  }
  .syntax-highlighter .token.string {
    color: #8e44ad !important; /* Яркий фиолетовый для строк */
  }
  .syntax-highlighter .token.variable {
    color: #f39c12 !important; /* Желтый для переменных */
  }
  .syntax-highlighter .token.comment {
    color: #7f8c8d !important; /* Серый для комментариев */
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

  // Выбираем случайный текст при изменении списка текстов
  useEffect(() => {
    if (texts?.length > 0) {
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setSelectedTextId(randomText.id);
    } else {
      setSelectedTextId(null);
    }
  }, [texts]);

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

  const timerOptions = timers?.map((timer) => ({
    value: timer.seconds,
    label: `${timer.seconds} секунд`,
  })) || [];

  const categoryOptions = categories?.map((category) => ({
    value: category.id,
    label: category.name,
  })) || [];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
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
            <p><FiZap aria-label="Скорость" /> Скорость: <span>0 зн/мин</span></p>
          </div>
          <div className="stats">
            <p><FiCheckCircle aria-label="Точность" /> Точность: <span>100%</span></p>
          </div>
        </div>

        <div className="Time">
          <h3>{formatTime(selectedTimer)}</h3>
        </div>

          <div className="text">
              {selectedText ? (
                  <>
                      <h3>TEXT - {selectedText.category?.name}</h3>
                      <SyntaxHighlighter language="javascript" style={dracula} className="syntax-highlighter">
                          {selectedText.text_content}
                      </SyntaxHighlighter>
                  </>
              ) : (
                  <p>Нет текстов для этой категории</p>
              )}
          </div>


          <div className="keyboard">
              <p>Здесь будет клавиатура</p>
          </div>
      </div>
    </div>
  );
};

export default Typing;
